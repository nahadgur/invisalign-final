'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Shield, Sparkles, ChevronUp, CheckCircle, Globe, Users, Medal } from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import LeadFormModal from '@/components/LeadFormModal';
import { FAQS_HOME } from '@/lib/data';

// Marquee images for Results section
const MARQUEE_IMAGES = [
  'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=1170&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1695275884195-70381520643d?q=80&w=1170&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1654105929878-77b7635232da?q=80&w=1164&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1656623944690-9366fb1aba9b?q=80&w=1170&auto=format&fit=crop',
  'https://images.pexels.com/photos/13085186/pexels-photo-13085186.jpeg',
  'https://images.pexels.com/photos/287227/pexels-photo-287227.jpeg',
  'https://images.pexels.com/photos/28470229/pexels-photo-28470229.jpeg',
  'https://images.pexels.com/photos/11887613/pexels-photo-11887613.jpeg',
  'https://images.pexels.com/photos/13085186/pexels-photo-13085186.jpeg',
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

type FAQ = { question: string; answer: string } | { q: string; a: string };

const FAQAccordion: React.FC<{ faqs: FAQ[] }> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white">Frequently Asked Questions</h2>
          <p className="text-lg text-slate-400 font-medium">Everything you need to know before getting started.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              question={'question' in faq ? faq.question : faq.q}
              answer={'answer' in faq ? faq.answer : faq.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQItem: React.FC<{
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ question, answer, isOpen, onToggle }) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const maxHeight = isOpen ? `${bodyRef.current?.scrollHeight ?? 0}px` : '0px';

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-bold text-white">{question}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronUp className="w-5 h-5 text-slate-400" />
        </span>
      </button>

      <div
        style={{ maxHeight }}
        className="transition-[max-height] duration-300 ease-in-out overflow-hidden"
      >
        <div ref={bodyRef} className="px-6 pb-6">
          <p className="text-slate-400 font-medium leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default function BlogPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation onOpenModal={() => setIsModalOpen(true)} />


      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20">
                <Shield className="w-5 h-5 text-sky-400" />
                <span className="text-sky-400 text-sm font-bold tracking-wide uppercase">Platinum Provider Network</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black leading-tight">
                Find the Best <span className="text-sky-400">Invisalign Dentists</span> Near You
              </h1>
              <p className="text-xl text-slate-300 font-medium leading-relaxed max-w-xl">
                Get matched with experienced Invisalign providers. Transparent pricing, free consultation, and results you’ll love.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="pulse-glow px-10 py-5 bg-sky-500 text-white text-lg font-bold rounded-full shadow-2xl hover:scale-105 transition-all"
                >
                  Get Matched Now
                </button>
                <button className="px-10 py-5 bg-slate-900/60 border border-white/10 text-white text-lg font-bold rounded-full hover:border-sky-500/30 transition-all">
                  Learn How It Works
                </button>
              </div>
              <div className="flex items-center gap-8 pt-6">
                <div className="space-y-1">
                  <p className="text-3xl font-black text-white"><CountUp end={350} suffix="+" /></p>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Specialists</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-white"><CountUp end={98} suffix="%" /></p>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Satisfaction</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-white"><CountUp end={24} suffix="h" /></p>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Response</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="dark-card p-8 rounded-[2.5rem] border border-white/5">
                <img
                  src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1200&auto=format&fit=crop"
                  alt="Invisalign Dentist"
                  className="w-full h-[540px] object-cover rounded-2xl"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 dark-card p-6 rounded-2xl border border-sky-500/30 bg-slate-900/90 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-sky-400" />
                  <div>
                    <p className="text-2xl font-black text-white">Free</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Consultation Matching</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
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

      {/* Why Choose Invisalign Section */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-white">Why Choose Invisalign Clear Aligners?</h2>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto font-medium">
              The modern alternative to traditional braces. Nearly invisible, removable, and designed for your lifestyle.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: 'Nearly Invisible',
                desc: 'Clear aligners are virtually undetectable. Perfect for professionals and adults who want discreet orthodontic treatment without metal brackets.'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Removable Convenience',
                desc: 'Eat, brush, and floss normally. Remove your aligners for important meetings, photos, or special occasions without compromising treatment.'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Comfortable Design',
                desc: 'Smooth plastic aligners with no sharp metal edges. Custom-fitted to your teeth for maximum comfort throughout your smile journey.'
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: 'Predictable Results',
                desc: 'Advanced 3D ClinCheck technology shows your complete treatment plan and final result before you even begin. See your future smile today.'
              },
              {
                icon: <Calendar className="w-8 h-8" />,
                title: 'Faster Treatment',
                desc: 'Most cases complete in 6-18 months. Express and Lite options available for minor corrections in as little as 3-6 months.'
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'Proven Technology',
                desc: 'Over 14 million patients treated worldwide. Backed by decades of research and continuous innovation in clear aligner therapy.'
              }
            ].map((item, i) => (
              <div key={i} className="dark-card p-8 rounded-[2rem] border border-white/5 hover:border-sky-500/30 transition-all">
                <div className="w-14 h-14 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-400 mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-black text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              className="w-[180px] md:w-[280px] aspect-[4/5] flex-shrink-0 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl hover:border-sky-500/30 transition-all group"
            >
              <img 
                src={img} 
                loading="lazy"
                className="block w-full h-full object-cover object-center grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
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

      {/* Conditions We Treat Section */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-white">Conditions Invisalign Can Treat</h2>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto font-medium">
              From simple spacing issues to complex bite corrections, our Platinum providers handle every case with precision.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Crowded Teeth',
                desc: 'Overlapping teeth due to insufficient jaw space. Can lead to plaque buildup and gum disease if untreated.'
              },
              {
                title: 'Gaps & Spacing',
                desc: 'Noticeable spaces between teeth. Can affect bite function and lead to gum problems over time.'
              },
              {
                title: 'Overbite',
                desc: 'Upper teeth significantly overlap lower teeth. May cause jaw pain, tooth wear, and gum irritation.'
              },
              {
                title: 'Underbite',
                desc: 'Lower teeth protrude past upper teeth. Can affect chewing, speech, and cause premature tooth wear.'
              },
              {
                title: 'Crossbite',
                desc: 'Some upper teeth sit inside lower teeth. Can cause tooth chipping, gum recession, and jaw misalignment.'
              },
              {
                title: 'Open Bite',
                desc: 'Upper and lower teeth don\'t touch when mouth is closed. Makes biting certain foods difficult.'
              },
              {
                title: 'Adult Relapse',
                desc: 'Teeth shifted after childhood braces. Invisalign Lite or Express can quickly restore alignment.'
              },
              {
                title: 'General Alignment',
                desc: 'Minor cosmetic adjustments for a more confident smile. Perfect for adults seeking subtle improvements.'
              }
            ].map((condition, i) => (
              <div key={i} className="dark-card p-6 rounded-2xl border border-white/5 hover:border-sky-500/30 transition-all">
                <h3 className="text-lg font-black text-white mb-2">{condition.title}</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{condition.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Platinum Difference Section */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-black uppercase tracking-widest rounded-full">
                Platinum Provider Network
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                The <span className="text-sky-400">Platinum</span> Difference
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Not all Invisalign providers are created equal. Platinum status represents the highest tier of clinical expertise and patient volume.
              </p>
              <div className="space-y-4 pt-4">
                {[
                  'Minimum 50+ cases completed annually',
                  'Advanced training in complex orthodontic movements',
                  'Access to exclusive Invisalign features and attachments',
                  'Proven track record of successful outcomes',
                  'Continuous education on latest clear aligner techniques'
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-sky-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300 font-medium">{point}</p>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-8 px-10 py-4 bg-sky-500 text-white font-bold rounded-full shadow-xl hover:scale-105 transition-all"
              >
                Find Your Platinum Provider
              </button>
            </div>
            <div className="relative">
              <div className="dark-card p-8 rounded-[2.5rem] border border-white/5">
                <img 
                  src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1200&auto=format&fit=crop"
                  alt="Platinum Invisalign Provider"
                  className="w-full h-[500px] object-cover rounded-2xl"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 dark-card p-6 rounded-2xl border border-sky-500/30 bg-slate-900/90 backdrop-blur-md max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <Medal className="w-8 h-8 text-sky-400" />
                  <div>
                    <p className="text-2xl font-black text-white">350+</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Vetted Specialists</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

         {/* FAQ Section */}
      <FAQAccordion faqs={FAQS_HOME} />

      {/* Final CTA Section */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            Ready to Transform Your Smile?
          </h2>
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
            Connect with a Platinum Invisalign provider in your area. Free consultation, expert care, and results you'll love.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="pulse-glow px-12 py-6 bg-sky-500 text-white text-xl font-bold rounded-full shadow-2xl hover:scale-105 transition-all"
          >
            Get Matched with a Specialist
          </button>
          <p className="text-sm text-slate-500 font-medium">
            No cost to use our service • Vetted specialists only • Free consultation matching
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
