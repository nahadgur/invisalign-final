'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-blue-100 mb-8">This article may not be published yet or doesn't exist.</p>
          <Link 
            href="/blog-feed"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition-colors"
          >
            Back to Knowledge Hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-blue-200">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog-feed" className="hover:text-white transition-colors">Knowledge Hub</Link>
          <span>/</span>
          <span className="text-white">{article['Article Title']}</span>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-semibold text-blue-300 bg-blue-500/30 px-4 py-1.5 rounded-full">
                {article.wp_category}
              </span>
              <span className="text-sm text-blue-200">
                {formatDate(article.publishDate)}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {article['Article Title']}
            </h1>
            
            {article['Meta Description'] && (
              <p className="text-xl text-blue-100 leading-relaxed">
                {article['Meta Description']}
              </p>
            )}
          </div>

          {/* Article Body */}
          <div 
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-p:text-blue-50 prose-p:leading-relaxed
              prose-a:text-blue-300 prose-a:no-underline hover:prose-a:text-blue-200
              prose-strong:text-white prose-strong:font-semibold
              prose-ul:text-blue-50 prose-ol:text-blue-50
              prose-li:marker:text-blue-300
              prose-blockquote:border-l-blue-400 prose-blockquote:text-blue-100"
            dangerouslySetInnerHTML={{ __html: article['Article Content'] }}
          />

          {/* CTA Section */}
          <div className="mt-12 p-8 bg-blue-500/20 border border-blue-400/30 rounded-xl">
            <h3 className="text-2xl font-bold text-white mb-3">
              Ready to Start Your Invisalign Journey?
            </h3>
            <p className="text-blue-100 mb-6">
              Connect with platinum-tier Invisalign providers in your area for a free consultation.
            </p>
            <Link 
              href="/#find-provider"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg transition-all hover:scale-105"
            >
              Find Your Perfect Provider
            </Link>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="container mx-auto px-4 py-16 max-w-6xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Related Articles
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedArticles.map((related) => (
              <Link
                key={related.Slug}
                href={`/blog-feed/${related.Slug}`}
                className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all hover:scale-105"
              >
                <span className="text-xs font-semibold text-blue-300 bg-blue-500/30 px-3 py-1 rounded-full">
                  {related.wp_category}
                </span>
                <h3 className="text-lg font-bold text-white mt-4 mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">
                  {related['Article Title']}
                </h3>
                <div className="flex items-center text-blue-300 text-sm font-semibold mt-4">
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
  );
}
