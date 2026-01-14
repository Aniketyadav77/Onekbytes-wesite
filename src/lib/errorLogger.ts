/**
 * Error logging and monitoring utility for production
 * Logs errors to console and can be extended to send to external services
 */

interface ErrorLog {
  timestamp: string;
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

class ErrorLogger {
  private static isDevelopment = process.env.NODE_ENV === 'development';

  static logError(
    error: unknown,
    context?: Record<string, unknown>,
    severity: 'info' | 'warning' | 'error' | 'critical' = 'error'
  ) {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context,
      severity,
    };

    // Log to console in development
    if (this.isDevelopment) {
      console.error('[ErrorLogger]', errorLog);
    }

    // In production, could send to external service (Sentry, LogRocket, etc.)
    // Example: sendToExternalService(errorLog);

    // Log to browser storage for debugging
    this.storeErrorLog(errorLog);

    return errorLog;
  }

  static logInfo(message: string, context?: Record<string, unknown>) {
    return this.logError(new Error(message), context, 'info');
  }

  static logWarning(message: string, context?: Record<string, unknown>) {
    return this.logError(new Error(message), context, 'warning');
  }

  static logCritical(error: unknown, context?: Record<string, unknown>) {
    return this.logError(error, context, 'critical');
  }

  private static storeErrorLog(log: ErrorLog) {
    try {
      if (typeof window === 'undefined') return;

      const logs = JSON.parse(localStorage.getItem('errorLogs') || '[]') as ErrorLog[];
      logs.push(log);

      // Keep only last 50 errors
      if (logs.length > 50) {
        logs.shift();
      }

      localStorage.setItem('errorLogs', JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to store error log:', e);
    }
  }

  static getStoredLogs(): ErrorLog[] {
    try {
      if (typeof window === 'undefined') return [];
      return JSON.parse(localStorage.getItem('errorLogs') || '[]');
    } catch {
      return [];
    }
  }

  static clearStoredLogs() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('errorLogs');
      }
    } catch (e) {
      console.error('Failed to clear error logs:', e);
    }
  }
}

export default ErrorLogger;
