type LogLevel = 'info' | 'warn' | 'error';

function emit(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context: context ?? {}
  };
  console.log(JSON.stringify(payload));
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => emit('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) => emit('warn', message, context),
  error: (message: string, context?: Record<string, unknown>) => emit('error', message, context)
};
