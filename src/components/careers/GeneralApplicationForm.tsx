'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, DocumentArrowUpIcon, UserIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useGeneralApplication } from '@/hooks/useCareers';
import { supabase } from '@/lib/supabase';

interface GeneralApplicationFormProps {
  onClose: () => void;
}

export default function GeneralApplicationForm({ onClose }: GeneralApplicationFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { submitApplication, submitting, error: hookError } = useGeneralApplication();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null as File | null,
    coverLetter: ''
  });
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      
      // Validate file size (5MB limit)
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a PDF, DOC, or DOCX file.');
        return;
      }
      
      // Validate file size (5MB limit)
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
    const fileExt = file.name.split('.').pop();
    const fileName = `general/${user?.id}/${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('resumes')
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(fileName);
    
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!user) {
      setError('Please sign in to submit a general application.');
      setTimeout(() => {
        router.push('/signin');
      }, 1500);
      return;
    }
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.resume) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Upload resume
      const resumeUrl = await uploadResume(formData.resume);
      
      // Submit application
      const applicationResult = await submitApplication({
        user_id: user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        resume_url: resumeUrl,
        cover_letter: formData.coverLetter || undefined,
        application_source: 'general_form',
        status: 'pending'
      });

      // Send confirmation emails (don't block the UI if this fails)
      try {
        const emailResponse = await fetch('/api/email/general-application', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            applicantEmail: formData.email,
            applicantName: formData.name,
            applicationId: applicationResult.id,
          }),
        });

        if (!emailResponse.ok) {
          console.error('Failed to send confirmation emails');
        } else {
          const emailResult = await emailResponse.json();
          console.log('Email sending result:', emailResult);
        }
      } catch (emailError) {
        console.error('Error sending emails:', emailError);
        // Don't show error to user since application was successful
      }
      
      // Show success message and redirect
      alert('Application submitted successfully! We\'ll review your application and contact you if there\'s a suitable match.');
      onClose();
      router.push('/careers');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit application';
      setError(errorMessage);
      console.error('Error submitting general application:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl border border-gray-700 shadow-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="relative p-6 border-b border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors duration-200"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
        <h3 className="text-2xl font-bold text-white mb-2">
          General Application
        </h3>
        <p className="text-gray-300">
          Submit your details for future opportunities
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
            Full Name *
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors duration-200"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
            Email Address *
          </label>
          <div className="relative">
            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors duration-200"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        {/* Phone Input */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors duration-200"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Resume (PDF, DOC, DOCX only, max 5MB) *
          </label>
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
              dragActive 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <DocumentArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {formData.resume ? (
              <div>
                <p className="text-white font-medium">{formData.resume.name}</p>
                <p className="text-gray-400 text-sm">
                  {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-white mb-2">Drop your resume here or click to browse</p>
                <p className="text-gray-400 text-sm">PDF, DOC, DOCX files only, maximum 5MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Cover Letter */}
        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium text-white mb-2">
            Cover Letter / Additional Message
          </label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            rows={4}
            value={formData.coverLetter}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors duration-200 resize-none"
            placeholder="Tell us about yourself and why you'd like to work with us..."
          />
        </div>

        {/* Error Message */}
        {(error || hookError) && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error || hookError}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <motion.button
            type="submit"
            disabled={isSubmitting || submitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 disabled:cursor-not-allowed"
            whileHover={{ scale: (isSubmitting || submitting) ? 1 : 1.02 }}
            whileTap={{ scale: (isSubmitting || submitting) ? 1 : 0.98 }}
          >
            {(isSubmitting || submitting) ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Submitting...
              </div>
            ) : (
              'Submit Application'
            )}
          </motion.button>
          <p className="text-gray-400 text-sm mt-3 text-center">
            We&apos;ll review your application and contact you if there&apos;s a suitable match.
          </p>
        </div>
      </form>
    </motion.div>
  );
}
