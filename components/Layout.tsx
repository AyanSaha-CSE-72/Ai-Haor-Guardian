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

  const supportedLocales = [
    { code: 'en', label: 'English' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'zh', label: '中文' },
    { code: 'ar', label: 'العربية' },
    { code: 'ru', label: 'Русский' },
    { code: 'pt', label: 'Português' },
    { code: 'de', label: 'Deutsch' },
    { code: 'it', label: 'Italiano' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'id', label: 'Bahasa Indonesia' },
    { code: 'ms', label: 'Bahasa Melayu' },
    { code: 'th', label: 'ไทย' },
    { code: 'tr', label: 'Türkçe' },
    { code: 'nl', label: 'Nederlands' },
    { code: 'pl', label: 'Polski' },
    { code: 'sv', label: 'Svenska' },
    { code: 'no', label: 'Norsk' },
    { code: 'da', label: 'Dansk' },
    { code: 'fi', label: 'Suomi' },
    { code: 'he', label: 'עברית' },
    { code: 'fa', label: 'فارسی' },
    { code: 'ur', label: 'اردو' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'mr', label: 'मराठी' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'ml', label: 'മലയാളം' },
    { code: 'si', label: 'සිංහල' },
    { code: 'ne', label: 'नेपाली' },
    { code: 'af', label: 'Afrikaans' },
    { code: 'sq', label: 'Shqip' },
    { code: 'am', label: 'አማርኛ' },
    { code: 'hy', label: 'Հայերեն' },
    { code: 'az', label: 'Azərbaycan' },
    { code: 'be', label: 'Беларуская' },
    { code: 'bg', label: 'Български' },
    { code: 'ca', label: 'Català' },
    { code: 'cs', label: 'Čeština' },
    { code: 'hr', label: 'Hrvatski' },
    { code: 'sk', label: 'Slovenčina' },
    { code: 'sl', label: 'Slovenščina' },
    { code: 'sr', label: 'Српски' },
    { code: 'uk', label: 'Українська' },
    { code: 'mk', label: 'Македонски' },
    { code: 'el', label: 'Ελληνικά' },
    { code: 'ht', label: 'Kreyòl Ayisyen' },
    { code: 'sw', label: 'Kiswahili' },
    { code: 'zu', label: 'isiZulu' },
    { code: 'xh', label: 'isiXhosa' },
    { code: 'yo', label: 'Yorùbá' },
    { code: 'ig', label: 'Igbo' },
    { code: 'ha', label: 'Hausa' },
    { code: 'eo', label: 'Esperanto' },
    { code: 'la', label: 'Latin' },
    { code: 'gl', label: 'Galego' },
    { code: 'eu', label: 'Euskara' },
    { code: 'cy', label: 'Cymraeg' },
    { code: 'ga', label: 'Gaeilge' },
    { code: 'is', label: 'Íslenska' },
    { code: 'lb', label: 'Lëtzebuergesch' },
    { code: 'mt', label: 'Malti' },
    { code: 'mn', label: 'Монгол' },
    { code: 'km', label: 'ខ្មែរ' },
    { code: 'lo', label: 'ລາວ' },
    { code: 'my', label: 'မြန်မာ' },
    { code: 'bo', label: 'བོད་སྐད' },
    { code: 'tg', label: 'Тоҷикӣ' },
    { code: 'uz', label: 'Oʻzbek' },
    { code: 'kk', label: 'Қазақ тілі' },
    { code: 'ku', label: 'Kurdî' },
    { code: 'ps', label: 'پښتو' },
    { code: 'bs', label: 'Bosanski' },
    { code: 'ro', label: 'Română' },
    { code: 'hu', label: 'Magyar' },
    { code: 'tk', label: 'Türkmençe' },
    { code: 'nb', label: 'Bokmål' },
    { code: 'nn', label: 'Nynorsk' },
    { code: 'et', label: 'Eesti' },
    { code: 'lv', label: 'Latviešu' },
    { code: 'lt', label: 'Lietuvių' },
    { code: 'rm', label: 'Rumantsch' },
    { code: 'st', label: 'Sesotho' },
    { code: 'tn', label: 'Setswana' },
    { code: 'sn', label: 'ChiShona' },
    { code: 'ny', label: 'Chichewa' },
    { code: 'so', label: 'Soomaali' },
    { code: 'am', label: 'አማርኛ' },
    { code: 'rw', label: 'Kinyarwanda' },
    { code: 'tg', label: 'Тоҷикӣ' },
    { code: 'hy', label: 'Հայերեն' },
    { code: 'sa', label: 'संस्कृतम्' },
    { code: 'or', label: 'ଓଡ଼ିଆ' },
    { code: 'as', label: 'অসমীয়া' },
    { code: 'sd', label: 'سنڌي' },
    { code: 'kk', label: 'Қазақ тілі' },
    { code: 'ps', label: 'پښتو' },
    { code: 'yi', label: 'ייִדיש' },
    { code: 'bn-IN', label: 'বাংলা (ভারত)' },
    { code: 'en-GB', label: 'English (GB)' },
    { code: 'en-US', label: 'English (US)' },
    { code: 'es-MX', label: 'Español (MX)' },
    { code: 'pt-BR', label: 'Português (BR)' },
    { code: 'pt-PT', label: 'Português (PT)' },
    { code: 'fr-CA', label: 'Français (CA)' },
    { code: 'zh-Hans', label: '中文(简体)' },
    { code: 'zh-Hant', label: '中文(繁體)' },
    { code: 'auto', label: 'Auto (native)' },
  ];

  const toggleLanguage = (next?: string) => {
    if (next) return setLanguage(next);
    // fallback cycle
    const idx = supportedLocales.findIndex((l) => l.code === language);
    const nextIdx = (idx + 1) % supportedLocales.length;
    setLanguage(supportedLocales[nextIdx].code);
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
                <div className="flex items-center gap-2">
                  <select
                    value={language}
                    onChange={(e) => toggleLanguage(e.target.value)}
                    className="px-2 py-1 rounded-md border bg-white dark:bg-slate-800 text-sm"
                    aria-label="Select language"
                  >
                    {supportedLocales.map((loc) => (
                      <option key={loc.code} value={loc.code}>{loc.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="-mr-2 flex md:hidden items-center gap-2">
              <select
                value={language}
                onChange={(e) => toggleLanguage(e.target.value)}
                className="px-2 py-1 rounded-md border bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                aria-label="Select language"
              >
                {supportedLocales.map((loc) => (
                  <option key={loc.code} value={loc.code}>{loc.label}</option>
                ))}
              </select>
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
