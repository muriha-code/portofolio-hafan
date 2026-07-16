import React, { useState, useEffect } from 'react';
import { Download, ChevronRight, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Profile } from '../types';

interface HeroProps {
  profile: Profile;
  resumeUrl: string;
}

export const Hero: React.FC<HeroProps> = ({ profile, resumeUrl }) => {
  const [typedText, setTypedText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const roles = [
    "Information Science Student",
    "Web Developer",
    "Graphic Designer",
    "UI/UX Designer"
  ];

  const typingSpeed = isDeleting ? 40 : 80;
  const period = 1500; // wait before deleting

  useEffect(() => {
    let timer: any;
    const currentFullText = roles[roleIndex];

    const handleType = () => {
      if (!isDeleting) {
        setTypedText(currentFullText.substring(0, typedText.length + 1));
        if (typedText === currentFullText) {
          timer = setTimeout(() => setIsDeleting(true), period);
        } else {
          timer = setTimeout(handleType, typingSpeed);
        }
      } else {
        setTypedText(currentFullText.substring(0, typedText.length - 1));
        if (typedText === '') {
          setIsDeleting(false);
          setRoleIndex((roleIndex + 1) % roles.length);
          timer = setTimeout(handleType, 200);
        } else {
          timer = setTimeout(handleType, typingSpeed);
        }
      }
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, roleIndex]);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-slate-50 dark:bg-slate-950 px-6"
    >
      {/* Background blobs & gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/10 dark:bg-primary/5 blur-[100px] animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/10 dark:bg-accent/5 blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
        
        {/* Fine grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">
        {/* Left text column */}
        <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary dark:text-accent font-semibold text-xs uppercase tracking-wider mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary dark:bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary dark:bg-accent"></span>
            </span>
            Available for Intern & Freelance
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-600 dark:text-slate-400 font-display font-medium text-lg mb-2"
          >
            Hi, I'm
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-3"
          >
            {profile.name || "Muhamad Rifky Hafan"}
          </motion.h1>

          {/* Typing Role Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-8 mb-6 flex items-center"
          >
            <span className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent font-display tracking-wide">
              {typedText}
            </span>
            <span className="w-0.5 h-6 bg-primary ml-1 animate-pulse" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mb-8"
          >
            {profile.description || "Saya adalah mahasiswa Sains Informasi yang memiliki ketertarikan besar dalam pengembangan website modern, UI/UX Design, dan Graphic Design. Saya senang membangun website yang cepat, responsif, memiliki pengalaman pengguna yang baik, serta menghasilkan desain visual yang menarik dan fungsional."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center gap-4 w-full"
          >
            <button
              onClick={() => handleScrollTo('projects')}
              className="px-6 py-3 rounded-full text-xs font-semibold bg-primary hover:bg-primary/95 text-white flex items-center gap-2 group shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300 cursor-pointer"
            >
              Lihat Project 
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={14} />
            </button>
            
            <button
              onClick={() => handleScrollTo('contact')}
              className="px-6 py-3 rounded-full text-xs font-semibold bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-50 flex items-center gap-2 transition-all duration-300 shadow-sm cursor-pointer"
            >
              Contact Me
              <MessageSquare size={14} />
            </button>

            <a
              href={resumeUrl && resumeUrl !== '#' ? resumeUrl : undefined}
              download={resumeUrl && resumeUrl !== '#' ? "Muhamad_Rifky_Hafan_CV.pdf" : undefined}
              onClick={resumeUrl && resumeUrl !== '#' ? undefined : (e) => { e.preventDefault(); alert("Silahkan hubungi Rifky atau tambahkan resume/CV melalui Admin Dashboard!"); }}
              className="px-6 py-3 rounded-full text-xs font-semibold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2 transition-all duration-300 shadow-sm cursor-pointer"
            >
              Download CV
              <Download size={14} />
            </a>
          </motion.div>
        </div>

        {/* Right photo column */}
        <div className="lg:col-span-5 flex justify-center items-center z-10 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, type: 'spring' }}
            className="relative w-[280px] sm:w-[350px] aspect-square rounded-3xl p-3 glass-premium shadow-2xl overflow-visible animate-float"
          >
            {/* Ambient glowing aura behind */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-3xl opacity-20 blur-2xl -z-10 animate-pulse" />

            {/* Inner frame containing image */}
            <div className="w-full h-full rounded-2xl overflow-hidden relative border border-slate-200/40 dark:border-slate-800/30">
              <img 
                src={profile.avatarUrl || '/profile.png'} 
                alt="Muhamad Rifky Hafan"
                className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  // Fallback avatar if user hasn't uploaded local /profile.png yet
                  e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800";
                }}
                referrerPolicy="no-referrer"
              />
              
              {/* Glass footer tag */}
              <div className="absolute bottom-4 left-4 right-4 glass px-4 py-2.5 rounded-xl border border-white/20 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Rifky Hafan</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Bandung, Indonesia</p>
                </div>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Online</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
