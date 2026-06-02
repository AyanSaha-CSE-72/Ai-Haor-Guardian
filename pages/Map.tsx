import React, { useState } from 'react';
import { MapData } from '../types';
import { getHaorMapDetails } from '../services/gemini';
import { MapPin, Info, ExternalLink, Map as MapIcon, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';


const Map: React.FC = () => {
  const [activeZone, setActiveZone] = useState('Sundarbans, Bangladesh');
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { language, t } = useLanguage();

  const handleZoneClick = async () => {
    if (!activeZone.trim()) return;
    setMapData(null);
    setLoading(true);
    setError('');
    
    try {
      const data = await getHaorMapDetails(activeZone.trim(), language);
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

      <div className="mb-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={activeZone}
          onChange={(e) => setActiveZone(e.target.value)}
          placeholder="e.g. Sundarbans, Everglades, Mekong Delta"
          className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
        />
        <button
          onClick={handleZoneClick}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-sm hover:bg-sky-600 transition-colors"
        >
          <Search size={18} />
          {t('dash.btn.analyze')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        {/* Map Container with Pins */}
        <div className="lg:col-span-2 relative bg-blue-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-inner h-[500px] group border border-slate-200 dark:border-slate-800">
          <img 
            src="https://picsum.photos/1200/800?grayscale&blur=2" 
            alt="Map Background" 
            className={`w-full h-full object-cover opacity-50 mix-blend-multiply transition-transform duration-1000 ease-in-out ${
              mapData ? 'scale-105' : 'scale-100'
            }`}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-slate-400/50 text-4xl font-bold uppercase tracking-widest select-none">Global Wetland Map</span>
          </div>

          <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/85 dark:bg-slate-950/85 backdrop-blur px-4 py-3 text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-lg flex items-center gap-3">
            <MapPin size={16} className="text-primary flex-shrink-0" />
            <span>{activeZone}</span>
          </div>
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