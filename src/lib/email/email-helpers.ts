import { emailService } from './email-service';
import { emailTemplates, type JobApplicationEmailData, type GeneralApplicationEmailData } from './email-templates';

export interface ApplicationEmailOptions {
  applicantEmail: string;
  applicantName: string;
  sendAdminNotification?: boolean;
  adminEmails?: string[];
}

export interface JobApplicationEmailOptions extends ApplicationEmailOptions {
  jobTitle: string;
  jobId: string;
  applicationId: string;
}

export interface GeneralApplicationEmailOptions extends ApplicationEmailOptions {
  applicationId: string;
}

export async function sendJobApplicationEmails(
  options: JobApplicationEmailOptions
): Promise<{ 
  userEmailSent: boolean; 
  adminEmailsSent: boolean; 
  errors?: string[];
}> {
  const results = {
    userEmailSent: false,
    adminEmailsSent: false,
    errors: [] as string[],
  };

  const applicationDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const companyName = 'Onekbyte Labs';

  // Send confirmation email to applicant
  try {
    const userEmailData: JobApplicationEmailData = {
      applicantName: options.applicantName,
      jobTitle: options.jobTitle,
      applicationDate,
      applicationId: options.applicationId,
      companyName,
    };

    const userEmailResult = await emailService.sendEmail(
      options.applicantEmail,
      emailTemplates.jobApplicationConfirmation,
      userEmailData
    );

    if (userEmailResult.success) {
      results.userEmailSent = true;
      console.log(`Confirmation email sent to ${options.applicantEmail} for job application ${options.applicationId}`);
    } else {
      results.errors.push(`Failed to send confirmation email: ${userEmailResult.error}`);
    }
  } catch (error) {
    results.errors.push(`Error sending confirmation email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Send admin notification emails
  if (options.sendAdminNotification && options.adminEmails && options.adminEmails.length > 0) {
    try {
      const adminEmailData = {
        applicantName: options.applicantName,
        jobTitle: options.jobTitle,
        applicationDate,
        applicationId: options.applicationId,
        companyName,
        applicantEmail: options.applicantEmail,
        adminDashboardUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3006'}/admin/applications`,
      };

      const adminEmailPromises = options.adminEmails.map(async (adminEmail) => {
        const result = await emailService.sendEmail(
          adminEmail,
          emailTemplates.adminNotification,
          adminEmailData
        );
        return { email: adminEmail, success: result.success, error: result.error };
      });

      const adminResults = await Promise.all(adminEmailPromises);
      const successfulAdminEmails = adminResults.filter(result => result.success);
      const failedAdminEmails = adminResults.filter(result => !result.success);

      if (successfulAdminEmails.length > 0) {
        results.adminEmailsSent = true;
        console.log(`Admin notification emails sent to ${successfulAdminEmails.length} recipients`);
      }

      if (failedAdminEmails.length > 0) {
        failedAdminEmails.forEach(result => {
          results.errors.push(`Failed to send admin notification to ${result.email}: ${result.error}`);
        });
      }
    } catch (error) {
      results.errors.push(`Error sending admin notifications: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return results;
}

export async function sendGeneralApplicationEmails(
  options: GeneralApplicationEmailOptions
): Promise<{ 
  userEmailSent: boolean; 
  adminEmailsSent: boolean; 
  errors?: string[];
}> {
  const results = {
    userEmailSent: false,
    adminEmailsSent: false,
    errors: [] as string[],
  };

  const applicationDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const companyName = 'Onekbyte Labs';

  // Send confirmation email to applicant
  try {
    const userEmailData: GeneralApplicationEmailData = {
      applicantName: options.applicantName,
      applicationDate,
      applicationId: options.applicationId,
      companyName,
    };

    const userEmailResult = await emailService.sendEmail(
      options.applicantEmail,
      emailTemplates.generalApplicationConfirmation,
      userEmailData
    );

    if (userEmailResult.success) {
      results.userEmailSent = true;
      console.log(`Confirmation email sent to ${options.applicantEmail} for general application ${options.applicationId}`);
    } else {
      results.errors.push(`Failed to send confirmation email: ${userEmailResult.error}`);
    }
  } catch (error) {
    results.errors.push(`Error sending confirmation email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Send admin notification emails
  if (options.sendAdminNotification && options.adminEmails && options.adminEmails.length > 0) {
    try {
      const adminEmailData = {
        applicantName: options.applicantName,
        jobTitle: null, // General application
        applicationDate,
        applicationId: options.applicationId,
        companyName,
        applicantEmail: options.applicantEmail,
        adminDashboardUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3006'}/admin/applications`,
      };

      const adminEmailPromises = options.adminEmails.map(async (adminEmail) => {
        const result = await emailService.sendEmail(
          adminEmail,
          emailTemplates.adminNotification,
          adminEmailData
        );
        return { email: adminEmail, success: result.success, error: result.error };
      });

      const adminResults = await Promise.all(adminEmailPromises);
      const successfulAdminEmails = adminResults.filter(result => result.success);
      const failedAdminEmails = adminResults.filter(result => !result.success);

      if (successfulAdminEmails.length > 0) {
        results.adminEmailsSent = true;
        console.log(`Admin notification emails sent to ${successfulAdminEmails.length} recipients`);
      }

      if (failedAdminEmails.length > 0) {
        failedAdminEmails.forEach(result => {
          results.errors.push(`Failed to send admin notification to ${result.email}: ${result.error}`);
        });
      }
    } catch (error) {
      results.errors.push(`Error sending admin notifications: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return results;
}

export function getEmailServiceStatus() {
  return {
    isConfigured: emailService.isConfigured(),
    config: emailService.getConfig(),
    queueStatus: emailService.getQueueStatus(),
  };
}

export function retryFailedEmails() {
  return emailService.retryFailedEmails();
}

export function getEmailQueue(status?: 'pending' | 'sent' | 'failed' | 'retrying') {
  return emailService.getQueueItems(status);
}

export function clearEmailQueue(status?: 'pending' | 'sent' | 'failed' | 'retrying') {
  return emailService.clearQueue(status);
}
