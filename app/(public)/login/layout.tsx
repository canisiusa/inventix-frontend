import { authOptions } from '@/lib/config/nextauth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

export default async function LoginLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/overview");
  }

  return <>
    {children}
  </>;
}
