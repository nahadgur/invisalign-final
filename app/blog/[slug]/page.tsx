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
            const startDate = new Date('2026-02-12T00:00:00');
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

  const getExcerpt = (content: string, length: number = 120) => {
    const text = content.replace(/<[^>]*>/g, '');
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <Navigation onOpenModal={() => setIsModalOpen(true)} />
        <div className="pt-32 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-black text-white mb-4">Article Not Found</h1>
            <p className="text-slate-400 mb-8 font-medium">This article may not be published yet or doesn't exist.</p>
            <Link 
              href="/blog"
              className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-black px-8 py-3 rounded-xl transition-colors uppercase text-sm tracking-wider"
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
        className={`fixed bottom-6 left-6 z-[70] w-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 text-slate-400 rounded-full flex items-center justify-center transition-all duration-500 ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      <div className="pt-32 pb-24 px-4 min-h-screen bg-slate-950">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <Link href="/" className="hover:text-sky-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-sky-400 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-slate-300">{article['Article Title']}</span>
          </div>

          {/* Article */}
          <article className="dark-card rounded-[2.5rem] border border-white/5 p-8 md:p-16 shadow-2xl">
            {/* Header */}
            <div className="mb-12 space-y-6">
              <div className="flex items-center gap-4">
                <span className="px-4 py-1.5 bg-sky-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase rounded-full">
                  {article.wp_category}
                </span>
                <span className="text-sm text-slate-500 font-medium">
                  {formatDate(article.publishDate)}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                {article['Article Title']}
              </h1>
              
              {article['Meta Description'] && (
                <p className="text-xl text-slate-400 font-medium leading-relaxed">
                  {article['Meta Description']}
                </p>
              )}
            </div>

            {/* Content */}
            <div 
              className="prose prose-invert prose-lg max-w-none
                prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                prose-p:text-slate-300 prose-p:leading-relaxed prose-p:font-medium
                prose-a:text-sky-400 prose-a:no-underline hover:prose-a:text-sky-300 prose-a:font-bold
                prose-strong:text-white prose-strong:font-black
                prose-ul:text-slate-300 prose-ol:text-slate-300
                prose-li:marker:text-sky-400
                prose-blockquote:border-l-sky-500 prose-blockquote:text-slate-400 prose-blockquote:italic"
              dangerouslySetInnerHTML={{ __html: article['Article Content'] }}
            />

            {/* CTA */}
            <div className="mt-16 p-10 bg-gradient-to-br from-sky-500/10 to-blue-500/10 border border-sky-500/20 rounded-3xl">
              <h3 className="text-3xl font-black text-white mb-4">
                Ready to Start Your Invisalign Journey?
              </h3>
              <p className="text-slate-400 mb-8 font-medium text-lg">
                Connect with platinum-tier Invisalign providers in your area for a free consultation.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-sky-500 hover:bg-sky-600 text-white font-black px-10 py-4 rounded-xl transition-all hover:scale-105 uppercase text-sm tracking-wider"
              >
                Find Your Perfect Provider
              </button>
            </div>
          </article>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="space-y-8">
              <h2 className="text-4xl font-black text-white">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.Slug}
                    href={`/blog/${related.Slug}`}
                    className="group dark-card rounded-[2rem] border border-white/5 p-6 hover:border-sky-500/30 transition-all duration-500 shadow-xl"
                  >
                    <span className="inline-block px-3 py-1 bg-sky-500/90 backdrop-blur-md text-white text-[9px] font-black uppercase rounded-full mb-4">
                      {related.wp_category}
                    </span>
                    <h3 className="text-xl font-black text-white mb-3 group-hover:text-sky-400 transition-colors line-clamp-2">
                      {related['Article Title']}
                    </h3>
                    <p className="text-slate-400 text-sm font-medium mb-4 line-clamp-2">
                      {getExcerpt(related['Article Content'])}
                    </p>
                    <div className="flex items-center text-sky-400 text-[10px] font-black uppercase tracking-wider">
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




