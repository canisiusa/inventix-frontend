"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocalization } from '@/providers/localization-provider';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { changeLanguage, t, currentlang } = useLocalization();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: t.navbar.features, href: "#features" },
    { name: t.navbar.automation, href: "#automation" },
   /*  { name: t.navbar.mobile, href: "#mobile" },
    { name: t.navbar.analysis, href: "#analysis" }, */
    { name: t.navbar.pricing, href: "#pricing" },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 shadow-sm backdrop-blur-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="#" className="flex items-center">
              <div className="text-2xl font-bold text-primary-600">StockSense</div>
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage('fr').then(() => location.reload())}>
                  <span className={`${currentlang === 'fr' ? 'font-bold' : ''}`}>{t.lang.fr}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('en').then(() => location.reload())}>
                  <span className={`${currentlang === 'en' ? 'font-bold' : ''}`}>{t.lang.en}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="sm" onClick={() => router.push('/login')}>
              {t.navbar.login}
            </Button>
            <Button variant="default" size="sm" onClick={() => router.push('/register')}>
              {t.navbar.freeTrial}
            </Button>
          </div>
          
          <div className="md:hidden flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage('fr').then(() => location.reload())}>
                  <span className={`${currentlang === 'fr' ? 'font-bold' : ''}`}>{t.lang.fr}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('en').then(() => location.reload())}>
                  <span className={`${currentlang === 'en' ? 'font-bold' : ''}`}>{t.lang.en}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-3 space-x-3">
                <Button variant="outline" className="w-full" size="sm" onClick={() => router.push('/login')}>
                  {t.navbar.login}
                </Button>
                <Button variant="default" className="w-full" size="sm" onClick={() => router.push('/register')}>
                  {t.navbar.freeTrial}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
