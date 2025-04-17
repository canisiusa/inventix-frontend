import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getIpLocationData } from './lib/utils';
import { cookies } from 'next/headers';
import { DEFAULT_LANGUAGE } from './constants/utils';

async function getLocale(): Promise<string | undefined> {
  const cookieStore = cookies();
  const locale = (await cookieStore).get('locale')?.value;
  if (locale) return locale;

  const resp = await getIpLocationData();

  const languages = resp?.location.languages.map((lang) => lang.code);
  if (languages && languages.length > 0) return languages[0];
  else return DEFAULT_LANGUAGE;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Ignorer certains fichiers spécifiques
  const ignoredPaths = ['/manifest.json', '/favicon.ico', '/images'];
  const publicFileExtensions = ['.json', '.ico', '.png', '.jpg', '.txt', '.css', '.js', '.svg'];

  if (
    ignoredPaths.some((ignorePath) => pathname.startsWith(ignorePath)) ||
    publicFileExtensions.some((ext) => pathname.endsWith(ext)) ||
    pathname.startsWith('/_next/') || // Ignorer les fichiers liés à Next.js (_next)
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // Vérifier si une locale est manquante dans le cookie
  const locale = await getLocale(); // Déterminez la locale en fonction des préférences utilisateur
  // Définir la locale dans un cookie
  const response = NextResponse.next();
  response.cookies.set('locale', locale || 'en', {
    path: '/',
    maxAge: 60 * 60 * 24 // 24 heures
  });

  return response;
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
