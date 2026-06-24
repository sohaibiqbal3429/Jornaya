'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight } from 'lucide-react';
import { useLeadId } from '@/components/leadid/LeadIdProvider';

const PremiumSubmissionAlert = dynamic(
  () => import('@/components/PremiumSubmissionAlert').then((module) => module.PremiumSubmissionAlert),
);

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  zipCode: string;
  email: string;
};

type FormFieldName = keyof FormData;

type SubmissionAlertState = {
  open: boolean;
  title: string;
  message: string;
  variant: 'success' | 'error';
};

type HomeLeadFormProps = {
  consentText: string;
  consentTextVersion: string;
};

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  phone: '',
  zipCode: '',
  email: '',
};

const requiredFields = [
  { name: 'firstName', label: 'First name' },
  { name: 'lastName', label: 'Last name' },
  { name: 'phone', label: 'Phone number' },
  { name: 'zipCode', label: 'ZIP code' },
] as const satisfies ReadonlyArray<{ name: Exclude<FormFieldName, 'email'>; label: string }>;

export function HomeLeadForm({ consentText, consentTextVersion }: HomeLeadFormProps) {
  const { debug: leadIdDebug, waitForValidToken } = useLeadId();
  const [verificationParentSubmissionId, setVerificationParentSubmissionId] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FormFieldName, string>>>({});
  const mirroredLeadIdTokenRef = useRef<HTMLInputElement>(null);
  const [submissionAlert, setSubmissionAlert] = useState<SubmissionAlertState>({
    open: false,
    title: '',
    message: '',
    variant: 'success',
  });
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    const parentId = new URLSearchParams(window.location.search).get('verification_parent_submission_id')?.trim() || '';
    setVerificationParentSubmissionId(parentId);
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (!Object.prototype.hasOwnProperty.call(formData, name)) {
      return;
    }

    const fieldName = name as FormFieldName;

    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    setFieldErrors((prev) => {
      if (!prev[fieldName]) {
        return prev;
      }

      const next = { ...prev };
      if (value.trim()) {
        delete next[fieldName];
      }
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextFieldErrors = requiredFields.reduce<Partial<Record<FormFieldName, string>>>((errors, field) => {
      if (!formData[field.name].trim()) {
        errors[field.name] = `${field.label} is required.`;
      }
      return errors;
    }, {});

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setSubmissionAlert({
        open: true,
        title: 'A few details are missing',
        message: 'Please add your first name, last name, phone number, and ZIP code before sending your request.',
        variant: 'error',
      });
      return;
    }

    setFieldErrors({});

    if (!consentChecked) {
      setConsentError('Please review and accept the communication consent before continuing.');
      return;
    }

    const leadIdTokenValue = await waitForValidToken(6_000);

    if (!leadIdTokenValue) {
      setSubmissionAlert({
        open: true,
        title: 'Secure tracking token unavailable',
        message: 'The Jornaya LeadiD token is not available yet. Please wait a moment and try again.',
        variant: 'error',
      });
      return;
    }

    const payload = {
      formType: 'legal_intake_contact',
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      zipCode: formData.zipCode,
      serviceInterest: 'Alpha Legal Intake consultation',
      message: `Legal intake requested for ZIP code ${formData.zipCode}.`,
      consent_checked: true,
      consent_timestamp: new Date().toISOString(),
      consent_text_version: consentTextVersion,
      leadiD_token: leadIdTokenValue,
      leadid_token: leadIdTokenValue,
      universal_leadid: mirroredLeadIdTokenRef.current?.value.trim() || leadIdTokenValue,
      page_url: window.location.href,
      page_source: verificationParentSubmissionId ? 'Alpha Legal Intake landing page verification replay' : 'Alpha Legal Intake landing page',
      leadid_debug: {
        ...leadIdDebug,
        submittedAt: new Date().toISOString(),
        verificationParentSubmissionId: verificationParentSubmissionId || null,
      },
      verification_parent_submission_id: verificationParentSubmissionId || undefined,
    };

    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setSubmissionAlert({
        open: true,
        title: 'Your Intake Request Has Been Received',
        message:
          'Thank you for choosing Alpha Legal Intake. An intake specialist may contact you shortly to verify accident details and coordinate next steps.',
        variant: 'success',
      });

      setFormData(initialFormData);
      setConsentChecked(false);
      setConsentError('');
    } catch {
      setSubmissionAlert({
        open: true,
        title: 'We could not send the request',
        message: 'Please try again in a moment or call us directly for assistance.',
        variant: 'error',
      });
    }
  };

  const inputBase =
    'mt-2 w-full rounded-2xl border bg-white/90 px-4 py-3.5 text-[#082033] shadow-sm outline-none transition duration-300 placeholder:text-[#8da1ad] focus:-translate-y-0.5 focus:border-[#16a3a8] focus:ring-4 focus:ring-[#7dd3fc]/20';

  return (
    <>
      {submissionAlert.open ? (
        <PremiumSubmissionAlert
          open={submissionAlert.open}
          title={submissionAlert.title}
          message={submissionAlert.message}
          variant={submissionAlert.variant}
          onClose={() => setSubmissionAlert((prev) => ({ ...prev, open: false }))}
        />
      ) : null}

      <form onSubmit={handleSubmit} className="rounded-[3rem] border border-white/90 bg-white/90 p-6 shadow-[0_28px_85px_rgba(8,32,51,0.12)] backdrop-blur-xl sm:p-8 lg:p-10">
        <input ref={mirroredLeadIdTokenRef} id="leadid_token_form" name="universal_leadid" type="hidden" />
        <input name="verification_parent_submission_id" type="hidden" value={verificationParentSubmissionId} readOnly />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#128a8f]">Secure legal intake</p>
            <h3 className="mt-2 text-3xl font-black tracking-[-0.055em] text-[#082033]">Tell us where your firm needs support.</h3>
          </div>
          <div className="hidden rounded-full bg-[#effaf9] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#0a5962] sm:block">Attorney-ready</div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="text-sm font-black text-[#254653]">First name *</label>
            <input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              autoComplete="given-name"
              aria-invalid={fieldErrors.firstName ? 'true' : 'false'}
              className={`${inputBase} ${fieldErrors.firstName ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100' : 'border-[#d7e8ec]'}`}
            />
            {fieldErrors.firstName ? <p className="mt-2 text-sm font-semibold text-red-600">{fieldErrors.firstName}</p> : null}
          </div>
          <div>
            <label htmlFor="lastName" className="text-sm font-black text-[#254653]">Last name *</label>
            <input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              autoComplete="family-name"
              aria-invalid={fieldErrors.lastName ? 'true' : 'false'}
              className={`${inputBase} ${fieldErrors.lastName ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100' : 'border-[#d7e8ec]'}`}
            />
            {fieldErrors.lastName ? <p className="mt-2 text-sm font-semibold text-red-600">{fieldErrors.lastName}</p> : null}
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="text-sm font-black text-[#254653]">Phone number *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              autoComplete="tel"
              aria-invalid={fieldErrors.phone ? 'true' : 'false'}
              className={`${inputBase} ${fieldErrors.phone ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100' : 'border-[#d7e8ec]'}`}
            />
            {fieldErrors.phone ? <p className="mt-2 text-sm font-semibold text-red-600">{fieldErrors.phone}</p> : null}
          </div>
          <div>
            <label htmlFor="zipCode" className="text-sm font-black text-[#254653]">ZIP code *</label>
            <input
              id="zipCode"
              name="zipCode"
              inputMode="numeric"
              autoComplete="postal-code"
              value={formData.zipCode}
              onChange={handleInputChange}
              aria-invalid={fieldErrors.zipCode ? 'true' : 'false'}
              className={`${inputBase} ${fieldErrors.zipCode ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100' : 'border-[#d7e8ec]'}`}
            />
            {fieldErrors.zipCode ? <p className="mt-2 text-sm font-semibold text-red-600">{fieldErrors.zipCode}</p> : null}
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="email" className="text-sm font-black text-[#254653]">
            Email address <span className="font-semibold text-[#6a828d]">(optional)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            autoComplete="email"
            className={`${inputBase} border-[#d7e8ec]`}
          />
        </div>

        <div className={`mt-6 rounded-[1.6rem] border p-5 ${consentError ? 'border-red-300 bg-red-50' : 'border-[#d7e8ec] bg-[#f7fcfc]'}`}>
          <label htmlFor="consent" className="flex items-start gap-4 text-sm leading-6 text-[#4f6875]">
            <input
              id="consent"
              type="checkbox"
              checked={consentChecked}
              onChange={(event) => {
                setConsentChecked(event.target.checked);
                if (event.target.checked) {
                  setConsentError('');
                }
              }}
              className="mt-1 h-5 w-5 rounded border-[#9fb9c1] text-[#0d9488] accent-[#0d9488]"
            />
            <span>{consentText}</span>
          </label>
          {consentError ? <p className="mt-3 text-sm font-semibold text-red-600">{consentError}</p> : null}
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#062a3c] px-7 py-4 text-base font-black text-white shadow-[0_22px_42px_rgba(6,42,60,0.22)] transition hover:-translate-y-1 hover:bg-[#0b3b53]"
        >
          Send my support <ArrowRight className="h-5 w-5" />
        </button>
      </form>
    </>
  );
}
