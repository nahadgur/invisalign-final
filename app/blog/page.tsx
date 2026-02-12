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

export default function BlogPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [blogSearchQuery, setBlogSearchQuery] = useState('');
  const [blogPage, setBlogPage] = useState(1);
  const [articles, setArticles] = useState<ArticleWithDate[]>([]);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 6;

  // Load CSV articles with drip-feed logic
  useEffect(() => {
    fetch('/articles.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse<Article>(csvText, {
          header: true,
          complete: (results) => {
            const startDate = new Date('2026-02-16T00:00:00');
            const articlesPerDay = 3;
            
            const articlesWithDates: ArticleWithDate[] = results.data
              .filter((article: Article) => article['Article Title'] && article['Slug'])
              .map((article: Article, index: number) => {
                const dayOffset = Math.floor(index / articlesPerDay);
                const publishDate = new Date(startDate);
                publishDate.setDate(publishDate.getDate() + dayOffset);
                
                return {
                  ...article,
                  publishDate,
                  index
                };
              });

            setArticles(articlesWithDates);
            setLoading(false);
          }
        });
      });
  }, []);

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

  const getExcerpt = (content: string, length: number = 150) => {
    const text = content.replace(/<[^>]*>/g, '');
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <div className="text-xl">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Navigation onOpenModal={() => setIsModalOpen(true)} />
      
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-4 bg-sky-500 text-white rounded-full shadow-2xl transition-all duration-500 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'}`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              Invisalign Insights
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Expert guidance, patient stories, and the latest innovations in clear aligner treatment
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={blogSearchQuery}
                onChange={(e) => setBlogSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-slate-400">No articles found matching your search.</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {paginatedPosts.map((post) => (
                  <Link
                    key={post.Slug}
                    href={`/blog/${post.Slug}`}
                    className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-sky-500 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                          {post.wp_category}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatDate(post.publishDate)}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold mb-3 group-hover:text-sky-400 transition-colors line-clamp-2">
                        {post['Article Title']}
                      </h2>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                        {getExcerpt(post['Article Content'])}
                      </p>
                      <div className="flex items-center text-sky-400 text-sm font-semibold">
                        Read More
                        <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => setBlogPage(p => Math.max(1, p - 1))}
                    disabled={blogPage === 1}
                    className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-sky-500 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-slate-400">
                    Page {blogPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setBlogPage(p => Math.min(totalPages, p + 1))}
                    disabled={blogPage === totalPages}
                    className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-sky-500 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
