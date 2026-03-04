'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { services } from '@/data/services';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { LeadFormModal } from '@/components/LeadFormModal';

export default function ServicesIndexPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Header onOpenModal={() => setIsModalOpen(true)} />
      <main className="flex-grow">
        <Hero
          title="Elite Invisalign Treatments"
          subtitle="Customised clear aligner solutions for every clinical challenge, from complex bite issues to lifestyle-focused adult treatment."
          image="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2000&auto=format&fit=crop"
          showCta={false}
          showTrust={false}
        />
        <section className="section-padding">
          <div className="container-width">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map(service => (
                <Link key={service.id} href={`/services/${service.slug}/`} className="group flex gap-6 p-6 bg-white rounded-2xl border border-gray-100 hover:border-brand-300 hover:shadow-lg transition-all">
                  <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-xl font-display font-bold text-gray-900 group-hover:text-brand-600 mb-2">{service.title}</h2>
                    <p className="text-sm text-gray-600 mb-4 flex-grow">{service.description}</p>
                    <span className="text-brand-600 font-medium text-sm flex items-center">
                      View treatment <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
