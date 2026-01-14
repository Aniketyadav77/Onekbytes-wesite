/**
 * Environment variable validation for production safety
 * Ensures all required configs are present at startup
 */

interface EnvironmentConfig {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  RESEND_API_KEY?: string;
  NODE_ENV: string;
}

class EnvValidator {
  private static requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  private static optionalVars = ['SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY'];

  static validate(): EnvironmentConfig {
    const missing: string[] = [];

    // Check required variables
    for (const varName of this.requiredVars) {
      if (!process.env[varName]) {
        missing.push(varName);
      }
    }

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please configure these variables in your .env.local file'
      );
    }

    // Warn about optional variables in production
    if (process.env.NODE_ENV === 'production') {
      for (const varName of this.optionalVars) {
        if (!process.env[varName]) {
          console.warn(`⚠️  Optional environment variable not set: ${varName}`);
        }
      }
    }

    return {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      NODE_ENV: process.env.NODE_ENV || 'development',
    };
  }

  static isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  static isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }
}

export default EnvValidator;
