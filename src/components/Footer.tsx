import React from 'react';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-50/95 dark:from-slate-900/95 to-transparent backdrop-blur-lg border-t border-slate-200 dark:border-white/5 py-6 z-50">
      <div className="container max-w-7xl mx-auto px-4">
        <p className="text-slate-600 dark:text-slate-400 text-sm text-center">
          Made with ❤️ by GPT Engineer
        </p>
      </div>
    </footer>
  );
};

export default Footer;