import React from 'react';
import { Smartphone, QrCode, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getDictionary } from '@/app/dictionaries';

const MobileSection = async () => {
  const t = await getDictionary();
  
  return (
    <section id="mobile" className="section-padding bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.mobile.title}</h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t.mobile.subtitle}
          </p>
          
          <div className="space-y-6 mb-8">
            <div className="flex gap-4">
              <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                <Smartphone size={20} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">{t.mobile.stockConsult.title}</h3>
                <p className="text-muted-foreground">
                  {t.mobile.stockConsult.description}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                <QrCode size={20} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">{t.mobile.scanning.title}</h3>
                <p className="text-muted-foreground">
                  {t.mobile.scanning.description}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                <Bell size={20} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">{t.mobile.notifications.title}</h3>
                <p className="text-muted-foreground">
                  {t.mobile.notifications.description}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="default">
              {t.mobile.downloadIOS}
            </Button>
            <Button size="lg" variant="outline">
              {t.mobile.downloadAndroid}
            </Button>
          </div>
        </div>
        
        <div className="order-1 lg:order-2 relative flex justify-center">
          <div className="relative w-64 h-[500px]">
            <img 
              src="https://images.unsplash.com/photo-1601784551616-20c9e07e702c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=926&q=80" 
              alt="Application mobile StockSense" 
              className="rounded-[32px] shadow-2xl border-8 border-gray-800 w-full h-full object-cover"
            />
            <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-lg shadow-lg border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-1.5 rounded-full">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>
                <div>
                  <p className="text-xs font-medium">{t.mobile.notif.title}</p>
                  <p className="text-[10px] text-muted-foreground">{t.mobile.notif.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileSection;
