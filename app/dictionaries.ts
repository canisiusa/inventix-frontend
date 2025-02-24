/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';

type Dictionaries = {
  [key in LanguageCode]: () => Promise<Record<string, any>>;
};

const dictionaries: Dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  fr: () => import('./dictionaries/fr.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  // Vérifiez si la locale est une clé valide de dictionaries
  if (!(locale in dictionaries)) {
    // console.warn(`Locale '${locale}' not supported, falling back to 'en'`);
    locale = 'en'; // Utilisez 'en' comme locale par défaut
  }

  const loadDictionary = dictionaries[locale as keyof Dictionaries];
  return loadDictionary();
};
