import { Resend } from 'resend';
import type { CreateEmailOptions } from 'resend';

export interface EmailQueueItem {
  id: string;
  to: string;
  template: EmailTemplate;
  data: Record<string, unknown>;
  attempts: number;
  maxAttempts: number;
  status: 'pending' | 'sent' | 'failed' | 'retrying';
  createdAt: Date;
  lastAttemptAt?: Date;
  sentAt?: Date;
  error?: string;
}

export interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export interface EmailServiceConfig {
  apiKey: string;
  fromEmail: string;
  fromName: string;
  enabled: boolean;
  queueEnabled: boolean;
  retryAttempts: number;
  retryDelay: number;
  developmentMode: boolean;
  adminEmail: string;
  developmentEmailRedirect: boolean;
}

class EmailService {
  private resend: Resend | null = null;
  private config: EmailServiceConfig;
  private queue: EmailQueueItem[] = [];
  private processing = false;

  constructor() {
    this.config = {
      apiKey: process.env.RESEND_API_KEY || '',
      fromEmail: process.env.FROM_EMAIL || '',
      fromName: process.env.FROM_NAME || 'Onekbyte Labs',
      enabled: process.env.EMAIL_ENABLED === 'true',
      queueEnabled: process.env.EMAIL_QUEUE_ENABLED === 'true',
      retryAttempts: parseInt(process.env.EMAIL_RETRY_ATTEMPTS || '3'),
      retryDelay: parseInt(process.env.EMAIL_RETRY_DELAY || '5000'),
      developmentMode: process.env.DEVELOPMENT_MODE === 'true',
      adminEmail: process.env.ADMIN_EMAIL || '',
      developmentEmailRedirect: process.env.DEVELOPMENT_EMAIL_REDIRECT === 'true',
    };

    if (this.config.enabled && this.config.apiKey) {
      this.resend = new Resend(this.config.apiKey);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  async sendEmail(
    to: string,
    template: EmailTemplate,
    data: Record<string, unknown> = {}
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    if (!this.config.enabled) {
      console.log('Email service is disabled');
      return { success: true, id: 'disabled' };
    }

    if (!this.resend) {
      return { success: false, error: 'Email service not configured' };
    }

    const emailId = this.generateId();

    if (this.config.queueEnabled) {
      const queueItem: EmailQueueItem = {
        id: emailId,
        to,
        template,
        data,
        attempts: 0,
        maxAttempts: this.config.retryAttempts,
        status: 'pending',
        createdAt: new Date(),
      };

      this.queue.push(queueItem);
      this.processQueue();
      return { success: true, id: emailId };
    } else {
      return await this.sendEmailDirect(to, template, data);
    }
  }

  private async sendEmailDirect(
    to: string,
    template: EmailTemplate,
    data: Record<string, unknown>
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      if (!this.resend) {
        throw new Error('Resend client not initialized');
      }

      const processedSubject = this.processTemplate(template.subject, data);
      const processedHtml = this.processTemplate(template.htmlContent, data);
      const processedText = template.textContent 
        ? this.processTemplate(template.textContent, data)
        : undefined;

      // In development mode, redirect all emails to admin email
      let finalTo = to;
      let finalSubject = processedSubject;
      let finalHtml = processedHtml;

      if (this.config.developmentMode && this.config.developmentEmailRedirect && this.config.adminEmail) {
        finalTo = this.config.adminEmail;
        
        // Add development notice to subject and content
        finalSubject = `[DEV - Originally for: ${to}] ${processedSubject}`;
        finalHtml = `
          <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 8px 0; color: #0369a1;">🚧 Development Mode</h3>
            <p style="margin: 0; color: #0369a1;">
              <strong>Original recipient:</strong> ${to}<br>
              <strong>Redirected to:</strong> ${finalTo}<br>
              <small>This email was redirected because you're in development mode.</small>
            </p>
          </div>
          ${processedHtml}
        `;
      }

      const emailOptions: CreateEmailOptions = {
        from: `${this.config.fromName} <${this.config.fromEmail}>`,
        to: [finalTo],
        subject: finalSubject,
        html: finalHtml,
        text: processedText,
      };

      console.log('Sending email with options:', {
        from: emailOptions.from,
        to: emailOptions.to,
        subject: emailOptions.subject
      });

      const result = await this.resend.emails.send(emailOptions);

      if (result.error) {
        const errorMessage = result.error.message || result.error.name || 'Unknown Resend error';
        console.error('Resend API error:', result.error);
        throw new Error(errorMessage);
      }

      console.log('Email sent successfully:', result.data?.id);
      return { success: true, id: result.data?.id };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Email sending failed:', errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    }
  }

  private processTemplate(template: string, data: Record<string, unknown>): string {
    let processed = template;
    
    // Replace placeholders like {{name}} with actual data
    Object.keys(data).forEach(key => {
      const placeholder = `{{${key}}}`;
      const value = data[key]?.toString() || '';
      processed = processed.replace(new RegExp(placeholder, 'g'), value);
    });

    return processed;
  }

  private async processQueue(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    try {
      const pendingItems = this.queue.filter(item => 
        item.status === 'pending' || item.status === 'retrying'
      );

      // Process emails one by one to avoid rate limiting
      for (const item of pendingItems) {
        if (item.attempts >= item.maxAttempts) {
          item.status = 'failed';
          continue;
        }

        item.attempts++;
        item.lastAttemptAt = new Date();
        item.status = item.attempts > 1 ? 'retrying' : 'pending';

        console.log(`Processing email ${item.id} (attempt ${item.attempts}/${item.maxAttempts})`);

        const result = await this.sendEmailDirect(item.to, item.template, item.data);

        if (result.success) {
          item.status = 'sent';
          item.sentAt = new Date();
          console.log(`Email ${item.id} sent successfully`);
        } else {
          item.error = result.error;
          console.log(`Email ${item.id} failed: ${result.error}`);
          
          if (item.attempts < item.maxAttempts) {
            item.status = 'retrying';
            console.log(`Email ${item.id} will be retried in ${this.config.retryDelay}ms`);
          } else {
            item.status = 'failed';
            console.log(`Email ${item.id} failed permanently after ${item.attempts} attempts`);
          }
        }

        // Add delay between emails to respect rate limits (Resend allows 2 req/sec)
        if (pendingItems.indexOf(item) < pendingItems.length - 1) {
          console.log('Waiting 600ms before next email to respect rate limits...');
          await new Promise(resolve => setTimeout(resolve, 600)); // 600ms = ~1.67 emails/sec
        }
      }

      // Schedule retry for failed items that haven't reached max attempts
      const retryItems = this.queue.filter(item => 
        item.status === 'retrying' && item.attempts < item.maxAttempts
      );

      if (retryItems.length > 0) {
        setTimeout(() => {
          this.processQueue();
        }, this.config.retryDelay);
      }

    } catch (error) {
      console.error('Queue processing error:', error);
    } finally {
      this.processing = false;
    }
  }

  // Admin methods
  getQueueStatus(): {
    total: number;
    pending: number;
    sent: number;
    failed: number;
    retrying: number;
  } {
    const stats = {
      total: this.queue.length,
      pending: 0,
      sent: 0,
      failed: 0,
      retrying: 0,
    };

    this.queue.forEach(item => {
      stats[item.status]++;
    });

    return stats;
  }

  getQueueItems(status?: EmailQueueItem['status']): EmailQueueItem[] {
    if (status) {
      return this.queue.filter(item => item.status === status);
    }
    return [...this.queue];
  }

  retryFailedEmails(): number {
    const failedItems = this.queue.filter(item => item.status === 'failed');
    failedItems.forEach(item => {
      item.status = 'pending';
      item.attempts = 0;
      item.error = undefined;
    });

    if (failedItems.length > 0) {
      this.processQueue();
    }

    return failedItems.length;
  }

  clearQueue(status?: EmailQueueItem['status']): number {
    const initialLength = this.queue.length;
    
    if (status) {
      this.queue = this.queue.filter(item => item.status !== status);
    } else {
      this.queue = [];
    }

    return initialLength - this.queue.length;
  }

  isConfigured(): boolean {
    return !!(this.config.enabled && this.config.apiKey && this.config.fromEmail);
  }

  getConfig(): Omit<EmailServiceConfig, 'apiKey'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { apiKey, ...safeConfig } = this.config;
    return safeConfig;
  }

  // Reset service with new configuration
  resetService(): void {
    this.config = {
      apiKey: process.env.RESEND_API_KEY || '',
      fromEmail: process.env.FROM_EMAIL || '',
      fromName: process.env.FROM_NAME || 'Onekbyte Labs',
      enabled: process.env.EMAIL_ENABLED === 'true',
      queueEnabled: process.env.EMAIL_QUEUE_ENABLED === 'true',
      retryAttempts: parseInt(process.env.EMAIL_RETRY_ATTEMPTS || '3'),
      retryDelay: parseInt(process.env.EMAIL_RETRY_DELAY || '5000'),
      developmentMode: process.env.DEVELOPMENT_MODE === 'true',
      adminEmail: process.env.ADMIN_EMAIL || '',
      developmentEmailRedirect: process.env.DEVELOPMENT_EMAIL_REDIRECT === 'true',
    };

    if (this.config.enabled && this.config.apiKey) {
      this.resend = new Resend(this.config.apiKey);
    } else {
      this.resend = null;
    }

    // Clear existing queue
    this.queue = [];
    this.processing = false;

    console.log('Email service reset with new configuration:', {
      enabled: this.config.enabled,
      fromEmail: this.config.fromEmail,
      fromName: this.config.fromName,
      queueEnabled: this.config.queueEnabled,
      retryAttempts: this.config.retryAttempts,
    });
  }
}

// Singleton instance
export const emailService = new EmailService();
