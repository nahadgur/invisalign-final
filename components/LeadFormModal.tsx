'use client';

import React, { useState } from 'react';
import { CheckCircle } from './Icons';

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

const HeroLeadForm: React.FC<HeroLeadFormProps> = ({ city, service }) => {
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

      // Do NOT set Content-Type header — avoids CORS preflight with Google Apps Script
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data: { ok?: boolean; error?: string } = {};
      try { data = JSON.parse(text); } catch { /* non-JSON response is OK */ }

      if (data && data.ok === false) {
        throw new Error(data.error || 'Submission failed');
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert('Something went wrong. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-[2rem] p-8 shadow-2xl flex flex-col items-center justify-center text-center gap-6 min-h-[340px]">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10">
          <CheckCircle className="w-12 h-12" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Request Received!</h3>
          <p className="text-slate-500 font-medium">
            We&apos;ve matched you with a Platinum Partner{city ? ` in ${city}` : ''}. Check your email for next steps.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-2xl">
      <div className="mb-6">
        <div className="inline-block px-3 py-1 bg-sky-50 text-sky-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-3">
          Free Matching Service
        </div>
        <h3 className="text-2xl font-black text-slate-900 leading-tight">
          Get Matched{city ? ` in ${city}` : ''}
        </h3>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Top local clinics will contact you within 2 hours
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name *"
          className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border-2 border-slate-100 text-slate-700 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-400/10 outline-none transition-all placeholder:text-slate-400 text-sm font-medium"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            required
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number *"
            className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border-2 border-slate-100 text-slate-700 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-400/10 outline-none transition-all placeholder:text-slate-400 text-sm font-medium"
          />
          <input
            required
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address *"
            className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border-2 border-slate-100 text-slate-700 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-400/10 outline-none transition-all placeholder:text-slate-400 text-sm font-medium"
          />
        </div>

        <select
          required
          name="treatment"
          value={formData.treatment}
          onChange={handleChange}
          className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border-2 border-slate-100 text-slate-700 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-400/10 outline-none transition-all text-sm font-medium"
        >
          <option value="" disabled>Select Treatment *</option>
          {TREATMENTS.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {!city && (
          <input
            required
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="Your City / Location *"
            className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border-2 border-slate-100 text-slate-700 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-400/10 outline-none transition-all placeholder:text-slate-400 text-sm font-medium"
          />
        )}

        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full py-4 bg-sky-500 hover:bg-sky-600 disabled:opacity-70 text-white font-black text-base rounded-xl shadow-lg shadow-sky-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 relative overflow-hidden group/btn"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          {isSubmitting ? (
            <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Get 3 Free Quotes →</>
          )}
        </button>

        <div className="flex items-center justify-center gap-4 pt-1">
          <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            100% Free
          </span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            No Spam
          </span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            2hr Response
          </span>
        </div>
      </form>
    </div>
  );
};

export default HeroLeadForm;
