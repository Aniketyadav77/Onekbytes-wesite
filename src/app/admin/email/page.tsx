'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowPathIcon,
  TrashIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface EmailStats {
  total: number;
  pending: number;
  sent: number;
  failed: number;
  retrying: number;
}

interface EmailServiceStatus {
  isConfigured: boolean;
  config: {
    fromEmail: string;
    fromName: string;
    enabled: boolean;
    queueEnabled: boolean;
    retryAttempts: number;
    retryDelay: number;
  };
  queueStatus: EmailStats;
}

interface EmailQueueItem {
  id: string;
  to: string;
  template: {
    subject: string;
    htmlContent: string;
    textContent?: string;
  };
  data: Record<string, unknown>;
  attempts: number;
  maxAttempts: number;
  status: 'pending' | 'sent' | 'failed' | 'retrying';
  createdAt: string;
  lastAttemptAt?: string;
  sentAt?: string;
  error?: string;
}

export default function EmailAdminDashboard() {
  const [emailStatus, setEmailStatus] = useState<EmailServiceStatus | null>(null);
  const [emailQueue, setEmailQueue] = useState<EmailQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const fetchEmailStatus = async () => {
    try {
      const response = await fetch('/api/email/admin?action=status');
      if (response.ok) {
        const data = await response.json();
        setEmailStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch email status:', error);
    }
  };

  const fetchEmailQueue = async (status?: string) => {
    try {
      const url = status && status !== 'all' 
        ? `/api/email/admin?action=queue&status=${status}`
        : '/api/email/admin?action=queue';
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setEmailQueue(data.queue || []);
      }
    } catch (error) {
      console.error('Failed to fetch email queue:', error);
    }
  };

  const retryFailedEmails = async () => {
    setActionLoading('retry');
    try {
      const response = await fetch('/api/email/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'retry-failed' }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Retried ${result.retriedCount} failed emails`);
        await fetchEmailStatus();
        await fetchEmailQueue(selectedStatus);
      }
    } catch (error) {
      console.error('Failed to retry emails:', error);
      alert('Failed to retry emails');
    } finally {
      setActionLoading(null);
    }
  };

  const clearQueue = async (status?: string) => {
    setActionLoading('clear');
    try {
      const response = await fetch('/api/email/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'clear-queue', status }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Cleared ${result.clearedCount} emails from queue`);
        await fetchEmailStatus();
        await fetchEmailQueue(selectedStatus);
      }
    } catch (error) {
      console.error('Failed to clear queue:', error);
      alert('Failed to clear queue');
    } finally {
      setActionLoading(null);
    }
  };

  const resetEmailService = async () => {
    setActionLoading('reset');
    try {
      const response = await fetch('/api/email/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reset-service' }),
      });

      if (response.ok) {
        await response.json();
        alert('Email service reset successfully! New configuration loaded.');
        await fetchEmailStatus();
        await fetchEmailQueue(selectedStatus);
      }
    } catch (error) {
      console.error('Failed to reset email service:', error);
      alert('Failed to reset email service');
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchEmailStatus(),
        fetchEmailQueue(selectedStatus)
      ]);
      setLoading(false);
    };

    fetchData();
  }, [selectedStatus]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'retrying':
        return <ArrowPathIcon className="w-5 h-5 text-yellow-500" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <EnvelopeIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'text-green-500 bg-green-500/10';
      case 'failed':
        return 'text-red-500 bg-red-500/10';
      case 'retrying':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'pending':
        return 'text-blue-500 bg-blue-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Email Admin Dashboard</h1>
          <p className="text-gray-400">Monitor and manage email delivery system</p>
        </div>

        {/* Configuration Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gray-800/50 rounded-xl border border-gray-700 p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <InformationCircleIcon className="w-6 h-6 mr-2" />
            Service Configuration
          </h2>
          
          {emailStatus ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Status</div>
                <div className={`font-semibold ${emailStatus.isConfigured ? 'text-green-500' : 'text-red-500'}`}>
                  {emailStatus.isConfigured ? 'Configured' : 'Not Configured'}
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">From Email</div>
                <div className="font-semibold text-white">{emailStatus.config.fromEmail}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Queue Enabled</div>
                <div className={`font-semibold ${emailStatus.config.queueEnabled ? 'text-green-500' : 'text-red-500'}`}>
                  {emailStatus.config.queueEnabled ? 'Yes' : 'No'}
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Retry Attempts</div>
                <div className="font-semibold text-white">{emailStatus.config.retryAttempts}</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400">Failed to load configuration</div>
          )}
        </motion.div>

        {/* Queue Statistics */}
        {emailStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4"
          >
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 text-center">
              <EnvelopeIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{emailStatus.queueStatus.total}</div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 text-center">
              <ClockIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{emailStatus.queueStatus.pending}</div>
              <div className="text-sm text-gray-400">Pending</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 text-center">
              <CheckCircleIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{emailStatus.queueStatus.sent}</div>
              <div className="text-sm text-gray-400">Sent</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 text-center">
              <XCircleIcon className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{emailStatus.queueStatus.failed}</div>
              <div className="text-sm text-gray-400">Failed</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 text-center">
              <ArrowPathIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{emailStatus.queueStatus.retrying}</div>
              <div className="text-sm text-gray-400">Retrying</div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gray-800/50 rounded-xl border border-gray-700 p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={resetEmailService}
              disabled={actionLoading === 'reset'}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {actionLoading === 'reset' ? (
                <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <ArrowPathIcon className="w-5 h-5 mr-2" />
              )}
              Reset Service
            </button>
            <button
              onClick={retryFailedEmails}
              disabled={actionLoading === 'retry'}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {actionLoading === 'retry' ? (
                <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <ArrowPathIcon className="w-5 h-5 mr-2" />
              )}
              Retry Failed Emails
            </button>
            <button
              onClick={() => clearQueue('failed')}
              disabled={actionLoading === 'clear'}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {actionLoading === 'clear' ? (
                <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <TrashIcon className="w-5 h-5 mr-2" />
              )}
              Clear Failed Emails
            </button>
            <button
              onClick={() => {
                fetchEmailStatus();
                fetchEmailQueue(selectedStatus);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center"
            >
              <ArrowPathIcon className="w-5 h-5 mr-2" />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Email Queue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl border border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Email Queue</h2>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
              <option value="retrying">Retrying</option>
            </select>
          </div>

          {emailQueue.length === 0 ? (
            <div className="text-center py-8">
              <EnvelopeIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No emails in queue</p>
            </div>
          ) : (
            <div className="space-y-4">
              {emailQueue.map((email) => (
                <div key={email.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      {getStatusIcon(email.status)}
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(email.status)}`}>
                        {email.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Created: {new Date(email.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400 mb-1">To:</div>
                      <div className="text-white">{email.to}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1">Subject:</div>
                      <div className="text-white">{email.template.subject}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1">Attempts:</div>
                      <div className="text-white">{email.attempts} / {email.maxAttempts}</div>
                    </div>
                    {email.sentAt && (
                      <div>
                        <div className="text-gray-400 mb-1">Sent:</div>
                        <div className="text-white">{new Date(email.sentAt).toLocaleString()}</div>
                      </div>
                    )}
                  </div>

                  {email.error && (
                    <div className="mt-3 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                      <div className="text-red-400 text-sm font-medium mb-1">Error:</div>
                      <div className="text-red-300 text-sm">{email.error}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
