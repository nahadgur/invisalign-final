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
  'Published': string;
  'Date': string;
}

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [publishedArticles, setPublishedArticles] = useState<Article[]>([]);
  const [blogSearchQuery, setBlogSearchQuery] = useState('');
  const [blogPage, setBlogPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const postsPerPage = 12;

  useEffect(() => {
    const loadCSV = async () => {
      try {
        const res = await fetch('/blog_posts.csv');
        const csvText = await res.text();

        const parsed = Papa.parse<Article>(csvText, {
          header: true,
          skipEmptyLines: true,
        });

        const parsedArticles = (parsed.data || []).filter(
          (row) => row && row['Article Title'] && row['Slug']
        );

        setArticles(parsedArticles);
      } catch (e) {
        console.error('Failed to load blog CSV:', e);
      }
    };

    loadCSV();
  }, []);

  useEffect(() => {
    const published = articles.filter((a) => {
      const p = (a.Published || '').toLowerCase().trim();
      return p === 'true' || p === 'yes' || p === '1';
    });
    setPublishedArticles(published);
  }, [articles]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const filteredPosts = useMemo(() => {
    const q = blogSearchQuery.toLowerCase().trim();
    if (!q) return publishedArticles;

    return publishedArticles.filter((article) => {
      const title = (article['Article Title'] || '').toLowerCase();
      const content = (article['Article Content'] || '').toLowerCase();
      const category = (article.wp_category || '').toLowerCase();
      return title.includes(q) || content.includes(q) || category.includes(q);
    });
  }, [blogSearchQuery, publishedArticles]);

  useEffect(() => {
    setBlogPage(1);
  }, [blogSearchQuery, publishedArticles]);

  const paginatedPosts = useMemo(() => {
    const start = (blogPage - 1) * postsPerPage;
    return filteredPosts.slice(start, start + postsPerPage);
  }, [filteredPosts, blogPage]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const getExcerpt = (content: string, length: number = 120) => {
    const text = (content || '').replace(/<[^>]*>/g, '');
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

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

      <div className="pt-32 pb-24 px-4 min-h-screen bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                Invisalign Blog
              </h1>
              <p className="mt-3 text-slate-400 font-medium max-w-2xl">
                Insights, guides, and expert tips to help you find the best Invisalign dentist and get the smile you want.
              </p>
            </div>

            <div className="w-full md:w-[420px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  value={blogSearchQuery}
                  onChange={(e) => setBlogSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-200 placeholder:text-slate-500 outline-none focus:border-sky-500/40 transition"
                />
              </div>
            </div>
          </div>

          {paginatedPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 font-medium">No articles found.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPosts.map((article) => (
                <Link
                  key={article.Slug}
                  href={`/blog/${article.Slug}`}
                  className="group rounded-3xl bg-white/5 border border-white/10 hover:border-sky-500/30 transition overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
                        {(article.wp_category || 'Invisalign').replace(/_/g, ' ')}
                      </span>
                      <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-sky-400 transition" />
                    </div>

                    <h2 className="mt-4 text-xl font-black text-white leading-snug">
                      {article['Article Title']}
                    </h2>

                    <p className="mt-3 text-slate-400 font-medium leading-relaxed">
                      {getExcerpt(article['Article Content'], 140)}
                    </p>

                    {article.Date ? (
                      <p className="mt-5 text-xs text-slate-500 font-semibold">
                        {article.Date}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 ? (
            <div className="mt-12 flex items-center justify-center gap-3">
              <button
                onClick={() => setBlogPage((p) => Math.max(1, p - 1))}
                disabled={blogPage === 1}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold disabled:opacity-40"
              >
                Prev
              </button>

              <div className="text-slate-400 font-semibold">
                Page <span className="text-white">{blogPage}</span> of{' '}
                <span className="text-white">{totalPages}</span>
              </div>

              <button
                onClick={() => setBlogPage((p) => Math.min(totalPages, p + 1))}
                disabled={blogPage === totalPages}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <Footer />
    </div>
  );
}
