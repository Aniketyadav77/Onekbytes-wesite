'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Job } from '@/types/database'
import { 
  XMarkIcon, 
  ExclamationTriangleIcon,
  DocumentTextIcon,
  MapPinIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

// Rich text editor (we'll use a simple textarea with formatting for now, can upgrade to react-quill later)
interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  required?: boolean
  error?: string
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  label, 
  required,
  error 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.max(120, textarea.scrollHeight)}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [value])

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            adjustTextareaHeight()
          }}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            error ? 'border-red-500' : 'border-gray-700'
          }`}
          style={{ minHeight: '120px' }}
        />
        <DocumentTextIcon className="w-5 h-5 absolute right-3 top-3 text-gray-400" />
      </div>
      {error && (
        <p className="text-red-400 text-sm flex items-center">
          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}

interface JobCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (jobData: Omit<Job, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  existingJobs: Job[]
}

export default function JobCreateModal({ isOpen, onClose, onSubmit, existingJobs }: JobCreateModalProps) {
  const [formData, setFormData] = useState({
    job_title: '',
    department: '',
    location: '',
    job_type: 'full_time',
    experience_level: 'entry_level',
    salary_range: '',
    short_description: '',
    full_description: '',
    requirements: '',
    responsibilities: '',
    status: 'draft'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        job_title: '',
        department: '',
        location: '',
        job_type: 'full_time',
        experience_level: 'entry_level',
        salary_range: '',
        short_description: '',
        full_description: '',
        requirements: '',
        responsibilities: '',
        status: 'draft'
      })
      setErrors({})
    }
  }, [isOpen])

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
    { value: 'full_time', label: 'Full-time' },
    { value: 'part_time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'remote', label: 'Remote' }
  ]

  const experienceLevels = [
    { value: 'entry_level', label: 'Entry Level' },
    { value: 'mid_level', label: 'Mid Level' },
    { value: 'senior_level', label: 'Senior Level' },
    { value: 'lead', label: 'Lead' },
    { value: 'executive', label: 'Executive' }
  ]

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Only job title is required
    if (!formData.job_title.trim()) {
      newErrors.job_title = 'Job title is required'
    } else if (formData.job_title.length < 3) {
      newErrors.job_title = 'Job title must be at least 3 characters'
    }

    // Check for duplicate job titles
    const duplicateJob = existingJobs.find(
      job => job.job_title.toLowerCase() === formData.job_title.toLowerCase().trim()
    )
    if (duplicateJob) {
      newErrors.job_title = 'A job with this title already exists'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setErrors({}) // Clear any previous errors
    
    try {
      // Clean up form data
      const cleanedData = {
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

      await onSubmit(cleanedData)
      // Only close on success - onSubmit will handle closing if needed
    } catch (error) {
      // Show error to user, keep modal open for retry
      const errorMessage = error instanceof Error ? error.message : 'Failed to create job. Please try again.'
      console.error('[JobCreateModal] Error creating job:', errorMessage)
      setErrors({ submit: errorMessage })
    } finally {
      // Always reset submitting state
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

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                <h2 className="text-2xl font-bold text-white">Create New Job</h2>
                <p className="text-gray-400 mt-1">Add a new job posting to your careers page</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
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
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="e.g., San Francisco, CA or Remote"
                          className={`w-full px-4 py-3 pl-10 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.location ? 'border-red-500' : 'border-gray-700'
                          }`}
                        />
                        <MapPinIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
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
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.salary_range}
                          onChange={(e) => handleInputChange('salary_range', e.target.value)}
                          placeholder="e.g., $120k - $160k"
                          className="w-full px-4 py-3 pl-10 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <CurrencyDollarIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
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

                  {/* Full Description */}
                  <RichTextEditor
                    label="Full Job Description"
                    value={formData.full_description}
                    onChange={(value) => handleInputChange('full_description', value)}
                    placeholder="Detailed description of the role, company, and what makes this opportunity exciting..."
                    error={errors.full_description}
                  />

                  {/* Responsibilities */}
                  <RichTextEditor
                    label="Key Responsibilities"
                    value={formData.responsibilities}
                    onChange={(value) => handleInputChange('responsibilities', value)}
                    placeholder="• Lead development of new features&#10;• Collaborate with cross-functional teams&#10;• Mentor junior developers..."
                    error={errors.responsibilities}
                  />

                  {/* Requirements */}
                  <RichTextEditor
                    label="Requirements & Qualifications"
                    value={formData.requirements}
                    onChange={(value) => handleInputChange('requirements', value)}
                    placeholder="• 5+ years of software development experience&#10;• Proficiency in React, TypeScript, and Node.js&#10;• Experience with cloud platforms..."
                    error={errors.requirements}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-4 p-6 bg-gray-800/30 border-t border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Job'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}
