'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { services } from '@/data/services';
import { getCityBySlug, toSlug } from '@/data/locations';
import { FAQS_SERVICES } from '@/data/site';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FAQ } from '@/components/FAQ';
import { HeroLeadForm } from '@/components/HeroLeadForm';
import { LeadFormModal } from '@/components/LeadFormModal';

export default function CityPage({ params }: { params: { city: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cityName = getCityBySlug(params.city);
  if (!cityName) notFound();

  return (
    <>
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Header onOpenModal={() => setIsModalOpen(true)} />
      <main className="flex-grow">

        {/* Hero with form */}
        <section className="bg-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-900/30 via-gray-900/0 to-transparent pointer-events-none" />
          <div className="container-width py-12 md:py-20 relative z-10">
            <Breadcrumbs items={[{ label: 'Locations', href: '/location/' }, { label: cityName }]} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 px-3 py-1 rounded-full text-sm font-medium mb-6 border border-brand-500/30">
                  <MapPin className="w-4 h-4" /> Elite Platinum Providers Available
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
                  Invisalign in <span className="text-brand-400">{cityName}</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Access {cityName}&apos;s most experienced Invisalign specialists. Choose from our comprehensive treatment options below.
                </p>
              </div>
              <div>
                <HeroLeadForm city={cityName} />
              </div>
            </div>
          </div>
        </section>

        <div className="container-width py-16">
          {/* Services grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Available Treatments in {cityName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}/${params.city}/`}
                  className="block group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="h-40 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-display font-bold text-gray-900 group-hover:text-brand-600 mb-2">
                      {service.title} in {cityName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{service.description}</p>
                    <span className="text-brand-600 font-medium text-sm flex items-center">
                      Get free quotes <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mb-16">
            <FAQ faqs={FAQS_SERVICES} title={`Invisalign FAQs — ${cityName}`} />
          </div>

          {/* CTA */}
          <div className="bg-brand-50 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-900 mb-4">
              Live in {cityName}?
            </h2>
            <p className="text-brand-700 mb-8 max-w-2xl mx-auto">
              Get matched with Platinum Invisalign providers in the {cityName} area. It takes less than 2 minutes.
            </p>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary text-lg !px-8 !py-4">Find Local Providers</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
