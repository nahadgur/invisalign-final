'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, MapPin, Star, Clock, Shield, Award, Users } from 'lucide-react';
import { services, getServiceBySlug } from '@/data/services';
import { LOCATIONS, getCityBySlug } from '@/data/locations';
import { FAQS_SERVICES } from '@/data/site';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroLeadForm } from '@/components/HeroLeadForm';
import { FAQ } from '@/components/FAQ';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Testimonials } from '@/components/Testimonials';
import { LeadFormModal } from '@/components/LeadFormModal';

export default function ServiceLocationPage({ params }: { params: { serviceSlug: string; locationSlug: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const service = getServiceBySlug(params.serviceSlug);
  const cityName = getCityBySlug(params.locationSlug);
  if (!service || !cityName) notFound();

  const relatedServices = services.filter(s => s.id !== service.id).slice(0, 3);
  const allCities = Object.values(LOCATIONS).flat();

  const benefits = [
    { icon: <Award className="w-6 h-6" />, title: 'Platinum Providers', desc: 'Only the top 1% of UK Invisalign specialists' },
    { icon: <Clock className="w-6 h-6" />, title: 'Fast Track Consultations', desc: 'Priority appointments available within 7 days' },
    { icon: <Shield className="w-6 h-6" />, title: 'Guaranteed Results', desc: 'Treatment backed by thousands of successful cases' },
    { icon: <Users className="w-6 h-6" />, title: 'Expert Matching', desc: 'Personalised provider selection for your case' },
  ];

  const treatmentSteps = [
    'Free initial consultation with a vetted specialist',
    '3D digital scan and personalised treatment planning',
    'Receive your custom aligners manufactured to precision',
    'Regular progress monitoring and refinement if needed',
    'Achieve your perfect smile with permanent retention',
  ];

  return (
    <>
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Header onOpenModal={() => setIsModalOpen(true)} />
      <main className="flex-grow">

        {/* Split Hero Section with Inline Form — Garden Rooms pattern */}
        <section className="bg-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={service.image} alt="" className="w-full h-full object-cover opacity-50" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/70 to-gray-900/30" />
          </div>

          <div className="container-width py-12 md:py-20 relative z-10">
            <Breadcrumbs items={[
              { label: 'Treatments', href: '/services/' },
              { label: service.title, href: `/services/${service.slug}/` },
              { label: cityName }
            ]} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 px-3 py-1 rounded-full text-sm font-medium mb-6 border border-brand-500/30">
                  <MapPin className="w-4 h-4" /> Elite Providers in {cityName}
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
                  {service.title} in <span className="text-brand-400">{cityName}</span>
                </h1>

                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  {service.description} Connect with {cityName}&apos;s most experienced Platinum-tier Invisalign specialists.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    `Local ${cityName} experts`,
                    "Compare up to 3 free quotes",
                    "Platinum and Diamond providers only",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-brand-400 flex-shrink-0" />
                      <span className="text-lg">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex text-yellow-400">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <span>Trusted by patients in {cityName}</span>
                </div>
              </div>

              <div>
                <HeroLeadForm city={cityName} service={service.title} />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container-width py-16">
          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="bg-brand-100 p-2 rounded-lg text-brand-600">{benefit.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {/* Treatment Steps */}
              <div className="mb-12">
                <h2 className="text-3xl font-display font-bold text-gray-900 mb-6">
                  Your Treatment Journey in {cityName}
                </h2>
                <div className="space-y-5">
                  {treatmentSteps.map((step, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                      <div className="flex-shrink-0 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-sm">{i + 1}</div>
                      <p className="text-gray-700 font-medium pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose */}
              <div className="mb-12">
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">
                  Why Choose {service.title} in {cityName}?
                </h3>
                <div className="space-y-3">
                  {[
                    'Access to Platinum-certified providers with proven track records',
                    'State-of-the-art 3D scanning and ClinCheck visualisation technology',
                    `Convenient ${cityName} locations with flexible appointment times`,
                    'Comprehensive aftercare and retention planning included',
                  ].map((point, i) => (
                    <div key={i} className="flex items-start gap-3 bg-brand-50 p-4 rounded-xl border border-brand-100">
                      <CheckCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-800 font-medium text-sm">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {service.faqs.length > 0 && (
                <div className="mb-12">
                  <FAQ faqs={service.faqs} title={`${service.title} FAQs`} />
                </div>
              )}

              <div className="mt-12">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Patient Reviews</h2>
                <Testimonials limit={2} />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-28 space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <h3 className="text-lg font-display font-bold text-gray-900 mb-4">Other Treatments in {cityName}</h3>
                  <ul className="space-y-2 mb-8">
                    {services.filter(s => s.id !== service.id).map(s => (
                      <li key={s.id}>
                        <Link
                          href={`/services/${s.slug}/${params.locationSlug}/`}
                          className="block px-4 py-3 rounded-lg bg-gray-50 border border-gray-100 hover:border-brand-300 hover:bg-brand-50 text-gray-700 hover:text-brand-700 transition-all text-sm font-medium"
                        >
                          {s.title} in {cityName}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-lg font-display font-bold text-gray-900 mb-4">{service.title} Elsewhere</h3>
                  <ul className="space-y-2">
                    {allCities.filter(c => c !== cityName).slice(0, 5).map(city => {
                      const slug = city.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <li key={city}>
                          <Link
                            href={`/services/${service.slug}/${slug}/`}
                            className="block px-4 py-3 rounded-lg bg-gray-50 border border-gray-100 hover:border-brand-300 hover:bg-brand-50 text-gray-700 hover:text-brand-700 transition-all text-sm font-medium"
                          >
                            {service.title} in {city}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="bg-brand-900 text-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-lg font-display font-bold mb-4">Ready to start?</h3>
                  <p className="text-brand-100 mb-6 text-sm">
                    Get matched with the best {service.title.toLowerCase()} providers in {cityName}.
                  </p>
                  <button onClick={() => setIsModalOpen(true)} className="block w-full bg-white text-brand-900 text-center font-bold py-3 px-6 rounded-xl hover:bg-brand-50 transition-colors">
                    Get Free Quotes
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
