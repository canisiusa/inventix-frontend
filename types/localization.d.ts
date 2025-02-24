type LanguageCode = 'fr' | 'en';

type Language = {
    code: LanguageCode;
    name: string;
};

type CountryConfig = {
    language: Language;
};