import React, { useState } from 'react';
import { getHaorPrediction } from '../services/gemini';
import { HAOR_LIST, PredictionData } from '../types';
import { Activity, Wind, Fish, Navigation, AlertTriangle, RefreshCw, XCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard: React.FC = () => {
  const [selectedHaor, setSelectedHaor] = useState(HAOR_LIST[0]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PredictionData | null>(null);
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const { language, t } = useLanguage();

  const handlePredict = async () => {
    setLoading(true);
    setError('');
    setErrorCode('');
    setData(null); 
    try {
      const result = await getHaorPrediction(selectedHaor, language);
      setData(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch AI prediction.');
      setErrorCode(err.code || '');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header & Controls */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('dash.title')}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{t('dash.subtitle')}</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-4 w-full md:w-auto">
          <select 
            value={selectedHaor}
            onChange={(e) => setSelectedHaor(e.target.value)}
            className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
          >
            {HAOR_LIST.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
          
          <button
            onClick={handlePredict}
            disabled={loading}
            className="flex items-center gap-2 bg-primary hover:bg-sky-600 text-white px-6 py-2 rounded-md font-semibold disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {loading ? <RefreshCw className="animate-spin" size={18}/> : <Activity size={18}/>}
            {loading ? t('dash.btn.analyzing') : t('dash.btn.analyze')}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-800 flex flex-col sm:flex-row items-start gap-4">
          <div className="flex items-start gap-3 flex-1">
             <AlertTriangle className="flex-shrink-0 mt-0.5 text-red-600 dark:text-red-400" size={24} />
             <div>
               <h3 className="font-bold text-sm text-red-800 dark:text-red-100 flex items-center gap-2">
                 {t('dash.error.title')}
                 {errorCode && <span className="text-xs bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 rounded font-mono opacity-80 border border-red-200 dark:border-red-800">Code: {errorCode}</span>}
               </h3>
               <p className="text-sm mt-1">{error}</p>
             </div>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={handlePredict}
               className="text-sm font-semibold bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-800 dark:text-red-100 px-4 py-2 rounded transition-colors whitespace-nowrap"
             >
               {t('dash.error.retry')}
             </button>
             <button onClick={() => setError('')} className="text-red-500 hover:text-red-700 dark:hover:text-red-300 self-center">
               <XCircle size={20} />
             </button>
          </div>
        </div>
      )}

      {/* Prediction Cards */}
      {data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          
          {/* Water Level Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className={`p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 ${
              data.waterLevel.riskLevel === 'High' ? 'bg-red-50 dark:bg-red-900/20' : 
              data.waterLevel.riskLevel === 'Medium' ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-green-50 dark:bg-green-900/20'
            }`}>
              <Activity className={
                 data.waterLevel.riskLevel === 'High' ? 'text-red-500' : 
                 data.waterLevel.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-green-500'
              } />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t('card.water.title')}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">{t('card.water.risk')}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                   data.waterLevel.riskLevel === 'High' ? 'bg-red-100 text-red-700' : 
                   data.waterLevel.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  {data.waterLevel.riskLevel}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('card.water.prob')}</p>
                <p className="text-slate-600 dark:text-slate-400">{data.waterLevel.riseProbability}</p>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-500 italic border-t border-slate-100 dark:border-slate-800 pt-3">
                "{data.waterLevel.description}"
              </div>
            </div>
          </div>

          {/* Storm Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50">
              <Wind className="text-sky-500" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t('card.storm.title')}</h3>
            </div>
            <div className="p-6 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">{t('card.storm.likelihood')}</p>
                    <p className="font-bold text-slate-900 dark:text-white">{data.storm.likelihood}</p>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">{t('card.storm.wind')}</p>
                    <p className="font-bold text-slate-900 dark:text-white">{data.storm.windDirection}</p>
                 </div>
               </div>
               <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                  <span className="font-bold">{t('card.storm.advice')}</span> {data.storm.advice}
               </div>
            </div>
          </div>

          {/* Fish Movement Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50">
              <Fish className="text-teal-500" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t('card.fish.title')}</h3>
            </div>
            <div className="p-6 space-y-4">
               <div className="flex items-center justify-between">
                 <span className="text-slate-600 dark:text-slate-300">{t('card.fish.activity')}</span>
                 <div className="flex gap-1">
                   {[1,2,3].map(i => (
                     <div key={i} className={`h-2 w-6 rounded-full ${
                       (data.fish.movement === 'Low' && i === 1) ||
                       (data.fish.movement === 'Medium' && i <= 2) ||
                       (data.fish.movement === 'High') ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'
                     }`} />
                   ))}
                 </div>
               </div>
               <div className="space-y-2">
                 <p className="text-sm"><span className="font-semibold text-slate-700 dark:text-slate-300">{t('card.fish.zone')}</span> <span className="text-slate-600 dark:text-slate-400">{data.fish.zone}</span></p>
                 <p className="text-sm"><span className="font-semibold text-slate-700 dark:text-slate-300">{t('card.fish.time')}</span> <span className="text-slate-600 dark:text-slate-400">{data.fish.bestTime}</span></p>
               </div>
            </div>
          </div>

          {/* Route Safety Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50">
              <Navigation className="text-indigo-500" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t('card.route.title')}</h3>
            </div>
            <div className="p-6 space-y-4">
               <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 flex items-center justify-center">
                    <svg className="h-full w-full" viewBox="0 0 36 36">
                      <path className="text-slate-200 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                      <path className={`${data.route.safetyScore > 70 ? 'text-green-500' : data.route.safetyScore > 40 ? 'text-yellow-500' : 'text-red-500'}`} 
                            strokeDasharray={`${data.route.safetyScore}, 100`} 
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                    </svg>
                    <span className="absolute text-sm font-bold text-slate-900 dark:text-white">{data.route.safetyScore}%</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{t('card.route.score')}</p>
                    <p className="text-xs text-slate-500">{t('card.route.sub')}</p>
                  </div>
               </div>
               
               <div className="text-sm">
                 <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('card.route.path')}</p>
                 <p className="text-slate-600 dark:text-slate-400 bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded">{data.route.safePath}</p>
               </div>

               {data.route.warningPoints.length > 0 && (
                 <div className="text-xs text-red-600 dark:text-red-400 flex flex-wrap gap-2 mt-2">
                   {data.route.warningPoints.map((wp, idx) => (
                     <span key={idx} className="flex items-center gap-1 bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded border border-red-100 dark:border-red-900/30">
                       <AlertTriangle size={12}/> {wp}
                     </span>
                   ))}
                 </div>
               )}
            </div>
          </div>

        </div>
      ) : (
        !error && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <Activity className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{t('dash.noData.title')}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('dash.noData.desc')}</p>
          </div>
        )
      )}
    </div>
  );
};

export default Dashboard;