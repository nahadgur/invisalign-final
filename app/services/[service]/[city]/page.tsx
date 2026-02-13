'use client';

import React, { useState } from 'react';
import { CheckCircle, Clock, Shield, Award, MapPin, ChevronUp, Users } from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import LeadFormModal from '@/components/LeadFormModal';
import { SERVICES, LOCATIONS, FAQS_SERVICES } from '@/lib/data';
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

export default function ServiceCityPage({ params }: { params: { service: string; city: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const service = SERVICES.find(s => s.id === params.service);

  const allCities = Object.values(LOCATIONS).flat();
  const cityName = allCities.find(city =>
    city.toLowerCase().replace(/\s+/g, '-') === params.city
  );

  if (!service || !cityName) notFound();

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

  const benefits = [
    { icon: <Award className="w-6 h-6" />, title: 'Platinum Providers', desc: 'Only the top 1% of UK Invisalign specialists' },
    { icon: <Clock className="w-6 h-6" />, title: 'Fast Track Consultations', desc: 'Priority appointments available within 7 days' },
    { icon: <Shield className="w-6 h-6" />, title: 'Guaranteed Results', desc: 'Treatment backed by thousands of successful cases' },
    { icon: <Users className="w-6 h-6" />, title: 'Expert Matching', desc: 'Personalized provider selection for your case' }
  ];

  const treatmentSteps = [
    'Free initial consultation with a vetted specialist',
    '3D digital scan and personalized treatment planning',
    'Receive your custom aligners manufactured to precision',
    'Regular progress monitoring and refinement if needed',
    'Achieve your perfect smile with permanent retention'
  ];

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

      {/* Hero Section with Image */}
      <div className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24 min-h-[640px] sm:min-h-[680px] md:min-h-[720px]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt={`${service.title} in ${cityName}`}
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/60 to-slate-950" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 space-y-16">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
            <Link href="/services" className="hover:text-sky-400 transition-colors">
              Services
            </Link>
            <span>/</span>
            <Link href={`/services/${params.service}`} className="hover:text-sky-400 transition-colors">
              {service.title}
            </Link>
            <span>/</span>
            <span className="text-white">{cityName}</span>
          </div>

          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 rounded-full border border-sky-500/20 text-sm text-sky-400 backdrop-blur-sm">
              <MapPin className="w-4 h-4" />
              <span>Elite Providers in {cityName}</span>
            </div>

            <h1 className="text-4xl md:text-7xl font-black text-white leading-tight tracking-tight">
              {service.title}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                in {cityName}
              </span>
            </h1>

            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
              {service.desc} Connect with {cityName}&apos;s most experienced Platinum-tier Invisalign specialists.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-10 py-5 bg-sky-500 text-white font-black rounded-full shadow-2xl hover:scale-105 transition-all text-lg"
              >
                Get Matched in {cityName}
              </button>

              <Link
                href={`/location/${params.city}`}
                className="px-10 py-5 bg-white/5 text-white font-bold rounded-full border border-white/10 hover:border-sky-500/30 transition-all text-lg backdrop-blur-sm"
              >
                View All {cityName} Treatments
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the page */}
      <div className="pb-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 space-y-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="dark-card p-6 rounded-3xl border border-white/5">
                <div className="mb-4 p-3 rounded-xl bg-sky-500/10 text-sky-400 inline-flex">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-slate-400">{benefit.desc}</p>
              </div>
            ))}
          </div>

          <div className="dark-card p-10 md:p-14 rounded-[2.5rem] border border-white/5">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8 text-center">
              Your Treatment Journey in {cityName}
            </h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {treatmentSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/40 border border-white/5">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <p className="text-slate-300 font-medium pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="dark-card p-10 rounded-[2.5rem] border border-white/5">
              <h3 className="text-2xl font-black text-white mb-6">
                Why Choose {service.title} in {cityName}?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-sky-400 flex-shrink-0 mt-1" />
                  <p className="text-slate-300">Access to Platinum-certified providers with proven track records</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-sky-400 flex-shrink-0 mt-1" />
                  <p className="text-slate-300">State-of-the-art 3D scanning and ClinCheck visualization technology</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-sky-400 flex-shrink-0 mt-1" />
                  <p className="text-slate-300">Convenient {cityName} locations with flexible appointment times</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-sky-400 flex-shrink-0 mt-1" />
                  <p className="text-slate-300">Comprehensive aftercare and retention planning included</p>
                </div>
              </div>
            </div>

            <div className="dark-card p-10 rounded-[2.5rem] border border-sky-500/20 bg-sky-500/5">
              <h3 className="text-2xl font-black text-white mb-6">Ready to Transform Your Smile?</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Our {cityName} network is ready to assess your case and create a personalized treatment plan. Get matched with the perfect provider for your{' '}
                {service.title.toLowerCase()} needs.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-sky-400" />
                  <span>Free initial consultation</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-sky-400" />
                  <span>No obligation assessment</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-sky-400" />
                  <span>Transparent pricing from the start</span>
                </li>
              </ul>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full px-8 py-5 bg-sky-500 text-white font-black rounded-full shadow-2xl hover:scale-105 transition-all"
              >
                Book Your {cityName} Consultation
              </button>
            </div>
          </div>

          <div className="dark-card p-10 rounded-[2.5rem] border border-white/5">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Other Treatments in {cityName}</h3>
                <div className="space-y-2">
                  {SERVICES.filter(s => s.id !== params.service)
                    .slice(0, 5)
                    .map(s => (
                      <Link
                        key={s.id}
                        href={`/services/${s.id}/${params.city}`}
                        className="block px-4 py-3 rounded-xl bg-slate-900/40 border border-white/5 hover:border-sky-500/30 text-slate-300 hover:text-white transition-all text-sm font-medium"
                      >
                        {s.title} in {cityName}
                      </Link>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">{service.title} in Other Cities</h3>
                <div className="space-y-2">
                  {allCities
                    .filter(c => c !== cityName)
                    .slice(0, 5)
                    .map(city => {
                      const slug = city.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <Link
                          key={city}
                          href={`/services/${params.service}/${slug}`}
                          className="block px-4 py-3 rounded-xl bg-slate-900/40 border border-white/5 hover:border-sky-500/30 text-slate-300 hover:text-white transition-all text-sm font-medium"
                        >
                          {service.title} in {city}
                        </Link>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <FAQSection faqs={FAQS_SERVICES} />
      </div>

      <Footer />
    </div>
  );
}
