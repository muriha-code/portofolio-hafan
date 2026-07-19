import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from './LucideIcon';
import { Skill } from '../types';

interface SkillsProps {
  skills: Skill[];
}

export const Skills: React.FC<SkillsProps> = ({ skills }) => {
  // Group skills by category
  const categories = ['Frontend', 'Backend', 'Database', 'UI/UX & Design'];

  return (
    <section 
      id="skills" 
      className="py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Keahlian</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            My Skills
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mt-3" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {categories.map((cat) => {
            const catSkills = skills.filter(s => s.category === cat);
            return (
              <div 
                key={cat}
                className="p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/20 dark:shadow-none"
              >
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  {cat}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catSkills.length > 0 ? (
                    catSkills.map((skill, index) => (
                      <motion.div 
                        key={skill.id} 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                        className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:border-primary dark:hover:border-primary hover:shadow-md hover:shadow-primary/5 hover:scale-[1.02] transition-all duration-300 cursor-default group"
                      >
                        <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                          <LucideIcon name={skill.iconName || 'Code'} size={16} />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors line-clamp-1">{skill.name}</span>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic col-span-full">Belum ada skill ditambahkan untuk kategori ini.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
