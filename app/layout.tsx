import type { Metadata } from "next";
import { Lexend_Deca, Noto_Sans, Plus_Jakarta_Sans, Raleway, Varela, Varta } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import { Toaster } from "@/components/ui/sonner";
import { LocalizationProvider } from "@/providers/localization-provider";
import { cookies } from "next/headers";
import { getDictionary } from "./dictionaries";

const mainFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "700", "500"],
});

export const metadata: Metadata = {
  title: "Inventix",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const locale = (await cookieStore).get('locale')?.value || 'en';

  const dict = await getDictionary(locale);
  return (
    <html lang="en">
      <body
        className={`${mainFont.className} antialiased`}
      >
        <Toaster richColors closeButton position="top-right" />
        <Providers>
          <LocalizationProvider dict={dict} lang={locale as LanguageCode}>
            {children}
          </LocalizationProvider>
        </Providers>
      </body>
    </html>
  );
}
