'use client';

import { useEffect } from 'react';
import { CheckCircle2, Sparkles, X, XCircle } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';

type PremiumSubmissionAlertProps = {
  open: boolean;
  title: string;
  message: string;
  variant?: 'success' | 'error';
  onClose: () => void;
};

export function PremiumSubmissionAlert({
  open,
  title,
  message,
  variant = 'success',
  onClose,
}: PremiumSubmissionAlertProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const isSuccess = variant === 'success';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#03131dcc] p-4 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="submission-alert-title"
        className="apha-modal-enter relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,32,51,0.96),rgba(6,24,38,0.94))] text-white shadow-[0_36px_120px_rgba(0,0,0,0.45)]"
      >
        <div
          className={`absolute inset-x-0 top-0 h-1 ${
            isSuccess ? 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400' : 'bg-gradient-to-r from-rose-400 via-orange-400 to-rose-400'
          }`}
        />
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#2dd4bf]/18 blur-3xl" />
        <div className="absolute left-[-3rem] top-24 h-44 w-44 rounded-full bg-[#60a5fa]/18 blur-3xl" />
        <div className="absolute bottom-[-4rem] right-14 h-44 w-44 rounded-full bg-white/6 blur-3xl" />

        <div className="relative border border-white/5 bg-white/[0.03] p-6 sm:p-7">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mb-5 flex items-start justify-between gap-4 pr-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 backdrop-blur">
              <Sparkles className="h-4 w-4 text-[#7dd3fc]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#d8eef0]">Secure intake update</span>
            </div>
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] ${
                isSuccess
                  ? 'bg-emerald-500/16 text-emerald-300 ring-1 ring-emerald-400/35'
                  : 'bg-rose-500/16 text-rose-300 ring-1 ring-rose-400/35'
              }`}
            >
              {isSuccess ? <CheckCircle2 className="h-7 w-7" /> : <XCircle className="h-7 w-7" />}
            </div>
          </div>

          <div className="mb-6">
            <BrandMark tone="light" size="compact" />
          </div>

          <h3 id="submission-alert-title" className="text-2xl font-black tracking-[-0.045em] text-white">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-[#c6d9df] sm:text-[0.96rem]">{message}</p>

          <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-white/[0.05] p-4 text-sm text-[#d8eef0]">
            {isSuccess
              ? 'Your information has been queued for secure review. Apha uses this request to help coordinate the next conversation around available Medicare-related coverage options.'
              : 'The secure intake record could not be completed. Please retry in a moment or contact Apha Health Plan directly for assistance.'}
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full px-4 text-sm font-bold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#082033] ${
              isSuccess
                ? 'bg-gradient-to-r from-[#0d9488] to-[#2563eb] shadow-[0_18px_42px_rgba(13,148,136,0.28)] hover:-translate-y-0.5'
                : 'bg-gradient-to-r from-[#f97316] to-[#ef4444] shadow-[0_18px_42px_rgba(249,115,22,0.22)] hover:-translate-y-0.5'
            }`}
          >
            {isSuccess ? 'Return to Apha' : 'Try again'}
          </button>
        </div>
      </div>
    </div>
  );
}
