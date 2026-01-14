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
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

// Import modal components (we'll create these next)
import JobCreateModal from './components/JobCreateModal'
import JobEditModal from './components/JobEditModal'
import JobPreviewModal from './components/JobPreviewModal'
import DeleteConfirmationModal from './components/DeleteConfirmationModal'
import BulkActionsBar from './components/BulkActionsBar'
import Toast from './components/Toast'

type TabType = 'jobs' | 'applications'
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

  // Filtering and searching
  const filteredJobs = jobsWithCounts.filter(job => {
    const matchesSearch = job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !filterDepartment || job.department === filterDepartment
    const matchesStatus = !filterStatus || job.status === filterStatus
    
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const departments = [...new Set(jobs.map(job => job.department))]
  const statuses = ['active', 'inactive', 'draft']

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-red-500'
      case 'draft': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'inactive': return 'text-red-400'
      case 'draft': return 'text-yellow-400'
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

// JobsList Component (placeholder - we'll create the full component next)
interface JobsListProps {
  jobs: JobWithApplicationCount[];
  viewType: ViewType;
  selectedJobs: string[];
  onJobSelect: (id: string, selected: boolean) => void;
  onJobEdit: (job: Job) => void;
  onJobDelete: (job: Job) => void;
  onJobPreview: (job: Job) => void;
  onStatusChange: (id: string, status: string) => void;
  getStatusColor: (status: string) => string;
  getStatusTextColor: (status: string) => string;
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
              {jobs.map((job: JobWithApplicationCount) => (
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
                      <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(job.status || 'draft')}`}></div>
                      <span className={`text-sm capitalize ${getStatusTextColor(job.status || 'draft')}`}>{job.status || 'draft'}</span>
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

  // Card view will be implemented in the next step
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job: JobWithApplicationCount) => (
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

// JobCard component placeholder
interface JobCardProps {
  job: JobWithApplicationCount;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onPreview: () => void;
  onStatusChange: (status: string) => void;
  getStatusColor: (status: string) => string;
  getStatusTextColor: (status: string) => string;
}

const JobCard = ({ job, isSelected, onSelect, onEdit, onDelete, onPreview, onStatusChange, getStatusColor, getStatusTextColor }: JobCardProps) => {
  return (
    <motion.div
      layout
      className={`bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border transition-all ${
        isSelected ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-gray-700 hover:border-gray-600'
      }`}
    >
      {/* Card content will be implemented in the next step */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className="rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500"
          />
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(job.status || 'draft')}`}></div>
            <span className={`text-sm capitalize ${getStatusTextColor(job.status || 'draft')}`}>{job.status || 'draft'}</span>
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
          </select>
        </div>
      </div>
    </motion.div>
  )
}
