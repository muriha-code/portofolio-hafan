import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, GraduationCap, Star, Calendar } from 'lucide-react';
import { Experience } from '../types';

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ experiences }) => {
  // Sort experiences or just render as listed
  return (
    <section 
      id="experience" 
      className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/40 px-6 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Riwayat</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Work & Education
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mt-3" />
        </div>

        {/* Timeline Line & Items */}
        <div className="relative border-l-2 border-slate-200/60 dark:border-slate-800 ml-4 sm:ml-8 text-left space-y-12">
          {experiences.map((exp, index) => {
            const isEducation = exp.type.toLowerCase().includes('edu');
            const isFreelance = exp.type.toLowerCase().includes('free');
            
            return (
              <motion.div 
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-8 sm:pl-10 group"
              >
                {/* Timeline Icon Marker */}
                <div className={`absolute -left-[17px] top-1.5 p-2 rounded-full border-2 transition-colors duration-300 ${
                  isEducation 
                    ? 'bg-blue-50 dark:bg-blue-950 border-primary text-primary' 
                    : isFreelance
                    ? 'bg-amber-50 dark:bg-amber-950 border-amber-500 text-amber-500'
                    : 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-500'
                } group-hover:bg-primary group-hover:text-white group-hover:border-primary`}>
                  {isEducation ? (
                    <GraduationCap size={14} />
                  ) : isFreelance ? (
                    <Star size={14} />
                  ) : (
                    <Briefcase size={14} />
                  )}
                </div>

                {/* Card Container */}
                <div className="p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 shadow-sm group-hover:shadow-md group-hover:border-primary/20 transition-all duration-300">
                  {/* Top row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase ${
                        isEducation 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                          : isFreelance
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                          : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {exp.type}
                      </span>
                      <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white mt-2 group-hover:text-primary dark:group-hover:text-accent transition-colors">
                        {exp.role}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                      <Calendar size={12} />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  {/* Company/Org Name */}
                  <h4 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
                    {exp.company}
                  </h4>

                  {/* Body Text */}
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {experiences.length === 0 && (
          <div className="text-center py-12 text-slate-400 italic text-sm">
            Belum ada pengalaman atau riwayat ditambahkan.
          </div>
        )}
      </div>
    </section>
  );
};
