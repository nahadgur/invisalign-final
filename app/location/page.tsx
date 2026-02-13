'use client';

import React, { useState, useMemo } from 'react';
import { Globe, ArrowUpRight, ChevronUp } from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import LeadFormModal from '@/components/LeadFormModal';
import { LOCATIONS, FAQS_LOCATION } from '@/lib/data';
import Link from 'next/link';

export default function LocationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

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

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredLocations = useMemo(() => {
    if (!searchQuery) return LOCATIONS;
    const result: Record<string, string[]> = {};
    Object.entries(LOCATIONS).forEach(([region, cities]) => {
      const filtered = cities.filter((city) =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) result[region] = filtered;
    });
    return result;
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Navigation onOpenModal={() => setIsModalOpen(true)} />

      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 left-6 z-[70] w-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 text-slate-400 rounded-full flex items-center justify-center transition-all duration-500 ${
          showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      <div className="pt-32 pb-24 min-h-screen bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-7xl font-black text-white leading-tight tracking-tight">
              Find Your Local{' '}
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                Platinum Provider
              </span>
            </h1>

            <p className="text-xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
              {selectedCity
                ? `Elite Invisalign Specialists in ${selectedCity} are ready to transform your smile.`
                : "Access the UK's most exclusive network of clear aligner experts. Vetted for quality, verified for results."}
            </p>

            <div className="max-w-xl mx-auto relative mt-8 flex items-center">
              <Globe className="absolute left-6 text-slate-500 w-6 h-6 z-10" />
              <input
                type="text"
                placeholder="Search your city or town..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-5 pl-16 text-white focus:border-sky-500 outline-none transition-all shadow-2xl"
              />
            </div>
          </div>

          {selectedCity && (
            <div className="dark-card p-8 md:p-12 rounded-[2.5rem] border border-sky-500/20 bg-sky-500/5 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white">
                  Start your journey in {selectedCity}
                </h2>
                <p className="text-slate-400 max-w-xl font-medium">
                  Top-tier providers in the area are currently accepting new patients for consultations.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-10 py-5 bg-sky-500 text-white font-black rounded-full shadow-2xl hover:scale-105 transition-all"
              >
                Book {selectedCity} Consultation
              </button>
            </div>
          )}

          <div className="flex flex-col gap-16 pt-8">
            {Object.entries(filteredLocations).map(([region, cities]) => (
              <div key={region}>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-6 px-2">
                  {region}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {cities.map((city) => {
                    const citySlug = city.toLowerCase().replace(/\s+/g, '-');

                    return (
                      <Link
  key={city}
  href={`/location/${citySlug}`}
  className={`text-left px-6 py-5 rounded-2xl border transition-all font-bold text-base sm:text-lg leading-relaxed flex items-center justify-between group ${
    selectedCity === city
      ? 'bg-sky-500/20 border-sky-500 text-sky-400 shadow-lg shadow-sky-500/5'
      : 'bg-slate-900/40 border-white/5 text-slate-300 hover:border-sky-500/30 hover:text-white hover:bg-slate-800/40'
  }`}
  onClick={(e) => {
    if (selectedCity === city) {
      e.preventDefault();
      handleCityClick(city);
    }
  }}
>
  <span className="leading-snug">{city}</span>
  <ArrowUpRight
    className={`w-5 h-5 transition-all ${
      selectedCity === city
        ? 'opacity-100'
        : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
    }`}
  />
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
