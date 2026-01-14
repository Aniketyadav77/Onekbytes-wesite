# Email Workflow System Documentation

## Overview

This document describes the comprehensive email workflow system implemented for the Onekbyte Labs career application website. The system provides automated email confirmations for job applications and general career inquiries, with admin notification capabilities.

## Features

### Core Features
- ✅ **Automated Email Confirmations**: Send professional confirmation emails to applicants
- ✅ **Admin Notifications**: Notify HR team when new applications are submitted  
- ✅ **Email Queue System**: Asynchronous email processing with retry logic
- ✅ **Template System**: Customizable HTML and text email templates
- ✅ **Admin Dashboard**: Monitor email delivery status and manage queue
- ✅ **Error Handling**: Comprehensive error logging and retry mechanisms
- ✅ **Production Ready**: Built with TypeScript, proper validation, and error boundaries

### Email Types
1. **Job Application Confirmation**: Sent when someone applies for a specific job
2. **General Application Confirmation**: Sent for general career interest submissions
3. **Admin Notifications**: Alerts HR team about new applications

## Technical Architecture

### Components
```
src/lib/email/
├── email-service.ts       # Core email service with queue and retry logic
├── email-templates.ts     # Email template definitions
└── email-helpers.ts       # High-level helper functions

src/app/api/email/
├── job-application/route.ts      # API for job application emails
├── general-application/route.ts  # API for general application emails
└── admin/route.ts               # API for admin management

src/app/admin/email/page.tsx     # Admin dashboard
src/app/email-test/page.tsx      # Test interface
```

### Email Service Architecture
- **Singleton Pattern**: Single email service instance
- **Queue System**: In-memory queue with configurable retry logic
- **Template Processing**: Dynamic placeholder replacement
- **Error Recovery**: Automatic retry with exponential backoff
- **Status Tracking**: Real-time monitoring of email delivery

## Configuration

### Environment Variables
Add these to your `.env.local` file:

```env
# Email Configuration
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=aniketyadavdv07@gmail.com
FROM_NAME=HR Onekbyte Labs
EMAIL_ENABLED=true

# Email Queue Configuration  
EMAIL_QUEUE_ENABLED=true
EMAIL_RETRY_ATTEMPTS=3
EMAIL_RETRY_DELAY=5000
```

