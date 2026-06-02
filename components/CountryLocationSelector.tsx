import React, { useEffect, useState } from 'react';
import { regionsMap } from '../services/countryRegions';

type Country = { name: string; code: string };

const CountryLocationSelector: React.FC<{
  onChange?: (country?: Country | null, location?: string) => void;
  layout?: 'vertical' | 'horizontal';
}> = ({ onChange, layout = 'horizontal' }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [countryInput, setCountryInput] = useState<string>('');
  const [regions, setRegions] = useState<string[] | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
        const data = await res.json();
        const list: Country[] = data
          .map((c: any) => ({ name: c.name?.common || c.name, code: c.cca2 }))
          .filter((c: Country) => c.code)
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        setCountries(list);
      } catch (e) {
        console.error('Failed to load countries', e);
      }
    };
    load();
  }, []);

  // when selectedLocation changes, notify parent
  useEffect(() => {
    const countryObj = countries.find((c) => c.code === selectedCountry) || null;
    onChange?.(countryObj, selectedLocation);
  }, [selectedLocation, selectedCountry, countries, onChange]);

  const containerClass =
    layout === 'vertical'
      ? 'mt-6 w-full max-w-xl mx-auto flex flex-col gap-3 items-stretch justify-center'
      : 'mt-6 w-full max-w-xl mx-auto flex flex-col sm:flex-row gap-3 items-stretch justify-center';

  const tryMatchCountry = (input: string) => {
    if (!input || countries.length === 0) {
      setSelectedCountry('');
      setRegions(null);
      setSelectedLocation('');
      onChange?.(null, '');
      return;
    }
    const exact = countries.find((c) => c.name.toLowerCase() === input.trim().toLowerCase());
    const found = exact || countries.find((c) => c.name.toLowerCase().startsWith(input.trim().toLowerCase()));
    if (found) {
      setSelectedCountry(found.code);
      const r = regionsMap[found.code];
      if (r && r.length > 0) {
        setRegions(r.slice(0, 50));
        setSelectedLocation('');
      } else {
        setRegions(null);
        setSelectedLocation('');
      }
      return;
    }
    setSelectedCountry('');
    setRegions(null);
    setSelectedLocation('');
    onChange?.(null, '');
  };

  return (
    <div className={containerClass}>
      <div className="flex-1">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Country</label>
        <input
          value={countryInput}
          onChange={(e) => {
            setCountryInput(e.target.value);
            tryMatchCountry(e.target.value);
          }}
          onBlur={(e) => tryMatchCountry(e.target.value)}
          placeholder="Type country name"
          className="w-full rounded-md border py-2 px-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
        />
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location / Wetland</label>
        {regions ? (
          <div>
            <div className="max-h-48 overflow-auto grid grid-cols-2 gap-2">
              {regions.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedLocation(r)}
                  className={`text-left rounded-md border px-3 py-2 bg-white hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700 ${selectedLocation === r ? 'ring-2 ring-primary' : ''}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <input
            placeholder="Enter city or wetland"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full rounded-md border py-2 px-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        )}
      </div>
    </div>
  );
};

export default CountryLocationSelector;
