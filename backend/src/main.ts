import 'dotenv/config';
import { createServer } from 'node:http';
import { yoga } from './api/yoga.js';
import { logger } from './infrastructure/logging/logger.js';

const isProduction = process.env.NODE_ENV === 'production';
const corsOrigin = process.env.CORS_ORIGIN ?? (isProduction ? '' : '*');

const server = createServer((req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-XSS-Protection', '0');
  const isGraphqlRoute = req.url?.startsWith('/graphql') ?? false;
  const isDevGraphiqlRoute = isGraphqlRoute && !isProduction;
  const csp = isDevGraphiqlRoute
    ? "default-src 'self'; connect-src 'self' https://api.github.com https://unpkg.com blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com blob:; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: https://raw.githubusercontent.com; font-src 'self' data: https://unpkg.com; worker-src 'self' blob: https://unpkg.com; child-src 'self' blob: https://unpkg.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
    : "default-src 'self'; connect-src 'self' https://api.github.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'";
  res.setHeader('Content-Security-Policy', csp);
  if (corsOrigin) {
    res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  return yoga(req, res);
});
const port = Number(process.env.PORT ?? 4000);

server.listen(port, () => {
  logger.info('Backend server running', { port });
});
