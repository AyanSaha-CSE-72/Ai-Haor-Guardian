import React, { useMemo, useState } from 'react';
import { MapPin, Map as MapIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import CountryLocationSelector from '../components/CountryLocationSelector';


const Map: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const { t } = useLanguage();

  const mapQuery = useMemo(() => {
    const parts = [selectedLocation.trim(), selectedCountry.trim()].filter(Boolean);
    return parts.join(', ');
  }, [selectedCountry, selectedLocation]);

  const mapUrl = useMemo(() => {
    if (!mapQuery) return '';
    return `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=7&output=embed`;
  }, [mapQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('map.title')}</h2>
        <p className="text-slate-500 dark:text-slate-400">{t('map.subtitle')}</p>
      </div>

      <div className="mb-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-primary mb-2">
          <MapIcon size={18} />
          <p className="text-sm font-semibold uppercase tracking-[0.18em]">Location selector</p>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Select a country first, then choose a wetland or location to load the map preview.
        </p>

        <CountryLocationSelector
          layout="vertical"
          onChange={(country, location) => {
            setSelectedCountry(country?.name || '');
            setSelectedLocation(location || '');
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
          <div className="border-b border-slate-100 dark:border-slate-800 px-5 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <MapPin size={18} className="text-primary" />
              <div>
                <p className="text-sm font-semibold">{selectedCountry || 'No country selected'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedLocation ? selectedLocation : 'Choose a location to update the map'}
                </p>
              </div>
            </div>
            {mapQuery && (
              <span className="rounded-full bg-sky-50 dark:bg-sky-900/20 px-3 py-1 text-xs font-semibold text-sky-700 dark:text-sky-200">
                {mapQuery}
              </span>
            )}
          </div>

          <div className="relative h-[560px] bg-slate-100 dark:bg-slate-800">
            {mapUrl ? (
              <iframe
                title="Selected location map"
                src={mapUrl}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center px-6 text-slate-500 dark:text-slate-400">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-slate-900 shadow-sm">
                  <MapPin size={30} className="text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">Select a country and location</p>
                <p className="mt-2 max-w-md text-sm">
                  The map preview will appear here as soon as you choose a country and wetland or city.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4 text-primary">
            <MapIcon size={22} />
            <h3 className="text-xl font-bold">Selected place</h3>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Country</p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {selectedCountry || 'Not selected yet'}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Location</p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {selectedLocation || 'Not selected yet'}
              </p>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-4 text-sm text-slate-500 dark:text-slate-400 leading-6">
              Choose a country from the selector, then tap a location. The map on the left updates immediately.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;