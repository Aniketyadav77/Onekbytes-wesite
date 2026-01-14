'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  XMarkIcon,
  CheckIcon,
  EyeSlashIcon,
  TrashIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline'

interface BulkActionsBarProps {
  selectedCount: number
  onBulkDelete: () => void
  onBulkActivate: () => void
  onBulkDeactivate: () => void
  onClearSelection: () => void
}

export default function BulkActionsBar({
  selectedCount,
  onBulkDelete,
  onBulkActivate,
  onBulkDeactivate,
  onClearSelection
}: BulkActionsBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
    >
      <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-4">
        <div className="flex items-center space-x-6">
          {/* Selection Info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded-lg">
              <Squares2X2Icon className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-white font-medium">
                {selectedCount} job{selectedCount === 1 ? '' : 's'} selected
              </p>
              <p className="text-gray-400 text-sm">Choose an action to apply</p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-12 bg-gray-600"></div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Activate */}
            <button
              onClick={onBulkActivate}
              className="flex items-center px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-all transform hover:scale-105"
              title="Activate selected jobs"
            >
              <CheckIcon className="w-4 h-4 mr-2" />
              Activate
            </button>

            {/* Deactivate */}
            <button
              onClick={onBulkDeactivate}
              className="flex items-center px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-all transform hover:scale-105"
              title="Deactivate selected jobs"
            >
              <EyeSlashIcon className="w-4 h-4 mr-2" />
              Deactivate
            </button>

            {/* Delete */}
            <button
              onClick={onBulkDelete}
              className="flex items-center px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all transform hover:scale-105"
              title="Delete selected jobs"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-12 bg-gray-600"></div>

          {/* Clear Selection */}
          <button
            onClick={onClearSelection}
            className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
            title="Clear selection"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
