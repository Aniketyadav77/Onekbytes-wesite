'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Job } from '@/types/database'
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface JobEditModalProps {
  isOpen: boolean
  job: Job | null
  onClose: () => void
  onSubmit: (jobData: Partial<Job>) => Promise<void>
  existingJobs: Job[]
}

export default function JobEditModal({ isOpen, job, onClose, onSubmit, existingJobs }: JobEditModalProps) {
  const [formData, setFormData] = useState({
    job_title: '',
    department: '',
    location: '',
    job_type: 'full-time',
    experience_level: 'mid-level',
    salary_range: '',
    short_description: '',
    full_description: '',
    requirements: '',
    responsibilities: '',
    status: 'draft'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Update form data when job changes
  useEffect(() => {
    if (job && isOpen) {
      const newFormData = {
        job_title: job.job_title || '',
        department: job.department || '',
        location: job.location || '',
        job_type: job.job_type || 'full-time',
        experience_level: job.experience_level || 'mid-level',
        salary_range: job.salary_range || '',
        short_description: job.short_description || '',
        full_description: job.full_description || '',
        requirements: job.requirements || '',
        responsibilities: job.responsibilities || '',
        status: job.status || 'draft'
      }
      setFormData(newFormData)
      setErrors({})
      setHasChanges(false)
    }
  }, [job, isOpen])

  // Track changes
  useEffect(() => {
    if (!job) return

    const hasFormChanges = Object.keys(formData).some(key => {
      const formValue = formData[key as keyof typeof formData]
      const jobValue = job[key as keyof Job]
      
      return formValue !== (jobValue || '')
    })

    setHasChanges(hasFormChanges)
  }, [formData, job])

  const departments = [
    'Engineering',
    'AI/ML Research',
    'Product',
    'Design',
    'Marketing',
    'Sales',
    'Operations',
    'Human Resources',
    'Finance',
    'Legal',
    'Customer Success'
  ]

  const jobTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'remote', label: 'Remote' }
  ]

  const experienceLevels = [
    { value: 'entry-level', label: 'Entry Level' },
    { value: 'mid-level', label: 'Mid Level' },
    { value: 'senior-level', label: 'Senior Level' },
    { value: 'lead', label: 'Lead' },
    { value: 'executive', label: 'Executive' }
  ]

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.job_title.trim()) {
      newErrors.job_title = 'Job title is required'
    } else if (formData.job_title.length < 3) {
      newErrors.job_title = 'Job title must be at least 3 characters'
    }

    // Check for duplicate job titles (excluding current job)
    const duplicateJob = existingJobs.find(
      existingJob => existingJob.id !== job?.id && 
      existingJob.job_title.toLowerCase() === formData.job_title.toLowerCase().trim()
    )
    if (duplicateJob) {
      newErrors.job_title = 'A job with this title already exists'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !hasChanges) {
      return
    }

    setIsSubmitting(true)
    try {
      // Clean up and submit form data
      const updates: Partial<Job> = {
        job_title: formData.job_title.trim(),
        department: formData.department.trim(),
        location: formData.location.trim(),
        job_type: formData.job_type,
        experience_level: formData.experience_level,
        salary_range: formData.salary_range.trim() || undefined,
        short_description: formData.short_description.trim(),
        full_description: formData.full_description.trim(),
        requirements: formData.requirements.trim(),
        responsibilities: formData.responsibilities.trim(),
        status: formData.status as 'active' | 'inactive' | 'draft' | 'expired'
      }

      await onSubmit(updates)
      onClose()
    } catch (error) {
      console.error('Error updating job:', error)
      setErrors({ submit: 'Failed to update job. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleClose = () => {
    if (hasChanges && !isSubmitting) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose()
      }
    } else {
      onClose()
    }
  }

  if (!isOpen || !job) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-white">Edit Job</h2>
                <p className="text-gray-400 mt-1">
                  Updating: {job.job_title}
                  {hasChanges && <span className="text-yellow-400 ml-2">• Unsaved changes</span>}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Form - reuse the same form structure as JobCreateModal */}
            <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="p-6 space-y-6">
                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-2" />
                      <span className="text-red-400">{errors.submit}</span>
                    </div>
                  </div>
                )}

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Job Title */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Job Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.job_title}
                        onChange={(e) => handleInputChange('job_title', e.target.value)}
                        placeholder="e.g., Senior Software Engineer"
                        className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.job_title ? 'border-red-500' : 'border-gray-700'
                        }`}
                      />
                      {errors.job_title && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors.job_title}
                        </p>
                      )}
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Department
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.department ? 'border-red-500' : 'border-gray-700'
                        }`}
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      {errors.department && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors.department}
                        </p>
                      )}
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="e.g., San Francisco, CA or Remote"
                        className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.location ? 'border-red-500' : 'border-gray-700'
                        }`}
                      />
                      {errors.location && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors.location}
                        </p>
                      )}
                    </div>

                    {/* Job Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Job Type
                      </label>
                      <select
                        value={formData.job_type}
                        onChange={(e) => handleInputChange('job_type', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {jobTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Experience Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Experience Level
                      </label>
                      <select
                        value={formData.experience_level}
                        onChange={(e) => handleInputChange('experience_level', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {experienceLevels.map(level => (
                          <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Salary Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Salary Range (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.salary_range}
                        onChange={(e) => handleInputChange('salary_range', e.target.value)}
                        placeholder="e.g., $120k - $160k"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="expired">Expired</option>
                      </select>
                    </div>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Short Description
                    </label>
                    <textarea
                      value={formData.short_description}
                      onChange={(e) => handleInputChange('short_description', e.target.value)}
                      placeholder="Brief summary of the role"
                      rows={3}
                      className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                        errors.short_description ? 'border-red-500' : 'border-gray-700'
                      }`}
                    />
                    {errors.short_description && (
                      <p className="text-red-400 text-sm flex items-center mt-1">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.short_description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Detailed Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                    Detailed Information
                  </h3>

                  {/* Job Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Job Description
                    </label>
                    <textarea
                      value={formData.full_description}
                      onChange={(e) => handleInputChange('full_description', e.target.value)}
                      placeholder="Detailed description of the role, company, and what makes this opportunity exciting..."
                      rows={6}
                      className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                        errors.full_description ? 'border-red-500' : 'border-gray-700'
                      }`}
                    />
                    {errors.full_description && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.full_description}
                      </p>
                    )}
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Key Responsibilities
                    </label>
                    <textarea
                      value={formData.responsibilities}
                      onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                      placeholder="• Lead development of new features&#10;• Collaborate with cross-functional teams&#10;• Mentor junior developers..."
                      rows={6}
                      className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                        errors.responsibilities ? 'border-red-500' : 'border-gray-700'
                      }`}
                    />
                    {errors.responsibilities && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.responsibilities}
                      </p>
                    )}
                  </div>

                  {/* Qualifications */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Required Qualifications
                    </label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) => handleInputChange('requirements', e.target.value)}
                      placeholder="• 5+ years of software development experience&#10;• Proficiency in React, TypeScript, and Node.js&#10;• Experience with cloud platforms..."
                      rows={6}
                      className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                        errors.requirements ? 'border-red-500' : 'border-gray-700'
                      }`}
                    />
                    {errors.requirements && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.requirements}
                      </p>
                    )}
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 bg-gray-800/30 border-t border-gray-700">
                <div className="text-sm text-gray-400">
                  Last updated: {new Date(job.updated_at || job.created_at || Date.now()).toLocaleString()}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !hasChanges}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </div>
                    ) : hasChanges ? (
                      'Update Job'
                    ) : (
                      'No Changes'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}
