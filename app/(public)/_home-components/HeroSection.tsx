import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Database, Shield } from "lucide-react";
import { getDictionary } from '@/app/dictionaries';

const HeroSection = async () => {
  const t = await getDictionary();

  return (
    <section className="pt-28 pb-20 md:pt-32 md:pb-24 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {t.hero.title.split(' ').slice(0, -1).join(' ')} <span className="gradient-text">{t.hero.title.split(' ').slice(-1)}</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group">
                {t.hero.demoButton}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline">
                {t.hero.trialButton}
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-primary-600 mr-2" />
                <span className="text-sm font-medium">{t.hero.security}</span>
              </div>
              <div className="flex items-center">
                <Database className="h-5 w-5 text-primary-600 mr-2" />
                <span className="text-sm font-medium">{t.hero.openAPI}</span>
              </div>
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-primary-600 mr-2" />
                <span className="text-sm font-medium">{t.hero.predictiveAnalysis}</span>
              </div>
            </div>
          </div>
          <div className="relative animate-fade-in">
            <div className="bg-white p-2 rounded-xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Plateforme StockSense"
                className="rounded-lg w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div>
                  <p className="text-sm font-medium">{t.hero.optimizedStock}</p>
                  <p className="text-xs text-muted-foreground">{t.hero.accuratePredictions}</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <div className="h-3 w-3 rounded-full bg-primary-500"></div>
                </div>
                <div>
                  <p className="text-sm font-medium">{t.hero.efficiency}</p>
                  <p className="text-xs text-muted-foreground">{t.hero.errorReduction}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
