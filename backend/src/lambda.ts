import { pipeline } from 'node:stream/promises';
import type { LambdaFunctionURLEvent, Context } from 'aws-lambda';
import { yoga } from './api/yoga.js';

const isProduction = process.env.NODE_ENV === 'production';
const corsOrigin = process.env.CORS_ORIGIN ?? (isProduction ? '' : '*');

const securityHeaders: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'X-XSS-Protection': '0'
};

export const handler = awslambda.streamifyResponse(
  async (event: LambdaFunctionURLEvent, responseStream, lambdaContext: Context) => {
    const query = event.rawQueryString ? `?${event.rawQueryString}` : '';
    const url = `https://${event.requestContext.domainName}${event.requestContext.http.path}${query}`;

    const response = await yoga.fetch(
      url,
      {
        method: event.requestContext.http.method,
        headers: event.headers as Record<string, string>,
        body: event.body
          ? event.isBase64Encoded
            ? Buffer.from(event.body, 'base64')
            : event.body
          : null
      },
      { event, lambdaContext }
    );

    const headers: Record<string, string> = {
      ...Object.fromEntries(response.headers.entries()),
      ...securityHeaders
    };
    if (corsOrigin) {
      headers['Access-Control-Allow-Origin'] = corsOrigin;
    }
    headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

    const httpResponseStream = awslambda.HttpResponseStream.from(responseStream, {
      statusCode: response.status,
      headers
    });

    if (response.body) {
      await pipeline(response.body, httpResponseStream);
    }

    httpResponseStream.end();
  }
);
