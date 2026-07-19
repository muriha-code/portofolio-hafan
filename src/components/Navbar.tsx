import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  logoText: string;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode, logoText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const currentItem = navItems.find(item => item.id === activeSection);
    if (currentItem) {
      document.title = `Muriha Studio – ${currentItem.label}`;
    }
  }, [activeSection]);

  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled
      setIsScrolled(window.scrollY > 20);

      // Simple active section detection
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass py-3 shadow-md border-b border-slate-200/50 dark:border-slate-800/50' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={() => scrollToSection('home')}
          className="flex items-center text-slate-900 dark:text-white group cursor-pointer"
        >
          <span className="text-xl md:text-2xl font-display font-extrabold tracking-tight group-hover:text-primary transition-colors duration-300">
            Muriha Studio
          </span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/60 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/40">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? 'text-white' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-full border border-slate-200/50 dark:border-slate-800/40 bg-white/80 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-accent hover:border-primary/30 dark:hover:border-accent/30 transition-all cursor-pointer shadow-sm"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Hire Me Shortcut */}
          <button
            onClick={() => scrollToSection('contact')}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-primary dark:hover:bg-accent transition-all duration-300 shadow-sm cursor-pointer"
          >
            Hubungi Saya
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-3 lg:hidden">
          {/* Theme Toggle Mobile */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full border border-slate-200/50 dark:border-slate-800/40 bg-white/80 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full border border-slate-200/50 dark:border-slate-800/40 bg-white/80 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/30 dark:bg-slate-900/60 backdrop-blur-md z-[100] lg:hidden"
              aria-hidden="true"
            />
            
            {/* Sidebar Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 h-[100dvh] w-[280px] max-w-[85vw] bg-white dark:bg-slate-950 shadow-2xl z-[101] lg:hidden flex flex-col border-l border-slate-200/50 dark:border-slate-800/50"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/60">
                <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  Menu
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 -mr-2.5 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95 touch-manipulation cursor-pointer"
                  aria-label="Tutup menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`relative flex items-center justify-between px-4 py-3.5 min-h-[44px] rounded-xl text-base font-medium transition-all duration-200 cursor-pointer touch-manipulation active:scale-[0.98] ${
                        isActive
                          ? 'bg-primary/10 text-primary dark:text-accent font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeMobileIndicator"
                          className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-accent"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-800/60">
                <button
                  onClick={() => scrollToSection('contact')}
                  className="w-full flex justify-center items-center py-3.5 min-h-[44px] rounded-xl text-sm font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-primary dark:hover:bg-accent transition-all shadow-sm active:scale-[0.98] cursor-pointer touch-manipulation"
                >
                  Hubungi Saya
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
