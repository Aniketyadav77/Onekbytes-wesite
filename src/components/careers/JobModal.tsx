'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, MapPinIcon, CurrencyDollarIcon, ClockIcon, BriefcaseIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import JobApplicationModal from './JobApplicationModal';
import { Job } from '@/types/database';

interface JobModalProps {
  job: Job;
  onClose: () => void;
}

export default function JobModal({ job, onClose }: JobModalProps) {
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // Reset application modal when main modal closes
  useEffect(() => {
    if (!job) {
      setShowApplicationModal(false);
    }
  }, [job]);

  const handleApplyClick = () => {
    if (!user) {
      // Redirect to sign in if not authenticated
      router.push('/signin');
      return;
    }
    
    // Open application modal if authenticated
    setShowApplicationModal(true);
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {job && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" 
              onClick={onClose}
            />
            
            {/* Modal */}
            <motion.div
              className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl border border-gray-700 shadow-2xl overflow-hidden"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.2, type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <motion.div
              className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-3xl"
              animate={{
                x: [0, 30, 0],
                y: [0, -20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-12 -left-12 w-28 h-28 bg-gradient-to-br from-pink-400 to-blue-600 rounded-full blur-3xl"
              animate={{
                x: [0, -25, 0],
                y: [0, 25, 0],
                scale: [1, 0.8, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
          </div>

          {/* Close button */}
          <button
            onClick={handleCloseClick}
            className="absolute top-4 right-4 z-20 p-2 text-gray-400 hover:text-white bg-gray-800/70 hover:bg-gray-700/80 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="relative z-10 p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {job.department}
                </span>
                <span className="text-green-400 text-sm font-medium bg-green-400/10 px-3 py-1 rounded-full">
                  {job.job_type}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {job.job_title}
              </h2>
              
              {/* Job details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center text-gray-300">
                  <MapPinIcon className="w-5 h-5 mr-3 text-blue-400" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <CurrencyDollarIcon className="w-5 h-5 mr-3 text-green-400" />
                  <span>{job.salary_range || 'Competitive'}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <ClockIcon className="w-5 h-5 mr-3 text-purple-400" />
                  <span>{job.experience_level}</span>
                </div>
              </div>
            </div>

            {/* Job description */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <BriefcaseIcon className="w-5 h-5 mr-2 text-blue-400" />
                  About This Role
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {job.full_description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Requirements */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Requirements
                  </h3>
                  <div className="space-y-3">
                    {job.requirements.split(';').map((requirement, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start text-gray-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-sm">{requirement.trim()}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Responsibilities */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Responsibilities
                  </h3>
                  <div className="space-y-3">
                    {job.responsibilities.split(';').map((responsibility, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start text-gray-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-sm">{responsibility.trim()}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Apply button */}
              <div className="pt-8 border-t border-gray-700">
                <motion.button
                  onClick={handleApplyClick}
                  className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 px-8 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Apply for This Position</span>
                  <ArrowRightIcon className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                </motion.button>
                <p className="text-gray-400 text-sm mt-3 text-center md:text-left">
                  Fill out the application form to apply
                </p>
              </div>
            </div>
          </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
          
      {/* Job Application Modal */}
      <JobApplicationModal
        job={job}
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
      />
    </>
  );
}
