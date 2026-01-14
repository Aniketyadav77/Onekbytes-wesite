'use client';

import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

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

interface OngoingResearchCarouselProps {
  projects: OngoingResearch[];
}

export function OngoingResearchCarousel({ projects }: OngoingResearchCarouselProps) {

  // Simple minimal styling; status is displayed as text only

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getVisibleProjects = () => {
    return projects.slice(0, 2);
  };

  if (projects.length === 0) {
    return (
      <div className="text-center text-gray-400 py-20">
        No ongoing research projects to display.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start gap-8">
      {getVisibleProjects().map((project) => (
        <motion.div
          key={project.id}
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
          <div className="relative w-[380px] h-[500px]">
            <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700 p-6">
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/10 via-gray-400/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('_', ' ')}
                  </span>
                  <div className="text-right">
                    <div className="text-xl font-semibold text-white">
                      {project.progress_percentage}%
                    </div>
                    <div className="text-xs text-gray-400">Complete</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress_percentage}%` }}
                  />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                  {project.project_title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 mb-4 leading-relaxed text-sm line-clamp-3">
                  {project.description}
                </p>

                {/* Team */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-400 mb-2">Team</div>
                  <div className="flex flex-wrap gap-2">
                    {project.team_members.map((member, memberIndex) => (
                      <span key={memberIndex} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Spacer */}
                <div className="flex-grow" />

                {/* Dates */}
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">Started: {formatDate(project.start_date)}</span>
                  </div>
                  {project.expected_completion && (
                    <div className="flex items-center">
                      <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">Expected: {formatDate(project.expected_completion)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
