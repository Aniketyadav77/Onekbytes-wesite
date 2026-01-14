export interface JobApplicationEmailData extends Record<string, unknown> {
  applicantName: string;
  jobTitle: string;
  applicationDate: string;
  applicationId: string;
  companyName: string;
  hrEmail?: string;
  adminDashboardUrl?: string;
}

export interface GeneralApplicationEmailData extends Record<string, unknown> {
  applicantName: string;
  applicationDate: string;
  applicationId: string;
  companyName: string;
  hrEmail?: string;
  adminDashboardUrl?: string;
}

export interface AdminNotificationEmailData extends Record<string, unknown> {
  applicantName: string;
  jobTitle?: string;
  applicationDate: string;
  applicationId: string;
  applicantEmail?: string;
  applicantPhone?: string;
  companyName: string;
  adminDashboardUrl: string;
}

export interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

export const emailTemplates = {
  jobApplicationConfirmation: {
    subject: '🚀 Application Received - {{jobTitle}} at {{companyName}}',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Confirmation</title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; line-height: 1.6;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #000000;">
          <tr>
            <td>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 800px; margin: 0 auto; background-color: #000000; border-radius: 24px; overflow: hidden;">
                <tr>
                  <td>
                    <!-- Gradient Header -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #4F46E5 0%, #06B6D4 50%, #10B981 100%); height: 140px;">
                      <tr>
                        <td style="text-align: center; vertical-align: middle; padding: 40px 20px;">
                          <div style="color: #000000; font-size: 42px; font-weight: 800; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">{{companyName}}</div>
                        </td>
                      </tr>
                    </table>

                    <!-- Main Content -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #1a1a1a; padding: 40px;">
                      <tr>
                        <td>
                          <!-- Title Section -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 40px;">
                            <tr>
                              <td style="text-align: center;">
                                <div style="color: #ffffff; font-size: 32px; font-weight: 600; margin-bottom: 12px;">Application Received 🚀</div>
                                <div style="color: #9CA3AF; font-size: 16px; font-weight: 400;">Thank you for applying to {{companyName}}</div>
                              </td>
                            </tr>
                          </table>

                          <!-- Details Card -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #2d2d2d; border-radius: 16px; margin-bottom: 40px; border: 1px solid #404040;">
                            <tr>
                              <td style="padding: 32px;">
                                
                                <!-- Applicant Info -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                                  <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #404040;">
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tr>
                                          <td style="color: #9CA3AF; font-size: 14px; font-weight: 500; width: 140px;">👤 Applicant:</td>
                                          <td style="color: #ffffff; font-size: 14px; font-weight: 600;">{{applicantName}}</td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>

                                <!-- Position Info -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                                  <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #404040;">
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tr>
                                          <td style="color: #9CA3AF; font-size: 14px; font-weight: 500; width: 140px;">💼 Position:</td>
                                          <td style="color: #ffffff; font-size: 14px; font-weight: 600;">{{jobTitle}}</td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>

                                <!-- Date Info -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                                  <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #404040;">
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tr>
                                          <td style="color: #9CA3AF; font-size: 14px; font-weight: 500; width: 140px;">📅 Date:</td>
                                          <td style="color: #ffffff; font-size: 14px; font-weight: 600;">{{applicationDate}}</td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>

                                <!-- ID Info -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td style="padding: 12px 0;">
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tr>
                                          <td style="color: #9CA3AF; font-size: 14px; font-weight: 500; width: 140px;">🆔 ID:</td>
                                          <td style="color: #A855F7; font-size: 14px; font-weight: 600;">{{applicationId}}</td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>

                              </td>
                            </tr>
                          </table>

                          <!-- Next Steps Card -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #1e3a8a; border-radius: 16px; margin-bottom: 40px; border-left: 4px solid #3B82F6;">
                            <tr>
                              <td style="padding: 32px;">
                                <div style="color: #60A5FA; font-size: 20px; font-weight: 600; margin-bottom: 20px;">Next Steps</div>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr><td style="color: #E5E7EB; font-size: 14px; padding: 6px 0; line-height: 1.5;">🤖 AI will analyze your application in 24–48h</td></tr>
                                  <tr><td style="color: #E5E7EB; font-size: 14px; padding: 6px 0; line-height: 1.5;">� If shortlisted, our team will reach out</td></tr>
                                  <tr><td style="color: #E5E7EB; font-size: 14px; padding: 6px 0; line-height: 1.5;">⚡ Expect a response within 1 week</td></tr>
                                </table>
                              </td>
                            </tr>
                          </table>

                          <!-- Footer -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #000000; border-radius: 16px; text-align: center;">
                            <tr>
                              <td style="padding: 32px;">
                                <div style="color: #9CA3AF; font-size: 14px; margin-bottom: 8px;">© 2025 {{companyName}} — AI-Powered Recruitment Platform</div>
                                <div style="color: #60A5FA; font-size: 13px; font-style: italic; margin-bottom: 16px;">Building the future of talent acquisition with artificial intelligence</div>
                                <div style="color: #9CA3AF; font-size: 12px;">Made with ❤️ by Aniket</div>
                              </td>
                            </tr>
                          </table>

                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    textContent: `
🚀 APPLICATION RECEIVED SUCCESSFULLY!

Thank you for applying to {{jobTitle}} at {{companyName}}!

👤 Applicant: {{applicantName}}
💼 Position: {{jobTitle}}  
📅 Date: {{applicationDate}}
🆔 ID: {{applicationId}}

Next Steps:
• 🤖 AI will analyze your application in 24–48h
• � If shortlisted, our team will reach out
• ⚡ Expect a response within 1 week

© 2025 {{companyName}} — AI-Powered Recruitment Platform
Building the future of talent acquisition with artificial intelligence
Made with ❤️ by Aniket
    `
  } as EmailTemplate,

  generalApplicationConfirmation: {
    subject: '✨ Application Received - Career Opportunities at {{companyName}}',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Confirmation</title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; line-height: 1.6;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #000000;">
          <tr>
            <td>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 800px; margin: 0 auto; background-color: #000000; border-radius: 24px; overflow: hidden;">
                <tr>
                  <td>
                    <!-- Gradient Header -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #10B981 0%, #06B6D4 50%, #8B5CF6 100%); height: 140px;">
                      <tr>
                        <td style="text-align: center; vertical-align: middle; padding: 40px 20px;">
                          <div style="color: #000000; font-size: 42px; font-weight: 800; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">{{companyName}}</div>
                        </td>
                      </tr>
                    </table>

                    <!-- Main Content -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #1a1a1a; padding: 40px;">
                      <tr>
                        <td>
                          <!-- Title Section -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 40px;">
                            <tr>
                              <td style="text-align: center;">
                                <div style="color: #ffffff; font-size: 32px; font-weight: 600; margin-bottom: 12px;">Application Received ✨</div>
                                <div style="color: #9CA3AF; font-size: 16px; font-weight: 400;">Thank you for your interest in {{companyName}}</div>
                              </td>
                            </tr>
                          </table>

                          <!-- Details Card -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #2d2d2d; border-radius: 16px; margin-bottom: 40px; border: 1px solid #404040;">
                            <tr>
                              <td style="padding: 32px;">
                                
                                <!-- Applicant Info -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                                  <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #404040;">
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tr>
                                          <td style="color: #9CA3AF; font-size: 14px; font-weight: 500; width: 140px;">👤 Applicant:</td>
                                          <td style="color: #ffffff; font-size: 14px; font-weight: 600;">{{applicantName}}</td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>

                                <!-- Application Type -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                                  <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #404040;">
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tr>
                                          <td style="color: #9CA3AF; font-size: 14px; font-weight: 500; width: 140px;">🎯 Type:</td>
                                          <td style="color: #ffffff; font-size: 14px; font-weight: 600;">General Career Interest</td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>

                                <!-- Date Info -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                                  <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #404040;">
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tr>
                                          <td style="color: #9CA3AF; font-size: 14px; font-weight: 500; width: 140px;">📅 Date:</td>
                                          <td style="color: #ffffff; font-size: 14px; font-weight: 600;">{{applicationDate}}</td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>

                                <!-- ID Info -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td style="padding: 12px 0;">
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tr>
                                          <td style="color: #9CA3AF; font-size: 14px; font-weight: 500; width: 140px;">🆔 ID:</td>
                                          <td style="color: #A855F7; font-size: 14px; font-weight: 600;">{{applicationId}}</td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>

                              </td>
                            </tr>
                          </table>

                          <!-- Next Steps Card -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #1e3a8a; border-radius: 16px; margin-bottom: 40px; border-left: 4px solid #10B981;">
                            <tr>
                              <td style="padding: 32px;">
                                <div style="color: #34D399; font-size: 20px; font-weight: 600; margin-bottom: 20px;">Next Steps</div>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr><td style="color: #E5E7EB; font-size: 14px; padding: 6px 0; line-height: 1.5;">🔍 Our talent team will review your profile for opportunities</td></tr>
                                  <tr><td style="color: #E5E7EB; font-size: 14px; padding: 6px 0; line-height: 1.5;">🎯 We'll match your skills with open positions</td></tr>
                                  <tr><td style="color: #E5E7EB; font-size: 14px; padding: 6px 0; line-height: 1.5;">📧 You'll receive updates when relevant roles become available</td></tr>
                                  <tr><td style="color: #E5E7EB; font-size: 14px; padding: 6px 0; line-height: 1.5;">🤝 We may reach out for career discussions</td></tr>
                                </table>
                              </td>
                            </tr>
                          </table>

                          <!-- Footer -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #000000; border-radius: 16px; text-align: center;">
                            <tr>
                              <td style="padding: 32px;">
                                <div style="color: #9CA3AF; font-size: 14px; margin-bottom: 8px;">© 2025 {{companyName}} — AI-Powered Recruitment Platform</div>
                                <div style="color: #34D399; font-size: 13px; font-style: italic; margin-bottom: 16px;">Building the future of talent acquisition with artificial intelligence</div>
                                <div style="color: #9CA3AF; font-size: 12px;">Made with ❤️ by Aniket</div>
                              </td>
                            </tr>
                          </table>

                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    textContent: `
✨ APPLICATION RECEIVED SUCCESSFULLY!

Thank you for your interest in {{companyName}}

👤 Applicant: {{applicantName}}
🎯 Type: General Career Interest
📅 Date: {{applicationDate}}
🆔 ID: {{applicationId}}

Next Steps:
• 🔍 Our talent team will review your profile for opportunities
• 🎯 We'll match your skills with open positions
• 📧 You'll receive updates when relevant roles become available
• 🤝 We may reach out for career discussions

© 2025 {{companyName}} — AI-Powered Recruitment Platform
Building the future of talent acquisition with artificial intelligence
Made with ❤️ by Aniket
    `
  } as EmailTemplate,

  adminNotification: {
    subject: '🚨 New Application Alert - {{jobTitle || "General Application"}}',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Notification</title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #7c2d12; line-height: 1.6;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #7c2d12;">
          <tr>
            <td>
              <table role="presentation" cellspacing="0" cellpadding="20" border="0" width="100%" style="max-width: 650px; margin: 0 auto;">
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ef4444; border-radius: 16px; border: 2px solid #fbbf24;">
                      <tr>
                        <td style="padding: 40px;">
                          
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="text-align: center; padding-bottom: 30px; margin-bottom: 30px; border-bottom: 2px solid #fbbf24;">
                            <tr>
                              <td>
                                <div style="font-size: 32px; font-weight: 700; color: #fbbf24; margin-bottom: 20px;">{{companyName}}</div>
                                <div style="font-size: 80px; margin-bottom: 20px; display: block;">🚨</div>
                                <div style="font-size: 28px; font-weight: 600; color: #ffffff; margin-bottom: 10px;">New Application Alert!</div>
                                <div style="font-size: 16px; color: #fed7aa; font-weight: 400;">⚡ Immediate action required - Review and respond</div>
                              </td>
                            </tr>
                          </table>

                          <table role="presentation" cellspacing="0" cellpadding="25" border="0" width="100%" style="background-color: #7f1d1d; border-radius: 12px; margin-bottom: 25px; border: 1px solid #fbbf24;">
                            <tr>
                              <td>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 15px; padding: 10px 0; border-bottom: 1px solid #fbbf24;">
                                  <tr>
                                    <td style="font-weight: 500; color: #fed7aa; font-size: 14px;">👤 Applicant:</td>
                                    <td style="color: #ffffff; font-weight: 600; font-size: 14px; text-align: right;">{{applicantName}}</td>
                                  </tr>
                                </table>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 15px; padding: 10px 0; border-bottom: 1px solid #fbbf24;">
                                  <tr>
                                    <td style="font-weight: 500; color: #fed7aa; font-size: 14px;">💼 Position:</td>
                                    <td style="color: #ffffff; font-weight: 600; font-size: 14px; text-align: right;">{{jobTitle || "General Application"}}</td>
                                  </tr>
                                </table>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 15px; padding: 10px 0; border-bottom: 1px solid #fbbf24;">
                                  <tr>
                                    <td style="font-weight: 500; color: #fed7aa; font-size: 14px;">📅 Application Date:</td>
                                    <td style="color: #ffffff; font-weight: 600; font-size: 14px; text-align: right;">{{applicationDate}}</td>
                                  </tr>
                                </table>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 15px; padding: 10px 0; border-bottom: 1px solid #fbbf24;">
                                  <tr>
                                    <td style="font-weight: 500; color: #fed7aa; font-size: 14px;">🆔 Application ID:</td>
                                    <td style="color: #ffffff; font-weight: 600; font-size: 14px; text-align: right;">#{{applicationId}}</td>
                                  </tr>
                                </table>
                                {{#if applicantEmail}}
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 15px; padding: 10px 0; border-bottom: 1px solid #fbbf24;">
                                  <tr>
                                    <td style="font-weight: 500; color: #fed7aa; font-size: 14px;">� Email:</td>
                                    <td style="color: #ffffff; font-weight: 600; font-size: 14px; text-align: right;">{{applicantEmail}}</td>
                                  </tr>
                                </table>
                                {{/if}}
                                {{#if applicantPhone}}
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 0;">
                                  <tr>
                                    <td style="font-weight: 500; color: #fed7aa; font-size: 14px;">📱 Phone:</td>
                                    <td style="color: #ffffff; font-weight: 600; font-size: 14px; text-align: right;">{{applicantPhone}}</td>
                                  </tr>
                                </table>
                                {{/if}}
                              </td>
                            </tr>
                          </table>

                          <table role="presentation" cellspacing="0" cellpadding="15" border="0" width="100%" style="text-align: center;">
                            <tr>
                              <td>
                                <a href="{{adminDashboardUrl}}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; text-align: center;">
                                  🔍 Review Application Now
                                </a>
                              </td>
                            </tr>
                          </table>

                          <table role="presentation" cellspacing="0" cellpadding="20" border="0" width="100%" style="text-align: center; border-top: 1px solid #fbbf24;">
                            <tr>
                              <td>
                                <p style="margin: 0 0 8px 0; color: #fed7aa; font-size: 12px;">🤖 This is an automated high-priority notification from {{companyName}}.</p>
                                <p style="margin: 0; color: #fed7aa; font-size: 12px;">🚀 Powered by AI recruitment technology</p>
                              </td>
                            </tr>
                          </table>

                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    textContent: `
🚨 HIGH PRIORITY: NEW APPLICATION ALERT

⚡ Immediate action required - A new job application has been submitted.

🎯 Application Details:

• 👤 Applicant: {{applicantName}}



• 💼 Position: {{jobTitle || "General Application"}}
• 📅 Application Date: {{applicationDate}}
• 🆔 Application ID: #{{applicationId}}
{{#if applicantEmail}}• 📧 Email: {{applicantEmail}}{{/if}}
{{#if applicantPhone}}• 📱 Phone: {{applicantPhone}}{{/if}}

🔍 Please review this application immediately for optimal candidate experience.

🚀 Access the admin dashboard: {{adminDashboardUrl}}

---
🤖 This is an automated high-priority notification from {{companyName}}.
🚀 Powered by AI recruitment technology
    `
  } as EmailTemplate,
};

// Export type for use in other parts of the application
export type EmailTemplateType = keyof typeof emailTemplates;
