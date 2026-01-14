import { NextRequest, NextResponse } from 'next/server';
import { getEmailServiceStatus, retryFailedEmails, getEmailQueue, clearEmailQueue } from '@/lib/email/email-helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const status = searchParams.get('status') as 'pending' | 'sent' | 'failed' | 'retrying' | undefined;

    switch (action) {
      case 'status':
        return NextResponse.json(getEmailServiceStatus());

      case 'queue':
        return NextResponse.json({
          queue: getEmailQueue(status),
          stats: getEmailServiceStatus().queueStatus,
        });

      default:
        return NextResponse.json(getEmailServiceStatus());
    }
  } catch (error) {
    console.error('Error in email status API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get email status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, status } = body;

    switch (action) {
      case 'retry-failed':
        const retriedCount = retryFailedEmails();
        return NextResponse.json({
          success: true,
          message: `Retried ${retriedCount} failed emails`,
          retriedCount,
        });

      case 'clear-queue':
        const clearedCount = clearEmailQueue(status);
        return NextResponse.json({
          success: true,
          message: `Cleared ${clearedCount} emails from queue`,
          clearedCount,
        });

      case 'reset-service':
        const { emailService } = await import('@/lib/email/email-service');
        emailService.resetService();
        return NextResponse.json({
          success: true,
          message: 'Email service reset with new configuration',
          config: emailService.getConfig(),
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in email admin API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to perform action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
