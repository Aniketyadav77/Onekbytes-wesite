'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCareers } from '@/hooks/enhanced-useCareers';
import { Job } from '@/types/database';
import JobCard from '@/components/careers/JobCard';
import GeneralApplicationForm from '@/components/careers/GeneralApplicationForm';
import JobModal from '@/components/careers/JobModal';
import JobApplicationModal from '@/components/careers/JobApplicationModal';
export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showGeneralForm, setShowGeneralForm] = useState(false);
  const [jobToApply, setJobToApply] = useState<Job | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  
  // Use optimized careers hook with fast loading
  const { jobs, loading, error, fetchJobs } = useCareers();
  // Fetch jobs immediately on mount - use ref to prevent infinite loops
  useEffect(() => {
    let mounted = true    
    const loadJobs = async () => {
      if (!mounted) return;
      
      try {
        await fetchJobs(false); // Only fetch active jobs for careers page
      } catch (err) {

        if (mounted) {
          
          console.error('Failed to load jobs:', err);
        }
      }
    };
    
    loadJobs();
    
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty to run only once on mount

  // Filter only active jobs for public careers page and ensure uniqueness
  const activeJobs = jobs
    .filter(job => job.status === 'active')
    .filter((job, index, self) => index === self.findIndex(j => j.id === job.id));

  const handleApplyForJob = (job: Job) => {
    setJobToApply(job);
    setShowApplicationModal(true);
  };

  const isAnyModalOpen = selectedJob !== null || showApplicationModal;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="
              text-center
              text-slate-400 font-light tracking-tight
              text-2xl sm:text-3xl md:text-5xl lg:text-6xl
              mb-6
            "
          >
            Join Our Team
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-sm text-gray-300 max-w-xl mx-auto"
          >
            Shape the future of AI with us. We&apos;re looking for passionate individuals who want to push the boundaries of what&apos;s possible.
          </motion.p>
        </div>
      </div>

      {/* Job Cards Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl   text-slate-400 font-light  font-bold text-center mb-12"
          >
            Open Positions
          </motion.h2>
          
          {loading && activeJobs.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <span className="ml-3 text-gray-400">Loading jobs...</span>
            </div>
          ) : error && activeJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">Error loading jobs: {error}</p>
              <button 
                onClick={() => fetchJobs(false)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : activeJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-xl mb-4">No active job positions available at the moment.</p>
              <p className="text-gray-500">Check back soon for new opportunities!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeJobs.map((job, index) => (
                <motion.div
                  key={`job-${job.id}-${index}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <JobCard 
                    job={job} 
                    onViewDetails={() => setSelectedJob(job)}
                    onApply={() => handleApplyForJob(job)}
                    isModalOpen={isAnyModalOpen}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* General Application Section */}
      <section className="py-16 px-6 bg-black/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Don&apos;t See Your Role?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-300 mb-8"
          >
            We&apos;re always looking for talented individuals. Send us your details and we&apos;ll reach out when a suitable position opens up.
          </motion.p>
          
          {!showGeneralForm ? (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={() => setShowGeneralForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Apply for Future Opportunities
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <GeneralApplicationForm onClose={() => setShowGeneralForm(false)} />
            </motion.div>
          )}
        </div>
      </section>

      {/* Job Details Modal */}
      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

      {/* Job Application Modal */}
      {jobToApply && (
        <JobApplicationModal
          job={jobToApply}
          isOpen={showApplicationModal}
          onClose={() => {
            setShowApplicationModal(false);
            setJobToApply(null);
          }}
        />
      )}
    </div>
  );
}
