import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Mail, Lock, Loader2, ArrowLeft, ArrowRight, Eye, ChevronRight, ShieldAlert
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'motion/react';

// Database Service & Entities
import { dbService } from './services/db';
import { Profile, Project, Skill, Experience, Certificate, Settings } from './types';

// Visitor Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';

import { ExperienceTimeline } from './components/ExperienceTimeline';
import { Certificates } from './components/Certificates';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';

// Admin Components
import { AdminPanel } from './components/AdminPanel';

// Loading Component
import { Preloader } from './components/Preloader';

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const localTheme = localStorage.getItem('rifky_theme');
    if (localTheme) return localTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Client-Side Routing State (Standard path / hash sync)
  const [route, setRoute] = useState<'portfolio' | 'admin'>('portfolio');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);

  // Core portfolio records loaded from Firestore / LocalStorage
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);


  // Toggle Dark Mode globally
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('rifky_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rifky_theme', 'light');
    }
  }, [darkMode]);

  // Sync route state with hash/URL path
  useEffect(() => {
    const handleUrlChange = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (hash === '#/admin' || path === '/admin' || path.startsWith('/admin/')) {
        setRoute('admin');
      } else {
        setRoute('portfolio');
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    
    // Initial check
    handleUrlChange();

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Check current admin login state & load core records
  useEffect(() => {
    const loadAllPublicData = async () => {
      setDataLoaded(false);
      setShowPreloader(true);
      try {
        const [p, s, projs, sks, exps, certs] = await Promise.all([
          dbService.getProfile(),
          dbService.getSettings(),
          dbService.getProjects(),
          dbService.getSkills(),
          dbService.getExperiences(),
          dbService.getCertificates()
        ]);
        setProfile(p);
        setSettings(s);
        setProjects(projs);
        setSkills(sks);
        setExperiences(exps);
        setCertificates(certs);
      } catch (err) {
        console.error("Gagal sinkronisasi data:", err);
      } finally {
        setDataLoaded(true);
      }
    };

    loadAllPublicData();

    // Observe Auth Change
    const unsubscribe = dbService.onAuthChanged((user) => {
      setIsAdminLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, [route]); // reload on routing back & forth

  // Handle Admin Login submission
  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAdminAuthLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await dbService.login(email, password);
      setIsAdminLoggedIn(true);
      toast.success("Login berhasil! Selamat datang di CMS Admin.");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Gagal masuk admin. Cek credentials.");
    } finally {
      setAdminAuthLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await dbService.logout();
      setIsAdminLoggedIn(false);
      toast.success("Berhasil keluar dari CMS.");
    } catch (err) {
      toast.error("Gagal keluar.");
    }
  };

  // Navigating between pages
  const navigateTo = (page: 'portfolio' | 'admin') => {
    if (page === 'admin') {
      window.location.hash = '#/admin';
      setRoute('admin');
    } else {
      window.location.hash = '#/';
      setRoute('portfolio');
    }
  };

  if (showPreloader) {
    return <Preloader isDataLoaded={dataLoaded} onFinished={() => setShowPreloader(false)} />;
  }

  // VIEW 1: PORTFOLIO MAIN LAYOUT (Visitor facing)
  if (route === 'portfolio') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 relative selection:bg-primary/20">
        <Toaster position="bottom-right" />
        
        {/* Progress Bar top */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-400 to-accent z-[100] origin-left" />


        {/* Global sticky navbar */}
        <Navbar 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          logoText={settings?.logoText || 'Rifky.Hafan'} 
        />

        {/* Sections */}
        {profile && (
          <>
            <Hero profile={profile} />
            <About profile={profile} />
          </>
        )}
        
        <Skills skills={skills} />
        <Projects projects={projects} />

        <ExperienceTimeline experiences={experiences} />
        <Certificates certificates={certificates} />
        
        {settings && <ContactForm settings={settings} />}
        
        <Chatbot />
        <Footer />
      </div>
    );
  }

  // VIEW 2: ADMIN CMS PANEL (Authenticated facing)
  if (route === 'admin') {
    if (isAdminLoggedIn) {
      return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
          {/* Quick link back to portfolio */}
          <div className="fixed top-4 right-4 z-50">
            <button 
              onClick={() => navigateTo('portfolio')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 hover:bg-slate-50 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 shadow cursor-pointer transition-transform hover:scale-105"
            >
              <ArrowLeft size={10} /> Lihat Portfolio Site
            </button>
          </div>

          <AdminPanel onLogout={handleAdminLogout} />
        </div>
      );
    }

    // VIEW 3: ADMIN LOGIN SCREEN (Unauthenticated facing)
    return (
      <div className="min-h-screen bg-slate-900 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-300 relative overflow-hidden">
        <Toaster position="bottom-right" />

        {/* Back link */}
        <div className="absolute top-6 left-6 z-10">
          <button 
            onClick={() => navigateTo('portfolio')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 text-xs font-semibold text-white shadow-lg cursor-pointer transition-all"
          >
            <ArrowLeft size={14} /> Kembali ke Portfolio
          </button>
        </div>

        {/* Abstract glowing blobs for branding styling */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-8 sm:p-10 rounded-3xl shadow-2xl text-left"
        >
          {/* Form Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Sparkles size={22} className="animate-pulse" />
            </div>
            <h2 className="text-xl font-display font-bold text-white tracking-tight">CMS Admin Login</h2>
            <p className="text-xs text-slate-400">Silahkan login untuk mengelola konten portfolio Anda.</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Mail size={10} /> Email Address
              </label>
              <input 
                required 
                type="email" 
                name="email" 
                placeholder="admin@rifky.com" 
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/40 text-slate-200 text-sm focus:outline-none focus:border-primary transition-all" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Lock size={10} /> Password
              </label>
              <input 
                required 
                type="password" 
                name="password" 
                placeholder="••••••••••••" 
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/40 text-slate-200 text-sm focus:outline-none focus:border-primary transition-all" 
              />
            </div>

            <button 
              type="submit" 
              disabled={adminAuthLoading}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-primary/25 cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {adminAuthLoading ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  Memverifikasi Akun...
                </>
              ) : (
                <>
                  Masuk Dashboard
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Quick Notice Credentials */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-left">
            <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert size={12} /> Akun Admin Default (Offline Preview):
            </h3>
            <div className="mt-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 font-mono text-[10px] text-slate-400 space-y-1">
              <p><span className="text-slate-500">Email:</span> admin@rifky.com</p>
              <p><span className="text-slate-500">Pass:</span> rifkyhafan2026</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}
