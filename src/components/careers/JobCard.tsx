'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, CurrencyDollarIcon, BriefcaseIcon, ClockIcon, EyeIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Job } from '@/types/database';

interface JobCardProps {
  job: Job;
  onViewDetails: () => void;
  onApply: () => void;
  isModalOpen?: boolean;
}

export default function JobCard({ job, onViewDetails, onApply, isModalOpen = false }: JobCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const handleApplyClick = () => {
    if (!user) {
      // Redirect to sign in if not authenticated
      router.push('/signin');
      return;
    }
    
    // Call parent's onApply function
    onApply();
  };

  // Debounce hover effects when modal is open to prevent conflicts
  const handleMouseEnter = () => {
    if (!isModalOpen) {
      // Clear any existing timeout
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      // Add a small delay to prevent rapid state changes
      const timeout = setTimeout(() => setIsHovered(true), 50);
      setHoverTimeout(timeout);
    }
  };

  const handleMouseLeave = () => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsHovered(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  return (
    <motion.div
      className="group relative w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={!isModalOpen ? { y: -8 } : {}}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="relative w-full bg-black/95 backdrop-blur-sm rounded-2xl border border-gray-800/60 shadow-2xl overflow-hidden hover:border-white/20 transition-all duration-300">
        {/* Modern gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-gray-400/3 to-white/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Subtle animated background */}
        <motion.div
          className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-white/5 to-gray-300/5 rounded-full blur-3xl"
          animate={{
            scale: isHovered && !isModalOpen ? 1.2 : 1,
            opacity: isHovered && !isModalOpen ? 0.4 : 0.15,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        
        {/* Content */}
        <div className="relative z-10 p-6 h-full flex flex-col min-h-[400px]">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="bg-gradient-to-r from-white to-gray-200 text-black px-3 py-1.5 rounded-full text-xs font-semibold">
                {job.department}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-green-400 text-xs font-medium bg-green-400/20 px-2 py-1 rounded-full border border-green-400/30">
                  {job.job_type}
                </span>
                <BriefcaseIcon className="w-5 h-5 text-gray-300" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-gray-200 transition-colors duration-300">
              {job.job_title}
            </h3>
          </div>

          {/* Details */}
          <div className="space-y-4 mb-6 flex-1">
            <div className="flex items-center text-gray-200 text-sm">
              <MapPinIcon className="w-4 h-4 mr-3 text-white" />
              <span className="line-clamp-1">{job.location}</span>
            </div>
            <div className="flex items-center text-gray-200 text-sm">
              <CurrencyDollarIcon className="w-4 h-4 mr-3 text-green-400" />
              <span>{job.salary_range || 'Competitive'}</span>
            </div>
            <div className="flex items-center text-gray-200 text-sm">
              <ClockIcon className="w-4 h-4 mr-3 text-white" />
              <span>{job.experience_level}</span>
            </div>
            
            {/* Description */}
            {/* <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
              <p className="text-gray-200 text-sm line-clamp-3 leading-relaxed">
                {job.short_description}
              </p>
            </div> */}


    
            {/* Requirements Preview */}
            {/* {job.requirements && (
              <div className="mt-4 p-3 bg-gray-800/30 rounded-lg border border-gray-600/40">
                <h4 className="text-gray-200 font-semibold text-xs mb-2">Key Requirements</h4>
                <p className="text-gray-300 text-xs line-clamp-2">
                  {job.requirements.split(';').slice(0, 2).join('; ')}...
                </p>
              </div>
            )} */}
          </div>

          {/* Actions */}
          <div className="space-y-3 mt-auto">
            <button
              onClick={onViewDetails}
              className="w-full bg-gray-900/80 hover:bg-gray-800/80 border border-gray-700/60 hover:border-gray-600/60 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center group/btn"
            >
              <EyeIcon className="w-4 h-4 mr-2 text-gray-300 group-hover/btn:text-white transition-colors" />
              <span>View Details</span>
            </button>
            
            <motion.button
              onClick={handleApplyClick}
              className="w-full bg-gradient-to-r from-white to-gray-200 hover:from-gray-100 hover:to-white text-black py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center group/apply shadow-lg hover:shadow-white/25"
              whileHover={!isModalOpen ? { scale: 1.02 } : {}}
              whileTap={!isModalOpen ? { scale: 0.98 } : {}}
              transition={{ duration: 0.15 }}
            >
              <span>Apply Now</span>
              <ArrowRightIcon className="w-4 h-4 ml-2 group-hover/apply:translate-x-1 transition-transform duration-200" />
            </motion.button>
          </div>
        </div>

        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-gray-300/5 to-white/5 opacity-0 pointer-events-none"
          animate={{ opacity: isHovered && !isModalOpen ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