### Required Setup
1. **Resend Account**: Sign up at [resend.com](https://resend.com)
2. **API Key**: Generate API key in Resend dashboard
3. **Domain Verification**: Verify sending domain (if using custom domain)
4. **Dependencies**: `npm install resend` (already installed)

## API Endpoints

### 1. Job Application Email
```http
POST /api/email/job-application
Content-Type: application/json

{
  "applicantEmail": "john@example.com",
  "applicantName": "John Doe",
  "jobTitle": "Full Stack Developer",
  "jobId": "job-123",
  "applicationId": "app-456",
  "sendAdminNotification": true,
  "adminEmails": ["hr@onekbytelabs.com"]
}
```

### 2. General Application Email
```http
POST /api/email/general-application
Content-Type: application/json

{
  "applicantEmail": "john@example.com",
  "applicantName": "John Doe",
  "applicationId": "app-789",
  "sendAdminNotification": true,
  "adminEmails": ["hr@onekbytelabs.com"]
}
```

### 3. Admin Management
```http
GET /api/email/admin?action=status
GET /api/email/admin?action=queue&status=failed

POST /api/email/admin
{
  "action": "retry-failed"
}

POST /api/email/admin
{
  "action": "clear-queue",
  "status": "failed"
}
```

## Integration Points

### Job Application Modal
File: `src/components/careers/JobApplicationModal.tsx`

```typescript
// After successful application submission
const emailResponse = await fetch('/api/email/job-application', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    applicantEmail: formData.email,
    applicantName: formData.name,
    jobTitle: job.job_title,
    jobId: job.id,
    applicationId: applicationData.id,
  }),
});
```

### General Application Form
File: `src/components/careers/GeneralApplicationForm.tsx`

```typescript
// After successful application submission
const emailResponse = await fetch('/api/email/general-application', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    applicantEmail: formData.email,
    applicantName: formData.name,
    applicationId: applicationResult.id,
  }),
});
```

## Email Templates

### Template Structure
- **Professional Design**: Clean, responsive HTML emails
- **Branded Layout**: Company colors and typography
- **Dynamic Content**: Placeholder-based content replacement
- **Mobile Responsive**: Optimized for all devices
- **Accessibility**: Proper semantic markup and contrast

### Available Placeholders
- `{{applicantName}}` - Applicant's full name
- `{{jobTitle}}` - Job position title
- `{{applicationDate}}` - Formatted application date
- `{{applicationId}}` - Unique application ID
- `{{companyName}}` - Company name (Onekbyte Labs)

### Customization
Templates can be modified in `src/lib/email/email-templates.ts`:

```typescript
export const emailTemplates = {
  jobApplicationConfirmation: {
    subject: '✅ Application Received - {{jobTitle}} at {{companyName}}',
    htmlContent: `...`,
    textContent: `...`
  }
};
```

## Admin Dashboard

### Access
- URL: `/admin/email`
- Features: Email queue monitoring, retry management, configuration status

### Dashboard Features
1. **Service Status**: Configuration validation and health check
2. **Queue Statistics**: Real-time counts of pending/sent/failed emails
3. **Queue Management**: View, retry, and clear email queue
4. **Error Monitoring**: Detailed error logs and troubleshooting

### Admin Actions
- **Retry Failed**: Reprocess all failed emails
- **Clear Queue**: Remove emails by status
- **Refresh Status**: Update dashboard data
- **View Details**: Inspect individual email attempts

## Testing

### Test Interface
- URL: `/email-test`
- Features: Send test emails, check service status
- Usage: Validate configuration and email delivery

### Test Steps
1. Navigate to `/email-test`
2. Enter test email and applicant details
3. Test job application or general application emails
4. Check email delivery in your inbox
5. Verify admin dashboard shows activity

### Validation Checklist
- [ ] Resend API key configured
- [ ] Test emails delivered successfully
- [ ] Admin notifications working
- [ ] Queue system processing emails
- [ ] Error handling functioning
- [ ] Admin dashboard accessible

## Monitoring & Troubleshooting

### Common Issues

1. **"Email service not configured"**
   - Check `RESEND_API_KEY` in `.env.local`
   - Verify API key is valid in Resend dashboard

2. **"Failed to send emails"**
   - Check Resend dashboard for delivery issues
   - Verify FROM_EMAIL domain is verified
   - Check rate limits in Resend account

3. **Queue not processing**
   - Check `EMAIL_QUEUE_ENABLED=true`
   - Verify retry settings are configured
   - Check admin dashboard for queue status

### Monitoring Points
- Email delivery success rate
- Queue processing time
- Error patterns and frequency
- Admin notification delivery

### Logging
- All email attempts logged to console
- Error details captured for troubleshooting
- Queue status updates tracked
- Admin actions audited

## Security Considerations

### Email Security
- API key stored in environment variables
- Input validation on all email endpoints
- Rate limiting considerations
- Email content sanitization

### Data Protection
- No sensitive data in email templates
- Application IDs are non-sequential UUIDs
- Email addresses validated before sending
- Error messages don't expose system details

## Performance

### Optimization Features
- Asynchronous email processing
- Queue-based delivery system
- Retry logic with exponential backoff
- Memory-efficient template processing

### Scalability Considerations
- In-memory queue suitable for moderate traffic
- Can be upgraded to Redis/database queue for high volume
- Template caching for performance
- Connection pooling for email service

## Maintenance

### Regular Tasks
1. Monitor queue status weekly
2. Clear old sent emails monthly
3. Review error patterns quarterly
4. Update templates as needed

### Updates & Upgrades
- Resend package updates
- Template improvements
- Dashboard enhancements
- Queue system scaling

## Production Deployment

### Checklist
- [ ] Update `RESEND_API_KEY` with production key
- [ ] Set `FROM_EMAIL` to verified domain
- [ ] Configure `EMAIL_ENABLED=true`
- [ ] Test email delivery in production
- [ ] Monitor initial email volume
- [ ] Set up admin access controls

### Monitoring Setup
- Set up alerts for failed email delivery
- Monitor queue size and processing time
- Track email delivery success rates
- Set up logging aggregation

---

## Support

For technical support or questions about the email system:
- Check admin dashboard at `/admin/email`
- Use test interface at `/email-test`
- Review logs for error details
- Contact development team for system issues

Last Updated: January 2024
Version: 1.0.0
