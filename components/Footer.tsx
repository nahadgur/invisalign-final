import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { services } from '@/data/services';
import { siteConfig } from '@/data/site';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container-width">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-md flex items-center justify-center text-white font-bold">ID</div>
              <span className="font-display font-bold text-lg text-white">Invisalign Dentists</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Independent referral facilitator connecting patients with top-rated Platinum and Diamond Invisalign providers across the UK.
            </p>
            <p className="text-xs text-gray-500 italic border-l-2 border-gray-700 pl-3">
              Invisalign Dentists is a referral facilitator. We connect you with independent dental professionals. We do not perform treatment ourselves.
            </p>
          </div>

          {/* Treatments */}
          <div>
            <h4 className="text-white font-semibold mb-4">Treatments</h4>
            <ul className="space-y-2 text-sm">
              {services.map(s => (
                <li key={s.id}>
                  <Link href={`/services/${s.slug}/`} className="hover:text-brand-400 transition-colors">{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Popular Locations</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Invisalign London', href: '/location/london/' },
                { label: 'Invisalign Manchester', href: '/location/manchester/' },
                { label: 'Invisalign Birmingham', href: '/location/birmingham/' },
                { label: 'Invisalign Leeds', href: '/location/leeds/' },
                { label: 'Invisalign Bristol', href: '/location/bristol/' },
                { label: 'Invisalign Edinburgh', href: '/location/edinburgh/' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4 text-brand-500" /> United Kingdom
              </li>
            </ul>
            <p className="text-brand-400 mt-4 font-bold">support@invisaligndentists.com</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} {siteConfig.name}. We are a facilitator, not a dental provider.</p>
          <div className="flex gap-6">
            <Link href="/sitemap.xml" className="hover:text-gray-300">Sitemap</Link>
            <Link href="/services/" className="hover:text-gray-300">Services</Link>
            <Link href="/location/" className="hover:text-gray-300">Locations</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
