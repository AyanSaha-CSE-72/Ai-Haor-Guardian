import React, { useEffect, useMemo, useState } from 'react';
import { City, Country, State } from 'country-state-city';
import regionsMap from '../services/countryRegions';
import { useLanguage } from '../contexts/LanguageContext';

type SelectorProps = {
  onChange?: (location?: string) => void;
  layout?: 'vertical' | 'horizontal';
};

type LocationOption = {
  label: string;
  subtitle?: string;
  kind: 'country' | 'state' | 'city' | 'town' | 'district' | 'wetland';
  isoCode?: string; // for countries
};

type OpenMeteoResult = {
  name?: string;
  country?: string;
  country_code?: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  feature_code?: string;
};

const CountryLocationSelector: React.FC<SelectorProps> = ({ onChange, layout = 'horizontal' }) => {
  const { language } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [remoteLocations, setRemoteLocations] = useState<LocationOption[]>([]);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [restCountryMap, setRestCountryMap] = useState<Record<string, string>>({});

  const wetlands = useMemo(() => {
    const unique = new Set<string>();
    Object.values(regionsMap).forEach((items) => {
      items.forEach((item) => unique.add(item));
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, []);

  useEffect(() => {
    // Fetch restcountries once to obtain native/common names for native display
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=cca2,name', { signal: controller.signal });
        const data = await res.json();
        const map: Record<string, string> = {};
        if (Array.isArray(data)) {
          data.forEach((c: any) => {
            const code = (c.cca2 || '').toUpperCase();
            let nativeName = c?.name?.common || '';
            // prefer one nativeName if available
            if (c?.name?.nativeName && typeof c.name.nativeName === 'object') {
              const firstKey = Object.keys(c.name.nativeName)[0];
              nativeName = c.name.nativeName[firstKey]?.common || nativeName;
            }
            if (code) map[code] = nativeName;
          });
        }
        setRestCountryMap(map);
      } catch (e) {
        // ignore network errors; fallbacks will be used
        console.warn('Could not fetch restcountries for native names', e);
      }
    })();
    return () => controller.abort();
  }, []);

  const allLocations = useMemo(() => {
    const merged = new Map<string, LocationOption>();

    Country.getAllCountries().forEach((item) => {
      if (item?.name) {
        merged.set(item.name.toLowerCase(), { label: item.name, kind: 'country', subtitle: item.isoCode, isoCode: item.isoCode });
      }
    });

    State.getAllStates().forEach((item) => {
      if (item?.name) {
        const key = item.name.toLowerCase();
        if (!merged.has(key)) {
          merged.set(key, { label: item.name, kind: 'state', subtitle: item.countryCode });
        }
      }
    });

    City.getAllCities().forEach((item) => {
      if (item?.name) {
        const key = item.name.toLowerCase();
        if (!merged.has(key)) {
          merged.set(key, { label: item.name, kind: 'city', subtitle: item.countryCode });
        }
      }
    });

    wetlands.forEach((label) => {
      const key = label.toLowerCase();
      if (!merged.has(key)) {
        merged.set(key, { label, kind: 'wetland' });
      }
    });

    remoteLocations.forEach((item) => {
      const key = item.label.toLowerCase();
      if (!merged.has(key)) {
        merged.set(key, item);
      }
    });

    return Array.from(merged.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [remoteLocations, wetlands]);

  const getCountryDisplay = (iso?: string, fallback?: string) => {
    if (!iso) return fallback || '';
    const code = iso.toUpperCase();

    // auto -> show native/common name from restcountries if available
    if (language === 'auto') {
      return restCountryMap[code] || fallback || code;
    }

    // try Intl.DisplayNames for the requested locale
    try {
      const locale = language || 'en';
      if (typeof Intl !== 'undefined' && (Intl as any).DisplayNames) {
        // @ts-ignore
        const dn = new (Intl as any).DisplayNames([locale], { type: 'region' });
        const name = dn.of(code);
        if (name) return name;
      }
    } catch (e) {
      // ignore
    }

    // fallback to restcountries common or provided label
    return restCountryMap[code] || fallback || code;
  };

  useEffect(() => {
    const q = search.trim();
    if (q.length < 2) {
      setRemoteLocations([]);
      setRemoteLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        setRemoteLoading(true);
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=20&language=en&format=json`;
        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();
        const results: OpenMeteoResult[] = Array.isArray(data?.results) ? data.results : [];

        const mapped = results.map<LocationOption>((item) => {
          const feature = item.feature_code || '';
          const kind: LocationOption['kind'] = feature.startsWith('ADM1')
            ? 'state'
            : feature.startsWith('ADM2') || feature.startsWith('ADM3') || feature.startsWith('ADM4')
              ? 'district'
              : feature.startsWith('PPL')
                ? 'city'
                : 'town';

          const pieces = [item.name, item.admin3, item.admin2, item.admin1, item.country].filter(Boolean);
          return {
            label: pieces.join(', '),
            kind,
            subtitle: item.feature_code,
          };
        });

        setRemoteLocations(mapped);
      } catch (error: any) {
        if (error?.name !== 'AbortError') {
          console.error('Failed to load remote locations', error);
        }
      } finally {
        setRemoteLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [search]);

  const filteredLocations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return allLocations.filter((item) => item.label.toLowerCase().includes(q)).slice(0, 60);
  }, [search, allLocations]);

  const remoteFilteredLocations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return remoteLocations.filter((item) => item.label.toLowerCase().includes(q)).slice(0, 20);
  }, [remoteLocations, search]);

  const combinedLocations = useMemo(() => {
    const merged = new Map<string, LocationOption>();
    [...remoteFilteredLocations, ...filteredLocations].forEach((item) => {
      const key = item.label.toLowerCase();
      if (!merged.has(key)) {
        merged.set(key, item);
      }
    });
    return Array.from(merged.values()).slice(0, 60);
  }, [filteredLocations, remoteFilteredLocations]);

  const containerClass =
    layout === 'vertical'
      ? 'mt-6 w-full max-w-xl mx-auto flex flex-col gap-3 items-stretch justify-center'
      : 'mt-6 w-full max-w-xl mx-auto flex flex-col sm:flex-row gap-3 items-stretch justify-center';

  const pickLocation = (value: string) => {
    setSelectedLocation(value);
    setSearch(value);
    onChange?.(value);
  };

  return (
    <div className={containerClass}>
      <div className="flex-1">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search country, city, state, or wetland"
          className="w-full rounded-md border py-2 px-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
        />

        {search.trim() && (
          <div className="mt-3 max-h-56 overflow-auto grid grid-cols-2 gap-2">
            {remoteLoading && (
              <div className="col-span-2 rounded-md border border-dashed border-slate-300 dark:border-slate-700 px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                Searching more places...
              </div>
            )}
            {combinedLocations.length > 0 ? (
              combinedLocations.map((item) => {
                const itemLabel = String(item.label);
                const isSelected = selectedLocation === itemLabel;

                const displayLabel = item.kind === 'country' ? getCountryDisplay(item.isoCode, item.label) : item.label;

                return (
                  <button
                    key={`${item.kind}-${itemLabel}`}
                    type="button"
                    onClick={() => pickLocation(itemLabel)}
                    className={`text-left rounded-md border px-3 py-2 bg-white hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700 ${isSelected ? 'ring-2 ring-primary' : ''}`}
                  >
                    <span className="block">{displayLabel}</span>
                    <span className="block text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {item.kind}{item.subtitle ? ` • ${item.subtitle}` : ''}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="col-span-2 rounded-md border border-dashed border-slate-300 dark:border-slate-700 px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                No matching location found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryLocationSelector;
