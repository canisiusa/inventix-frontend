import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getDictionary } from '@/app/dictionaries';

const FAQSection = async () => {
  const t = await getDictionary()
  
  return (
    <section className="section-padding bg-gradient-to-b from-blue-50 to-white">
      <h2 className="section-title">{t.faq.title}</h2>
      <p className="section-subtitle">
        {t.faq.subtitle}
      </p>
      
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {t.faq.questions.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
