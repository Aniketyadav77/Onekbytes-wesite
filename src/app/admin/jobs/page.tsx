'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useAdminCareers } from '@/hooks/enhanced-useCareers'
import { Job } from '@/types/database'
import { 
  UserGroupIcon, 
  BriefcaseIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  CogIcon
} from '@heroicons/react/24/outline'

// Import modal components
import JobCreateModal from './components/JobCreateModal'
import JobEditModal from './components/JobEditModal'
import JobPreviewModal from './components/JobPreviewModal'
import DeleteConfirmationModal from './components/DeleteConfirmationModal'
import BulkActionsBar from './components/BulkActionsBar'
import Toast from './components/Toast'

type TabType = 'jobs' | 'applications' | 'emailTest' | 'emailAdmin'
type ViewType = 'card' | 'table'

interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

interface JobWithApplicationCount extends Job {
  applicationCount: number
}

export default function AdminJobsPage() {
  const { isAdmin } = useAuth()
  const { 
    jobs, 
    loading, 
    createJob, 
    updateJob, 
    deleteJob,
    updateJobStatus,
    bulkUpdateStatus,
    bulkDelete,
    getApplicationCount,
    fetchJobs,
    clearError
  } = useAdminCareers()

  // State management
  const [activeTab, setActiveTab] = useState<TabType>('jobs')
  const [viewType, setViewType] = useState<ViewType>('card')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [selectedJobs, setSelectedJobs] = useState<string[]>([])
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [jobsWithCounts, setJobsWithCounts] = useState<JobWithApplicationCount[]>([])

  // Email test state
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailResult, setEmailResult] = useState<string | null>(null)
  const [emailFormData, setEmailFormData] = useState({
    applicantEmail: '',
    applicantName: '',
    jobTitle: 'Full Stack Developer',
    jobId: 'test-job-123',
    applicationId: `test-app-${Date.now()}`,
  })

  // Email admin dashboard state
  const [emailAdminStatus, setEmailAdminStatus] = useState<Record<string, unknown> | null>(null)
  const [emailAdminQueue, setEmailAdminQueue] = useState<Record<string, unknown>[]>([])
  const [emailAdminLoading, setEmailAdminLoading] = useState(true)
  const [emailAdminActionLoading, setEmailAdminActionLoading] = useState<string | null>(null)
  const [emailAdminSelectedStatus, setEmailAdminSelectedStatus] = useState<string>('all')

  // Toast management
  const addToast = (type: ToastMessage['type'], message: string) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 5000)
  }

  // Load jobs with application counts
  const loadJobsWithCounts = useCallback(async () => {
    try {
      const jobsData = await Promise.all(
        jobs.map(async (job) => {
          try {
            const applicationCount = await getApplicationCount(job.id)
            return { ...job, applicationCount }
          } catch (error) {
            // If count fails for individual job, use 0 and continue
            void error
            console.warn('[AdminJobs] Failed to get count for job:', job.id)
            return { ...job, applicationCount: 0 }
          }
        })
      )
      setJobsWithCounts(jobsData)
    } catch (error) {
      void error
      console.error('[AdminJobs] Error loading jobs with counts:', error)
      // On error, set jobs without counts (count = 0)
      const fallbackJobs = jobs.map(job => ({ ...job, applicationCount: 0 }))
      setJobsWithCounts(fallbackJobs)
    }
  }, [jobs, getApplicationCount])

  useEffect(() => {
    if (jobs.length > 0) {
      loadJobsWithCounts()
    }
  }, [jobs, loadJobsWithCounts])

  // Clear error when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  // Job CRUD operations
  const handleCreateJob = async (jobData: Omit<Job, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Create the job - this should complete independently
      await createJob(jobData)
      
      // Close modal immediately after successful creation
      setShowCreateModal(false)
      addToast('success', 'Job created successfully!')
      
      // Refresh jobs list in background (don't await to prevent blocking UI)
      fetchJobs().catch(err => {
        console.warn('[AdminJobs] Background job refresh failed:', err)
      })
    } catch (error) {
      void error
      // Keep modal open on error so user can retry
      const errorMessage = error instanceof Error ? error.message : 'Failed to create job'
      console.error('[AdminJobs] Job creation error:', errorMessage)
      addToast('error', errorMessage)
      throw error // Re-throw so modal can handle it
    }
  }

  const handleUpdateJob = async (jobId: string, jobData: Partial<Job>) => {
    try {
      await updateJob(jobId, jobData)
      setShowEditModal(false)
      addToast('success', 'Job updated successfully!')
      fetchJobs()
    } catch (error) {
      addToast('error', error instanceof Error ? error.message : 'Failed to update job')
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deleteJob(jobId)
      setShowDeleteModal(false)
      setSelectedJob(null)
      addToast('success', 'Job deleted successfully!')
      fetchJobs()
    } catch (error) {
      addToast('error', error instanceof Error ? error.message : 'Failed to delete job')
    }
  }

  const handleStatusChange = async (jobId: string, status: string) => {
    try {
      await updateJobStatus(jobId, status)
      addToast('success', `Job ${status === 'active' ? 'activated' : 'deactivated'} successfully!`)
      fetchJobs()
    } catch (error) {
      void error
      addToast('error', 'Failed to update job status')
    }
  }

  // Bulk operations
  const handleBulkDelete = async () => {
    try {
      await bulkDelete(selectedJobs)
      setSelectedJobs([])
      addToast('success', `${selectedJobs.length} jobs deleted successfully!`)
      fetchJobs()
    } catch (error) {
      void error
      addToast('error', 'Failed to delete selected jobs')
    }
  }

  const handleBulkStatusChange = async (status: string) => {
    try {
      await bulkUpdateStatus(selectedJobs, status as 'active' | 'inactive' | 'draft' | 'expired')
      setSelectedJobs([])
      addToast('success', `${selectedJobs.length} jobs ${status} successfully!`)
      fetchJobs()
    } catch (error) {
      void error
      addToast('error', 'Failed to update selected jobs')
    }
  }

  // Email test functions
  const testJobApplicationEmail = async () => {
    setEmailLoading(true)
    setEmailResult(null)

    try {
      const response = await fetch('/api/email/job-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailFormData),
      })

      const data = await response.json()
      
      if (response.ok) {
        setEmailResult(`✅ Success! User email: ${data.userEmailSent ? '✅' : '❌'}, Admin emails: ${data.adminEmailsSent ? '✅' : '❌'}`)
        if (data.errors && data.errors.length > 0) {
          setEmailResult(prev => prev + `\n⚠️ Errors: ${data.errors.join(', ')}`)
        }
      } else {
        setEmailResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setEmailResult(`❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setEmailLoading(false)
    }
  }

  const testGeneralApplicationEmail = async () => {
    setEmailLoading(true)
    setEmailResult(null)

    try {
      const response = await fetch('/api/email/general-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicantEmail: emailFormData.applicantEmail,
          applicantName: emailFormData.applicantName,
          applicationId: emailFormData.applicationId,
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setEmailResult(`✅ Success! User email: ${data.userEmailSent ? '✅' : '❌'}, Admin emails: ${data.adminEmailsSent ? '✅' : '❌'}`)
        if (data.errors && data.errors.length > 0) {
          setEmailResult(prev => prev + `\n⚠️ Errors: ${data.errors.join(', ')}`)
        }
      } else {
        setEmailResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setEmailResult(`❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setEmailLoading(false)
    }
  }

  const checkEmailStatus = async () => {
    setEmailLoading(true)
    setEmailResult(null)

    try {
      const response = await fetch('/api/email/admin?action=status')
      const data = await response.json()
      
      if (response.ok) {
        setEmailResult(`📊 Email Service Status:
🔧 Configured: ${data.isConfigured ? '✅' : '❌'}
📧 From: ${data.config.fromEmail}
📤 Queue Enabled: ${data.config.queueEnabled ? '✅' : '❌'}
📈 Queue Stats: Total: ${data.queueStatus.total}, Pending: ${data.queueStatus.pending}, Sent: ${data.queueStatus.sent}, Failed: ${data.queueStatus.failed}`)
      } else {
        setEmailResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setEmailResult(`❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setEmailLoading(false)
    }
  }

  // Email admin dashboard functions
  const fetchEmailAdminStatus = async () => {
    try {
      const response = await fetch('/api/email/admin?action=status')
      if (response.ok) {
        const data = await response.json()
        setEmailAdminStatus(data)
      }
    } catch (error) {
      console.error('Failed to fetch email status:', error)
    }
  }

  const fetchEmailAdminQueue = async (status?: string) => {
    try {
      const url = status && status !== 'all' 
        ? `/api/email/admin?action=queue&status=${status}`
        : '/api/email/admin?action=queue'
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setEmailAdminQueue(data.queue || [])
      }
    } catch (error) {
      console.error('Failed to fetch email queue:', error)
    }
  }

  const retryFailedEmails = async () => {
    setEmailAdminActionLoading('retry')
    try {
      const response = await fetch('/api/email/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'retry-failed' }),
      })

      if (response.ok) {
        const result = await response.json()
        addToast('success', `Retried ${result.retriedCount} failed emails`)
        await fetchEmailAdminStatus()
        await fetchEmailAdminQueue(emailAdminSelectedStatus)
      }
    } catch (error) {
      console.error('Failed to retry emails:', error)
      addToast('error', 'Failed to retry emails')
    } finally {
      setEmailAdminActionLoading(null)
    }
  }

  const clearEmailQueue = async (status?: string) => {
    setEmailAdminActionLoading('clear')
    try {
      const response = await fetch('/api/email/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'clear-queue', status }),
      })

      if (response.ok) {
        const result = await response.json()
        addToast('success', `Cleared ${result.clearedCount} emails from queue`)
        await fetchEmailAdminStatus()
        await fetchEmailAdminQueue(emailAdminSelectedStatus)
      }
    } catch (error) {
      console.error('Failed to clear queue:', error)
      addToast('error', 'Failed to clear queue')
    } finally {
      setEmailAdminActionLoading(null)
    }
  }

  const resetEmailService = async () => {
    setEmailAdminActionLoading('reset')
    try {
      const response = await fetch('/api/email/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reset-service' }),
      })

      if (response.ok) {
        addToast('success', 'Email service reset successfully! New configuration loaded.')
        await fetchEmailAdminStatus()
        await fetchEmailAdminQueue(emailAdminSelectedStatus)
      }
    } catch (error) {
      console.error('Failed to reset email service:', error)
      addToast('error', 'Failed to reset email service')
    } finally {
      setEmailAdminActionLoading(null)
    }
  }

  // Load email admin data when emailAdmin tab is active
  useEffect(() => {
    if (activeTab === 'emailAdmin') {
      const fetchEmailAdminData = async () => {
        setEmailAdminLoading(true)
        await Promise.all([
          fetchEmailAdminStatus(),
          fetchEmailAdminQueue(emailAdminSelectedStatus)
        ])
        setEmailAdminLoading(false)
      }
      fetchEmailAdminData()
    }
  }, [activeTab, emailAdminSelectedStatus])

  // Filtering and searching
  const filteredJobs = jobsWithCounts.filter(job => {
    const matchesSearch = job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !filterDepartment || job.department === filterDepartment
    const matchesStatus = !filterStatus || job.status === filterStatus
    
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const departments = [...new Set(jobs.map(job => job.department))]
  const statuses = ['active', 'inactive', 'draft', 'expired']

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-red-500'
      case 'draft': return 'bg-yellow-500'
      case 'expired': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusTextColor = (status?: string) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'inactive': return 'text-red-400'
      case 'draft': return 'text-yellow-400'
      case 'expired': return 'text-orange-400'
      default: return 'text-gray-400'
    }
  }

  // Admin access check
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="mt-4 text-xl text-gray-300">
              Manage job postings and review applications
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-800/50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center px-6 py-3 rounded-md transition-all ${
                activeTab === 'jobs'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BriefcaseIcon className="w-5 h-5 mr-2" />
              Job Postings ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex items-center px-6 py-3 rounded-md transition-all ${
                activeTab === 'applications'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <UserGroupIcon className="w-5 h-5 mr-2" />
              Applications
            </button>
            <button
              onClick={() => setActiveTab('emailTest')}
              className={`flex items-center px-6 py-3 rounded-md transition-all ${
                activeTab === 'emailTest'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <EnvelopeIcon className="w-5 h-5 mr-2" />
              Email System Test
            </button>
            <button
              onClick={() => setActiveTab('emailAdmin')}
              className={`flex items-center px-6 py-3 rounded-md transition-all ${
                activeTab === 'emailAdmin'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <CogIcon className="w-5 h-5 mr-2" />
              Email Admin Dashboard
            </button>
          </div>
        </div>

        {/* Job Postings Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'jobs' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Actions Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Job Postings</h2>
                  <p className="text-gray-400 mt-1">
                    Manage your job openings ({filteredJobs.length} of {jobs.length})
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* View Toggle */}
                  <div className="flex bg-gray-800/50 rounded-lg p-1">
                    <button
                      onClick={() => setViewType('card')}
                      className={`p-2 rounded-md transition-all ${
                        viewType === 'card' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                      title="Card View"
                    >
                      <Squares2X2Icon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewType('table')}
                      className={`p-2 rounded-md transition-all ${
                        viewType === 'table' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                      title="Table View"
                    >
                      <ListBulletIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Create Job
                  </button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs by title or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Department Filter */}
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status} className="capitalize">{status}</option>
                  ))}
                </select>
              </div>

              {/* Bulk Actions Bar */}
              <AnimatePresence>
                {selectedJobs.length > 0 && (
                  <BulkActionsBar
                    selectedCount={selectedJobs.length}
                    onBulkDelete={handleBulkDelete}
                    onBulkActivate={() => handleBulkStatusChange('active')}
                    onBulkDeactivate={() => handleBulkStatusChange('inactive')}
                    onClearSelection={() => setSelectedJobs([])}
                  />
                )}
              </AnimatePresence>

              {/* Jobs Content */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                  <span className="ml-3 text-gray-400">Loading jobs...</span>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-12">
                  <BriefcaseIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-400 mb-2">
                    {jobs.length === 0 ? 'No jobs posted yet' : 'No jobs match your filters'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {jobs.length === 0 
                      ? 'Create your first job posting to get started.' 
                      : 'Try adjusting your search or filter criteria.'
                    }
                  </p>
                  {jobs.length === 0 && (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
                    >
                      Create First Job
                    </button>
                  )}
                </div>
              ) : (
                <JobsList
                  jobs={filteredJobs}
                  viewType={viewType}
                  selectedJobs={selectedJobs}
                  onJobSelect={(jobId, selected) => {
                    if (selected) {
                      setSelectedJobs(prev => [...prev, jobId])
                    } else {
                      setSelectedJobs(prev => prev.filter(id => id !== jobId))
                    }
                  }}
                  onJobEdit={(job) => {
                    setSelectedJob(job)
                    setShowEditModal(true)
                  }}
                  onJobDelete={(job) => {
                    setSelectedJob(job)
                    setShowDeleteModal(true)
                  }}
                  onJobPreview={(job) => {
                    setSelectedJob(job)
                    setShowPreviewModal(true)
                  }}
                  onStatusChange={handleStatusChange}
                  getStatusColor={getStatusColor}
                  getStatusTextColor={getStatusTextColor}
                />
              )}
            </motion.div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white">Applications</h2>
              
              {/* Applications content placeholder */}
              <div className="bg-gray-800/30 rounded-xl p-8 text-center">
                <UserGroupIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-400 mb-2">Applications Management</h3>
                <p className="text-gray-500">View and manage job applications here.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-white mb-2">Job Applications</h4>
                    <p className="text-3xl font-bold text-blue-400">0</p>
                    <p className="text-gray-400 text-sm">Applications for specific jobs</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-white mb-2">General Applications</h4>
                    <p className="text-3xl font-bold text-purple-400">0</p>
                    <p className="text-gray-400 text-sm">General interest applications</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Email Test Tab */}
          {activeTab === 'emailTest' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Test Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 rounded-xl border border-gray-700 p-6"
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
                      value={emailFormData.applicantEmail}
                      onChange={(e) => setEmailFormData({ ...emailFormData, applicantEmail: e.target.value })}
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
                      value={emailFormData.applicantName}
                      onChange={(e) => setEmailFormData({ ...emailFormData, applicantName: e.target.value })}
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
                      value={emailFormData.jobTitle}
                      onChange={(e) => setEmailFormData({ ...emailFormData, jobTitle: e.target.value })}
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
                      value={emailFormData.applicationId}
                      onChange={(e) => setEmailFormData({ ...emailFormData, applicationId: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="test-app-123"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={testJobApplicationEmail}
                    disabled={emailLoading || !emailFormData.applicantEmail || !emailFormData.applicantName}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {emailLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                    )}
                    Test Job Application Email
                  </button>
                  
                  <button
                    onClick={testGeneralApplicationEmail}
                    disabled={emailLoading || !emailFormData.applicantEmail || !emailFormData.applicantName}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {emailLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                    )}
                    Test General Application Email
                  </button>

                  <button
                    onClick={checkEmailStatus}
                    disabled={emailLoading}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {emailLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <EnvelopeIcon className="w-5 h-5 mr-2" />
                    )}
                    Check Email Status
                  </button>
                </div>
              </motion.div>

              {/* Results */}
              {emailResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 rounded-xl border border-gray-700 p-6"
                >
                  <h3 className="text-lg font-bold text-white mb-4">Test Results</h3>
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                    {emailResult}
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
                  <p>3. Check the Email Admin Dashboard tab for queue management and detailed monitoring</p>
                  <p>4. Test emails will be sent from: <strong>aniketyadavdv07@gmail.com</strong></p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Email Admin Dashboard Tab */}
          {activeTab === 'emailAdmin' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {emailAdminLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-400">Loading email admin dashboard...</span>
                </div>
              ) : (
                <>
                  {/* Service Configuration */}
                  {emailAdminStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-800/50 rounded-xl border border-gray-700 p-6"
                    >
                      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                        <InformationCircleIcon className="w-6 h-6 mr-2" />
                        Service Configuration
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Status</h4>
                          <p className={`text-lg font-semibold ${(emailAdminStatus as Record<string, unknown>)?.isConfigured ? 'text-green-400' : 'text-red-400'}`}>
                            {(emailAdminStatus as Record<string, unknown>)?.isConfigured ? 'Configured' : 'Not Configured'}
                          </p>
                        </div>
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-1">From Email</h4>
                          <p className="text-lg font-semibold text-white">{(emailAdminStatus.config as Record<string, unknown>)?.fromEmail as string || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Queue Enabled</h4>
                          <p className={`text-lg font-semibold ${(emailAdminStatus.config as Record<string, unknown>)?.queueEnabled ? 'text-green-400' : 'text-red-400'}`}>
                            {(emailAdminStatus.config as Record<string, unknown>)?.queueEnabled ? 'Yes' : 'No'}
                          </p>
                        </div>
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Retry Attempts</h4>
                          <p className="text-lg font-semibold text-white">{(emailAdminStatus.config as Record<string, unknown>)?.retryAttempts as number || 0}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Email Queue Stats */}
                  {emailAdminStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-2 md:grid-cols-5 gap-4"
                    >
                      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 text-center">
                        <EnvelopeIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-white">{((emailAdminStatus as Record<string, unknown>)?.queueStatus as Record<string, unknown>)?.total as number || 0}</p>
                        <p className="text-gray-400">Total</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 text-center">
                        <ClockIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-blue-400">{((emailAdminStatus as Record<string, unknown>)?.queueStatus as Record<string, unknown>)?.pending as number || 0}</p>
                        <p className="text-gray-400">Pending</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 text-center">
                        <CheckCircleIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-green-400">{((emailAdminStatus as Record<string, unknown>)?.queueStatus as Record<string, unknown>)?.sent as number || 0}</p>
                        <p className="text-gray-400">Sent</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 text-center">
                        <XCircleIcon className="w-8 h-8 text-red-400 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-red-400">{((emailAdminStatus as Record<string, unknown>)?.queueStatus as Record<string, unknown>)?.failed as number || 0}</p>
                        <p className="text-gray-400">Failed</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 text-center">
                        <ArrowPathIcon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-yellow-400">{((emailAdminStatus as Record<string, unknown>)?.queueStatus as Record<string, unknown>)?.retrying as number || 0}</p>
                        <p className="text-gray-400">Retrying</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/50 rounded-xl border border-gray-700 p-6"
                  >
                    <h3 className="text-lg font-bold text-white mb-4">Queue Management</h3>
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={retryFailedEmails}
                        disabled={emailAdminActionLoading === 'retry'}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {emailAdminActionLoading === 'retry' ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <ArrowPathIcon className="w-4 h-4 mr-2" />
                        )}
                        Retry Failed Emails
                      </button>
                      
                      <button
                        onClick={() => clearEmailQueue()}
                        disabled={emailAdminActionLoading === 'clear'}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {emailAdminActionLoading === 'clear' ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <TrashIcon className="w-4 h-4 mr-2" />
                        )}
                        Clear Queue
                      </button>

                      <button
                        onClick={resetEmailService}
                        disabled={emailAdminActionLoading === 'reset'}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {emailAdminActionLoading === 'reset' ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <CogIcon className="w-4 h-4 mr-2" />
                        )}
                        Reset Service
                      </button>
                    </div>
                  </motion.div>

                  {/* Email Queue Filter */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/50 rounded-xl border border-gray-700 p-6"
                  >
                    <h3 className="text-lg font-bold text-white mb-4">Email Queue</h3>
                    
                    {/* Filter */}
                    <div className="mb-4">
                      <select
                        value={emailAdminSelectedStatus}
                        onChange={(e) => setEmailAdminSelectedStatus(e.target.value)}
                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="sent">Sent</option>
                        <option value="failed">Failed</option>
                        <option value="retrying">Retrying</option>
                      </select>
                    </div>

                    {/* Queue Items */}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {emailAdminQueue.length > 0 ? (
                        emailAdminQueue.map((item: Record<string, unknown>, index: number) => (
                          <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-medium">{String(item.to)}</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                item.status === 'sent' ? 'bg-green-500/20 text-green-400' :
                                item.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                                item.status === 'retrying' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {String(item.status)}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-1">{String((item.template as Record<string, unknown>)?.subject || '')}</p>
                            <p className="text-gray-500 text-xs">
                              Created: {new Date(String(item.createdAt)).toLocaleString()}
                              {Number(item.attempts) > 0 && ` • Attempts: ${item.attempts}/${item.maxAttempts}`}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <EnvelopeIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400">No emails in queue</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <JobCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateJob}
        existingJobs={jobs}
      />

      <JobEditModal
        isOpen={showEditModal}
        job={selectedJob}
        onClose={() => {
          setShowEditModal(false)
          setSelectedJob(null)
        }}
        onSubmit={(jobData) => selectedJob ? handleUpdateJob(selectedJob.id, jobData) : Promise.resolve()}
        existingJobs={jobs}
      />

      <JobPreviewModal
        isOpen={showPreviewModal}
        job={selectedJob}
        onClose={() => {
          setShowPreviewModal(false)
          setSelectedJob(null)
        }}
        onEdit={() => {
          setShowPreviewModal(false)
          setShowEditModal(true)
        }}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        job={selectedJob}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedJob(null)
        }}
        onConfirm={() => selectedJob && handleDeleteJob(selectedJob.id)}
      />

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              type={toast.type}
              message={toast.message}
              onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// JobsList Component
interface JobsListProps {
  jobs: JobWithApplicationCount[];
  viewType: ViewType;
  selectedJobs: string[];
  onJobSelect: (id: string, selected: boolean) => void;
  onJobEdit: (job: Job) => void;
  onJobDelete: (job: Job) => void;
  onJobPreview: (job: Job) => void;
  onStatusChange: (id: string, status: string) => void;
  getStatusColor: (status?: string) => string;
  getStatusTextColor: (status?: string) => string;
}

const JobsList = ({ jobs, viewType, selectedJobs, onJobSelect, onJobEdit, onJobDelete, onJobPreview, onStatusChange, getStatusColor, getStatusTextColor }: JobsListProps) => {
  if (viewType === 'table') {
    return (
      <div className="bg-gray-800/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedJobs.length === jobs.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        jobs.forEach((job: Job) => onJobSelect(job.id, true))
                      } else {
                        jobs.forEach((job: Job) => onJobSelect(job.id, false))
                      }
                    }}
                    className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Job</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Applications</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {jobs.map((job) => (
                <motion.tr
                  key={job.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedJobs.includes(job.id)}
                      onChange={(e) => onJobSelect(job.id, e.target.checked)}
                      className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">{job.job_title}</div>
                      <div className="text-sm text-gray-400">{job.location}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{job.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(job.status)}`}></div>
                      <span className={`text-sm capitalize ${getStatusTextColor(job.status)}`}>{job.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{job.applicationCount || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onJobPreview(job)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="Preview"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onJobEdit(job)}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onJobDelete(job)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // Card view
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          isSelected={selectedJobs.includes(job.id)}
          onSelect={(selected) => onJobSelect(job.id, selected)}
          onEdit={() => onJobEdit(job)}
          onDelete={() => onJobDelete(job)}
          onPreview={() => onJobPreview(job)}
          onStatusChange={(status) => onStatusChange(job.id, status)}
          getStatusColor={getStatusColor}
          getStatusTextColor={getStatusTextColor}
        />
      ))}
    </div>
  )
}

// JobCard component
interface JobCardProps {
  job: JobWithApplicationCount;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onPreview: () => void;
  onStatusChange: (status: string) => void;
  getStatusColor: (status?: string) => string;
  getStatusTextColor: (status?: string) => string;
}

const JobCard = ({ job, isSelected, onSelect, onEdit, onDelete, onPreview, onStatusChange, getStatusColor, getStatusTextColor }: JobCardProps) => {
  return (
    <motion.div
      layout
      className={`bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border transition-all ${
        isSelected ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-gray-700 hover:border-gray-600'
      }`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className="rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500"
          />
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(job.status)}`}></div>
            <span className={`text-sm capitalize ${getStatusTextColor(job.status)}`}>{job.status}</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{job.job_title}</h3>
          <div className="text-sm text-gray-400 space-y-1">
            <div>{job.department} • {job.location}</div>
            <div>{job.job_type} • {job.experience_level}</div>
            {job.salary_range && <div className="text-blue-400">{job.salary_range}</div>}
          </div>
        </div>

        <p className="text-gray-300 text-sm line-clamp-2">{job.short_description}</p>

        <div className="flex items-center justify-between text-sm">
          <span className="text-purple-400">{job.applicationCount || 0} applications</span>
          <span className="text-gray-400">{job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <button
              onClick={onPreview}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
              title="Preview"
            >
              <EyeIcon className="w-4 h-4" />
            </button>
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
              title="Edit"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
              title="Delete"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>

          <select
            value={job.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>
    </motion.div>
  )
}
