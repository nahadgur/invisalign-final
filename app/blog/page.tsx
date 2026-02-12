'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Papa from 'papaparse';
import Link from 'next/link';
import { Search, ArrowUpRight, ChevronUp } from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import LeadFormModal from '@/components/LeadFormModal';

interface Article {
  'Article Title': string;
  'Article Content': string;
  'wp_category': string;
  'Slug': string;
  'Meta Title': string;
  'Meta Description': string;
  'Schema Markup': string;
  'Status': string;
}

interface ArticleWithDate extends Article {
  publishDate: Date;
  index: number;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const makeUniqueSlug = (base: string, used: Set<string>) => {
  let slug = base || 'post';
  let i = 2;
  while (used.has(slug)) slug = `${base}-${i++}`;
  used.add(slug);
  return slug;
};

export default function BlogPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [blogSearchQuery, setBlogSearchQuery] = useState('');
  const [blogPage, setBlogPage] = useState(1);
  const [articles, setArticles] = useState<ArticleWithDate[]>([]);
  const postsPerPage = 6;

  // Load CSV articles with drip-feed logic
  useEffect(() => {
    fetch('/articles.csv')
      .then(response => response.text())
      .then(csvText => {
     Papa.parse<Article>(csvText, {
  header: true,
  complete: (results) => {
    const startDate = new Date('2026-02-10T00:00:00');
    const articlesPerDay = 3;
    const usedSlugs = new Set<string>();

    const articlesWithDates: ArticleWithDate[] = results.data
      .filter((article: Article) => article['Article Title'])
      .map((article: Article, index: number) => {
        const dayOffset = Math.floor(index / articlesPerDay);
        const publishDate = new Date(startDate);
        publishDate.setDate(publishDate.getDate() + dayOffset);

        /* 👇 ADD THIS PART */
        const baseSlug =
          (article['Slug'] || '').trim() ||
          slugify(article['Article Title']);

        const uniqueSlug = makeUniqueSlug(baseSlug, usedSlugs);
        /* 👆 END ADD */

        return {
          ...article,
          Slug: uniqueSlug,
          publishDate,
          index,
        };
      });

    setArticles(articlesWithDates);
  },
});
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

  // Filter to only show published articles (based on drip-feed schedule)
  const today = new Date();
  const publishedArticles = articles.filter(article => article.publishDate <= today);

  const filteredPosts = useMemo(() => {
    if (!blogSearchQuery) return publishedArticles;
    return publishedArticles.filter(post => 
      post['Article Title'].toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
      post['Article Content'].toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
      post.wp_category.toLowerCase().includes(blogSearchQuery.toLowerCase())
    );
  }, [blogSearchQuery, publishedArticles]);

  const paginatedPosts = useMemo(() => {
    const start = (blogPage - 1) * postsPerPage;
    return filteredPosts.slice(start, start + postsPerPage);
  }, [filteredPosts, blogPage]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const getExcerpt = (content: string, length: number = 120) => {
    const text = content.replace(/<[^>]*>/g, '');
    return text.length > length ? text.substring(0, length) + '...' : text;
  };


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

      <div className="pt-32 pb-24 px-4 min-h-screen bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-7xl font-black text-white leading-tight tracking-tight">
              Invisalign <span className="text-sky-400 italic">Insights</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
              Expert clinical advice, pricing updates, and patient success stories.
            </p>
            <div className="max-w-xl mx-auto relative pt-8">
              <input 
                type="text" 
                placeholder="Search articles by topic..." 
                value={blogSearchQuery}
                onChange={(e) => { 
                  setBlogSearchQuery(e.target.value); 
                  setBlogPage(1); 
                }}
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-sky-500 outline-none transition-all pl-14 shadow-2xl"
              />
           <Search className="absolute left-5 top-[3.2rem] text-slate-500 w-6 h-6" />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {paginatedPosts.map((post) => (
              <Link
                key={post.Slug}
                href={`/blog/${post.Slug}`}
                className="group dark-card rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col hover:border-sky-500/30 transition-all duration-500 shadow-2xl"
              >
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-10">📝</div>
                  </div>
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-sky-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase rounded-full">
                    {post.wp_category}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h2 className="text-2xl font-black text-white mb-4 group-hover:text-sky-400 transition-colors">
                    {post['Article Title']}
                  </h2>
                  <p className="text-slate-400 font-medium mb-8 flex-1">
                    {getExcerpt(post['Article Content'])}
                  </p>
                  <div className="flex items-center gap-2 text-sky-400 font-black uppercase tracking-widest text-[10px]">
                    Read Article <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setBlogPage(page)}
                  className={`px-4 py-2 rounded-xl font-bold transition-all ${
                    blogPage === page
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
