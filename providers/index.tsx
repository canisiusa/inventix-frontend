"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./ThemeProvider";
import ReactQueryProvider from "./ReactQuery";
import { Container as PromiseModalContainer } from "react-modal-promise";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
            <PromiseModalContainer />
      
      <ReactQueryProvider>
        {children}
      </ReactQueryProvider>
    </ThemeProvider>
  </SessionProvider>;
}