import React from 'react';
import { Shield, Users, History } from 'lucide-react';
import { getDictionary } from '@/app/dictionaries';

const SecurityFeature = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="h-14 w-14 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-primary-600">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const SecuritySection = async () => {
  const t = await getDictionary();
  
  return (
    <section id="security" className="section-padding bg-gradient-to-b from-primary-50 to-white">
      <h2 className="section-title">{t.security.title}</h2>
      <p className="section-subtitle">
        {t.security.subtitle}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SecurityFeature 
          icon={<Users size={28} />}
          title={t.security.roleManagement.title}
          description={t.security.roleManagement.description}
        />
        
        <SecurityFeature 
          icon={<History size={28} />}
          title={t.security.auditHistory.title}
          description={t.security.auditHistory.description}
        />
        
        <SecurityFeature 
          icon={<Shield size={28} />}
          title={t.security.authentication.title}
          description={t.security.authentication.description}
        />
      </div>
    </section>
  );
};

export default SecuritySection;
