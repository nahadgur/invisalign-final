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

// If CSV content is mostly plain text / line breaks (no <p> tags), wrap into paragraphs
// so spacing + typography styles apply consistently.
const ensureParagraphs = (html: string) => {
  let h = (html || '').trim();
  if (!h) return '';

  // If it already has block-level structure, leave it alone.
  const hasBlocks =
    /<\s*p\b/i.test(h) ||
    /<\s*h[1-6]\b/i.test(h) ||
    /<\s*(ul|ol|table|blockquote|pre)\b/i.test(h);
  if (hasBlocks) return h;

  // Split into paragraphs based on double <br> or blank lines.
  const brSplit = h.split(/<br\s*\/?>\s*<br\s*\/?>/i).map((s) => s.trim()).filter(Boolean);
  if (brSplit.length > 1) {
    return brSplit
      .map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`)
      .join('');
  }

  const nlSplit = h.split(/\n\s*\n+/).map((s) => s.trim()).filter(Boolean);
  if (nlSplit.length > 1) {
    return nlSplit
      .map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`)
      .join('');
  }

  // Fallback: single paragraph, preserve single newlines as <br />.
  return `<p>${h.replace(/\n/g, '<br />')}</p>`;
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
                  cleanedHtml: ensureParagraphs(cleanArticleHtml(a['Article Content'])),
                };
              });

            // NOTE: We do not gate article visibility by publishDate on the article page,
            // so "Related articles" can always render 3 internal links.
            const found = all.find((a) => a.Slug === slug) || null;

            setArticle(found);

            if (found) {
              setFurtherReading(pickFurtherReading(found.Slug, 3));

              const sameCategory = all.filter(
                (a) => a.Slug !== slug && a.wp_category === found.wp_category
              );
              const fill = all.filter(
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
            className={[
              'p-10 max-w-none',
              // Headings
              '[&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:font-black [&_h1]:tracking-tight [&_h1]:text-white [&_h1]:mt-10 [&_h1]:mb-5',
              '[&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4',
              '[&_h3]:text-2xl [&_h3]:md:text-3xl [&_h3]:font-black [&_h3]:tracking-tight [&_h3]:text-white [&_h3]:mt-8 [&_h3]:mb-3',
              '[&_h4]:text-xl [&_h4]:font-black [&_h4]:text-white [&_h4]:mt-7 [&_h4]:mb-3',

              // Paragraphs
              '[&_p]:text-slate-300 [&_p]:font-medium [&_p]:leading-relaxed [&_p]:mb-5',

              // Links
              '[&_a]:text-sky-400 [&_a]:font-black [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-sky-300',

              // Lists
              // Ensure bullets/numbering are visible + nicely spaced
              '[&_ul]:my-6 [&_ul]:pl-7 [&_ul]:list-disc [&_ul]:list-outside [&_ul]:space-y-3 [&_ul]:text-slate-300 [&_ul]:font-medium',
              '[&_ol]:my-6 [&_ol]:pl-7 [&_ol]:list-decimal [&_ol]:list-outside [&_ol]:space-y-3 [&_ol]:text-slate-300 [&_ol]:font-medium',
              '[&_li]:leading-relaxed [&_li]:pl-1 [&_li]:marker:text-sky-400',

              // Blockquotes
              '[&_blockquote]:my-8 [&_blockquote]:rounded-3xl [&_blockquote]:border [&_blockquote]:border-white/10 [&_blockquote]:bg-white/5 [&_blockquote]:p-6 [&_blockquote]:text-slate-200 [&_blockquote]:font-medium',
              '[&_blockquote_p]:mb-0',

              // Horizontal rules
              '[&_hr]:my-10 [&_hr]:border-white/10',

              // Images
              '[&_img]:w-full [&_img]:h-auto [&_img]:rounded-3xl [&_img]:border [&_img]:border-white/10 [&_img]:shadow-2xl [&_img]:my-8',

              // Tables
              '[&_table]:w-full [&_table]:my-10 [&_table]:overflow-hidden [&_table]:rounded-3xl [&_table]:border [&_table]:border-white/10 [&_table]:bg-white/5 [&_table]:shadow-2xl',
              '[&_thead]:bg-white/10',
              '[&_th]:text-left [&_th]:px-5 [&_th]:py-4 [&_th]:text-white [&_th]:text-sm [&_th]:font-black [&_th]:tracking-wide',
              '[&_td]:px-5 [&_td]:py-4 [&_td]:text-slate-200 [&_td]:text-sm [&_td]:font-medium [&_td]:border-t [&_td]:border-white/10',
              'hover:[&_tbody_tr]:bg-white/5',

              // Code
              '[&_code]:px-2 [&_code]:py-1 [&_code]:rounded-lg [&_code]:bg-white/10 [&_code]:text-slate-100 [&_code]:text-[0.95em]',
              '[&_pre]:my-8 [&_pre]:p-6 [&_pre]:rounded-3xl [&_pre]:bg-white/5 [&_pre]:border [&_pre]:border-white/10 [&_pre]:overflow-x-auto',
            ].join(' ')}
            dangerouslySetInnerHTML={{ __html: article.cleanedHtml || '' }}
          />
        </div>

        {relatedArticles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-black text-white">Related articles</h2>

            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {relatedArticles.map((a) => (
                <Link
                  key={a.Slug}
                  href={`/blog/${a.Slug}`}
                  className="group rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col hover:border-sky-500/30 transition-all duration-500 shadow-2xl bg-slate-950"
                >
                  <div className="relative h-44 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                    {a.featuredImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.featuredImage}
                        alt={a['Article Title']}
                        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl opacity-10">📝</div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                    <div className="absolute top-5 left-5 px-4 py-1.5 bg-sky-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase rounded-full">
                      {a.wp_category}
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-white mb-4 group-hover:text-sky-400 transition-colors">
                      {a['Article Title']}
                    </h3>
                    <div className="flex items-center gap-2 text-sky-400 font-black uppercase tracking-widest text-[10px] mt-auto">
                      Read Article <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {furtherReading.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-black text-white">Further Reading</h2>
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
