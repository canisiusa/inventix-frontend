/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { QuoteIcon } from 'lucide-react';
import { getDictionary } from '@/app/dictionaries';

const TestimonialsSection = async () => {
  const t = await getDictionary()
  
  const testimonials = [
    {
      quote: t.testimonials.quotes[0].quote,
      author: t.testimonials.quotes[0].author,
      position: t.testimonials.quotes[0].position,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    {
      quote: t.testimonials.quotes[1].quote,
      author: t.testimonials.quotes[1].author,
      position: t.testimonials.quotes[1].position,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    {
      quote: t.testimonials.quotes[2].quote,
      author: t.testimonials.quotes[2].author,
      position: t.testimonials.quotes[2].position,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80"
    },
  ];

  const companyLogos = [
    "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
  ];

  return (
    <section className="section-padding bg-white">
      <h2 className="section-title">{t.testimonials.title}</h2>
      <p className="section-subtitle">
        {t.testimonials.subtitle}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-start mb-4">
                <QuoteIcon className="h-8 w-8 text-primary-300" />
              </div>
              <p className="text-muted-foreground mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author} 
                  className="h-12 w-12 rounded-full object-cover mr-4" 
                />
                <div>
                  <h4 className="font-semibold">{testimonial.author}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-16">
        <p className="text-center text-muted-foreground mb-8">
          {t.testimonials.trustText}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {companyLogos.map((logo, index) => (
            <img 
              key={index} 
              src={logo} 
              alt="Client logo" 
              className="h-6 md:h-8 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300" 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
