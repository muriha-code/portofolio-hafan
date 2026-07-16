import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, ExternalLink, Calendar, Layers, FolderGit, ChevronRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectsProps {
  projects: Project[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Web Development' | 'UI Design' | 'Graphic Design'>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filters: ('All' | 'Web Development' | 'UI Design' | 'Graphic Design')[] = [
    'All', 'Web Development', 'UI Design', 'Graphic Design'
  ];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section 
      id="projects" 
      className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/40 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Portofolio Utama</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Selected Projects
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mt-3" />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-12 max-w-xl mx-auto">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                activeFilter === filter
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/60'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -8 }}
                className="group flex flex-col h-full rounded-3xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 overflow-hidden shadow-xl hover:shadow-2xl hover:border-primary/20 dark:hover:border-primary/20 transition-all duration-300"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                  {/* Category Badges */}
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-900/80 dark:bg-white/90 text-white dark:text-slate-950 backdrop-blur-sm">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-primary text-white flex items-center gap-1 shadow-md shadow-primary/20">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-950/40 text-white backdrop-blur-sm flex items-center gap-1">
                      <Calendar size={10} />
                      {project.year}
                    </span>
                  </div>

                  <img 
                    src={project.thumbnailUrl} 
                    alt={project.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800";
                    }}
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle black overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6" />
                </div>

                {/* Info details */}
                <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between text-left">
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.techStack.map((tech) => (
                        <span 
                          key={tech} 
                          className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/40 dark:border-slate-800/40"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Call to actions */}
                  <div className="flex items-center justify-between border-t border-slate-200/40 dark:border-slate-800/40 pt-6 mt-6">
                    <button 
                      onClick={() => setSelectedProject(project)}
                      className="text-xs font-bold text-slate-900 dark:text-white hover:text-primary dark:hover:text-accent flex items-center gap-1 group/btn cursor-pointer"
                    >
                      Detail Project 
                      <ChevronRight className="group-hover/btn:translate-x-0.5 transition-transform" size={14} />
                    </button>

                    <div className="flex items-center gap-3">
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-accent hover:border-primary/20 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all cursor-pointer"
                          aria-label="GitHub Repository"
                        >
                          <Github size={14} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-accent hover:border-primary/20 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all cursor-pointer"
                          aria-label="Live Website"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-slate-400 italic text-sm">
            Belum ada project untuk kategori ini.
          </div>
        )}
      </div>

      {/* Project Detail Modal Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] flex flex-col text-left"
            >
              <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary dark:text-accent uppercase tracking-wider">
                      {selectedProject.category}
                    </span>
                    <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mt-2">
                      {selectedProject.title}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                {/* Modal Big Cover */}
                <div className="rounded-2xl overflow-hidden aspect-video w-full bg-slate-100 dark:bg-slate-900">
                  <img 
                    src={selectedProject.thumbnailUrl} 
                    alt={selectedProject.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800";
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Descriptions */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Deskripsi Project</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {selectedProject.longDescription || selectedProject.description}
                  </p>
                </div>

                {/* Screenshots Gallery if available */}
                {selectedProject.screenshots && selectedProject.screenshots.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Screenshots</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedProject.screenshots.map((ss, idx) => (
                        <div key={idx} className="rounded-xl overflow-hidden aspect-video border border-slate-100 dark:border-slate-800 bg-slate-50">
                          <img 
                            src={ss} 
                            alt={`Screenshot ${idx+1}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.techStack.map((tech) => (
                      <span key={tech} className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {selectedProject.githubUrl && (
                      <a 
                        href={selectedProject.githubUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-4 py-2 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Github size={14} /> Repository
                      </a>
                    )}
                    {selectedProject.liveUrl && (
                      <a 
                        href={selectedProject.liveUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-4 py-2 text-xs font-semibold rounded-full bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5 cursor-pointer"
                      >
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
