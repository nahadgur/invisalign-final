'use client';

import React, { useState } from 'react';
import { Users, Sparkles, Shield, Medal, Globe, User, ArrowUpRight, ChevronUp, MapPin } from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import LeadFormModal from '@/components/LeadFormModal';
import HeroLeadForm from '@/components/HeroLeadForm';
import { SERVICES, LOCATIONS, FAQS_SERVICES } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function CityServicesPage({ params }: { params: { city: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const allCities = Object.values(LOCATIONS).flat();
  const cityName = allCities.find(city =>
    city.toLowerCase().replace(/\s+/g, '-') === params.city
  );

  if (!cityName) notFound();

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

      {/* Hero */}
      <div className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24 min-h-[640px] bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-900/20 via-slate-950/0 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-sm text-slate-400 mb-8">
            <Link href="/location" className="hover:text-sky-400 transition-colors">All Locations</Link>
            <span>/</span>
            <span className="text-white">{cityName}</span>
          </div>

          {/* Two-column hero */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 rounded-full border border-sky-500/20 text-sm text-sky-400">
                <MapPin className="w-4 h-4" />
                <span>Elite Platinum Providers Available</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                Invisalign in <span className="text-sky-400 italic">{cityName}</span>
              </h1>

              <p className="text-xl text-slate-400 font-medium leading-relaxed">
                Access {cityName}&apos;s most experienced Invisalign specialists. Choose from our comprehensive treatment options below.
              </p>
            </div>

            <div>
              <HeroLeadForm city={cityName} />
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="pb-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 space-y-16">
          <div>
            <h2 className="text-3xl font-black text-white mb-8 text-center">
              Available Treatments in {cityName}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicesWithIcons.map((service) => {
                const citySlug = params.city;
                return (
                  <Link
                    key={service.id}
                    href={`/services/${service.id}/${citySlug}`}
                    className="group dark-card p-10 rounded-[2.5rem] border border-white/5 hover:border-sky-500/30 transition-all flex flex-col shadow-xl"
                  >
                    <div className={`mb-6 p-4 rounded-2xl bg-${service.color}-500/10 text-${service.color}-400 inline-flex self-start`}>
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4 group-hover:text-sky-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-slate-400 font-medium mb-8 flex-1">{service.desc}</p>
                    <div className="flex items-center gap-2 text-sky-400 font-black uppercase tracking-widest text-[10px]">
                      View Details <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <FAQSection faqs={FAQS_SERVICES} />
      </div>

      <Footer />
    </div>
  );
}
