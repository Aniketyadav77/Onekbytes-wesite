'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Job } from '@/types/database'
import { 
  XMarkIcon, 
  ExclamationTriangleIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  job: Job | null
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteConfirmationModal({ 
  isOpen, 
  job, 
  onClose, 
  onConfirm 
}: DeleteConfirmationModalProps) {
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
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-red-500/20 rounded-lg">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Delete Job</h2>
                  <p className="text-gray-400 text-sm">This action cannot be undone</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-300 mb-4">
                  Are you sure you want to delete this job posting? This will permanently remove:
                </p>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-4">
                  <div className="flex items-start space-x-3">
                    <TrashIcon className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white">{job.job_title}</h3>
                      <div className="text-gray-400 text-sm mt-1">
                        {job.department} • {job.location}
                      </div>
                      <div className="text-gray-400 text-sm">
                        Created: {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h4 className="text-red-400 font-medium mb-2">⚠️ Warning:</h4>
                  <ul className="text-red-300 text-sm space-y-1">
                    <li>• The job posting will be removed from the careers page</li>
                    <li>• All associated applications will be preserved</li>
                    <li>• The job will no longer accept new applications</li>
                    <li>• This action cannot be undone</li>
                  </ul>
                </div>
              </div>

              {/* Alternative Actions */}
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="text-blue-400 font-medium mb-2">💡 Consider instead:</h4>
                <p className="text-blue-300 text-sm mb-2">
                  If you want to stop accepting applications but keep the job data:
                </p>
                <button
                  onClick={() => {
                    // This would trigger a status change to inactive instead of delete
                    onClose()
                    // You could add a callback here to change status to inactive
                  }}
                  className="text-blue-400 hover:text-blue-300 text-sm underline"
                >
                  Set job status to &quot;Inactive&quot; instead
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all transform hover:scale-105 flex items-center space-x-2"
                >
                  <TrashIcon className="w-4 h-4" />
                  <span>Delete Job</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}
