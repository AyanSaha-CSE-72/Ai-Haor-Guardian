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
  'nav.dashboard': { en: 'AI Insights', bn: 'AI ইনসাইটস' },
  'nav.map': { en: 'Map', bn: 'মানচিত্র' },
  'nav.alerts': { en: 'Alerts', bn: 'সতর্কবার্তা' },
  'nav.chat': { en: 'AI Session', bn: 'AI চ্যাট' },
  'nav.about': { en: 'About', bn: 'সম্পর্কে' },
  'nav.builtBy': { en: 'Built for global wetland safety', bn: 'বিশ্বব্যাপী জলাভূমি নিরাপত্তার জন্য তৈরি' },

  // Home
  'home.title': { en: 'Global Wetland Guardian', bn: 'গ্লোবাল ওয়েটল্যান্ড গার্ডিয়ান' },
  'home.subtitle': { en: 'Global Wetland Intelligence', bn: 'বিশ্বব্যাপী জলাভূমি বুদ্ধিমত্তা' },
  'home.desc': { 
    en: 'AI-powered weather prediction, fish insight, and storm alerts for wetlands, deltas, coasts, and floodplains anywhere in the world.', 
    bn: 'বিশ্বের যেকোনো জলাভূমি, ডেল্টা, উপকূল বা বন্যাপ্রবণ অঞ্চলের জন্য AI-চালিত আবহাওয়া পূর্বাভাস, মাছের তথ্য এবং ঝড়ের সতর্কতা।' 
  },
  'home.btn.predict': { en: 'Live Prediction', bn: 'লাইভ পূর্বাভাস' },
  'home.btn.ask': { en: 'Ask AI Anything', bn: 'AI কে প্রশ্ন করুন' },
  'home.card.water': { en: 'Weather Prediction', bn: 'আবহাওয়ার পূর্বাভাস' },
  'home.card.water.desc': { en: 'AI estimates rain, visibility, and travel safety for your location.', bn: 'আপনার এলাকার বৃষ্টি, দৃশ্যমানতা এবং যাতায়াত নিরাপত্তা AI দিয়ে অনুমান করে।' },
  'home.card.storm': { en: 'Storm Alert AI', bn: 'ঝড় সতর্কতা AI' },
  'home.card.storm.desc': { en: 'Early warning for storms, wind risk, and emergency action.', bn: 'ঝড়, বাতাসের ঝুঁকি ও জরুরি করণীয়ের আগাম সতর্কতা।' },
  'home.card.fish': { en: 'Fish Insight AI', bn: 'মাছের তথ্য AI' },
  'home.card.fish.desc': { en: 'Find likely fish activity, productive zones, and best timing.', bn: 'মাছের সম্ভাব্য কার্যকলাপ, ভালো জোন, এবং সেরা সময় বের করে।' },
  'home.card.chat': { en: 'Ask AI', bn: 'AI চ্যাট' },
  'home.card.chat.desc': { en: 'Chat in your language to get instant answers.', bn: 'আপনার ভাষায় প্রশ্ন করে দ্রুত উত্তর পান।' },

  // Dashboard
  'dash.title': { en: 'Global Wetland AI Insights', bn: 'বিশ্বব্যাপী জলাভূমি AI ইনসাইটস' },
  'dash.subtitle': { en: 'Generate weather prediction, fish insight, and storm alerts for any wetland location.', bn: 'যেকোনো জলাভূমি এলাকার জন্য আবহাওয়া পূর্বাভাস, মাছের তথ্য এবং ঝড়ের সতর্কতা তৈরি করুন।' },
  'dash.location.label': { en: 'Location or wetland name', bn: 'অবস্থান বা জলাভূমির নাম' },
  'dash.location.placeholder': { en: 'e.g. Sundarbans, Bangladesh or Everglades, USA', bn: 'যেমন: সুন্দরবন, বাংলাদেশ বা এভারগ্লেডস, USA' },
  'dash.location.help': { en: 'Works with any wetland, delta, river basin, or coastal area worldwide.', bn: 'বিশ্বের যেকোনো জলাভূমি, ডেল্টা, নদীবেসিন বা উপকূলীয় এলাকার জন্য কাজ করে।' },
  'dash.btn.analyze': { en: 'Analyze', bn: 'বিশ্লেষণ করুন' },
  'dash.btn.analyzing': { en: 'Analyzing...', bn: 'বিশ্লেষণ চলছে...' },
  'dash.error.title': { en: 'Analysis Failed', bn: 'বিশ্লেষণ ব্যর্থ হয়েছে' },
  'dash.error.retry': { en: 'Try Again', bn: 'আবার চেষ্টা করুন' },
  'dash.noData.title': { en: 'No prediction data', bn: 'কোনো তথ্য নেই' },
  'dash.noData.desc': { en: 'Enter a global wetland location and click Analyze to see AI insights.', bn: 'একটি জলাভূমির অবস্থান লিখুন এবং AI ইনসাইটস দেখতে বিশ্লেষণ করুন-এ ক্লিক করুন।' },
  'dash.result.for': { en: 'Insights for', bn: 'এর জন্য ইনসাইটস' },
  'dash.weather.title': { en: 'Weather Prediction', bn: 'আবহাওয়ার পূর্বাভাস' },
  'dash.weather.risk': { en: 'Risk level', bn: 'ঝুঁকির মাত্রা' },
  'dash.weather.summary': { en: 'Summary', bn: 'সারাংশ' },
  'dash.weather.rain': { en: 'Rain outlook', bn: 'বৃষ্টির সম্ভাবনা' },
  'dash.weather.window': { en: 'Best travel window', bn: 'ভ্রমণের সেরা সময়' },
  'dash.weather.advice': { en: 'Safety advice', bn: 'নিরাপত্তা পরামর্শ' },
  'dash.fish.title': { en: 'Fish Insight AI', bn: 'মাছের তথ্য AI' },
  'dash.fish.activity': { en: 'Activity level', bn: 'কার্যকলাপের মাত্রা' },
  'dash.fish.species': { en: 'Likely species', bn: 'সম্ভাব্য প্রজাতি' },
  'dash.fish.zones': { en: 'Productive zones', bn: 'উৎপাদনশীল এলাকা' },
  'dash.fish.time': { en: 'Best fishing time', bn: 'মাছ ধরার সেরা সময়' },
  'dash.fish.strategy': { en: 'Lure strategy', bn: 'লুর/কৌশল' },
  'dash.storm.title': { en: 'Storm Alert AI', bn: 'ঝড় সতর্কতা AI' },
  'dash.storm.alert': { en: 'Alert level', bn: 'সতর্কতার মাত্রা' },
  'dash.storm.wind': { en: 'Wind risk', bn: 'বাতাসের ঝুঁকি' },
  'dash.storm.window': { en: 'Danger window', bn: 'ঝুঁকির সময়' },
  'dash.storm.action': { en: 'Action steps', bn: 'করণীয়' },
  'dash.storm.evacuation': { en: 'Evacuation advice', bn: 'সরে যাওয়ার পরামর্শ' },
  
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
  'map.title': { en: 'Interactive Wetland Map', bn: 'ইন্টারঅ্যাক্টিভ জলাভূমি মানচিত্র' },
  'map.subtitle': { en: 'Enter any wetland location to get a quick AI geographical summary.', bn: 'যেকোনো জলাভূমির অবস্থান লিখে AI ভৌগোলিক সারাংশ দেখুন।' },
  'map.insights': { en: 'Location Insights (Google Maps)', bn: 'অবস্থানের তথ্য (গুগল ম্যাপ)' },
  'map.select': { en: 'Enter a location to view details.', bn: 'বিস্তারিত দেখতে একটি অবস্থান লিখুন।' },
  'map.loading': { en: 'Loading Google Maps data...', bn: 'গুগল ম্যাপের তথ্য লোড হচ্ছে...' },
  'map.sources': { en: 'Google Maps Sources', bn: 'গুগল ম্যাপের সূত্র' },

  // Alerts
  'alert.title': { en: 'Global Safety Alert System', bn: 'গ্লোবাল সেফটি অ্যালার্ট সিস্টেম' },
  'alert.subtitle': { en: 'Generate a custom AI safety advisory before heading out anywhere in the world.', bn: 'বিশ্বের যেকোনো স্থানে যাওয়ার আগে কাস্টম AI নিরাপত্তা পরামর্শ নিন।' },
  'alert.form.name': { en: 'Operator Name', bn: 'ব্যবহারকারীর নাম' },
  'alert.form.phone': { en: 'Phone Number', bn: 'মোবাইল নম্বর' },
  'alert.form.haor': { en: 'Location', bn: 'অবস্থান' },
  'alert.form.boat': { en: 'Transport Type', bn: 'যানবাহনের ধরন' },
  'alert.btn.gen': { en: 'Generate Safety Advisory', bn: 'নিরাপত্তা পরামর্শ তৈরি করুন' },
  'alert.btn.generating': { en: 'Generating...', bn: 'তৈরি হচ্ছে...' },
  'alert.result.title': { en: 'Generated Advisory', bn: 'প্রস্তুতকৃত পরামর্শ' },
  'alert.share': { en: 'Share', bn: 'শেয়ার করুন' },
  'alert.copied': { en: 'Copied!', bn: 'কপি হয়েছে!' },
  'alert.save': { en: 'Save as PDF', bn: 'PDF সংরক্ষণ করুন' },

  // About
  'about.title': { en: 'About Global Wetland Guardian', bn: 'গ্লোবাল ওয়েটল্যান্ড গার্ডিয়ান সম্পর্কে' },
  'about.subtitle': { en: 'Empowering wetland, delta, coastal, and floodplain communities with AI safety tools.', bn: 'AI নিরাপত্তা টুল দিয়ে জলাভূমি, ডেল্টা, উপকূলীয় ও বন্যাপ্রবণ কমিউনিটিকে শক্তিশালী করা।' },
  'about.sec1.title': { en: 'Wetland Regions Worldwide', bn: 'বিশ্বব্যাপী জলাভূমি অঞ্চল' },
  'about.sec1.desc': { 
    en: 'Wetlands, deltas, mangroves, and floodplains are unique ecosystems around the world. They are rich in biodiversity but often unpredictable and hazardous.', 
    bn: 'জলাভূমি, ডেল্টা, ম্যানগ্রোভ ও বন্যাপ্রবণ সমভূমি বিশ্বের নানা দেশে অনন্য ইকোসিস্টেম। এগুলো জীববৈচিত্র্যে সমৃদ্ধ হলেও অনেক সময় অনির্দেশ্য ও ঝুঁকিপূর্ণ।' 
  },
  'about.sec2.title': { en: 'Why People are at Risk', bn: 'মানুষ কেন ঝুঁকিতে?' },
  'about.sec2.desc': { 
    en: 'Sudden floods, severe storms, and changing water conditions can threaten fishers, boat operators, and local communities every year.', 
    bn: 'হঠাৎ বন্যা, তীব্র ঝড়, এবং পানির পরিবর্তনশীল অবস্থা প্রতি বছর জেলে, নৌ-চালক ও স্থানীয় মানুষদের ঝুঁকিতে ফেলে।' 
  },
  'about.sec3.title': { en: 'How AI Helps Worldwide', bn: 'বিশ্বব্যাপী AI কীভাবে সাহায্য করে?' },
  'about.sec3.desc': { 
    en: 'We analyze data to answer simple questions anywhere: Is it safe now? Where are the fish? Which route is best?', 
    bn: 'আমরা যেকোনো জায়গার জন্য সহজ প্রশ্নের উত্তর দিতে ডেটা বিশ্লেষণ করি: এখন কি নিরাপদ? মাছ কোথায় আছে? কোন পথটি সবচেয়ে ভালো?' 
  },

  // Chat
  'chat.title': { en: 'AI Session', bn: 'AI সেশন' },
  'chat.subtitle': { en: 'Ask safety questions in your preferred language', bn: 'আপনার পছন্দের ভাষায় নিরাপত্তা প্রশ্ন করুন' },
  'chat.placeholder': { en: 'Example: Is it safe to go out tonight?', bn: 'উদাহরণ: আজ রাতে বাইরে যাওয়া কি নিরাপদ?' },
  'chat.welcome': { 
    en: 'Hello! I am the Global Wetland Guardian AI. How can I help you? You can ask about weather, storms, fish activity, or safety.', 
    bn: 'হ্যালো! আমি গ্লোবাল ওয়েটল্যান্ড গার্ডিয়ান AI। কীভাবে সাহায্য করতে পারি? আপনি আবহাওয়া, ঝড়, মাছের কার্যকলাপ বা নিরাপত্তা নিয়ে প্রশ্ন করতে পারেন।' 
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