'use client';

import { useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Clock, Shield, Star, Search } from 'lucide-react';
import { services, getServiceBySlug } from '@/data/services';
import { LOCATIONS, toSlug } from '@/data/locations';
import { FAQS_SERVICES } from '@/data/site';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { TrustBadges } from '@/components/TrustBadges';
import { Testimonials } from '@/components/Testimonials';
import { FAQ } from '@/components/FAQ';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { LeadFormModal } from '@/components/LeadFormModal';
import { HeroLeadForm } from '@/components/HeroLeadForm';

export default function ServicePage({ params }: { params: { serviceSlug: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const service = getServiceBySlug(params.serviceSlug);
  if (!service) notFound();

  const relatedServices = services.filter(s => s.id !== service.id).slice(0, 3);

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
        <Hero title={service.title} subtitle={service.description} image={service.image} onOpenModal={() => setIsModalOpen(true)} />
        <TrustBadges />

        <div className="container-width py-12">
          <Breadcrumbs items={[{ label: 'Treatments', href: '/services/' }, { label: service.title }]} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article className="prose prose-lg max-w-none text-gray-600 mb-12">
                <h2 className="text-3xl font-display font-bold text-gray-900 mb-6">{service.title} Across the UK</h2>
                <p className="mb-6 text-lg leading-relaxed">{service.description} Our Platinum and Diamond providers have the experience and technology to deliver exceptional results for this treatment type.</p>
              </article>

              {/* Search cities */}
              <div className="mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search your city or town..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* City Grid by Region */}
              <div className="mb-12 space-y-10">
                {Object.entries(filteredLocations).map(([region, cities]) => (
                  <div key={region}>
                    <h3 className="text-xl font-display font-bold text-gray-900 mb-4">{region}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {cities.map(city => (
                        <Link
                          key={city}
                          href={`/services/${service.slug}/${toSlug(city)}/`}
                          className="group flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-brand-50 hover:shadow-md transition-all border border-gray-100 hover:border-brand-200"
                        >
                          <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0" />
                          <span className="font-medium text-gray-700 group-hover:text-brand-700 text-sm">{city}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {service.faqs.length > 0 && (
                <div className="mb-12">
                  <FAQ faqs={service.faqs} />
                </div>
              )}

              <div className="mb-12">
                <FAQ faqs={FAQS_SERVICES} title="General Invisalign FAQs" />
              </div>

              <div className="mt-12">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">What Patients Say</h2>
                <Testimonials limit={2} />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-28 space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <h3 className="text-lg font-display font-bold text-gray-900 mb-4">Get Matched for {service.title}</h3>
                  <p className="text-gray-600 mb-6 text-sm">Free, no-obligation match with Platinum providers.</p>
                  <button onClick={() => setIsModalOpen(true)} className="block w-full btn-primary text-center">Find a Provider</button>
                  <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                    {[
                      { icon: <Clock className="w-4 h-4 text-brand-500" />, text: "Consultations available this week" },
                      { icon: <Shield className="w-4 h-4 text-brand-500" />, text: "Platinum & Diamond providers only" },
                      { icon: <Star className="w-4 h-4 text-brand-500" />, text: "4.95 average rating" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="bg-brand-100 p-1.5 rounded-full">{item.icon}</div>
                        <span className="text-sm font-medium text-gray-700">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Related Treatments */}
          <div className="mt-20 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-8">Other Treatments</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedServices.map(rs => (
                <Link key={rs.id} href={`/services/${rs.slug}/`} className="block group bg-white rounded-xl border border-gray-200 hover:border-brand-500 hover:shadow-md transition-all overflow-hidden">
                  <div className="h-40 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={rs.image} alt={rs.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-bold text-gray-900 group-hover:text-brand-600 mb-1">{rs.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{rs.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
