import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckIcon } from 'lucide-react';
import { getDictionary } from '@/app/dictionaries';

const PricingFeature = ({ included, text }: { included: boolean, text: string }) => {
  return (
    <div className="flex items-center mb-3">
      {included ? (
        <CheckIcon className="h-5 w-5 text-primary-600 mr-2 shrink-0" />
      ) : (
        <div className="h-5 w-5 mr-2 shrink-0" />
      )}
      <span className={included ? "text-foreground" : "text-muted-foreground"}>{text}</span>
    </div>
  );
};

const PricingSection = async () => {
  const t = await getDictionary();

  return (
    <section id="pricing" className="section-padding bg-white">
      <h2 className="section-title">{t.pricing.title}</h2>
      <p className="section-subtitle">
        {t.pricing.subtitle}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="pricing-card">
          <h3 className="text-2xl font-bold mb-2">{t.pricing.standardPlan.title}</h3>
          <p className="text-muted-foreground mb-6">{t.pricing.standardPlan.description}</p>
          
          <div className="mb-6">
            <div className="flex items-end">
              <span className="text-4xl font-bold">{t.pricing.standardPlan.price}</span>
              <span className="text-muted-foreground ml-2">/ {t.pricing.userMonth}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{t.pricing.billedAnnually}</p>
          </div>
          
          <div className="mb-8">
            {t.pricing.standardPlan.features.map((feature, index) => (
              <PricingFeature key={index} included={true} text={feature} />
            ))}
          </div>
          
          <div className="mt-auto">
            <Button size="lg" className="w-full mb-3">
              {t.pricing.standardPlan.cta}
            </Button>
            <Button variant="outline" size="lg" className="w-full">
              {t.pricing.contactUs}
            </Button>
          </div>
        </div>
        
        <div className="pricing-card border-primary-200 bg-gradient-to-br from-white to-blue-50 relative">
          <div className="absolute top-0 right-0 bg-primary-600 text-white py-1 px-3 rounded-bl-lg rounded-tr-lg text-sm font-medium">
            {t.pricing.recommended}
          </div>
          
          <h3 className="text-2xl font-bold mb-2">{t.pricing.intelligencePlan.title}</h3>
          <p className="text-muted-foreground mb-6">{t.pricing.intelligencePlan.description}</p>
          
          <div className="mb-6">
            <div className="flex items-end">
              <span className="text-4xl font-bold">{t.pricing.intelligencePlan.price}</span>
              <span className="text-muted-foreground ml-2">/ {t.pricing.userMonth}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{t.pricing.billedAnnually}</p>
          </div>
          
          <div className="mb-8">
            {t.pricing.intelligencePlan.features.map((feature, index) => (
              <PricingFeature key={index} included={true} text={feature} />
            ))}
          </div>
          
          <div className="mt-auto">
            <Button size="lg" className="w-full mb-3" variant="default">
              {t.pricing.intelligencePlan.cta}
            </Button>
            <Button variant="outline" size="lg" className="w-full">
              {t.pricing.contactUs}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
