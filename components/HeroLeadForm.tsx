'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface HeroLeadFormProps {
  city?: string;
  service?: string;
}

const TREATMENTS = [
  'Invisalign for Crowded Teeth',
  'Invisalign for Gaps',
  'Invisalign for Overbite',
  'Invisalign for Underbite',
  'Invisalign for Crossbite',
  'Invisalign for Adults',
];

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbz-B9H0JTI7a9Cgyn9z-pZXKnuiNm6acAn8Zb13N21qGRcpxy7EtVvlPAjpl6f7Hj3-RQ/exec';

export function HeroLeadForm({ city, service }: HeroLeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: city || '',
    treatment: service || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location || city || '',
        treatment: formData.treatment || service || '',
        page: window.location.href,
        source: 'Invisalign Dentists',
      };

      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data: { ok?: boolean; error?: string } = {};
      try { data = JSON.parse(text); } catch {}

      if (data && data.ok === false) throw new Error(data.error || 'Submission failed');

      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert('Something went wrong. Please try again.');
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition";

  if (isSuccess) {
    return (
      <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-100 flex flex-col items-center justify-center text-center gap-4 min-h-[340px]">
        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-display font-bold">Request Received!</h3>
        <p className="text-gray-600">
          We&apos;ve matched you with a Platinum Partner{city ? ` in ${city}` : ''}. Check your email for next steps.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900 rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-100">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
          Free Matching Service
        </span>
        <h3 className="text-2xl font-display font-bold leading-tight">
          Get Matched{city ? ` in ${city}` : ''}
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          Top local clinics will contact you within 2 hours
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input required name="fullName" type="text" value={formData.fullName} onChange={handleChange} placeholder="Full Name *" className={inputClass} />

        <div className="grid grid-cols-2 gap-3">
          <input required name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Phone Number *" className={inputClass} />
          <input required name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address *" className={inputClass} />
        </div>

        <select required name="treatment" value={formData.treatment} onChange={handleChange} className={inputClass + " appearance-none cursor-pointer"}>
          <option value="" disabled>Select Treatment *</option>
          {TREATMENTS.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {!city && (
          <input required name="location" type="text" value={formData.location} onChange={handleChange} placeholder="Your City / Location *" className={inputClass} />
        )}

        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm mt-1"
        >
          {isSubmitting ? 'Sending…' : 'Get 3 Free Quotes →'}
        </button>

        <div className="flex items-center justify-center gap-4 pt-1">
          {['100% Free', 'No Spam', '2hr Response'].map(item => (
            <span key={item} className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              {item}
            </span>
          ))}
        </div>
      </form>
    </div>
  );
}
