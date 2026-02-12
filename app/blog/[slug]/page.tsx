'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowUpRight, ChevronUp } from '@/components/Icons';
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
  cleanedHtml?: string;
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

  // remove <strong> tags (keep content)
  h = h.replace(/<\/?strong\b[^>]*>/gi, '');

  // strip inline styles so your design wins
  h = h.replace(/\sstyle=["'][^"']*["']/gi, '');

  // remove explicit img width/height to allow responsive styling
  h = h.replace(/\s(width|height)=["'][^"']*["']/gi, '');

  // normalize multiple <br> into one
  h = h.replace(/(<br\s*\/?>\s*){3,}/gi, '<br /><br />');

  return h;
};

export default function ArticlePage() {
  const params = useParams();
  const rawSlug = params?.slug as string | string[] | undefined;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  const [article, setArticle] = useState<ArticleWithDate | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ArticleWithDate[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
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
            const startDate = new Date('2026-02-10T00:00:00');
            const articlesPerDay = 3;
            const usedSlugs = new Set<string>();

            const all: ArticleWithDate[] = (results.data || [])
              .filter((a: Article) => a && a['Article Title'] && a['Article Title'].trim())
              .map((a: Article, index: number) => {
                const dayOffset = Math.floor(index / articlesPerDay);
                const publishDate = new Date(startDate);
                publishDate.setDate(publishDate.getDate() + dayOffset);

                const baseSlug =
                  (a['Slug'] || '').trim() || slugify(a['Article Title']);
                const uniqueSlug = makeUniqueSlug(baseSlug, usedSlugs);

                const imgs = extractImageUrls(a['Article Content'] || '');
                const featuredImage = imgs.length ? imgs[imgs.length - 1] : undefined;

                const cleanedHtml = cleanArticleHtml(a['Article Content'] || '');

                return {
                  ...a,
                  Slug: uniqueSlug,
                  publishDate,
                  index,
                  featuredImage,
                  cleanedHtml,
                };
              });

            const now = new Date();
            const published = all.filter((a) => a.publishDate <= now);

            const found = published.find((a) => a.Slug === slug) || null;
            setArticle(found);

            if (found) {
              const related = published
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

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

  const getExcerpt = (content: string, length: number = 120) => {
    const text = (content || '').replace(/<[^>]*>/g, '');
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const bodyHtml = useMemo(() => {
    return article?.cleanedHtml || '';
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <Navigation onOpenModal={() => setIsModalOpen(true)} />

        <div className="pt-32 pb-24 px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-black text-white">Article not found</h1>
            <p className="mt-4 text-slate-400 font-medium">
              This post may not be published yet, or the URL slug doesn’t match.
            </p>
            <div className="mt-8">
              <Link
                href="/blog"
                className="text-sky-400 font-black uppercase tracking-widest text-[11px] underline underline-offset-4"
              >
                Back to blog
              </Link>
            </div>
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
        className={`fixed bottom-6 left-6 z-[70] w-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 text-slate-400 rounded-full flex items-center justify-center transition-all duration-500 ${
          showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      <div className="pt-32 pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/blog"
            className="text-sky-400 font-black uppercase tracking-widest text-[11px] underline underline-offset-4"
          >
            Back to blog
          </Link>

          <div className="mt-10 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
            <div className="relative h-[340px] bg-gradient-to-br from-slate-800 to-slate-900">
              {article.featuredImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.featuredImage}
                  alt={article['Article Title']}
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

              <div className="absolute top-8 left-8 px-4 py-1.5 bg-sky-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase rounded-full">
                {article.wp_category}
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                <div className="text-slate-300 text-sm font-medium">
                  {formatDate(article.publishDate)}
                </div>
                <h1 className="mt-2 text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
                  {article['Article Title']}
                </h1>
              </div>
            </div>

            <div className="p-8 md:p-12 bg-slate-950">
              <div
                className={[
                  "max-w-none",
                  "text-slate-200",
                  "leading-relaxed",

                  // Headings (use your site look: bold, tight, white)
                  "[&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:font-black [&_h1]:tracking-tight [&_h1]:text-white [&_h1]:mt-10 [&_h1]:mb-5",
                  "[&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4",
                  "[&_h3]:text-2xl [&_h3]:md:text-3xl [&_h3]:font-black [&_h3]:tracking-tight [&_h3]:text-white [&_h3]:mt-8 [&_h3]:mb-3",
                  "[&_h4]:text-xl [&_h4]:font-black [&_h4]:text-white [&_h4]:mt-7 [&_h4]:mb-3",

                  // Paragraphs
                  "[&_p]:text-slate-300 [&_p]:font-medium [&_p]:leading-relaxed [&_p]:mb-5",

                  // Links
                  "[&_a]:text-sky-400 [&_a]:font-black [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-sky-300",

                  // Lists
                  "[&_ul]:my-6 [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:text-slate-300 [&_ul]:font-medium",
                  "[&_ol]:my-6 [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:text-slate-300 [&_ol]:font-medium",
                  "[&_li]:leading-relaxed",

                  // Blockquotes
                  "[&_blockquote]:my-8 [&_blockquote]:rounded-3xl [&_blockquote]:border [&_blockquote]:border-white/10 [&_blockquote]:bg-white/5 [&_blockquote]:p-6 [&_blockquote]:text-slate-200 [&_blockquote]:font-medium",
                  "[&_blockquote_p]:mb-0",

                  // Horizontal rules
                  "[&_hr]:my-10 [&_hr]:border-white/10",

                  // Images
                  "[&_img]:w-full [&_img]:h-auto [&_img]:rounded-3xl [&_img]:border [&_img]:border-white/10 [&_img]:shadow-2xl [&_img]:my-8",

                  // Tables (overhaul)
                  "[&_table]:w-full [&_table]:my-10 [&_table]:overflow-hidden [&_table]:rounded-3xl [&_table]:border [&_table]:border-white/10 [&_table]:bg-white/5 [&_table]:shadow-2xl",
                  "[&_thead]:bg-white/10",
                  "[&_th]:text-left [&_th]:px-5 [&_th]:py-4 [&_th]:text-white [&_th]:text-sm [&_th]:font-black [&_th]:tracking-wide",
                  "[&_td]:px-5 [&_td]:py-4 [&_td]:text-slate-200 [&_td]:text-sm [&_td]:font-medium [&_td]:border-t [&_td]:border-white/10",
                  "hover:[&_tbody_tr]:bg-white/5",

                  // Code
                  "[&_code]:px-2 [&_code]:py-1 [&_code]:rounded-lg [&_code]:bg-white/10 [&_code]:text-slate-100 [&_code]:text-[0.95em]",
                  "[&_pre]:my-8 [&_pre]:p-6 [&_pre]:rounded-3xl [&_pre]:bg-white/5 [&_pre]:border [&_pre]:border-white/10 [&_pre]:overflow-x-auto",

                  // Remove any leftover bold tags that might come from <b>
                  "[&_b]:font-normal [&_b]:text-inherit",
                ].join(' ')}
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            </div>
          </div>

          {relatedArticles.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-black text-white">Related articles</h2>

              <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {relatedArticles.map((a) => (
                  <Link
                    key={a.Slug}
                    href={`/blog/${a.Slug}`}
                    className="group dark-card rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col hover:border-sky-500/30 transition-all duration-500 shadow-2xl"
                  >
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
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
                      <div className="absolute top-6 left-6 px-4 py-1.5 bg-sky-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase rounded-full">
                        {a.wp_category}
                      </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-xl font-black text-white mb-4 group-hover:text-sky-400 transition-colors">
                        {a['Article Title']}
                      </h3>
                      <p className="text-slate-400 font-medium mb-8 flex-1">
                        {getExcerpt(a['Article Content'] || '')}
                      </p>
                      <div className="flex items-center gap-2 text-sky-400 font-black uppercase tracking-widest text-[10px]">
                        Read Article <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
