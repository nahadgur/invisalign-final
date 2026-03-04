'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Search } from 'lucide-react';
import { LOCATIONS, toSlug } from '@/data/locations';
import { FAQS_LOCATION } from '@/data/site';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { FAQ } from '@/components/FAQ';
import { LeadFormModal } from '@/components/LeadFormModal';

export default function LocationIndexPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLocations = useMemo(() => {
    if (!searchQuery) return LOCATIONS;
    const result: Record<string, string[]> = {};
    Object.entries(LOCATIONS).forEach(([region, cities]) => {
      const filtered = cities.filter(city => city.toLowerCase().includes(searchQuery.toLowerCase()));
      if (filtered.length > 0) result[region] = filtered;
    });
    return result;
  }, [searchQuery]);

  return (
    <>
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Header onOpenModal={() => setIsModalOpen(true)} />
      <main className="flex-grow">
        <Hero
          title="Find Your Local Platinum Provider"
          subtitle="Access the UK's most exclusive network of clear aligner experts. Vetted for quality, verified for results."
          image="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2000&auto=format&fit=crop"
          onOpenModal={() => setIsModalOpen(true)}
        />

        <section className="section-padding">
          <div className="container-width">
            {/* Search */}
            <div className="max-w-xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your city or town..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Regions + City Grids */}
            <div className="space-y-12">
              {Object.entries(filteredLocations).map(([region, cities]) => (
                <div key={region}>
                  <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">{region}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {cities.map(city => (
                      <Link
                        key={city}
                        href={`/location/${toSlug(city)}/`}
                        className="group block bg-gray-50 hover:bg-brand-50 border border-gray-100 hover:border-brand-200 rounded-xl p-4 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0" />
                          <span className="font-medium text-gray-700 group-hover:text-brand-700 text-sm">{city}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-gray-50">
          <div className="container-width max-w-3xl">
            <FAQ faqs={FAQS_LOCATION} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
