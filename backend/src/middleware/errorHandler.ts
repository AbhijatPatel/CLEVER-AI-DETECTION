import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { config } from '../config/env';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = (req.headers['x-request-id'] as string) || 'req-unknown';
  console.error(`[Error] Request ID ${requestId} failed:`, err);

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation Error',
      details: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      requestId
    });
    return;
  }

  if (err.name === 'UnauthorizedError' || err.status === 401) {
    res.status(401).json({
      error: 'Unauthorized',
      message: err.message || 'Authentication required',
      requestId
    });
    return;
  }

  // Safe production error responses - Never leak stack traces!
  const statusCode = err.statusCode || err.status || 500;
  const isProd = config.nodeEnv === 'production';

  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : err.name || 'Error',
    message: isProd && statusCode === 500 ? 'An unexpected internal error occurred. Please contact support.' : err.message,
    requestId
  });
}
