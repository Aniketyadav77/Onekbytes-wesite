'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ResearchPaperCard, OngoingResearchCarousel } from '@/components/research';

interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publication_date: string;
  journal_or_conference: string;
  pdf_url?: string;
  doi?: string;
  citation_count: number;
  tags: string[];
}

interface OngoingResearch {
  id: string;
  project_title: string;
  description: string;
  team_members: string[];
  status: 'planning' | 'in_progress' | 'analysis' | 'review' | 'completed';
  start_date: string;
  expected_completion?: string;
  progress_percentage: number;
  image_url?: string;
}

export default function ResearchPage() {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [ongoingResearch, setOngoingResearch] = useState<OngoingResearch[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const papersPerPage = 6;

  useEffect(() => {
    // TODO: Replace with actual Supabase queries
    // Mock data for now
    const mockPapers: ResearchPaper[] = [
      {
        id: '1',
        title: 'Advanced Machine Learning Techniques for Predictive Analytics',
        authors: ['Dr. John Smith', 'Dr. Jane Doe', 'Prof. Mike Johnson'],
        abstract: 'This paper explores cutting-edge machine learning algorithms and their applications in predictive analytics across various industries. We present novel approaches to data preprocessing, feature engineering, and model optimization that significantly improve prediction accuracy.',
        publication_date: '2024-03-15',
        journal_or_conference: 'Journal of Machine Learning Research',
        pdf_url: '/papers/ml-predictive-analytics.pdf',
        doi: '10.1234/jmlr.2024.001',
        citation_count: 45,
        tags: ['Machine Learning', 'Predictive Analytics', 'Data Science']
      },
      {
        id: '2',
        title: 'Quantum Computing Applications in Cryptography',
        authors: ['Dr. Alice Cooper', 'Prof. Bob Wilson'],
        abstract: 'An in-depth analysis of quantum computing applications in modern cryptography, exploring both opportunities and challenges for secure communication in the quantum era.',
        publication_date: '2024-01-20',
        journal_or_conference: 'IEEE Quantum Computing Conference',
        pdf_url: '/papers/quantum-crypto.pdf',
        doi: '10.1109/qcc.2024.002',
        citation_count: 32,
        tags: ['Quantum Computing', 'Cryptography', 'Security']
      },
      {
        id: '3',
        title: 'Sustainable AI: Energy-Efficient Deep Learning Models',
        authors: ['Dr. Sarah Green', 'Dr. Mark Blue', 'Dr. Lisa Red'],
        abstract: 'This research focuses on developing energy-efficient deep learning models that maintain high performance while significantly reducing computational costs and environmental impact.',
        publication_date: '2023-11-10',
        journal_or_conference: 'Nature Machine Intelligence',
        pdf_url: '/papers/sustainable-ai.pdf',
        doi: '10.1038/nmi.2023.003',
        citation_count: 78,
        tags: ['Sustainable AI', 'Deep Learning', 'Energy Efficiency']
      }
    ];

    const mockOngoingResearch: OngoingResearch[] = [
      {
        id: '1',
        project_title: 'Neural Network Optimization for Edge Computing',
        description: 'Developing lightweight neural networks optimized for edge devices with minimal computational resources while maintaining accuracy.',
        team_members: ['Dr. Alex Turner', 'Sarah Chen', 'Michael Park'],
        status: 'in_progress',
        start_date: '2024-01-15',
        expected_completion: '2024-12-31',
        progress_percentage: 65
      },
      {
        id: '2',
        project_title: 'Blockchain-Based Healthcare Data Management',
        description: 'Creating a secure, decentralized system for managing patient health records using blockchain technology.',
        team_members: ['Dr. Emma Davis', 'John Rodriguez', 'Lisa Wang'],
        status: 'analysis',
        start_date: '2024-03-01',
        expected_completion: '2025-06-30',
        progress_percentage: 40
      }
    ];

    setPapers(mockPapers);
    setOngoingResearch(mockOngoingResearch);
    setLoading(false);
  }, []);

  const totalPages = Math.ceil(papers.length / papersPerPage);
  const startIndex = (currentPage - 1) * papersPerPage;
  const endIndex = startIndex + papersPerPage;
  const currentPapers = papers.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
  <div className="relative max-w-7xl mx-auto text-center">

    {/* Title */}
   {/* Subtitle */}
    {/* Heading row with video - centered like navbar */}
    <div className="flex items-center gap-2 ml-124">
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
      className="
        text-center text-slate-400 font-light tracking-tight text-2xl sm:text-3xl md:text-5xl lg:text-6xl">
      
    
      Research 
    </motion.p>
    <video
      className="hidden sm:block w-[120px] h-[120px] md:w-[140px] md:h-[140px]"
      src="/videos/atomic_video.mp4"
      autoPlay
      loop
      muted
      playsInline
      aria-label="Research rotating logo animation"
      preload="auto"
    />
    </div>

    {/* Research animation below title */}
    <div className="mt-[-40px] flex justify-center">
      <video
        className="hidden sm:block w-[560px] h-[280px] md:w-[800px] md:h-[400px]"
        src="/videos/new_scientist_animatedvideo.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-label="Research animation"
        preload="auto"
      />
    </div>

    {/* Subtitle */}
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
      className="
        mt-4
        text-center
        text-white/50
        text-base
        md:text-lg
        max-w-2xl
        mx-auto
        leading-relaxed
      "
    >
    </motion.p>

      {/* Removed previous video; using animated metallic logo next to heading */}

  </div>
</section>


      {/* Ongoing Research Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent"
          >
          
          </motion.h2>
          <OngoingResearchCarousel projects={ongoingResearch} />
        </div>
      </section>

      {/* Published Papers Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-400"
          >
            Published Research Papers
          </motion.h2>
          
          {/* Papers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentPapers.map((paper, index) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ResearchPaperCard paper={paper} />
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${
                  currentPage === 1
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-white hover:bg-gray-800 transition-colors'
                }`}
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-full ${
                      currentPage === i + 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    } transition-colors`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${
                  currentPage === totalPages
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-white hover:bg-gray-800 transition-colors'
                }`}
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
