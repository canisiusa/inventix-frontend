import React from 'react';
import { Package, RefreshCw, Bell, Building2, Barcode, ArrowDownUp } from 'lucide-react';
import { getDictionary } from '@/app/dictionaries';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="feature-card">
      <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 text-primary-600">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const FeaturesSection = async () => {
  const t = await getDictionary();

  const features = [
    {
      icon: <Package size={24} />,
      title: t.features.productManagement.title,
      description: t.features.productManagement.description
    },
    {
      icon: <RefreshCw size={24} />,
      title: t.features.realTimeTracking.title,
      description: t.features.realTimeTracking.description
    },
    {
      icon: <Bell size={24} />,
      title: t.features.alertsHistory.title,
      description: t.features.alertsHistory.description
    },
    {
      icon: <Building2 size={24} />,
      title: t.features.multiWarehouse.title,
      description: t.features.multiWarehouse.description
    },
    {
      icon: <Barcode size={24} />,
      title: t.features.barcodes.title,
      description: t.features.barcodes.description
    },
    {
      icon: <ArrowDownUp size={24} />,
      title: t.features.stockMovements.title,
      description: t.features.stockMovements.description
    },
  ];

  return (
    <section id="features" className="section-padding bg-white">
      <h2 className="section-title">{t.features.title}</h2>
      <p className="section-subtitle">
        {t.features.subtitle}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
