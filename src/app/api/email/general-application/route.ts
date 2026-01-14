import { NextRequest, NextResponse } from 'next/server';
import { sendGeneralApplicationEmails } from '@/lib/email/email-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      applicantEmail,
      applicantName,
      applicationId,
      sendAdminNotification = true,
      adminEmails = ['hr@onekbytelabs.com', 'aniketyadavdv07@gmail.com']
    } = body;

    // Validate required fields
    if (!applicantEmail || !applicantName || !applicationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicantEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const result = await sendGeneralApplicationEmails({
      applicantEmail,
      applicantName,
      applicationId,
      sendAdminNotification,
      adminEmails,
    });

    return NextResponse.json({
      success: true,
      userEmailSent: result.userEmailSent,
      adminEmailsSent: result.adminEmailsSent,
      errors: result.errors || [],
    });

  } catch (error) {
    console.error('Error in general application email API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send emails',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
