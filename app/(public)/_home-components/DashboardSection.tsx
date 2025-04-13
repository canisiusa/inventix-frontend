import React from 'react';
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, TrendingUp } from 'lucide-react';
import { getDictionary } from '@/app/dictionaries';

const DashboardSection = async () => {
  const t = await getDictionary()
  
  return (
    <section className="section-padding bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.dashboard.title}</h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t.dashboard.subtitle}
          </p>
          
          <div className="space-y-6 mb-8">
            <div className="flex gap-4">
              <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">{t.dashboard.realTimeView.title}</h3>
                <p className="text-muted-foreground">
                  {t.dashboard.realTimeView.description}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">{t.dashboard.export.title}</h3>
                <p className="text-muted-foreground">
                  {t.dashboard.export.description}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">{t.dashboard.keyIndicators.title}</h3>
                <p className="text-muted-foreground">
                  {t.dashboard.keyIndicators.description}
                </p>
              </div>
            </div>
          </div>
          
          <Button size="lg">
            {t.dashboard.viewDashboards}
          </Button>
        </div>
        
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
            alt="Tableau de bord StockSense" 
            className="rounded-lg shadow-xl border border-gray-200"
          />
          <div className="absolute -top-4 -left-4 bg-white p-3 rounded-lg shadow-lg border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-1.5 rounded-full">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
              <div>
                <p className="text-xs font-medium">{t.dashboard.salesIncrease}</p>
                <p className="text-[10px] text-muted-foreground">{t.dashboard.thisMonth}</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-lg shadow-lg border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="bg-primary-100 p-1.5 rounded-full">
                <div className="h-2 w-2 rounded-full bg-primary-600"></div>
              </div>
              <div>
                <p className="text-xs font-medium">{t.dashboard.optimalStock}</p>
                <p className="text-[10px] text-muted-foreground">{t.dashboard.productPercentage}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
