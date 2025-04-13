/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers';
import 'server-only';

type Dictionaries = {
  [key in LanguageCode]: () => Promise<Translations>;
};

const dictionaries: Dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default) as any,
  fr: () => import('./dictionaries/fr.json').then((module) => module.default) as any,
};

export const getDictionary = async (locale?: LanguageCode): Promise<Translations> => {
  // 1. Déterminer la locale à partir du paramètre ou du cookie
  let resolvedLocale = locale;

  if (!resolvedLocale) {
    const cookieStore =  await cookies();
    resolvedLocale = cookieStore.get('locale')?.value as LanguageCode;
  }

  // 2. Fallback à 'en' si la locale est absente ou non supportée
  const isSupported = resolvedLocale && resolvedLocale in dictionaries;
  const finalLocale: LanguageCode = isSupported ? resolvedLocale : 'en';

  // 3. Charger et retourner le dictionnaire correspondant
  return dictionaries[finalLocale as keyof Dictionaries]();
};
