import React from 'react';
import { ShieldCheck, Droplets, HeartHandshake } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="py-16 bg-white dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {t('about.title')}
          </h2>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="space-y-12">
          {/* Section 1 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 p-4 bg-blue-50 dark:bg-slate-900 rounded-xl text-primary">
              <Droplets size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('about.sec1.title')}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('about.sec1.desc')}
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 p-4 bg-red-50 dark:bg-slate-900 rounded-xl text-red-500">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('about.sec2.title')}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('about.sec2.desc')}
              </p>
            </div>
          </div>

           {/* Section 3 */}
           <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 p-4 bg-green-50 dark:bg-slate-900 rounded-xl text-green-500">
              <HeartHandshake size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('about.sec3.title')}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('about.sec3.desc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
