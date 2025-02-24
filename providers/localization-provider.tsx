/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { DEFAULT_LANGUAGE } from '@/lib/config/localization.config';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type LocalizationContextType = {
  currentlang: LanguageCode;
  t: Record<string, any>;
};

const LocalizationContext = createContext<LocalizationContextType>({
  currentlang: DEFAULT_LANGUAGE,
  t: {}
});

export function LocalizationProvider({
  children,
  dict,
  lang
}: {
  children: ReactNode;
  dict: Record<string, any>;
  lang: LanguageCode;
}) {
  const [currentlang, setcurrentlang] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [dictionary, setDictionary] = useState<Record<string, any>>(dict);

  useEffect(() => {
    setDictionary(dict);
  }, [dict]);

  useEffect(() => {
    setcurrentlang(lang);
  }, [lang])

  return (
    <LocalizationContext.Provider value={{ currentlang, t:dictionary }}>
      {children}
    </LocalizationContext.Provider>
  );
}

// Hook personnalisé pour accéder au contexte de localisation.
export const useLocalization = () => useContext(LocalizationContext);
