'use client';

import React, { useState } from 'react';
import { Users, Sparkles, Shield, Medal, Globe, User, ArrowUpRight, ChevronUp } from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import LeadFormModal from '@/components/LeadFormModal';
import { SERVICES, FAQS_SERVICES } from '@/lib/data';

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setShowScrollTop(scrollPos / height > 0.3);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const servicesWithIcons = SERVICES.map(service => ({
    ...service,
    icon: service.id === 'crowded' ? <Users className="w-8 h-8" /> :
          service.id === 'gaps' ? <Sparkles className="w-8 h-8" /> :
          service.id === 'overbite' ? <Shield className="w-8 h-8" /> :
          service.id === 'underbite' ? <Medal className="w-8 h-8" /> :
          service.id === 'crossbite' ? <Globe className="w-8 h-8" /> :
          <User className="w-8 h-8" />
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Navigation onOpenModal={() => setIsModalOpen(true)} />
      
      <button 
        onClick={scrollToTop} 
        className={`fixed bottom-6 left-6 z-[70] w-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 text-slate-400 rounded-full flex items-center justify-center transition-all duration-500 ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      <div className="pt-32 pb-24 min-h-screen bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 space-y-16">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-7xl font-black text-white leading-tight">
              Elite Invisalign <span className="text-sky-400 italic">Treatments</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
              Customized clear aligner solutions for every clinical challenge, from complex bite issues to lifestyle-focused adult treatment.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesWithIcons.map((service) => (
              <div key={service.id} className="group dark-card p-10 rounded-[2.5rem] border border-white/5 hover:border-sky-500/30 transition-all flex flex-col shadow-xl">
                <div className={`mb-6 p-4 rounded-2xl bg-${service.color}-500/10 text-${service.color}-400 inline-flex self-start`}>
                  {service.icon}
                </div>
                <h2 className="text-2xl font-black text-white mb-4 group-hover:text-sky-400 transition-colors">
                  {service.title}
                </h2>
                <p className="text-slate-400 font-medium mb-8 flex-1">{service.desc}</p>
                <button 
                  onClick={() => setIsModalOpen(true)} 
                  className="flex items-center gap-2 text-sky-400 font-black uppercase tracking-widest text-[10px]"
                >
                  Inquire for Referral <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <FAQSection faqs={FAQS_SERVICES} />
      </div>

      <Footer />
    </div>
  );
}
