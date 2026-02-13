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
  featuredImage?: string;
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

// Extract image URLs from HTML. We’ll use the LAST one as featured image.
const extractImageUrls = (html: string): string[] => {
  const out: string[] = [];
  const s = html || '';

  // src="..."
  const srcRe = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = srcRe.exec(s))) out.push(m[1]);

  // bare URLs (fallback): https://...jpg/png/webp etc
  const urlRe = /(https?:\/\/[^\s"']+\.(?:png|jpe?g|webp|gif))(?:\?[^\s"']*)?/gi;
  while ((m = urlRe.exec(s))) out.push(m[1]);

  // de-dupe while preserving order
  return Array.from(new Set(out));
};

const stripHtml = (html: string) => (html || '').replace(/<[^>]*>/g, '').trim();

const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const getPublishDate = (row: Article, fallbackIndex: number) => {
  // Try to read a date from Schema Markup if present (YYYY-MM-DD or ISO).
  const schema = row['Schema Markup'] || '';
  const isoMatch = schema.match(
    /("datePublished"\s*:\s*"([^"]+)"|datePublished\s*=\s*"([^"]+)")/i
  );
  const raw = (isoMatch?.[2] || isoMatch?.[3] || '').trim();

  const parsed = raw ? new Date(raw) : null;
  if (parsed && !isNaN(parsed.getTime())) return parsed;

  // Otherwise, create a stable fallback date based on the index (older posts further back).
  const now = new Date();
  const d = new Date(now);
  d.setDate(now.getDate() - fallbackIndex);
  return d;
};

const getExcerpt = (contentHtml: string, maxLen = 170) => {
  const text = stripHtml(contentHtml);
  if (!text) return '';
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).trim()}…`;
};

const highlight = (text: string, query: string) => {
  if (!query) return text;
  const q = query.trim();
  if (!q) return text;

  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts
    .map((p, i) =>
      p.toLowerCase() === q.toLowerCase()
        ? `<mark class="bg-slate-700/70 text-slate-100 px-1 rounded">${p}</mark>`
        : p
    )
    .join('');
};

export default function BlogPage() {
  const [articles, setArticles] = useState<ArticleWithDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const [isModalOpen, setIsModalOpen] = useState(false);

  // back-to-top
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const fetchCsv = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/data/blog-posts.csv', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(`Failed to load blog data (HTTP ${res.status})`);
        }
        const csvText = await res.text();

        const parsed = Papa.parse<Article>(csvText, {
          header: true,
          skipEmptyLines: true,
        });

        if (parsed.errors?.length) {
          console.warn('CSV parse errors:', parsed.errors);
        }

        const rows = (parsed.data || []).filter(
          (r) =>
            (r?.['Article Title'] || '').trim().length > 0 &&
            (r?.['Article Content'] || '').trim().length > 0
        );

        // Create unique slugs if missing/duplicated
        const used = new Set<string>();
        const withDates: ArticleWithDate[] = rows.map((row, index) => {
          const baseSlug = (row['Slug'] || '').trim()
            ? slugify(row['Slug'])
            : slugify(row['Article Title']);
          const unique = makeUniqueSlug(baseSlug, used);

          const publishDate = getPublishDate(row, index);

          const imgs = extractImageUrls(row['Article Content']);
          const featuredImage = imgs.length ? imgs[imgs.length - 1] : undefined;

          return {
            ...row,
            Slug: unique,
            publishDate,
            index,
            featuredImage,
          };
        });

        setArticles(withDates);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || 'Something went wrong loading the blog posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchCsv();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const a of articles) {
      const c = (a.wp_category || '').trim();
      if (c) set.add(c);
    }
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [articles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = articles.slice();

    if (activeCategory !== 'All') {
      list = list.filter((a) => (a.wp_category || '').trim() === activeCategory);
    }

    if (q) {
      list = list.filter((a) => {
        const title = (a['Article Title'] || '').toLowerCase();
        const content = stripHtml(a['Article Content'] || '').toLowerCase();
        const meta = (a['Meta Title'] || '').toLowerCase();
        const desc = (a['Meta Description'] || '').toLowerCase();
        return (
          title.includes(q) ||
          content.includes(q) ||
          meta.includes(q) ||
          desc.includes(q)
        );
      });
    }

    list.sort((a, b) => {
      const at = a.publishDate.getTime();
      const bt = b.publishDate.getTime();
      return sortBy === 'newest' ? bt - at : at - bt;
    });

    return list;
  }, [articles, query, activeCategory, sortBy]);

  const featured = useMemo(() => filtered.slice(0, 3), [filtered]);
  const rest = useMemo(() => filtered.slice(3), [filtered]);

  const onCategoryClick = (c: string) => setActiveCategory(c);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* FIX: this used to be "< onOpenModal=... />" which breaks JSX */}
      <Navigation onOpenModal={() => setIsModalOpen(true)} />

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10">
        <header className="mb-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
                Invisalign Blog
              </h1>
              <p className="mt-2 max-w-2xl text-slate-300">
                Evidence-based Invisalign insights, tips, and guides. Search or browse by category.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortBy((s) => (s === 'newest' ? 'oldest' : 'newest'))}
                className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-200 hover:bg-slate-900"
              >
                Sort: {sortBy === 'newest' ? 'Newest' : 'Oldest'}
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-500"
              >
                Get a free consult
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-80">
                <Search />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles…"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-slate-100 placeholder:text-slate-400 outline-none focus:border-slate-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const active = c === activeCategory;
                return (
                  <button
                    key={c}
                    onClick={() => onCategoryClick(c)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      active
                        ? 'border-slate-400 bg-slate-200 text-slate-950'
                        : 'border-slate-700 bg-slate-900/30 text-slate-200 hover:bg-slate-900/70'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
            Loading articles…
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-6 text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
            No articles match your search.
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <section className="mb-12">
              <div className="mb-4 flex items-end justify-between">
                <h2 className="text-lg font-semibold text-slate-50">Featured</h2>
                <span className="text-sm text-slate-400">
                  Showing {filtered.length} article{filtered.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {featured.map((a) => {
                  const href = `/blog/${a.Slug}`;
                  const excerpt = getExcerpt(a['Article Content'], 140);

                  const titleHtml = highlight(a['Article Title'] || '', query);
                  const excerptHtml = highlight(excerpt, query);

                  return (
                    <Link
                      key={a.Slug}
                      href={href}
                      className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm transition hover:border-slate-600 hover:bg-slate-900/60"
                    >
                      {a.featuredImage && (
                        <div className="mb-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={a.featuredImage}
                            alt={a['Article Title']}
                            className="h-40 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                            loading="lazy"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs text-slate-400">
                          {a.wp_category ? a.wp_category : 'General'} • {formatDate(a.publishDate)}
                        </div>
                        <span className="opacity-60 transition group-hover:opacity-100">
                          <ArrowUpRight />
                        </span>
                      </div>

                      <h3
                        className="mt-2 text-base font-semibold text-slate-50"
                        dangerouslySetInnerHTML={{ __html: titleHtml }}
                      />

                      <p
                        className="mt-2 text-sm text-slate-300"
                        dangerouslySetInnerHTML={{ __html: excerptHtml }}
                      />
                    </Link>
                  );
                })}
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-end justify-between">
                <h2 className="text-lg font-semibold text-slate-50">All posts</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {rest.map((a) => {
                  const href = `/blog/${a.Slug}`;
                  const excerpt = getExcerpt(a['Article Content'], 170);

                  const titleHtml = highlight(a['Article Title'] || '', query);
                  const excerptHtml = highlight(excerpt, query);

                  return (
                    <Link
                      key={a.Slug}
                      href={href}
                      className="group flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/30 p-5 transition hover:border-slate-600 hover:bg-slate-900/60"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs text-slate-400">
                          {a.wp_category ? a.wp_category : 'General'} • {formatDate(a.publishDate)}
                        </div>
                        <span className="opacity-60 transition group-hover:opacity-100">
                          <ArrowUpRight />
                        </span>
                      </div>

                      <div className="flex gap-4">
                        {a.featuredImage && (
                          <div className="hidden w-28 flex-shrink-0 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 sm:block">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={a.featuredImage}
                              alt={a['Article Title']}
                              className="h-20 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                              loading="lazy"
                            />
                          </div>
                        )}

                        <div className="min-w-0">
                          <h3
                            className="text-base font-semibold text-slate-50"
                            dangerouslySetInnerHTML={{ __html: titleHtml }}
                          />
                          <p
                            className="mt-2 text-sm text-slate-300"
                            dangerouslySetInnerHTML={{ __html: excerptHtml }}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 rounded-full border border-slate-700 bg-slate-900/80 p-3 text-slate-100 shadow-lg hover:bg-slate-900"
          aria-label="Back to top"
        >
          <ChevronUp />
        </button>
      )}
    </div>
  );
}
