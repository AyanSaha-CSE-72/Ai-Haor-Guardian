import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CloudLightning, Activity, Ship, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Home: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="relative isolate overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-14 lg:pt-20 pb-20 sm:pb-24">
         <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#0ea5e9] to-[#38bdf8] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
          </div>
          
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl mb-6">
            {t('home.title')}
            <br />
            <span className="text-primary text-3xl sm:text-5xl">{t('home.subtitle')}</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t('home.desc')}
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6 flex-wrap">
            <Link to="/dashboard" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all">
              {t('home.btn.predict')}
            </Link>
            <Link to="/chat" className="text-sm font-semibold leading-6 text-slate-900 dark:text-white flex items-center gap-1 hover:text-primary">
              {t('home.btn.ask')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard 
            icon={<Activity className="h-8 w-8 text-primary" />}
            title={t('home.card.water')}
            desc={t('home.card.water.desc')}
            link="/dashboard"
          />
          <FeatureCard 
            icon={<CloudLightning className="h-8 w-8 text-yellow-500" />}
            title={t('home.card.storm')}
            desc={t('home.card.storm.desc')}
            link="/dashboard"
          />
          <FeatureCard 
            icon={<Ship className="h-8 w-8 text-teal-500" />}
            title={t('home.card.fish')}
            desc={t('home.card.fish.desc')}
            link="/dashboard"
          />
          <FeatureCard 
            icon={<MessageCircle className="h-8 w-8 text-indigo-500" />}
            title={t('home.card.chat')}
            desc={t('home.card.chat.desc')}
            link="/chat"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, link }: { icon: React.ReactNode, title: string, desc: string, link: string }) => (
  <Link to={link} className="flex flex-col items-start p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100 dark:border-slate-800">
    <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
  </Link>
);

export default Home;
