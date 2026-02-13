
'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, X } from './Icons';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeadFormModal: React.FC<LeadFormModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animationState, setAnimationState] = useState<'idle' | 'entering' | 'exiting'>('idle');

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setAnimationState('entering');
    } else if (shouldRender) {
      setAnimationState('exiting');
      const timer = setTimeout(() => {
        setShouldRender(false);
        setAnimationState('idle');
      }, 300); // Match exit animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const form = e.currentTarget;
    const fullName = (form.elements[0] as HTMLInputElement).value;
    const email = (form.elements[1] as HTMLInputElement).value;
    const location = (form.elements[2] as HTMLInputElement).value;

    const payload = {
      fullName,
      email,
      location,
      page: window.location.href,
      source: "Savvy Dental Implants",
    };

    const res = await fetch(
      'https://script.google.com/macros/s/AKfycbz-B9H0JTI7a9Cgyn9z-pZXKnuiNm6acAn8Zb13N21qGRcpxy7EtVvlPAjpl6f7Hj3-RQ/exec',
      {
        method: 'POST',
        // IMPORTANT: do NOT set Content-Type: application/json (causes CORS preflight)
        body: JSON.stringify(payload),
      }
    );

    // Apps Script sometimes returns text; parse safely
    const text = await res.text();
    let data: any = {};
    try { data = JSON.parse(text); } catch {}

    if (data && data.ok === false) {
      throw new Error(data.error || 'Submission failed');
    }

    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 3000);
  } catch (err) {
    console.error(err);
    setIsSubmitting(false);
    alert("Something went wrong. Please try again.");
  }
};



  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md 
        ${animationState === 'entering' ? 'animate-backdrop-in' : animationState === 'exiting' ? 'animate-backdrop-out' : 'opacity-100'}`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`relative w-full max-w-lg overflow-hidden bg-white rounded-[2.5rem] shadow-[0_48px_96px_-12px_rgba(0,0,0,0.9)] 
          ${animationState === 'entering' ? 'animate-modal-in' : 'animate-modal-out'}`}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-500 hover:bg-slate-50 rounded-full transition-all z-10"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 md:p-12">
          {isSuccess ? (
            <div className="flex flex-col items-center text-center py-12 space-y-6">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <CheckCircle className="w-14 h-14" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Request Received</h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                  We've successfully matched you with a Platinum Partner in your area. Check your email for next steps.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="inline-block px-3 py-1 bg-sky-50 text-sky-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-3 shadow-sm shadow-sky-100">
                  Priority Referral
                </div>
                <h2 className="text-3xl font-black text-slate-900 leading-tight">Start Your Smile Journey</h2>
                <p className="text-slate-500 mt-2 font-medium">
                  Complete the form to get matched with vetted Invisalign specialists in your area.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5 group">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-sky-500 transition-colors">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 text-slate-700 focus:border-sky-400 focus:bg-white focus:ring-8 focus:ring-sky-400/5 outline-none transition-all placeholder:text-slate-300" 
                    placeholder="E.g. Alexander Hamilton" 
                  />
                </div>
                <div className="space-y-1.5 group">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-sky-500 transition-colors">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 text-slate-700 focus:border-sky-400 focus:bg-white focus:ring-8 focus:ring-sky-400/5 outline-none transition-all placeholder:text-slate-300" 
                    placeholder="alex@example.com" 
                  />
                </div>
                <div className="space-y-1.5 group">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 group-focus-within:text-sky-500 transition-colors">Your City / Location</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 text-slate-700 focus:border-sky-400 focus:bg-white focus:ring-8 focus:ring-sky-400/5 outline-none transition-all placeholder:text-slate-300" 
                    placeholder="e.g. Manchester, UK" 
                  />
                </div>
                
                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className="w-full py-5 mt-4 bg-sky-500 hover:bg-sky-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-sky-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Verify Availability
                      <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 mt-6">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    facilitator service • free initial consultation
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadFormModal;
