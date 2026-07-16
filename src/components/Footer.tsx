import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/40 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            © {currentYear} Muhamad Rifky Hafan. All rights reserved.
          </p>
        </div>
        
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold flex items-center justify-center md:justify-start gap-1">
            Designed & Developed with ❤️ using React & Firebase
          </p>
        </div>
      </div>
    </footer>
  );
};
