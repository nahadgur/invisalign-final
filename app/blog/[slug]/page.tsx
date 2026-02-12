'use client';

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronUp } from '@/components/Icons';
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

export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [article, setArticle] = useState<ArticleWithDate | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ArticleWithDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  useEffect(() => {
    if (!slug) return;

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

            const today = new Date();
            const publishedArticles = articlesWithDates.filter(a => a.publishDate <= today);
            
            const foundArticle = publishedArticles.find(a => a.Slug === slug);
            setArticle(foundArticle || null);

            if (foundArticle) {
              const related = publishedArticles
                .filter(a => 
                  a.Slug !== slug && 
                  a.wp_category === foundArticle.wp_category
                )
                .slice(0, 3);
              setRelatedArticles(related);
            }

            setLoading(false);
          }
        });
      });
  }, [slug]);

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
        <div className="text-xl">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <Navigation onOpenModal={() => setIsModalOpen(true)} />
        <div className="pt-32 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
            <p className="text-slate-400 mb-8">This article may not be published yet or doesn't exist.</p>
            <Link 
              href="/blog"
              className="inline-block bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-lg transition-colors"
            >
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
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
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
            <Link href="/" className="hover:text-sky-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-sky-400 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-slate-200">{article['Article Title']}</span>
          </div>

          {/* Article Header */}
          <article className="bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider bg-sky-500/10 px-4 py-1.5 rounded-full">
                  {article.wp_category}
                </span>
                <span className="text-sm text-slate-500">
                  {formatDate(article.publishDate)}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                {article['Article Title']}
              </h1>
              
              {article['Meta Description'] && (
                <p className="text-xl text-slate-400 leading-relaxed">
                  {article['Meta Description']}
                </p>
              )}
            </div>

            {/* Article Body */}
            <div 
              className="prose prose-invert prose-lg max-w-none
                prose-headings:text-slate-100 prose-headings:font-bold
                prose-p:text-slate-300 prose-p:leading-relaxed
                prose-a:text-sky-400 prose-a:no-underline hover:prose-a:text-sky-300
                prose-strong:text-slate-100 prose-strong:font-semibold
                prose-ul:text-slate-300 prose-ol:text-slate-300
                prose-li:marker:text-sky-400
                prose-blockquote:border-l-sky-500 prose-blockquote:text-slate-400"
              dangerouslySetInnerHTML={{ __html: article['Article Content'] }}
            />

            {/* CTA Section */}
            <div className="mt-12 p-8 bg-gradient-to-r from-sky-500/10 to-blue-500/10 border border-sky-500/20 rounded-xl">
              <h3 className="text-2xl font-bold mb-3">
                Ready to Start Your Invisalign Journey?
              </h3>
              <p className="text-slate-400 mb-6">
                Connect with platinum-tier Invisalign providers in your area for a free consultation.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-4 rounded-lg transition-all hover:scale-105"
              >
                Find Your Perfect Provider
              </button>
            </div>
          </article>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.Slug}
                    href={`/blog/${related.Slug}`}
                    className="group bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-sky-500 transition-all"
                  >
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider bg-sky-500/10 px-3 py-1 rounded-full">
                      {related.wp_category}
                    </span>
                    <h3 className="text-lg font-bold mt-4 mb-2 group-hover:text-sky-400 transition-colors line-clamp-2">
                      {related['Article Title']}
                    </h3>
                    <div className="flex items-center text-sky-400 text-sm font-semibold mt-4">
                      Read More
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}