import React, { useState } from 'react';
import { HAOR_LIST, MapData } from '../types';
import { getHaorMapDetails } from '../services/gemini';
import { MapPin, Info, ExternalLink, Map as MapIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Map: React.FC = () => {
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { language, t } = useLanguage();

  const handleZoneClick = async (haor: string) => {
    if (activeZone === haor) return;
    setActiveZone(haor);
    setMapData(null);
    setLoading(true);
    setError('');
    
    try {
      const data = await getHaorMapDetails(haor, language);
      setMapData(data);
    } catch (e: any) {
      setError(e.message || "Could not load map details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('map.title')}</h2>
        <p className="text-slate-500 dark:text-slate-400">{t('map.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        {/* Map Container with Pins */}
        <div className="lg:col-span-2 relative bg-blue-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-inner h-[500px] group border border-slate-200 dark:border-slate-800">
          <img 
            src="https://picsum.photos/1200/800?grayscale&blur=2" 
            alt="Map Background" 
            className={`w-full h-full object-cover opacity-50 mix-blend-multiply transition-transform duration-1000 ease-in-out ${
              activeZone ? 'scale-105' : 'scale-100'
            }`}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-slate-400/50 text-4xl font-bold uppercase tracking-widest select-none">Bangladesh Map Zone</span>
          </div>

          {/* Interactive Pins */}
          {HAOR_LIST.map((haor, index) => (
            <button
              key={haor}
              onClick={() => handleZoneClick(haor)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-10 group/pin focus:outline-none ${
                activeZone === haor ? 'scale-125 z-20' : 'hover:scale-110 opacity-90 hover:opacity-100'
              }`}
              style={{
                top: `${30 + (index * 12) % 60}%`,
                left: `${20 + (index * 15) % 70}%`
              }}
            >
              <div className="relative flex flex-col items-center gap-1">
                {/* Active Zone Animation Layers */}
                {activeZone === haor && (
                  <>
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-red-500 rounded-full animate-ping opacity-20"></span>
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-red-500/10 rounded-full animate-pulse"></span>
                  </>
                )}
                
                <div className={`relative transition-all duration-300 rounded-full ${activeZone === haor ? 'ring-4 ring-red-500/20 bg-white/50' : ''}`}>
                  <MapPin 
                    className={`h-8 w-8 drop-shadow-lg transition-all duration-300 ${
                      activeZone === haor 
                        ? 'text-red-600 fill-red-100' 
                        : 'text-primary fill-slate-100 group-hover/pin:text-sky-600'
                    }`} 
                  />
                </div>
                
                <span className={`px-2 py-1 rounded text-xs font-bold shadow-sm backdrop-blur-sm transition-all duration-300 border ${
                  activeZone === haor 
                    ? 'bg-red-600 text-white border-red-500 shadow-md translate-y-1' 
                    : 'bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}>
                  {haor}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Info Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 flex flex-col h-full lg:h-[500px] overflow-hidden">
          <div className="flex items-center gap-2 mb-4 text-primary shrink-0">
            <Info size={24} />
            <h3 className="text-xl font-bold">{t('map.insights')}</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {activeZone ? (
              <div key={activeZone} className="animate-slide-up">
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                  {activeZone}
                </h4>
                
                {loading ? (
                  <div className="space-y-4 animate-pulse">
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full animate-ping"/>
                      {t('map.loading')}
                    </p>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                       <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-2"></div>
                       <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                    </div>
                  </div>
                ) : error ? (
                   <div className="text-red-500 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg text-sm">
                     {error}
                   </div>
                ) : (
                  <div className="space-y-6">
                    <div className="prose dark:prose-invert text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      {/* Render markdown-like text nicely */}
                      {mapData?.summary.split('\n').map((paragraph, i) => (
                        <p key={i} className="mb-2">{paragraph}</p>
                      ))}
                    </div>

                    {/* Google Maps Grounding Sources */}
                    {mapData?.sources && mapData.sources.length > 0 && (
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                          <MapIcon size={12} /> {t('map.sources')}
                        </h5>
                        <div className="flex flex-col gap-2">
                          {mapData.sources.map((source, idx) => (
                            <a 
                              key={idx}
                              href={source.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors group"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="bg-white dark:bg-slate-900 p-1.5 rounded-md text-red-500 shadow-sm">
                                   <MapPin size={16} />
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate group-hover:text-primary transition-colors">
                                  {source.title}
                                </span>
                              </div>
                              <ExternalLink size={14} className="text-slate-400 group-hover:text-primary ml-2 shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-slate-400 h-full py-20">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 animate-bounce">
                  <MapPin size={32} className="opacity-50"/>
                </div>
                <p>{t('map.select')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;