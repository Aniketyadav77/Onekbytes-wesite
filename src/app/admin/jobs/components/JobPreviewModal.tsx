'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Job } from '@/types/database'
import { 
  XMarkIcon, 
  PencilIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

interface JobPreviewModalProps {
  isOpen: boolean
  job: Job | null
  onClose: () => void
  onEdit: () => void
}

export default function JobPreviewModal({ isOpen, job, onClose, onEdit }: JobPreviewModalProps) {
  if (!isOpen || !job) return null

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

  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <div key={index} className="mb-2">
        {line.trim().startsWith('•') ? (
          <div className="flex items-start">
            <span className="text-purple-400 mr-2 mt-1">•</span>
            <span>{line.trim().substring(1).trim()}</span>
          </div>
        ) : line.trim() ? (
          <p>{line}</p>
        ) : (
          <br />
        )}
      </div>
    ))
  }

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
              <div className="flex items-center space-x-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{job.job_title}</h2>
                  <div className="flex items-center space-x-4 mt-2 text-gray-400">
                    <div className="flex items-center space-x-1">
                      <BuildingOfficeIcon className="w-4 h-4" />
                      <span>{job.department}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(job.status || 'draft')}`}></div>
                      <span className={`capitalize ${getStatusTextColor(job.status || 'draft')}`}>{job.status || 'draft'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={onEdit}
                  className="flex items-center px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
              <div className="space-y-8">
                {/* Job Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <ClockIcon className="w-5 h-5 text-purple-400" />
                      <h3 className="font-semibold text-white">Job Type</h3>
                    </div>
                    <p className="text-gray-300 capitalize">{job.job_type}</p>
                  </div>

                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <UserGroupIcon className="w-5 h-5 text-blue-400" />
                      <h3 className="font-semibold text-white">Experience Level</h3>
                    </div>
                    <p className="text-gray-300 capitalize">{job.experience_level.replace('-', ' ')}</p>
                  </div>

                  {job.salary_range && (
                    <div className="bg-gray-800/30 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
                        <h3 className="font-semibold text-white">Salary Range</h3>
                      </div>
                      <p className="text-gray-300">{job.salary_range}</p>
                    </div>
                  )}
                </div>

                {/* Short Description */}
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">About This Role</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">{job.short_description}</p>
                </div>

                {/* Job Description */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                    Job Description
                  </h3>
                  <div className="text-gray-300 leading-relaxed space-y-4">
                    {formatText(job.full_description)}
                  </div>
                </div>

                {/* Responsibilities */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                    Key Responsibilities
                  </h3>
                  <div className="text-gray-300 leading-relaxed">
                    {formatText(job.responsibilities)}
                  </div>
                </div>

                {/* Qualifications */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                    Required Qualifications
                  </h3>
                  <div className="text-gray-300 leading-relaxed">
                    {formatText(job.requirements)}
                  </div>
                </div>

                {/* Responsibilities */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                    Key Responsibilities
                  </h3>
                  <div className="text-gray-300 leading-relaxed">
                    {formatText(job.responsibilities)}
                  </div>
                </div>

                {/* Metadata */}
                <div className="bg-gray-800/20 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Job Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Created:</span>
                      <span className="text-white ml-2">
                        {new Date(job.created_at || Date.now()).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Last Updated:</span>
                      <span className="text-white ml-2">
                        {new Date(job.updated_at || job.created_at || Date.now()).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Job ID:</span>
                      <span className="text-white ml-2 font-mono text-xs">
                        {job.id.substring(0, 8)}...
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className={`ml-2 capitalize font-medium ${getStatusTextColor(job.status || 'draft')}`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Application Preview */}
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    How This Will Appear on Careers Page
                  </h3>
                  <div className="bg-black/30 rounded-lg p-4 border border-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-white">{job.job_title}</h4>
                        <div className="flex items-center space-x-2 text-gray-400 text-sm mt-1">
                          <span>{job.department}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span className="capitalize">{job.job_type}</span>
                        </div>
                      </div>
                      {job.salary_range && (
                        <div className="text-blue-400 font-medium">
                          {job.salary_range}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {job.short_description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(job.status || 'draft')}`}></div>
                        <span className={`text-xs capitalize ${getStatusTextColor(job.status || 'draft')}`}>
                          {job.status}
                        </span>
                      </div>
                      <button className="px-4 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}
