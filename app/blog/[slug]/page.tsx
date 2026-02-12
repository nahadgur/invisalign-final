'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowUpRight, ChevronUp } from '@/components/Icons';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import LeadFormModal from '@/components/LeadFormModal';

/* =======================
   TYPES
======================= */

interface Article {
  'Article Title': string;
  'Article Content': string;
  'wp_category': string;
  'Slug': string;
  'Meta Title': string;
  'Meta Description': string;
  'Schema Markup': string;
  'Status': string;
  'Further Reading'?: string;
}

interface ArticleWithDate extends Article {
  publishDate: Date;
  index: number;
  featuredImage?: string;
  cleanedHtml?: string;
}

type ReadingLink = {
  url: string;
  label: string;
};

/* =======================
   SLUG HELPERS
======================= */

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

/* =======================
   IMAGE + HTML CLEANUP
======================= */

const extractImageUrls = (html: string): string[] => {
  const out: string[] = [];
  const s = html || '';

  const srcRe = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = srcRe.exec(s))) out.push(m[1]);

  const urlRe = /(https?:\/\/[^\s"']+\.(?:png|jpe?g|webp|gif))(?:\?[^\s"']*)?/gi;
  while ((m = urlRe.exec(s))) out.push(m[1]);

  return Array.from(new Set(out));
};

const cleanArticleHtml = (html: string) => {
  let h = html || '';

  // remove <strong> / <b>
  h = h.replace(/<\/?(strong|b)\b[^>]*>/gi, '');

  // strip inline styles
  h = h.replace(/\sstyle=["'][^"']*["']/gi, '');

  // remove width/height attrs on images
  h = h.replace(/\s(width|height)=["'][^"']*["']/gi, '');

  return h;
};

/* =======================
   FURTHER READING
======================= */

const FURTHER_READING_POOL: ReadingLink[] = [
  { url: 'https://www.invisalign.com', label: 'Invisalign (official site)' },
  { url: 'https://pubmed.ncbi.nlm.nih.gov/?term=invisalign', label: 'PubMed: Invisalign research' },
  { url: 'https://pubmed.ncbi.nlm.nih.gov/?term=clear+aligners', label: 'PubMed: Clear aligners research' },
  { url: 'https://www.mouthhealthy.org/all-topics-a-z/orthodontics', label: 'MouthHealthy (ADA): Orthodontics' },
  { url: 'https://www.nhs.uk/conditions/orthodontics/', label: 'NHS: Orthodontics' },
  { url: 'https://www.mayoclinic.org/tests-procedures/braces/about/pac-20384670', label: 'Mayo Clinic: Braces overview' },
  { url: 'https://www.cdc.gov/oralhealth', label: 'CDC: Oral health' },
  { url: 'https://www.ajodo.org', label: 'AJODO (orthodontic journal)' },
];

// Simple deterministic hash so each article gets a stable, different set.
const hashString = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const pickFurtherReading = (key: string, count: number = 3): ReadingLink[] => {
  const pool = FURTHER_READING_POOL;
  if (!pool.length) return [];
  const start = hashString(key || 'post') % pool.length;

  const out: ReadingLink[] = [];
  for (let i = 0; i < pool.length && out.length < Math.min(count, pool.length); i++) {
    out.push(pool[(start + i) % pool.length]);
  }
  return out;
};

/* =======================
   PAGE
======================= */

export default function ArticlePage() {
  const params = useParams();
  const rawSlug = params?.slug as string | string[] | undefined;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  const [article, setArticle] = useState<ArticleWithDate | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ArticleWithDate[]>([]);
  const [furtherReading, setFurtherReading] = useState<ReadingLink[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  /* Scroll */
  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setShowScrollTop(h > 0 && window.scrollY / h > 0.3);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  /* Load article */
  useEffect(() => {
    if (!slug) return;

    fetch('/articles.csv')
      .then((r) => r.text())
      .then((csvText) => {
        Papa.parse<Article>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const startDate = new Date('2026-02-10T00:00:00');
            const articlesPerDay = 3;
            const usedSlugs = new Set<string>();

            const all: ArticleWithDate[] = (results.data || [])
              .filter((a) => a?.['Article Title'])
              .map((a, index) => {
                const publishDate = new Date(startDate);
                publishDate.setDate(
                  publishDate.getDate() + Math.floor(index / articlesPerDay)
                );

                const uniqueSlug = makeUniqueSlug(
                  (a['Slug'] || '').trim() || slugify(a['Article Title']),
                  usedSlugs
                );

                const images = extractImageUrls(a['Article Content']);
                const featuredImage =
                  images.length > 0 ? images[images.length - 1] : undefined;

                return {
                  ...a,
                  Slug: uniqueSlug,
                  publishDate,
                  index,
                  featuredImage,
                  cleanedHtml: cleanArticleHtml(a['Article Content']),
                };
              });

            const published = all.filter((a) => a.publishDate <= new Date());
            const found = published.find((a) => a.Slug === slug) || null;

            setArticle(found);

            if (found) {
              setFurtherReading(pickFurtherReading(found.Slug, 3));

const sameCategory = published.filter(
                (a) => a.Slug !== slug && a.wp_category === found.wp_category
              );
              const fill = published.filter(
                (a) => a.Slug !== slug && a.wp_category !== found.wp_category
              );
              setRelatedArticles([...sameCategory, ...fill].slice(0, 3));
            }
          },
        });
      });
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <Navigation onOpenModal={() => setIsModalOpen(true)} />
        <div className="pt-32 px-6 max-w-5xl mx-auto">
          <h1 className="text-3xl font-black text-white">Article not found</h1>
          <Link href="/blog" className="text-sky-400 underline mt-6 inline-block">
            Back to blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  /* =======================
     RENDER
  ======================= */

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Navigation onOpenModal={() => setIsModalOpen(true)} />

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-white/5 border border-white/10"
        >
          <ChevronUp />
        </button>
      )}

      <div className="pt-32 px-6 max-w-5xl mx-auto">
        <Link href="/blog" className="text-sky-400 uppercase text-xs font-black">
          ← Back to blog
        </Link>

        <div className="mt-10 rounded-[2.5rem] overflow-hidden border border-white/10">
          <div className="relative h-[420px] md:h-[520px]">
            {article.featuredImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.featuredImage}
                alt={article['Article Title']}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="text-sm text-slate-300">
                {article.publishDate.toDateString()}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white">
                {article['Article Title']}
              </h1>
            </div>
          </div>

          <div
            className="p-10 max-w-none
              [&_h2]:text-3xl [&_h2]:font-black [&_h2]:text-white
              [&_p]:text-slate-300 [&_p]:leading-relaxed
              [&_img]:rounded-3xl [&_img]:border [&_img]:border-white/10 [&_img]:my-8
              [&_table]:w-full [&_table]:border [&_table]:border-white/10
              [&_th]:p-4 [&_th]:text-white [&_th]:font-black
              [&_td]:p-4 [&_td]:border-t [&_td]:border-white/10"
            dangerouslySetInnerHTML={{ __html: article.cleanedHtml || '' }}
          />
        </div>

        {furtherReading.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-black text-white">
              Further Reading
            </h2>
            <ul className="mt-6 space-y-3">
              {furtherReading.map((l) => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 underline underline-offset-4"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
