'use client';

import { motion } from 'framer-motion';
import { 
  DocumentTextIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  TagIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

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

interface ResearchPaperCardProps {
  paper: ResearchPaper;
}

export function ResearchPaperCard({ paper }: ResearchPaperCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      className="group relative"
      whileHover={{ 
        scale: 1.05
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
    >
      {/* Card Container */}
      <div className="relative h-[500px] w-full">
        {/* Card Face */}
        <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700 p-6">
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/10 via-gray-400/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <DocumentTextIcon className="w-8 h-8 text-blue-400" />
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">Citations</span>
                <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-semibold">
                  {paper.citation_count}
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-3 line-clamp-3 leading-tight">
              {paper.title}
            </h3>

            {/* Authors */}
            <div className="flex items-center text-gray-300 mb-3">
              <UserGroupIcon className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm line-clamp-1">{paper.authors.join(', ')}</span>
            </div>

            {/* Journal/Conference */}
            <div className="flex items-center text-gray-300 mb-4">
              <AcademicCapIcon className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm line-clamp-1">{paper.journal_or_conference}</span>
            </div>

            {/* Date */}
            <div className="flex items-center text-gray-300 mb-4">
              <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm">{formatDate(paper.publication_date)}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {paper.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Abstract Section */}
            <div className="flex-grow overflow-hidden">
              <h4 className="text-blue-300 font-semibold mb-2 text-sm">Abstract</h4>
              <p className="text-gray-400 text-xs leading-relaxed line-clamp-4">
                {paper.abstract}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              {paper.pdf_url && (
                <button className="flex-1 flex items-center justify-center space-x-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-2 rounded-lg transition-colors text-xs">
                  <DocumentTextIcon className="w-3 h-3" />
                  <span>PDF</span>
                </button>
              )}
              
              {paper.doi && (
                <button className="flex-1 flex items-center justify-center space-x-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-2 rounded-lg transition-colors text-xs">
                  <TagIcon className="w-3 h-3" />
                  <span>DOI</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
