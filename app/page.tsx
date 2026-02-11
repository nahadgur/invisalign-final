'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Shield, Sparkles, ChevronUp } from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import LeadFormModal from '@/components/LeadFormModal';
import { FAQS_HOME } from '@/lib/data';

// Marquee images for Results section
const MARQUEE_IMAGES = [
  'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800&auto=format&fit=crop', // Dental examination
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop', // Dental tools
  'https://images.unsplash.com/photo-1609840114035-3c981c3f1c09?q=80&w=800&auto=format&fit=crop', // Dentist office
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop', // Smile close-up
  'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=800&auto=format&fit=crop', // Dental check
  'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=800&auto=format&fit=crop', // Patient smile
];

const CountUp: React.FC<{ end: number; suffix?: string; decimals?: number }> = ({ end, suffix = "", decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(start);
          }
        }, 16);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={elementRef}>{count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setShowScrollTop(scrollPos / height > 0.3);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 px-4">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1694675236489-d73651370688?q=80&w=880&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-90 animate-slow-zoom brightness-110" 
            alt="Invisalign Clear Aligners" 
          />
          <div className="absolute inset-0 bg-slate-950/30"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/70"></div>
        </div>
        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Premium Invisalign Facilitator</span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white leading-tight">
            The Network for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-400 animate-gradient">
              Elite Results.
            </span>
          </h1>
          <p className="text-lg lg:text-2xl text-slate-300 max-w-3xl mx-auto font-medium">
            Connecting discerning patients with the top 1% of Platinum Invisalign providers for verified orthodontic results.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="pulse-glow px-12 py-6 bg-sky-500 text-white text-xl font-bold rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            Find My Specialist
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <div className="bg-slate-900 border-y border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: 350, suffix: '+', label: 'Verified Partners' },
            { val: 12, suffix: 'k+', label: 'Matches' },
            { val: 4.95, suffix: '', decimals: 2, label: 'Rating' },
            { val: 0, suffix: 'Free', label: 'Service', special: true }
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-black text-white">
                {s.special ? 'FREE' : <CountUp end={s.val} suffix={s.suffix} decimals={s.decimals || 0} />}
              </p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Results That Inspire - Marquee Section */}
      <section className="py-16 bg-slate-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
            Results That <span className="text-sky-500">Inspire</span>
          </h2>
          <p className="text-slate-400 text-sm font-medium">Verified outcomes from our Platinum network.</p>
        </div>
        
        <div className="flex animate-marquee gap-6 whitespace-nowrap">
          {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((img, i) => (
            <div 
              key={i} 
              className="w-[180px] h-[220px] md:w-[280px] md:h-[350px] flex-shrink-0 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl hover:border-sky-500/30 transition-all group"
            >
              <img 
                src={img} 
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                alt="Smile Result" 
              />
            </div>
          ))}
        </div>
      </section>

      {/* How We Advocate Section */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-white">How We Advocate For You</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
              We ensure you are matched with the provider best suited for your specific clinical profile.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'Analysis',
                desc: 'We evaluate your smile goals to determine the ideal provider tier.',
                icon: <Calendar className="w-8 h-8" />,
                color: 'text-sky-400'
              },
              {
                num: '02',
                title: 'Matching',
                desc: 'We filter our database to find the perfect specialist fit.',
                icon: <Shield className="w-8 h-8" />,
                color: 'text-indigo-400'
              },
              {
                num: '03',
                title: 'Referral',
                desc: 'Receive a direct referral for a free 3D digital scan.',
                icon: <Sparkles className="w-8 h-8" />,
                color: 'text-emerald-400'
              }
            ].map((s, i) => (
              <div key={i} className="dark-card p-10 rounded-[2.5rem] hover:bg-slate-800/80 transition-all">
                <div className="flex justify-between items-start mb-10">
                  <div className={`w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center ${s.color}`}>
                    {s.icon}
                  </div>
                  <span className="text-5xl font-black text-slate-800">{s.num}</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-4">{s.title}</h3>
                <p className="text-slate-400 font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection faqs={FAQS_HOME} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
