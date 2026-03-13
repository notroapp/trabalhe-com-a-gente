declare const awslambda: {
  streamifyResponse: <TEvent, TResult>(
    handler: (event: TEvent, responseStream: NodeJS.WritableStream, context: any) => Promise<TResult> | TResult
  ) => (event: TEvent, context: unknown) => Promise<TResult> | TResult;
  HttpResponseStream: {
    from: (
      responseStream: NodeJS.WritableStream,
      options: { statusCode: number; headers?: Record<string, string> }
    ) => NodeJS.WritableStream;
  };
};
