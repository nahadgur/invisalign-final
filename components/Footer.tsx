'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-16 mb-24 text-sm font-medium text-slate-500">
          <div>
            <div className="flex items-center gap-3 text-white mb-8">
              <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center font-black">ID</div>
              <span className="text-2xl font-black">Invisalign Dentists</span>
            </div>
            <p>Independent referral facilitator connecting consumers with top-rated orthodontic specialists across the UK.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-[10px]">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/location">Vetting</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-[10px]">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-[10px]">Contact</h4>
            <p className="text-white font-black text-xl">800-SMILE-MATCH</p>
            <p className="text-sky-500 mt-2 font-bold">support@invisaligndentists.com</p>
          </div>
        </div>
        <p className="text-center text-[10px] uppercase font-black tracking-widest opacity-50">
          © 2024 Invisalign Dentists Referral Network. We are a facilitator, not a dental provider.
        </p>
      </div>
    </footer>
  );
}
