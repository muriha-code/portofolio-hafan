import React from 'react';
import { Download, GraduationCap, Compass, Target, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { Profile } from '../types';

interface AboutProps {
  profile: Profile;
}

export const About: React.FC<AboutProps> = ({ profile }) => {
  return (
    <section
      id="about"
      className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/40 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Biodata</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            About Me
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Portrait & Simple Bio Box */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative p-2 rounded-2xl glass-premium border border-slate-200/40 dark:border-slate-800/30 w-[240px] sm:w-[280px] aspect-square overflow-hidden shadow-xl"
            >
              <img
                src={profile.avatarUrl || '/profile.png'}
                alt="Rifky Hafan"
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800";
                }}
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <div className="mt-8 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 w-full max-w-sm">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Info size={16} className="text-primary" />
                Informasi Ringkas
              </h3>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex justify-between py-1 border-b border-slate-200/40 dark:border-slate-800/40">
                  <span className="font-medium text-slate-500">Nama Lengkap</span>
                  <span>{profile.name}</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-200/40 dark:border-slate-800/40">
                  <span className="font-medium text-slate-500">Pendidikan</span>
                  <span>{profile.education.split(' - ')[0]}</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-200/40 dark:border-slate-800/40">
                  <span className="font-medium text-slate-500">Domisili</span>
                  <span>Bandung, ID</span>
                </li>
                <li className="flex justify-between py-1">
                  <span className="font-medium text-slate-500">Karier</span>
                  <span>Web Dev & Graphic Designer</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: In-depth details, education, passion, career objectives */}
          <div className="lg:col-span-7 flex flex-col gap-8 text-left">
            <div>
              <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-4">
                Membangun Integrasi yang Sempurna antara Kode & Desain
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                {profile.bio || "Saya adalah mahasiswa Sains Informasi yang berfokus pada web development dan visual arts. Melalui pemahaman mendalam tentang manajemen data informasi, arsitektur informasi, serta estetika visual, saya mampu membangun aplikasi web yang cepat, aman, dan memanjakan mata."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Pendidikan */}
              <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 hover:border-primary/20 dark:hover:border-primary/20 transition-all shadow-sm">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary w-fit mb-4">
                  <GraduationCap size={18} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Pendidikan</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {profile.education || "S1 Sains Informasi - Universitas Padjadjaran"}
                </p>
              </div>

              {/* Card 2: Passion */}
              <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 hover:border-primary/20 dark:hover:border-primary/20 transition-all shadow-sm">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary w-fit mb-4">
                  <Compass size={18} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Passion</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {profile.passion || "Menciptakan desain web interaktif, tipografi presisi, dan arsitektur kode bersih yang ramah SEO."}
                </p>
              </div>

              {/* Card 3: Career Objective */}
              <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 hover:border-primary/20 dark:hover:border-primary/20 transition-all shadow-sm">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary w-fit mb-4">
                  <Target size={18} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Karir</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {profile.careerObjective || "Menjadi seorang Frontend Engineer atau UI/UX Designer yang berkontribusi aktif dalam menciptakan produk digital berdampak tinggi di industri teknologi."}
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <a
                href={profile.resumeUrl && profile.resumeUrl !== '#' ? profile.resumeUrl : undefined}
                target="_blank"
                rel="noopener noreferrer"
                onClick={profile.resumeUrl && profile.resumeUrl !== '#' ? undefined : (e) => { e.preventDefault(); alert("Silahkan tambahkan CV PDF melalui dashboard admin!"); }}
                className="px-6 py-3 rounded-full text-xs font-semibold bg-primary hover:bg-primary/95 text-white flex items-center gap-2 shadow-lg shadow-primary/15 transition-all duration-300 cursor-pointer"
              >
                Download CV Lengkap
                <Download size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
