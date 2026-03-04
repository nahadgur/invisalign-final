'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbz-B9H0JTI7a9Cgyn9z-pZXKnuiNm6acAn8Zb13N21qGRcpxy7EtVvlPAjpl6f7Hj3-RQ/exec';

export function LeadFormModal({ isOpen, onClose }: LeadFormModalProps) {
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
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

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
        source: 'Invisalign Dentists',
      };

      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data: any = {};
      try { data = JSON.parse(text); } catch {}

      if (data && data.ok === false) throw new Error(data.error || 'Submission failed');

      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => { setIsSuccess(false); onClose(); }, 3000);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm
        ${animationState === 'entering' ? 'animate-backdrop-in' : animationState === 'exiting' ? 'animate-backdrop-out' : 'opacity-100'}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`relative w-full max-w-lg overflow-hidden bg-white rounded-2xl shadow-2xl
          ${animationState === 'entering' ? 'animate-modal-in' : 'animate-modal-out'}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {isSuccess ? (
            <div className="flex flex-col items-center text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-display font-bold text-gray-900">Request Received!</h2>
              <p className="text-gray-600">We&apos;ve matched you with a Platinum Partner. Check your email for next steps.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                  Free Matching Service
                </span>
                <h2 className="text-2xl font-display font-bold text-gray-900">Start Your Smile Journey</h2>
                <p className="text-gray-600 text-sm mt-1">Complete the form to get matched with vetted Invisalign specialists.</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input required type="text" placeholder="Full name" className={inputClass} />
                <input required type="email" placeholder="Email address" className={inputClass} />
                <input required type="text" placeholder="Your city / location" className={inputClass} />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm mt-1"
                >
                  {isSubmitting ? 'Sending…' : 'Verify Availability →'}
                </button>

                <p className="text-center text-xs text-gray-400 mt-1">
                  Facilitator service · Free initial consultation
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
