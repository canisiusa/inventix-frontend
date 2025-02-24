"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes avant un refetch automatique
       // cacheTime: 1000 * 60 * 10, // 10 minutes en cache avant suppression
        refetchOnWindowFocus: false, // Pas de refetch automatique quand l'onglet est actif
        retry: 2, // Nombre de tentatives en cas d’échec
      },
    },
  }));

  return <QueryClientProvider client={queryClient}>
    {children}
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>;
};

export default ReactQueryProvider;
