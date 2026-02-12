'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Link from 'next/link';

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

export default function BlogFeed() {
  const [articles, setArticles] = useState<ArticleWithDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

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

            const uniqueCategories = Array.from(
              new Set(articlesWithDates.map(a => a.wp_category).filter(Boolean))
            );
            setCategories(uniqueCategories);
            setLoading(false);
          }
        });
      });
  }, []);

  const today = new Date();
  const publishedArticles = articles.filter(article => article.publishDate <= today);
  const upcomingCount = articles.length - publishedArticles.length;

  const filteredArticles = selectedCategory === 'all' 
    ? publishedArticles 
    : publishedArticles.filter(a => a.wp_category === selectedCategory);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Invisalign Knowledge Hub
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Expert insights and guidance on your smile transformation journey
          </p>
          <div className="flex justify-center gap-4 text-sm text-blue-200">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="font-semibold text-white">{publishedArticles.length}</span> Articles Live
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="font-semibold text-white">{upcomingCount}</span> Coming Soon
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              New articles daily at 12:00 AM
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-blue-100 hover:bg-white/20'
            }`}
          >
            All Articles
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-blue-100 hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center text-blue-100 py-20">
            <p className="text-xl">No articles available yet in this category.</p>
            <p className="mt-2">Check back soon for fresh content!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Link
                key={article.Slug}
                href={`/blog-feed/${article.Slug}`}
                className="group bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/15 transition-all hover:scale-105 hover:shadow-2xl"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-blue-300 bg-blue-500/30 px-3 py-1 rounded-full">
                      {article.wp_category}
                    </span>
                    <span className="text-xs text-blue-200">
                      {formatDate(article.publishDate)}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors line-clamp-2">
                    {article['Article Title']}
                  </h2>
                  
                  <p className="text-blue-100 text-sm line-clamp-3 mb-4">
                    {getExcerpt(article['Article Content'])}
                  </p>
                  
                  <div className="flex items-center text-blue-300 text-sm font-semibold">
                    Read More
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
