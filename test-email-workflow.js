#!/usr/bin/env node

/**
 * Complete Email Workflow Test Script
 * Tests the full email pipeline from job applications to delivery
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testEmailWorkflow() {
  console.log('🧪 Starting Complete Email Workflow Test\n');

  // Test 1: Reset Email Service
  console.log('1️⃣ Testing Email Service Reset...');
  try {
    const response = await fetch(`${BASE_URL}/api/email/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset' })
    });
    
    if (response.ok) {
      console.log('✅ Email service reset successful');
    } else {
      console.log('❌ Email service reset failed');
    }
  } catch (error) {
    console.log('❌ Email service reset error:', error.message);
  }

  // Test 2: Job Application Email
  console.log('\n2️⃣ Testing Job Application Email...');
  try {
    const response = await fetch(`${BASE_URL}/api/email/job-application`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicantEmail: 'test.user@example.com',
        applicantName: 'Test User',
        jobTitle: 'Full Stack Developer',
        jobId: 'test-job-123',
        applicationId: `test-app-${Date.now()}`
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Job application email API successful');
      console.log('📧 User email sent:', result.userEmailSent ? '✅' : '❌');
      console.log('📧 Admin emails sent:', result.adminEmailsSent ? '✅' : '❌');
      
      if (result.errors && result.errors.length > 0) {
        console.log('⚠️ Errors:', result.errors.join(', '));
      }
    } else {
      console.log('❌ Job application email failed:', result.error);
    }
  } catch (error) {
    console.log('❌ Job application email error:', error.message);
  }

  // Test 3: General Application Email
  console.log('\n3️⃣ Testing General Application Email...');
  try {
    const response = await fetch(`${BASE_URL}/api/email/general-application`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicantEmail: 'general.user@example.com',
        applicantName: 'General User',
        applicationId: `general-app-${Date.now()}`
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ General application email API successful');
      console.log('📧 User email sent:', result.userEmailSent ? '✅' : '❌');
      console.log('📧 Admin emails sent:', result.adminEmailsSent ? '✅' : '❌');
      
      if (result.errors && result.errors.length > 0) {
        console.log('⚠️ Errors:', result.errors.join(', '));
      }
    } else {
      console.log('❌ General application email failed:', result.error);
    }
  } catch (error) {
    console.log('❌ General application email error:', error.message);
  }

  // Test 4: Email Service Status
  console.log('\n4️⃣ Checking Email Service Status...');
  try {
    const response = await fetch(`${BASE_URL}/api/email/admin?action=status`);
    const status = await response.json();
    
    if (response.ok) {
      console.log('✅ Email service status retrieved');
      console.log('📊 Queue length:', status.queueLength);
      console.log('🔄 Processing:', status.processing ? '✅' : '❌');
      console.log('⚙️ Configuration:', JSON.stringify(status.config, null, 2));
    } else {
      console.log('❌ Failed to get email service status');
    }
  } catch (error) {
    console.log('❌ Email service status error:', error.message);
  }

  console.log('\n🏁 Email Workflow Test Complete!');
  console.log('\n📝 Summary:');
  console.log('- Email service should now redirect all emails to:', process.env.ADMIN_EMAIL || 'aniketyadavdv07@gmail.com');
  console.log('- Development mode prevents emails to external recipients');
  console.log('- All emails will be received by the admin email with original recipient info');
  console.log('- Check your admin email for test messages with [DEV] prefix');
}

// Run the test
testEmailWorkflow().catch(console.error);
