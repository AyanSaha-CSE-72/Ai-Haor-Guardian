import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Anchor, Home, Info, Activity, Map as MapIcon, Bell, MessageSquare, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  const navItems = [
    { path: '/', label: t('nav.home'), icon: <Home size={18} /> },
    { path: '/dashboard', label: t('nav.dashboard'), icon: <Activity size={18} /> },
  
    { path: '/alerts', label: t('nav.alerts'), icon: <Bell size={18} /> },
    { path: '/chat', label: t('nav.chat'), icon: <MessageSquare size={18} /> },
    { path: '/about', label: t('nav.about'), icon: <Info size={18} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <Anchor className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Global Wetland Guardian</span>
              </Link>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-50 dark:bg-slate-800 text-primary'
                        : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
                
                {/* Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Languages size={16} />
                  {language === 'en' ? 'BN' : 'EN'}
                </button>
              </div>
            </div>

            <div className="-mr-2 flex md:hidden items-center gap-2">
              <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1 px-2 py-1 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  {language === 'en' ? 'BN' : 'EN'}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.path
                      ? 'bg-blue-50 dark:bg-slate-800 text-primary'
                      : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © {new Date().getFullYear()} Global Wetland Guardian. All rights reserved.
          </p>
          <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold mt-2 md:mt-0">
            {t('nav.builtBy')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
