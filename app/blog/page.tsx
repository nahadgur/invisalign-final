'use client';

import React, { useState } from 'react';
import { Clock, User, ArrowLeft, Share2, ChevronUp } from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import LeadFormModal from '@/components/LeadFormModal';
import { BLOG_POSTS } from '@/lib/data';

export default function BlogPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

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

  // Single Post View
  if (selectedPost) {
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

        <div className="pt-24 min-h-screen bg-slate-950">
          <div className="max-w-5xl mx-auto px-4 pt-16 pb-12">
            <button 
              onClick={() => { setSelectedPost(null); window.scrollTo(0,0); }}
              className="flex items-center gap-2 text-sky-400 font-bold mb-8 hover:-translate-x-1 transition-transform"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Archive
            </button>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-sky-500/10 text-sky-400 text-[10px] font-black uppercase tracking-widest rounded-full">{selectedPost.category}</span>
                <span className="text-slate-500 text-sm font-bold flex items-center gap-1"><Clock className="w-4 h-4" /> {selectedPost.readTime}</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter">{selectedPost.title}</h1>
              <div className="flex items-center gap-4 py-4 border-y border-white/5">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-sky-400 font-black">
                  {selectedPost.author.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-bold">{selectedPost.author}</p>
                  <p className="text-slate-500 text-xs font-medium">{selectedPost.date}</p>
                </div>
                <div className="ml-auto">
                  <button className="p-3 bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 mb-20">
            <div className="h-[400px] md:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
              <img src={selectedPost.image} className="w-full h-full object-cover" alt={selectedPost.title} />
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 pb-32">
            <div className="prose prose-invert prose-sky max-w-none space-y-8">
              {selectedPost.content.map((p, i) => (
                <p key={i} className="text-xl text-slate-300 leading-relaxed font-medium">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-20 p-10 bg-gradient-to-br from-sky-500/20 to-indigo-500/10 border border-sky-500/30 rounded-[2.5rem] shadow-2xl text-center space-y-6">
              <h3 className="text-2xl font-black text-white leading-tight">Ready for your own smile transformation?</h3>
              <p className="text-slate-300 font-medium">Book a direct referral with our elite partners and see your future smile in 3D.</p>
              <button onClick={() => setIsModalOpen(true)} className="px-10 py-4 bg-sky-500 text-white font-black rounded-full hover:scale-105 transition-all">
                Find My Elite Provider
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Blog Archive View
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

      <div className="pt-32 pb-24 min-h-screen bg-slate-950 px-4">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-8xl font-black text-white leading-tight tracking-tighter">
              Clinical <span className="text-sky-400 italic">Insights.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
              Expert advice, clinical guides, and the science of smile design.
            </p>
          </div>

          {/* Featured Post */}
          <div 
            onClick={() => { setSelectedPost(BLOG_POSTS[0]); window.scrollTo(0,0); }}
            className="group relative h-[500px] md:h-[600px] rounded-[3.5rem] overflow-hidden border border-white/5 cursor-pointer shadow-2xl transition-all hover:border-sky-500/30"
          >
            <img 
              src={BLOG_POSTS[0].image} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
              alt="Featured" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-3xl space-y-6">
              <span className="px-4 py-1.5 bg-sky-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                Editor's Choice
              </span>
              <h2 className="text-3xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter group-hover:text-sky-400 transition-colors">
                {BLOG_POSTS[0].title}
              </h2>
              <p className="text-slate-300 text-lg font-medium line-clamp-2">
                {BLOG_POSTS[0].excerpt}
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Clock className="w-5 h-5 text-sky-400" /> {BLOG_POSTS[0].readTime}
                </div>
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <User className="w-5 h-5 text-sky-400" /> {BLOG_POSTS[0].author}
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Grid */}
          <div className="grid md:grid-cols-2 gap-10">
            {BLOG_POSTS.slice(1).map((post) => (
              <div 
                key={post.id} 
                onClick={() => { setSelectedPost(post); window.scrollTo(0,0); }}
                className="group dark-card rounded-[3rem] border border-white/5 overflow-hidden flex flex-col hover:border-sky-500/30 transition-all duration-500 shadow-2xl cursor-pointer"
              >
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={post.image} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    alt={post.title} 
                  />
                  <div className="absolute top-6 left-6 px-5 py-2 bg-sky-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                    {post.category}
                  </div>
                </div>
                <div className="p-10 flex-1 flex flex-col">
                  <h2 className="text-2xl font-black text-white mb-4 group-hover:text-sky-400 transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-slate-400 font-medium mb-10 flex-1 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                      {post.readTime}
                    </span>
                    <span className="text-sky-400 font-black uppercase tracking-widest text-[10px]">
                      Read Article →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
