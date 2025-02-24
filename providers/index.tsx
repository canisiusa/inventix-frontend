"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./ThemeProvider";
import ReactQueryProvider from "./ReactQuery";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ReactQueryProvider>
        {children}
      </ReactQueryProvider>
    </ThemeProvider>
  </SessionProvider>;
}