import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.home': { en: 'Home', bn: 'হোম' },
  'nav.dashboard': { en: 'Dashboard', bn: 'ড্যাশবোর্ড' },
  'nav.map': { en: 'Map', bn: 'মানচিত্র' },
  'nav.alerts': { en: 'Alerts', bn: 'সতর্কবার্তা' },
  'nav.chat': { en: 'AI Session', bn: 'AI চ্যাট' },
  'nav.about': { en: 'About', bn: 'সম্পর্কে' },
  'nav.builtBy': { en: 'Built by Ayan Saha', bn: 'নির্মাতা: অয়ন সাহা' },

  // Home
  'home.title': { en: 'AI Haor Guardian', bn: 'AI হাওর গার্ডিয়ান' },
  'home.subtitle': { en: 'Live Water & Weather Intelligence', bn: 'লাইভ পানি ও আবহাওয়ার তথ্য' },
  'home.desc': { 
    en: 'Smart predictions for water levels, storms, fish movement & safe fishing routes. Protecting the lives of fishermen in the Haor regions of Bangladesh.', 
    bn: 'পানির স্তর, ঝড়, মাছের গতিবিধি এবং নিরাপদ মাছ ধরার পথের জন্য স্মার্ট পূর্বাভাস। বাংলাদেশের হাওর অঞ্চলের জেলেদের জীবন রক্ষার্থে।' 
  },
  'home.btn.predict': { en: 'Live Prediction', bn: 'লাইভ পূর্বাভাস' },
  'home.btn.ask': { en: 'Ask AI Anything', bn: 'AI কে প্রশ্ন করুন' },
  'home.card.water': { en: 'Water Prediction', bn: 'পানির পূর্বাভাস' },
  'home.card.water.desc': { en: 'Real-time analysis of water rising risks.', bn: 'পানি বাড়ার ঝুঁকির রিয়েল-টাইম বিশ্লেষণ।' },
  'home.card.storm': { en: 'Storm Alerts', bn: 'ঝড়ের সতর্কতা' },
  'home.card.storm.desc': { en: 'Storm likelihood and wind direction monitoring.', bn: 'ঝড় ও বাতাসের দিক পর্যবেক্ষণ।' },
  'home.card.fish': { en: 'Fish Insights', bn: 'মাছের তথ্য' },
  'home.card.fish.desc': { en: 'Predict productive zones and patterns.', bn: 'মাছ পাওয়ার ভালো এলাকা এবং গতিবিধি।' },
  'home.card.chat': { en: 'Ask AI', bn: 'AI চ্যাট' },
  'home.card.chat.desc': { en: 'Chat in Bangla to get instant answers.', bn: 'বাংলায় প্রশ্ন করে জেনে নিন উত্তর।' },

  // Dashboard
  'dash.title': { en: 'AI Prediction Dashboard', bn: 'AI পূর্বাভাস ড্যাশবোর্ড' },
  'dash.subtitle': { en: 'Real-time intelligence for safer fishing.', bn: 'নিরাপদ মাছ ধরার জন্য রিয়েল-টাইম তথ্য।' },
  'dash.btn.analyze': { en: 'Analyze', bn: 'বিশ্লেষণ করুন' },
  'dash.btn.analyzing': { en: 'Analyzing...', bn: 'বিশ্লেষণ চলছে...' },
  'dash.error.title': { en: 'Analysis Failed', bn: 'বিশ্লেষণ ব্যর্থ হয়েছে' },
  'dash.error.retry': { en: 'Try Again', bn: 'আবার চেষ্টা করুন' },
  'dash.noData.title': { en: 'No prediction data', bn: 'কোনো তথ্য নেই' },
  'dash.noData.desc': { en: 'Select a Haor region and click Analyze to see AI insights.', bn: 'একটি হাওর নির্বাচন করুন এবং তথ্য দেখতে "বিশ্লেষণ করুন" এ ক্লিক করুন।' },
  
  // Dashboard Cards
  'card.water.title': { en: 'Water Level Prediction', bn: 'পানির স্তরের পূর্বাভাস' },
  'card.water.risk': { en: 'Risk Level', bn: 'ঝুঁকির মাত্রা' },
  'card.water.prob': { en: 'Rise Probability (24h)', bn: 'পানি বাড়ার সম্ভাবনা (২৪ ঘণ্টা)' },
  'card.storm.title': { en: 'Storm & Wind Risk', bn: 'ঝড় ও বাতাসের ঝুঁকি' },
  'card.storm.likelihood': { en: 'Likelihood', bn: 'সম্ভাবনা' },
  'card.storm.wind': { en: 'Wind Dir', bn: 'বাতাসের দিক' },
  'card.storm.advice': { en: 'Advice:', bn: 'পরামর্শ:' },
  'card.fish.title': { en: 'Fish Movement Insights', bn: 'মাছের গতিবিধির তথ্য' },
  'card.fish.activity': { en: 'Activity Level', bn: 'বিচরণ মাত্রা' },
  'card.fish.zone': { en: 'Best Zone:', bn: 'সেরা এলাকা:' },
  'card.fish.time': { en: 'Prime Time:', bn: 'উপযুক্ত সময়:' },
  'card.route.title': { en: 'Route Safety Analyzer', bn: 'নিরাপদ রুট বিশ্লেষক' },
  'card.route.score': { en: 'Safety Score', bn: 'নিরাপত্তা স্কোর' },
  'card.route.sub': { en: 'Based on wind & waves', bn: 'বাতাস ও ঢেউয়ের ওপর ভিত্তি করে' },
  'card.route.path': { en: 'Safe Path:', bn: 'নিরাপদ পথ:' },

  // Map
  'map.title': { en: 'Interactive Haor Map', bn: 'ইন্টারঅ্যাক্টিভ হাওর মানচিত্র' },
  'map.subtitle': { en: 'Click a zone to get a quick AI geographical summary.', bn: 'ভৌগোলিক তথ্য জানতে মানচিত্রের যেকোনো জোনে ক্লিক করুন।' },
  'map.insights': { en: 'Zone Insights (Google Maps)', bn: 'এলাকার তথ্য (গুগল ম্যাপ)' },
  'map.select': { en: 'Select a location on the map to view details.', bn: 'বিস্তারিত দেখতে মানচিত্রে একটি স্থান নির্বাচন করুন।' },
  'map.loading': { en: 'Loading Google Maps data...', bn: 'গুগল ম্যাপের তথ্য লোড হচ্ছে...' },
  'map.sources': { en: 'Google Maps Locations', bn: 'গুগল ম্যাপ লোকেশন' },

  // Alerts
  'alert.title': { en: 'Fisherman Alert System', bn: 'জেলে সতর্কবার্তা সিস্টেম' },
  'alert.subtitle': { en: 'Generate a custom AI safety advisory before heading out.', bn: 'মাছ ধরতে যাওয়ার আগে কাস্টমাইজড নিরাপত্তা পরামর্শ নিন।' },
  'alert.form.name': { en: 'Fisherman Name', bn: 'জেলে বা মাঝির নাম' },
  'alert.form.phone': { en: 'Phone Number', bn: 'মোবাইল নম্বর' },
  'alert.form.haor': { en: 'Select Haor', bn: 'হাওর নির্বাচন করুন' },
  'alert.form.boat': { en: 'Boat Type', bn: 'নৌকার ধরন' },
  'alert.btn.gen': { en: 'Generate Safety Advisory', bn: 'নিরাপত্তা পরামর্শ তৈরি করুন' },
  'alert.btn.generating': { en: 'Generating...', bn: 'তৈরি হচ্ছে...' },
  'alert.result.title': { en: 'Generated Advisory', bn: 'প্রস্তুতকৃত পরামর্শ' },
  'alert.share': { en: 'Share', bn: 'শেয়ার করুন' },
  'alert.copied': { en: 'Copied!', bn: 'কপি হয়েছে!' },
  'alert.save': { en: 'Save as PDF', bn: 'PDF সংরক্ষণ করুন' },

  // About
  'about.title': { en: 'About AI Haor Guardian', bn: 'AI হাওর গার্ডিয়ান সম্পর্কে' },
  'about.subtitle': { en: 'Empowering the communities of the wetlands with technology and safety.', bn: 'প্রযুক্তি ও নিরাপত্তার মাধ্যমে হাওরবাসীকে শক্তিশালী করা।' },
  'about.sec1.title': { en: 'The Haor Region', bn: 'হাওর অঞ্চল' },
  'about.sec1.desc': { 
    en: 'The Haor basin is a unique wetland ecosystem. During monsoon, it transforms into a vast inland sea. While it is a major source of fish, the environment is unpredictable.', 
    bn: 'হাওর অববাহিকা একটি অনন্য জলাভূমি ইকোসিস্টেম। বর্ষাকালে এটি বিশাল সাগরের রূপ নেয়। যদিও এটি মাছের প্রধান উৎস, তবে এর পরিবেশ অত্যন্ত অনির্দেশ্য।' 
  },
  'about.sec2.title': { en: 'Why Fishermen are at Risk', bn: 'জেলেদের ঝুঁকি কেন?' },
  'about.sec2.desc': { 
    en: 'Sudden flash floods and severe storms claim lives every year. Fishermen often lack accurate weather data.', 
    bn: 'হঠাৎ পাহাড়ি ঢল এবং তীব্র ঝড়ে প্রতি বছর প্রাণহানি ঘটে। জেলেদের কাছে অনেক সময় সঠিক আবহাওয়ার তথ্য থাকে না।' 
  },
  'about.sec3.title': { en: 'How AI Helps', bn: 'AI কীভাবে সাহায্য করে?' },
  'about.sec3.desc': { 
    en: 'We analyze data to provide simple insights: Is it safe? Where are the fish? Which route is best?', 
    bn: 'আমরা ডেটা বিশ্লেষণ করে সহজ পরামর্শ দেই: এখন কি নিরাপদ? মাছ কোথায় আছে? কোন পথটি সবচেয়ে ভালো?' 
  },

  // Chat
  'chat.title': { en: 'AI Session', bn: 'AI সেশন' },
  'chat.subtitle': { en: 'Ask safety questions in Bangla or English', bn: 'বাংলা বা ইংরেজিতে প্রশ্ন করুন' },
  'chat.placeholder': { en: 'Example: Is it safe to fish tonight?', bn: 'উদাহরণ: আজ রাতে মাছ ধরা কি নিরাপদ?' },
  'chat.welcome': { 
    en: 'Nomoshkar! I am the Haor Guardian AI. How can I help you? You can ask about water levels or safety.', 
    bn: 'নমস্কার! আমি হাওর গার্ডিয়ান AI। আমি কীভাবে সাহায্য করতে পারি? আপনি পানির স্তর বা নিরাপত্তা নিয়ে প্রশ্ন করতে পারেন।' 
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};