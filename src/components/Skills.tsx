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

                <div className="space-y-5">
                  {catSkills.length > 0 ? (
                    catSkills.map((skill) => (
                      <div key={skill.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <LucideIcon name={skill.iconName || 'Code'} className="text-primary/75 dark:text-accent/75" size={14} />
                            <span>{skill.name}</span>
                          </div>
                          <span className="text-slate-500">{skill.level}%</span>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          {/* Animated progress bar on scroll reveal */}
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true, margin: '-20px' }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">Belum ada skill ditambahkan untuk kategori ini.</p>
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
