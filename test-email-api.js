const fetch = require('node-fetch');

const testEmailAPI = async () => {
  try {
    console.log('Testing email API...');
    
    const response = await fetch('http://127.0.0.1:3006/api/email/job-application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        applicantEmail: 'aniketyadavdv07@gmail.com',
        applicantName: 'Test User',
        jobTitle: 'Test Job',
        jobId: 'test-123',
        applicationId: 'app-test-123',
      }),
    });

    const result = await response.json();
    console.log('Response:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

testEmailAPI();
