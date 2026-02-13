'use client';

import React, { useState, useMemo } from 'react';
import { Globe, ArrowUpRight, ChevronUp } from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import LeadFormModal from '@/components/LeadFormModal';
import { LOCATIONS, SERVICES, FAQS_LOCATION } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const SERVICE_IMAGES: Record<string, string> = {
  crossbite: 'https://images.unsplash.com/photo-1581939511501-4ec557ff0957?q=80&w=1170&auto=format&fit=crop',
  adults: 'https://images.unsplash.com/photo-1489278353717-f64c6ee8a4d2?q=80&w=1170&auto=format&fit=crop',
  gaps: 'https://images.pexels.com/photos/6502308/pexels-photo-6502308.jpeg',
  overbite: 'https://images.pexels.com/photos/15073697/pexels-photo-15073697.jpeg',
  crowded: 'https://images.unsplash.com/photo-1660732205543-dfef1a8761f7?q=80&w=1170&auto=format&fit=crop',
  underbite: 'https://images.pexels.com/photos/3762402/pexels-photo-3762402.jpeg'
};

export default function ServiceCitiesPage({ params }: { params: { service: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const service = SERVICES.find(s => s.id === params.service);
  if (!service) notFound();

  const heroImage = SERVICE_IMAGES[params.service] || SERVICE_IMAGES.adults;

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

  const filteredLocations = useMemo(() => {
    if (!searchQuery) return LOCATIONS;
    const result: Record<string, string[]> = {};
    Object.entries(LOCATIONS).forEach(([region, cities]) => {
      const filtered = cities.filter(city => city.toLowerCase().includes(searchQuery.toLowerCase()));
      if (filtered.length > 0) result[region] = filtered;
    });
    return result;
  }, [searchQuery]);

  const allCities = Object.values(LOCATIONS).flat();

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

      {/* Hero Section with Image */}
     <div className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24 min-h-[640px] sm:min-h-[680px] md:min-h-[720px]">
  <div className="absolute inset-0 z-0 relative">
    <Image
      src={heroImage}
      alt={service.title}
      fill
      priority
      sizes="100vw"
      className="object-cover object-center opacity-40"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/60 to-slate-950"></div>
  </div>
</div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-sm text-slate-400 mb-4 backdrop-blur-sm">
              <Link href="/services" className="hover:text-sky-400 transition-colors">All Services</Link>
              <span>/</span>
              <span className="text-white">{service.title}</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black text-white leading-tight tracking-tight">
              {service.title} in <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">{allCities.length}+ UK Locations</span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
              {service.desc} Find Platinum providers near you.
            </p>

            <div className="max-w-xl mx-auto relative mt-8 flex items-center">
              <Globe className="absolute left-6 text-slate-500 w-6 h-6 z-10" />
              <input 
                type="text" 
                placeholder="Search your city or town..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-5 pl-16 text-white focus:border-sky-500 outline-none transition-all shadow-2xl backdrop-blur-sm"
              />
            </div>
          </div>

          <div className="dark-card p-8 md:p-12 rounded-[2.5rem] border border-sky-500/20 bg-sky-500/5 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white">Ready to Start Your Treatment?</h2>
                <p className="text-slate-400 max-w-xl font-medium">
                  Connect with elite Platinum providers specializing in {service.title.toLowerCase()}.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="px-10 py-5 bg-sky-500 text-white font-black rounded-full shadow-2xl hover:scale-105 transition-all whitespace-nowrap"
              >
                Get Matched
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cities Grid */}
      <div className="pb-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-16">
            {Object.entries(filteredLocations).map(([region, cities]) => (
              <div key={region}>
                <h2 className="text-2xl font-black text-white mb-6 px-2">{region}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {cities.map(city => {
                    const citySlug = city.toLowerCase().replace(/\s+/g, '-');
                    return (
                      <Link 
                        key={city}
                        href={`/services/${params.service}/${citySlug}`}
                        className="text-left px-4 py-3.5 rounded-2xl border transition-all font-bold text-xs flex items-center justify-between group bg-slate-900/40 border-white/5 text-slate-400 hover:border-sky-500/30 hover:text-white hover:bg-slate-800/40"
                      >
                        <span>{city}</span>
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <FAQSection faqs={FAQS_LOCATION} />
      </div>

      <Footer />
    </div>
  );
}
