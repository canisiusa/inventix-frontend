import React from 'react';
import { Bot, Wifi, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from '@/app/dictionaries';

const AutomationSection = async () => {
  const t = await getDictionary();
  
  return (
    <section id="automation" className="section-padding bg-gradient-to-b from-white to-blue-50">
      <h2 className="section-title">{t.automation.title}</h2>
      <p className="section-subtitle">
        {t.automation.subtitle}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="card-gradient">
          <CardHeader className="pb-2">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 text-primary-600">
              <Bot size={24} />
            </div>
            <CardTitle>{t.automation.autoOrders.title}</CardTitle>
            <CardDescription>
              {t.automation.autoOrders.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t.automation.autoOrders.description}
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                <span className="text-sm">{t.automation.autoOrders.feature1}</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                <span className="text-sm">{t.automation.autoOrders.feature2}</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                <span className="text-sm">{t.automation.autoOrders.feature3}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="card-gradient">
          <CardHeader className="pb-2">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 text-primary-600">
              <Wifi size={24} />
            </div>
            <CardTitle>{t.automation.integrations.title}</CardTitle>
            <CardDescription>
              {t.automation.integrations.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t.automation.integrations.description}
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                <span className="text-sm">{t.automation.integrations.feature1}</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                <span className="text-sm">{t.automation.integrations.feature2}</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                <span className="text-sm">{t.automation.integrations.feature3}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="card-gradient">
          <CardHeader className="pb-2">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 text-primary-600">
              <Zap size={24} />
            </div>
            <CardTitle>{t.automation.api.title}</CardTitle>
            <CardDescription>
              {t.automation.api.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t.automation.api.description}
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                <span className="text-sm">{t.automation.api.feature1}</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                <span className="text-sm">{t.automation.api.feature2}</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                <span className="text-sm">{t.automation.api.feature3}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AutomationSection;
