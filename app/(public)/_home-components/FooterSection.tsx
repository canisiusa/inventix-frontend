import React from 'react';
import { Button } from "@/components/ui/button";
import { getDictionary } from '@/app/dictionaries';

const FooterSection = async () => {
  const t = await getDictionary()
  
  return (
    <footer className="bg-primary-900 text-white">
      <div className="section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.footer.readyText}</h2>
            <p className="text-primary-100 text-lg mb-8">
              {t.footer.joinText}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-primary-900 hover:bg-primary-100">
                {t.footer.trialCta}
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-primary-800">
                {t.footer.demoCta}
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1523289333742-be1143f6b766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
              alt="Entrepôt moderne" 
              className="rounded-lg"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 border-t border-primary-800">
          <div>
            <div className="text-2xl font-bold mb-4">StockSense</div>
            <p className="text-primary-200 mb-4">
              {t.footer.description}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-200 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
              <a href="#" className="text-primary-200 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-primary-200 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="text-primary-200 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.footer.product}</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-primary-200 hover:text-white">{t.navbar.features}</a></li>
              <li><a href="#automation" className="text-primary-200 hover:text-white">{t.navbar.automation}</a></li>
              <li><a href="#mobile" className="text-primary-200 hover:text-white">{t.navbar.mobile}</a></li>
              <li><a href="#analysis" className="text-primary-200 hover:text-white">{t.navbar.analysis}</a></li>
              <li><a href="#pricing" className="text-primary-200 hover:text-white">{t.navbar.pricing}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.footer.resources}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-200 hover:text-white">{t.footer.resourceLinks.helpCenter}</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white">{t.footer.resourceLinks.apiDocs}</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white">{t.footer.resourceLinks.blog}</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white">{t.footer.resourceLinks.webinars}</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white">{t.footer.resourceLinks.caseStudies}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.footer.company}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-200 hover:text-white">{t.footer.companyLinks.about}</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white">{t.footer.companyLinks.careers}</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white">{t.footer.companyLinks.contact}</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white">{t.footer.companyLinks.legal}</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white">{t.footer.companyLinks.privacy}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-primary-800 text-primary-300 text-sm">
          <p>{t.footer.copyright.replace('{year}', new Date().getFullYear().toString())}</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
