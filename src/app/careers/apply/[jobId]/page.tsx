'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, DocumentArrowUpIcon, UserIcon, EnvelopeIcon, PhoneIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

// Mock job data (replace with Supabase data later)
const mockJobs = [
  {
    id: '1',
    job_title: 'Senior AI Research Scientist',
    department: 'Research & Development',
    location: 'San Francisco, CA (Hybrid)',
    salary_range: '$150,000 - $200,000',
    experience_level: 'Senior (5+ years)',
    job_type: 'Full-time',
  },
  {
    id: '2',
    job_title: 'Full Stack Developer',
    department: 'Engineering',
    location: 'Remote',
    salary_range: '$120,000 - $160,000',
    experience_level: 'Mid-level (3-5 years)',
    job_type: 'Full-time',
  },
  // Add other jobs as needed
];

export default function JobApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  
  const [job, setJob] = useState<typeof mockJobs[0] | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null as File | null,
    coverLetter: ''
  });
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Find the job by ID (replace with Supabase query later)
    const foundJob = mockJobs.find(j => j.id === jobId);
    if (foundJob) {
      setJob(foundJob);
    } else {
      router.push('/careers');
    }
  }, [jobId, router]);

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
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file');
        return;
      }
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
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file');
        return;
      }
      setFormData(prev => ({
        ...prev,
        resume: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would integrate with Supabase to store the job application
      // For now, we'll simulate the submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Application submitted successfully for ${job?.job_title}! We'll be in touch soon.`);
      router.push('/careers');
    } catch {
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="relative pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.button
            onClick={() => router.back()}
            className="flex items-center text-gray-300 hover:text-white mb-8 transition-colors duration-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Careers
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
              Apply for Position
            </h1>
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl border border-gray-700 p-6 inline-block">
              <div className="flex items-center justify-center mb-4">
                <BriefcaseIcon className="w-8 h-8 text-blue-400 mr-3" />
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {job.department}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {job.job_title}
              </h2>
              <p className="text-gray-300">
                {job.location} • {job.job_type} • {job.salary_range}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Application Form */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl border border-gray-700 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Form Header */}
            <div className="p-8 border-b border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-2">
                Application Form
              </h3>
              <p className="text-gray-300">
                Please fill out all required fields to apply for this position.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h4 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                  Personal Information
                </h4>
                
                {/* Name */}
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

                {/* Email */}
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

                {/* Phone */}
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
              </div>

              {/* Resume Upload */}
              <div className="space-y-6">
                <h4 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                  Resume & Documents
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Resume (PDF only, max 5MB) *
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
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
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    <DocumentArrowUpIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    {formData.resume ? (
                      <div>
                        <p className="text-white font-medium text-lg">{formData.resume.name}</p>
                        <p className="text-gray-400">
                          {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-white text-lg mb-2">Drop your resume here or click to browse</p>
                        <p className="text-gray-400">PDF files only, maximum 5MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div className="space-y-6">
                <h4 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                  Cover Letter
                </h4>
                
                <div>
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-white mb-2">
                    Why are you interested in this position?
                  </label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    rows={6}
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors duration-200 resize-none"
                    placeholder="Tell us why you're excited about this role and how your experience makes you a great fit..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 disabled:cursor-not-allowed"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                      Submitting Application...
                    </div>
                  ) : (
                    `Apply for ${job.job_title}`
                  )}
                </motion.button>
                <p className="text-gray-400 text-sm mt-4 text-center">
                  By submitting this application, you agree to our terms and conditions.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
