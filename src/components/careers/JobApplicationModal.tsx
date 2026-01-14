'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PaperClipIcon, UserIcon, EnvelopeIcon, LinkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Job } from '@/types/database';

interface JobApplicationModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobApplicationModal({ job, isOpen, onClose }: JobApplicationModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedin_profile: '',
    resume: null as File | null
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSuccess(false);
      setError(null);
      setEmailStatus(null);
      setLoading(false);
      setFormData({ name: '', email: '', linkedin_profile: '', resume: null });
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a PDF, DOC, or DOCX file.');
        return;
      }
      
      // Validate file size (5MB = 5 * 1024 * 1024 bytes)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB.');
        return;
      }
      
      setError(null);
      setFormData(prev => ({
        ...prev,
        resume: file
      }));
    }
  };

  const uploadResume = async (file: File): Promise<string> => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `job/${user.id}/${job.id}-${Date.now()}.${fileExt}`;
    
    console.log('Uploading file with path:', fileName);
    console.log('User ID:', user.id);
    
    const { error } = await supabase.storage
      .from('resumes')
      .upload(fileName, file);
    
    if (error) {
      console.error('Upload error:', error);
      throw error;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(fileName);
    
    return publicUrl;
  };

  const checkExistingApplication = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('id')
        .eq('job_id', job.id)
        .eq('user_id', user?.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking existing application:', error);
        return false; // If error, allow application to proceed
      }
      
      return data !== null;
    } catch (error) {
      console.error('Exception in checkExistingApplication:', error);
      return false; // If error, allow application to proceed
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('User:', user);
    console.log('Form data:', formData);
    
    if (!user) {
      setError('Please sign in to apply for this job.');
      setTimeout(() => {
        window.location.href = '/signin';
      }, 1500);
      return;
    }
    
    if (!formData.name || !formData.email || !formData.resume) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Check for existing application first
      const hasExistingApplication = await checkExistingApplication();
      if (hasExistingApplication) {
        setError('You have already applied for this job.');
        setLoading(false);
        return;
      }
      
      // Upload resume and create application simultaneously for speed
      const [resumeUrl] = await Promise.all([
        uploadResume(formData.resume)
      ]);
      
      // Create job application
      const { data: applicationData, error: insertError } = await supabase
        .from('job_applications')
        .insert({
          job_id: job.id,
          user_id: user.id,
          name: formData.name,
          email: formData.email,
          linkedin_profile: formData.linkedin_profile || null,
          resume_url: resumeUrl,
          application_source: 'job_posting',
          status: 'pending'
        })
        .select('id')
        .single();
      
      if (insertError) {
        throw insertError;
      }

      // Send confirmation emails (enhanced feedback)
      let emailSuccessMessage = '';
      try {
        const emailResponse = await fetch('/api/email/job-application', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            applicantEmail: formData.email,
            applicantName: formData.name,
            jobTitle: job.job_title,
            jobId: job.id,
            applicationId: applicationData.id,
          }),
        });

        if (emailResponse.ok) {
          const emailResult = await emailResponse.json();
          console.log('Email sending result:', emailResult);
          
          // Check if in development mode
          const isDev = process.env.NODE_ENV === 'development';
          if (isDev) {
            emailSuccessMessage = ' (Confirmation emails sent to admin for testing)';
          } else {
            emailSuccessMessage = ' (Confirmation email sent)';
          }
        } else {
          console.error('Failed to send confirmation emails');
          emailSuccessMessage = ' (Application saved - email notification pending)';
        }
      } catch (emailError) {
        console.error('Error sending emails:', emailError);
        emailSuccessMessage = ' (Application saved successfully)';
      }
      
      // Show success with email status
      setSuccess(true);
      setEmailStatus(emailSuccessMessage);
      
      // Auto-close after success message
      setTimeout(() => {
        handleClose();
      }, 3000); // Increased to 3 seconds to show email status
      
    } catch (err) {
      console.error('Error submitting application:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSuccess(false);
      setError(null);
      setEmailStatus(null);
      setFormData({ name: '', email: '', linkedin_profile: '', resume: null });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-md bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Apply for Position</h3>
                  <p className="text-blue-100 text-sm mt-1">{job.job_title}</p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="text-white/80 hover:text-white transition-colors disabled:opacity-50"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Success State */}
            {success && (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Application Submitted!</h4>
                <p className="text-gray-400">
                  Thank you for applying! We&apos;ll review your application and get back to you soon.
                  {emailStatus && <span className="text-green-400">{emailStatus}</span>}
                </p>
              </div>
            )}

            {/* Form */}
            {!success && (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                {/* LinkedIn Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    LinkedIn Profile <span className="text-gray-500">(Optional)</span>
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      name="linkedin_profile"
                      value={formData.linkedin_profile}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Resume <span className="text-red-400">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-gray-500 transition-colors">
                    <input
                      type="file"
                      name="resume"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      required
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <PaperClipIcon className="w-8 h-8 text-gray-400 mb-2" />
                      {formData.resume ? (
                        <div className="text-sm">
                          <p className="text-green-400 font-medium">{formData.resume.name}</p>
                          <p className="text-gray-400">Click to change</p>
                        </div>
                      ) : (
                        <div className="text-sm">
                          <p className="text-gray-300">Upload your resume</p>
                          <p className="text-gray-400">PDF, DOC, DOCX (Max 5MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
