'use client';
import { DEFAULT_LANGUAGE } from '@/constants/utils';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type LocalizationContextType = {
  currentlang: LanguageCode;
  t: Translations;
  changeLanguage: (newLang: LanguageCode) => Promise<void>
};

const LocalizationContext = createContext<LocalizationContextType>({
  currentlang: DEFAULT_LANGUAGE,
  t: {} as Translations,
  changeLanguage: async () => { }
});

export function LocalizationProvider({
  children,
  dict,
  lang
}: {
  children: ReactNode;
  dict: Translations;
  lang: LanguageCode;
}) {
  const [currentlang, setcurrentlang] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [dictionary, setDictionary] = useState<Translations>(dict);

  useEffect(() => {
    setDictionary(dict);
  }, [dict]);

  useEffect(() => {
    setcurrentlang(lang);
  }, [lang])

  // Fonction pour changer la langue et mettre à jour le dictionnaire.
  const changeLanguage = async (newLang: LanguageCode) => {
    try {
      setcurrentlang(newLang);
      import(`@/app/dictionaries/${newLang}.json`)
        .then((module) => {
          setDictionary(module.default);
        })
        .catch((error) => {
          console.error(`Error loading dictionary for language ${newLang}:`, error);
        });
      const response = await fetch(`/api/locale`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ locale: newLang }),
      })
      if (!response.ok) {
        throw new Error('Failed to change language');
      }
    } catch {
     //
    }
  };

  return (
    <LocalizationContext.Provider value={{ currentlang, t: dictionary, changeLanguage }}>
      {children}
    </LocalizationContext.Provider>
  );
}

// Hook personnalisé pour accéder au contexte de localisation.
export const useLocalization = () => useContext(LocalizationContext);
