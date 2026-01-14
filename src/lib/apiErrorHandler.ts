import { NextResponse } from 'next/server';

/**
 * Utility for consistent error responses in API routes
 * Helps with fault tolerance by returning graceful error responses
 */

interface ApiErrorOptions {
  status?: number;
  isDevelopment?: boolean;
  context?: Record<string, unknown>;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function createErrorResponse(
  error: unknown,
  options: ApiErrorOptions = {}
) {
  const {
    status = 500,
    isDevelopment = process.env.NODE_ENV === 'development',
    context = {},
  } = options;

  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  const response: Record<string, unknown> = {
    success: false,
    error: errorMessage,
    ...(isDevelopment && { stack: errorStack, context }),
  };

  return NextResponse.json(response, { status });
}

export function createSuccessResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}
