'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function EmailTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    applicantEmail: '',
    applicantName: '',
    jobTitle: 'Full Stack Developer',
    jobId: 'test-job-123',
    applicationId: `test-app-${Date.now()}`,
  });

  const testJobApplicationEmail = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/email/job-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ Success! User email: ${data.userEmailSent ? '✅' : '❌'}, Admin emails: ${data.adminEmailsSent ? '✅' : '❌'}`);
        if (data.errors && data.errors.length > 0) {
          setResult(prev => prev + `\n⚠️ Errors: ${data.errors.join(', ')}`);
        }
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testGeneralApplicationEmail = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/email/general-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicantEmail: formData.applicantEmail,
          applicantName: formData.applicantName,
          applicationId: formData.applicationId,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ Success! User email: ${data.userEmailSent ? '✅' : '❌'}, Admin emails: ${data.adminEmailsSent ? '✅' : '❌'}`);
        if (data.errors && data.errors.length > 0) {
          setResult(prev => prev + `\n⚠️ Errors: ${data.errors.join(', ')}`);
        }
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const checkEmailStatus = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/email/admin?action=status');
      const data = await response.json();
      
      if (response.ok) {
        setResult(`📊 Email Service Status:
🔧 Configured: ${data.isConfigured ? '✅' : '❌'}
📧 From: ${data.config.fromEmail}
📤 Queue Enabled: ${data.config.queueEnabled ? '✅' : '❌'}
📈 Queue Stats: Total: ${data.queueStatus.total}, Pending: ${data.queueStatus.pending}, Sent: ${data.queueStatus.sent}, Failed: ${data.queueStatus.failed}`);
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Email System Test</h1>
          <p className="text-gray-400">Test email functionality and check service status</p>
        </div>

        {/* Test Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gray-800/50 rounded-xl border border-gray-700 p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <EnvelopeIcon className="w-6 h-6 mr-2" />
            Test Email Sending
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Applicant Email
              </label>
              <input
                type="email"
                value={formData.applicantEmail}
                onChange={(e) => setFormData({ ...formData, applicantEmail: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="test@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Applicant Name
              </label>
              <input
                type="text"
                value={formData.applicantName}
                onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Job Title
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full Stack Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Application ID
              </label>
              <input
                type="text"
                value={formData.applicationId}
                onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="test-app-123"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={testJobApplicationEmail}
              disabled={loading || !formData.applicantEmail || !formData.applicantName}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <PaperAirplaneIcon className="w-5 h-5 mr-2" />
              )}
              Test Job Application Email
            </button>
            
            <button
              onClick={testGeneralApplicationEmail}
              disabled={loading || !formData.applicantEmail || !formData.applicantName}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <PaperAirplaneIcon className="w-5 h-5 mr-2" />
              )}
              Test General Application Email
            </button>

            <button
              onClick={checkEmailStatus}
              disabled={loading}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <EnvelopeIcon className="w-5 h-5 mr-2" />
              )}
              Check Email Status 
            </button>
          </div>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gray-800/50 rounded-xl border border-gray-700 p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4">Test Results</h3>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap bg-gray-900/50 rounded-lg p-4 border border-gray-600">
              {result}
            </pre>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-900/20 rounded-xl border border-blue-700 p-6"
        >
          <h3 className="text-lg font-bold text-blue-400 mb-4">Setup Instructions</h3>
          <div className="text-sm text-blue-200 space-y-2">
            <p>1. Make sure you have added your Resend API key to the .env.local file:</p>
            <code className="block bg-blue-900/30 rounded px-3 py-2 mt-2">
              RESEND_API_KEY=your_actual_resend_api_key_here
            </code>
            <p>2. Verify your domain in Resend dashboard if using a custom domain</p>
            <p>3. Check the Email Admin Dashboard at <a href="/admin/email" className="underline">/admin/email</a> for queue management</p>
            <p>4. Test emails will be sent from: <strong>aniketyadavdv07@gmail.com</strong></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
