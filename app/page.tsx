import React from 'react';
import Navbar from './(public)/_home-components/Navbar';
import HeroSection from './(public)/_home-components/HeroSection';
import FeaturesSection from './(public)/_home-components/FeaturesSection';
import SecuritySection from './(public)/_home-components/SecuritySection';
import DashboardSection from './(public)/_home-components/DashboardSection';
import FAQSection from './(public)/_home-components/FAQSection';
import PricingSection from './(public)/_home-components/PricingSection';
import FooterSection from './(public)/_home-components/FooterSection';
import "./page.css"
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/config/nextauth';
import { redirect } from 'next/navigation';
import AutomationSection from './(public)/_home-components/AutomationSection';
const Home = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/overview")
  }
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <AutomationSection /> 
     {/*  <MobileSection /> */}
      <SecuritySection />
      <DashboardSection />
      {/* <AnalysisSection /> */}
      {/* <TestimonialsSection /> */}
      <FAQSection />
      <PricingSection />
      <FooterSection />
    </div>
  );
};

export default Home;
