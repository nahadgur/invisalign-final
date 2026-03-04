'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, MapPin, ChevronDown } from 'lucide-react';
import { services } from '@/data/services';
import { siteConfig } from '@/data/site';

interface HeaderProps {
  onOpenModal?: () => void;
}

export function Header({ onOpenModal }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-brand-900 text-brand-50 py-2 px-4 text-sm hidden md:block">
        <div className="container-width flex justify-between items-center">
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Platinum & Diamond Invisalign Providers Across the UK
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b transition-shadow duration-200 ${scrolled ? 'shadow-md border-gray-200' : 'shadow-sm border-gray-100'}`}>
        <div className="container-width">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
                <Image src="/logo.png" alt="Invisalign Dentists" width={40} height={40} priority className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl leading-none text-gray-900">Invisalign</span>
                <span className="text-xs text-brand-500 font-semibold tracking-widest uppercase">Dentists</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link href="/" className="px-3 py-2 text-gray-600 hover:text-brand-600 font-medium transition-colors rounded-lg hover:bg-brand-50">Home</Link>

              {/* Services Dropdown */}
              <div className="relative group">
                <Link href="/services/" className="flex items-center gap-1 px-3 py-2 text-gray-600 group-hover:text-brand-600 font-medium transition-colors rounded-lg group-hover:bg-brand-50">
                  Services <ChevronDown className="w-4 h-4" />
                </Link>
                <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0 p-2 z-50">
                  {services.map(service => (
                    <Link
                      key={service.id}
                      href={`/services/${service.slug}/`}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 rounded-lg transition-colors"
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/location/" className="px-3 py-2 text-gray-600 hover:text-brand-600 font-medium transition-colors rounded-lg hover:bg-brand-50">Locations</Link>
              <Link href="/blog/" className="px-3 py-2 text-gray-600 hover:text-brand-600 font-medium transition-colors rounded-lg hover:bg-brand-50">Blog</Link>

              <button onClick={onOpenModal} className="ml-3 btn-primary text-sm !py-2.5 !px-5 rounded-full">
                Find a Provider
              </button>
            </nav>

            {/* Mobile Toggle */}
            <button className="lg:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-xl z-50 max-h-[80vh] overflow-y-auto">
            <div className="px-4 pt-2 pb-6 space-y-1">
              <Link href="/" className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Home</Link>
              <div className="px-3 py-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Treatments</div>
                {services.map(s => (
                  <Link key={s.id} href={`/services/${s.slug}/`} className="block py-2 text-sm text-gray-600 hover:text-brand-600">{s.title}</Link>
                ))}
              </div>
              <Link href="/location/" className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Locations</Link>
              <Link href="/blog/" className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Blog</Link>
              <div className="pt-4 px-3">
                <button onClick={() => { onOpenModal?.(); setMobileOpen(false); }} className="block w-full btn-primary text-center">Find a Provider</button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
