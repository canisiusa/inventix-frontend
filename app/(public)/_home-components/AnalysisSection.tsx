import React from 'react';
import { BarChart3, BrainCircuit, LineChart, Users, Calculator, MessageSquareText, Bell } from 'lucide-react';
import { getDictionary } from '@/app/dictionaries';

const AnalysisFeature = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="feature-card hover:border-primary-200">
      <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 text-primary-600">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const AnalysisSection = async () => {
  const t = await getDictionary()
  
  return (
    <section id="analysis" className="section-padding bg-gradient-to-b from-white to-blue-50">
      <h2 className="section-title">{t.analysis.title}</h2>
      <p className="section-subtitle">
        {t.analysis.subtitle}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnalysisFeature 
          icon={<BarChart3 size={24} />}
          title={t.analysis.advancedStats.title}
          description={t.analysis.advancedStats.description}
        />
        
        <AnalysisFeature 
          icon={<BrainCircuit size={24} />}
          title={t.analysis.prediction.title}
          description={t.analysis.prediction.description}
        />
        
        <AnalysisFeature 
          icon={<Calculator size={24} />}
          title={t.analysis.costAnalysis.title}
          description={t.analysis.costAnalysis.description}
        />
        
        <AnalysisFeature 
          icon={<Users size={24} />}
          title={t.analysis.customerBehavior.title}
          description={t.analysis.customerBehavior.description}
        />
        
        <AnalysisFeature 
          icon={<LineChart size={24} />}
          title={t.analysis.dashboard.title}
          description={t.analysis.dashboard.description}
        />
        
        <AnalysisFeature 
          icon={<MessageSquareText size={24} />}
          title={t.analysis.chatbot.title}
          description={t.analysis.chatbot.description}
        />
      </div>
      
      <div className="mt-16 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 shrink-0">
            <Bell size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">{t.analysis.automation.title}</h3>
            <p className="text-lg text-muted-foreground">
              {t.analysis.automation.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisSection;
