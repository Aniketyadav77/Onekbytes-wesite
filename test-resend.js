import { Resend } from 'resend';

// Simple test script to verify Resend configuration
const testResend = async () => {
  const resend = new Resend('re_Xs5bEN2Y_HByb8xFF2z9AiBfJopGkBkWr');
  
  try {
    console.log('Testing Resend API...');
    
    // Test with a simple email
    const result = await resend.emails.send({
      from: 'HR Onekbyte Labs <onboarding@resend.dev>', // Using Resend's default domain
      to: ['aniketyadavdv07@gmail.com'],
      subject: 'Test Email from Onekbyte Labs',
      html: '<h1>Test Email</h1><p>This is a test email to verify Resend configuration.</p>',
    });

    if (result.error) {
      console.error('Resend Error:', result.error);
    } else {
      console.log('Email sent successfully:', result.data);
    }
  } catch (error) {
    console.error('Exception:', error);
  }
};

testResend();
