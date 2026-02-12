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

const slugify = (s: string) =>
  (s || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const makeUniqueSlug = (base: string, used: Set<string>) => {
  const cleanBase = base && base.length ? base : 'post';
  let slug = cleanBase;
  let i = 2;
  while (used.has(slug)) slug = `${cleanBase}-${i++}`;
  used.add(slug);
  return slug;
};

export default function ArticlePage() {
  const params = useParams();

  // slug can be string | string[] depending on route usage
  const rawSlug = params?.slug as string | string[] | undefined;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  const [article, setArticle] = useState<ArticleWithDate | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ArticleWithDate[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setShowScrollTop(height > 0 ? scrollPos / height > 0.3 : false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    if (!slug) return;

    fetch('/articles.csv')
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse<Article>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Publishing starts on Feb 10, 2026
            const startDate = new Date('2026-02-10T00:00:00');
            const articlesPerDay = 3;

            const usedSlugs = new Set<string>();

            const articlesWithDates: ArticleWithDate[] = results.data
              .filter((a: Article) => a && a['Article Title'] && a['Article Title'].trim())
              .map((a: Article, index: number) => {
                const dayOffset = Math.floor(index / articlesPerDay);
                const publishDate = new Date(startDate);
                publishDate.setDate(publishDate.getDate() + dayOffset);

                const baseSlug =
                  (a['Slug'] || '').trim() || slugify(a['Article Title']);

                const uniqueSlug = makeUniqueSlug(baseSlug, usedSlugs);

                return {
                  ...a,
                  Slug: uniqueSlug,
                  publishDate,
                  index,
                };
              });

            // Show posts published from Feb 10 up to today
            const now = new Date();
            const publishedArticles = articlesWithDates.filter((a) => a.publishDate <= now);

            const found = publishedArticles.find((a) => a.Slug === slug);
            setArticle(found || null);

            if (found) {
              const related = publishedArticles
                .filter((a) => a.Slug !== slug && a.wp_category === found.wp_category)
                .slice(0, 3);
              setRelatedArticles(related);
            } else {
              setRelatedArticles([]);
            }
          },
        });
      })
      .catch(() => {
        setArticle(null);
        setRelatedArticles([]);
      });
  }, [slug]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getExcerpt = (content: string, length: number = 120) => {
    const text = (content || '').replace(/<[^>]*>/g, '');
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation onOpenModal={() => setIsModalOpen(true)} />
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-10">
          {!article ? (
            <div>
              <h1 className="text-2xl font-semibold">Article not found</h1>
              <p className="mt-3">
                This post may not be published yet, or the URL slug doesn’t match.
              </p>
              <div className="mt-6">
                <Link href="/blog" className="underline">
                  Back to blog
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <Link href="/blog" className="underline">
                  Back to blog
                </Link>
              </div>

              <h1 className="text-3xl font-semibold">{article['Article Title']}</h1>
              <div className="mt-2 text-sm opacity-70">
                {formatDate(article.publishDate)}
              </div>

              <div
                className="prose max-w-none mt-8"
                dangerouslySetInnerHTML={{ __html: article['Article Content'] || '' }}
              />

              {relatedArticles.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-xl font-semibold">Related articles</h2>
                  <div className="mt-4 grid gap-4">
                    {relatedArticles.map((a) => (
                      <Link
                        key={a.Slug}
                        href={`/blog/${a.Slug}`}
                        className="block border rounded-lg p-4 hover:opacity-90"
                      >
                        <div className="font-medium">{a['Article Title']}</div>
                        <div className="mt-2 text-sm opacity-70">
                          {getExcerpt(a['Article Content'] || '')}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </main>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg"
          aria-label="Scroll to top"
        >
          <ChevronUp />
        </button>
      )}

      <Footer />
    </div>
  );
}

