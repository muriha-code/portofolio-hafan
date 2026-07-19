import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/40 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex justify-center items-center text-center">
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          © {currentYear} Muriha Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
