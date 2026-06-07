import React, { useState } from 'react';
import { CloudLightning, Fish, Loader2, MapPin, RefreshCw, ShieldAlert, Wind } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import CountryLocationSelector from '../components/CountryLocationSelector';
import { getWetlandInsights } from '../services/gemini';
import { WetlandInsightData } from '../types';

const Dashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const [location, setLocation] = useState('Sundarbans, Bangladesh');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<WetlandInsightData | null>(null);
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState('');

  const handleAnalyze = async () => {
    if (!location.trim() || loading) return;

    setLoading(true);
    setError('');
    setErrorCode('');
    setInsights(null);

    try {
      const result = await getWetlandInsights(location.trim(), language);
      setInsights(result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate insights.');
      setErrorCode(err.code || '');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900" />
        <div className="relative p-8 md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 dark:border-sky-900/60 bg-white/80 dark:bg-slate-950/80 px-3 py-1 text-xs font-semibold text-sky-700 dark:text-sky-300 backdrop-blur">
                <MapPin size={14} />
                Global wetland AI
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t('dash.title')}
              </h2>
              <p className="mt-3 text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
                {t('dash.subtitle')}
              </p>
            </div>

            <div className="w-full lg:max-w-xl">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('dash.location.label')}
              </label>
              <div className="flex flex-col md:flex-row gap-3 items-start">
                <div className="flex-1 w-full">
                  <CountryLocationSelector layout="vertical" onChange={(loc?: string) => setLocation(loc || '')} />
                </div>
                <div className="flex-shrink-0 md:mt-8">
                  <button
                    onClick={handleAnalyze}
                    disabled={loading || !location.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-semibold text-white shadow-lg shadow-sky-500/20 transition-colors hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                    {loading ? t('dash.btn.analyzing') : t('dash.btn.analyze')}
                  </button>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {t('dash.location.help')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-8 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-200 flex items-start gap-3">
          <ShieldAlert size={20} className="mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold flex items-center gap-2">
              {t('dash.error.title')}
              {errorCode && <span className="rounded-md border border-red-200 dark:border-red-800 bg-white/70 dark:bg-red-950/40 px-1.5 py-0.5 text-xs font-mono">{errorCode}</span>}
            </p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        </div>
      )}

      {insights ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{t('dash.result.for')}</p>
            <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{insights.location}</h3>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <InsightCard
              icon={<Wind className="text-sky-500" />}
              title={t('dash.weather.title')}
              accent={insights.weatherPrediction.riskLevel}
            >
              <Metric label={t('dash.weather.risk')} value={insights.weatherPrediction.riskLevel} />
              <TextBlock label={t('dash.weather.summary')} value={insights.weatherPrediction.summary} />
              <TextBlock label={t('dash.weather.rain')} value={insights.weatherPrediction.rainfallChance} />
              <TextBlock label={t('dash.weather.window')} value={insights.weatherPrediction.bestWindow} />
              <TextBlock label={t('dash.weather.advice')} value={insights.weatherPrediction.safetyAdvice} />
            </InsightCard>

            <InsightCard
              icon={<Fish className="text-emerald-500" />}
              title={t('dash.fish.title')}
              accent={insights.fishInsight.activityLevel}
            >
              <Metric label={t('dash.fish.activity')} value={insights.fishInsight.activityLevel} />
              <TextBlock label={t('dash.fish.species')} value={insights.fishInsight.species} />
              <TextBlock label={t('dash.fish.zones')} value={insights.fishInsight.bestZones} />
              <TextBlock label={t('dash.fish.time')} value={insights.fishInsight.bestTime} />
              <TextBlock label={t('dash.fish.strategy')} value={insights.fishInsight.lureAdvice} />
            </InsightCard>

            <InsightCard
              icon={<CloudLightning className="text-amber-500" />}
              title={t('dash.storm.title')}
              accent={insights.stormAlert.alertLevel}
            >
              <Metric label={t('dash.storm.alert')} value={insights.stormAlert.alertLevel} />
              <TextBlock label={t('dash.storm.wind')} value={insights.stormAlert.windRisk} />
              <TextBlock label={t('dash.storm.window')} value={insights.stormAlert.likelyWindow} />
              <TextBlock label={t('dash.storm.action')} value={insights.stormAlert.action} />
              <TextBlock label={t('dash.storm.evacuation')} value={insights.stormAlert.evacuationAdvice} />
            </InsightCard>
          </div>
        </div>
      ) : (
        !error && (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
            <MapPin className="mx-auto mb-4 text-slate-300 dark:text-slate-600" size={42} />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t('dash.noData.title')}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('dash.noData.desc')}</p>
          </div>
        )
      )}
    </div>
  );
};

const InsightCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  accent: string;
  children: React.ReactNode;
}> = ({ icon, title, accent, children }) => {
  const accentClass = accent === 'High'
    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-200 border-red-200 dark:border-red-800'
    : accent === 'Medium'
      ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-800'
      : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800';

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-5 py-4">
        <div className="rounded-xl bg-white dark:bg-slate-900 p-2 shadow-sm">{icon}</div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <div className="space-y-4 p-5">
        <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${accentClass}`}>
          {accent}
        </div>
        {children}
      </div>
    </div>
  );
};

const Metric: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{value}</p>
  </div>
);

const TextBlock: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{value}</p>
  </div>
);

export default Dashboard;
