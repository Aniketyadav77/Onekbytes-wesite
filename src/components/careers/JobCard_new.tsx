'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, CurrencyDollarIcon, BriefcaseIcon, ClockIcon, EyeIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import JobApplicationModal from './JobApplicationModal';
import { Job } from '@/types/database';

interface JobCardProps {
  job: Job;
  onViewDetails: () => void;
}

export default function JobCard({ job, onViewDetails }: JobCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleApplyClick = () => {
    if (!user) {
      // Redirect to sign in if not authenticated
      router.push('/signin');
      return;
    }
    
    // Open application modal if authenticated
    setShowApplicationModal(true);
  };

  return (
    <motion.div
      className="group relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="relative w-full bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300">
        {/* Modern gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Subtle animated background */}
        <motion.div
          className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"
          animate={{
            scale: isHovered ? 1.2 : 1,
            opacity: isHovered ? 0.3 : 0.1,
          }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Content */}
        <div className="relative z-10 p-6 h-full flex flex-col min-h-[400px]">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                {job.department}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-green-400 text-xs font-medium bg-green-400/10 px-2 py-1 rounded-full">
                  {job.job_type}
                </span>
                <BriefcaseIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors duration-300">
              {job.job_title}
            </h3>
          </div>

          {/* Details */}
          <div className="space-y-4 mb-6 flex-1">
            <div className="flex items-center text-gray-300 text-sm">
              <MapPinIcon className="w-4 h-4 mr-3 text-blue-400" />
              <span className="line-clamp-1">{job.location}</span>
            </div>
            <div className="flex items-center text-gray-300 text-sm">
              <CurrencyDollarIcon className="w-4 h-4 mr-3 text-green-400" />
              <span>{job.salary_range || 'Competitive'}</span>
            </div>
            <div className="flex items-center text-gray-300 text-sm">
              <ClockIcon className="w-4 h-4 mr-3 text-purple-400" />
              <span>{job.experience_level}</span>
            </div>
            
            {/* Description */}
            <div className="mt-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
              <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
                {job.short_description}
              </p>
            </div>
            
            {/* Requirements Preview */}
            {job.requirements && (
              <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-700/20">
                <h4 className="text-blue-300 font-semibold text-xs mb-2">Key Requirements</h4>
                <p className="text-gray-400 text-xs line-clamp-2">
                  {job.requirements.split(';').slice(0, 2).join('; ')}...
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3 mt-auto">
            <button
              onClick={onViewDetails}
              className="w-full bg-gray-800/60 hover:bg-gray-700/60 border border-gray-600/50 hover:border-gray-500/50 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center group/btn"
            >
              <EyeIcon className="w-4 h-4 mr-2 text-gray-400 group-hover/btn:text-white transition-colors" />
              <span>View Details</span>
            </button>
            
            <motion.button
              onClick={handleApplyClick}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center group/apply shadow-lg hover:shadow-blue-500/25"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Apply Now</span>
              <ArrowRightIcon className="w-4 h-4 ml-2 group-hover/apply:translate-x-1 transition-transform duration-200" />
            </motion.button>
          </div>
        </div>

        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Job Application Modal */}
      <JobApplicationModal
        job={job}
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
      />
    </motion.div>
  );
}
