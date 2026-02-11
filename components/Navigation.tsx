'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from './Icons';

interface NavigationProps {
  onOpenModal: () => void;
}

export default function Navigation({ onOpenModal }: NavigationProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';

  return (
    <>
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled || !isHome ? 'glass-effect py-3 shadow-xl' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white font-black">ID</div>
            <span className="text-2xl font-black text-white">Invisalign Dentists</span>
          </Link>
          <div className="hidden md:flex items-center space-x-10 text-sm font-semibold">
            <Link href="/services" className={pathname === '/services' ? 'text-sky-400' : 'hover:text-sky-400'}>Services</Link>
            <Link href="/location" className={pathname === '/location' ? 'text-sky-400' : 'hover:text-sky-400'}>Location</Link>
            <Link href="/blog" className={pathname === '/blog' ? 'text-sky-400' : 'hover:text-sky-400'}>Blog</Link>
            <button onClick={onOpenModal} className="px-7 py-2.5 bg-sky-500 text-white rounded-full font-bold shadow-lg shadow-sky-500/20">Find a Provider</button>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 bg-white/5 rounded-xl"><Menu className="w-6 h-6" /></button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-sm transition-opacity duration-500 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}>
        <div className={`absolute top-0 right-0 h-full w-[65%] bg-slate-900 border-l border-white/5 p-6 pt-20 flex flex-col space-y-4 transition-transform duration-500 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-left px-4 py-3 font-bold">Home</Link>
          <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-left px-4 py-3 font-bold">Services</Link>
          <Link href="/location" onClick={() => setIsMobileMenuOpen(false)} className="text-left px-4 py-3 font-bold">Location</Link>
          <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-left px-4 py-3 font-bold">Blog</Link>
          <button onClick={() => { onOpenModal(); setIsMobileMenuOpen(false); }} className="text-left px-4 py-3 font-bold text-sky-400">Find a Provider</button>
        </div>
      </div>
    </>
  );
}
