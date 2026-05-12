'use client';

import { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/context/LanguageContext';
import type { GuestRegistrationData, TravelerData, TravelerErrors, FormStep, IdDocumentType } from '@/types/guest-identity';

const SignaturePad = dynamic(() => import('@/components/SignaturePad'), { ssr: false });

const STEPS: FormStep[] = ['personal', 'upload', 'signature'];

const emptyTraveler = (): TravelerData => ({
  firstName: '', lastName: '', dateOfBirth: '', placeOfBirth: '',
  nationality: '', idType: 'cin', idNumber: '', idExpiryDate: '',
  address: '', idFrontPhoto: null, idBackPhoto: null,
});

const emptyForm = (): GuestRegistrationData => ({
  travelers: [emptyTraveler()],
  checkInDate: '',
  checkOutDate: '',
  signature: '',
});

// ─── Step Indicator ───────────────────────────────────────────────────────────

const StepIndicator = ({ currentStep, labels }: {
  currentStep: FormStep;
  labels: { personal: string; upload: string; signature: string };
}) => {
  const idx = STEPS.indexOf(currentStep);
  return (
    <nav aria-label="Progress" className="mb-10">
      <ol className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <li key={step} className="flex-1 flex items-center">
              <div className="flex flex-col items-center w-full">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors
                  ${done ? 'bg-primary-600 border-primary-600 text-white' : active ? 'border-primary-600 text-primary-600 bg-white' : 'border-gray-300 text-gray-400 bg-white'}`}>
                  {done
                    ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    : i + 1}
                </div>
                <span className={`mt-2 text-xs font-medium text-center ${active ? 'text-primary-600' : done ? 'text-gray-700' : 'text-gray-400'}`}>
                  {labels[step]}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-5 ${done ? 'bg-primary-600' : 'bg-gray-200'}`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// ─── Trust Banner ─────────────────────────────────────────────────────────────

const TrustBanner = ({ heading, subtitle, items }: { heading: string; subtitle: string; items: readonly string[] }) => (
  <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 mt-6">
    <div className="flex items-start gap-3">
      <div className="shrink-0 w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <div>
        <h3 className="text-sm font-bold text-amber-800 mb-0.5">{heading}</h3>
        <p className="text-xs text-amber-700 mb-3">{subtitle}</p>
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-amber-800">
              <svg className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

// ─── Photo Upload ─────────────────────────────────────────────────────────────

interface PhotoUploadProps {
  label: string; file: File | null; onChange: (f: File | null) => void;
  clickLabel: string; dragLabel: string; fileTypesLabel: string;
  previewLabel: string; changeLabel: string; required?: boolean;
}

const PhotoUpload = ({ label, file, onChange, clickLabel, dragLabel, fileTypesLabel, previewLabel, changeLabel, required }: PhotoUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) return;
    onChange(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          <img src={preview} alt={previewLabel} className="w-full max-h-48 object-contain bg-gray-50" />
          <button type="button" onClick={() => { setPreview(null); onChange(null); }}
            className="absolute top-2 right-2 bg-white text-gray-600 hover:text-red-600 rounded-full px-2 py-1 shadow text-xs font-medium border border-gray-200">
            {changeLabel}
          </button>
        </div>
      ) : (
        <div onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
            ${dragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 bg-gray-50'}`}>
          <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm text-gray-600"><span className="font-semibold text-primary-600">{clickLabel}</span> {dragLabel}</p>
          <p className="text-xs text-gray-400 mt-1">{fileTypesLabel}</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
};

// ─── Review Row ───────────────────────────────────────────────────────────────

const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-4 py-1.5 border-b border-gray-100 last:border-0">
    <span className="w-40 shrink-0 text-xs font-medium text-gray-500">{label}</span>
    <span className="text-xs text-gray-900">{value || '—'}</span>
  </div>
);

// ─── Traveler Personal Fields ─────────────────────────────────────────────────

interface PersonalLabels {
  heading: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  idType: string;
  idTypes: { cin: string; passport: string; residence: string; other: string };
  idNumber: string;
  idExpiryDate: string;
  address: string;
  checkInDate: string;
  checkOutDate: string;
}

interface TravelerFieldsProps {
  traveler: TravelerData;
  errors: TravelerErrors;
  onChange: (field: keyof TravelerData, value: string | IdDocumentType) => void;
  labels: PersonalLabels;
}

const TravelerFields = ({ traveler, errors, onChange, labels }: TravelerFieldsProps) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <Field label={labels.firstName} error={errors.firstName}>
        <input value={traveler.firstName} onChange={(e) => onChange('firstName', e.target.value)}
          className={inputCls(!!errors.firstName)} />
      </Field>
      <Field label={labels.lastName} error={errors.lastName}>
        <input value={traveler.lastName} onChange={(e) => onChange('lastName', e.target.value)}
          className={inputCls(!!errors.lastName)} />
      </Field>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Field label={labels.dateOfBirth} error={errors.dateOfBirth}>
        <input type="date" value={traveler.dateOfBirth} onChange={(e) => onChange('dateOfBirth', e.target.value)}
          className={inputCls(!!errors.dateOfBirth)} />
      </Field>
      <Field label={labels.placeOfBirth} error={errors.placeOfBirth}>
        <input value={traveler.placeOfBirth} onChange={(e) => onChange('placeOfBirth', e.target.value)}
          className={inputCls(!!errors.placeOfBirth)} />
      </Field>
    </div>
    <Field label={labels.nationality} error={errors.nationality}>
      <input value={traveler.nationality} onChange={(e) => onChange('nationality', e.target.value)}
        className={inputCls(!!errors.nationality)} />
    </Field>
    <div className="grid grid-cols-2 gap-4">
      <Field label={labels.idType}>
        <select value={traveler.idType} onChange={(e) => onChange('idType', e.target.value as IdDocumentType)}
          className={inputCls(false)}>
          <option value="cin">{labels.idTypes.cin}</option>
          <option value="passport">{labels.idTypes.passport}</option>
          <option value="residence">{labels.idTypes.residence}</option>
          <option value="other">{labels.idTypes.other}</option>
        </select>
      </Field>
      <Field label={labels.idNumber} error={errors.idNumber}>
        <input value={traveler.idNumber} onChange={(e) => onChange('idNumber', e.target.value)}
          className={inputCls(!!errors.idNumber)} />
      </Field>
    </div>
    <Field label={labels.idExpiryDate} error={errors.idExpiryDate}>
      <input type="date" value={traveler.idExpiryDate} onChange={(e) => onChange('idExpiryDate', e.target.value)}
        className={inputCls(!!errors.idExpiryDate)} />
    </Field>
    <Field label={labels.address} error={errors.address}>
      <textarea value={traveler.address} onChange={(e) => onChange('address', e.target.value)}
        rows={2} className={inputCls(!!errors.address) + ' resize-none'} />
    </Field>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const GuestIdentityPage = () => {
  const { t } = useLanguage();
  const gi = t.guestIdentity;

  const [step, setStep] = useState<FormStep>('personal');
  const [form, setForm] = useState<GuestRegistrationData>(emptyForm());
  const [dateErrors, setDateErrors] = useState<{ checkInDate?: string; checkOutDate?: string }>({});
  const [travelerErrors, setTravelerErrors] = useState<TravelerErrors[]>([{}]);
  const [uploadErrors, setUploadErrors] = useState<string[]>(['']);
  const [sigError, setSigError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── Traveler helpers ──

  const updateTraveler = (idx: number, field: keyof TravelerData, value: string | File | null | IdDocumentType) => {
    setForm((prev) => {
      const travelers = [...prev.travelers];
      travelers[idx] = { ...travelers[idx], [field]: value };
      return { ...prev, travelers };
    });
    setTravelerErrors((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: undefined };
      return next;
    });
  };

  const addTraveler = () => {
    setForm((prev) => ({ ...prev, travelers: [...prev.travelers, emptyTraveler()] }));
    setTravelerErrors((prev) => [...prev, {}]);
    setUploadErrors((prev) => [...prev, '']);
  };

  const removeTraveler = (idx: number) => {
    setForm((prev) => ({ ...prev, travelers: prev.travelers.filter((_, i) => i !== idx) }));
    setTravelerErrors((prev) => prev.filter((_, i) => i !== idx));
    setUploadErrors((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Validation ──

  const validatePersonal = () => {
    const requiredFields: (keyof TravelerData)[] = [
      'firstName', 'lastName', 'dateOfBirth', 'placeOfBirth',
      'nationality', 'idNumber', 'idExpiryDate', 'address',
    ];
    const nextTravelerErrors = form.travelers.map((t) => {
      const errs: TravelerErrors = {};
      requiredFields.forEach((f) => { if (!t[f]) errs[f] = gi.errors.required; });
      return errs;
    });
    const nextDateErrors: typeof dateErrors = {};
    if (!form.checkInDate) nextDateErrors.checkInDate = gi.errors.required;
    if (!form.checkOutDate) nextDateErrors.checkOutDate = gi.errors.required;
    setTravelerErrors(nextTravelerErrors);
    setDateErrors(nextDateErrors);
    return nextTravelerErrors.every((e) => Object.keys(e).length === 0) && Object.keys(nextDateErrors).length === 0;
  };

  const validateUpload = () => {
    const nextErrors = form.travelers.map((t) => t.idFrontPhoto ? '' : gi.errors.photoRequired);
    setUploadErrors(nextErrors);
    return nextErrors.every((e) => !e);
  };

  const validateSignature = () => {
    if (!form.signature) { setSigError(gi.errors.signatureRequired); return false; }
    return true;
  };

  // ── Navigation ──

  const goNext = () => {
    if (step === 'personal' && !validatePersonal()) return;
    if (step === 'upload' && !validateUpload()) return;
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };

  const goBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignature()) return;
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('checkInDate', form.checkInDate);
      fd.append('checkOutDate', form.checkOutDate);
      fd.append('signature', form.signature);

      const travelerMeta = form.travelers.map((t) => ({
        firstName: t.firstName, lastName: t.lastName, dateOfBirth: t.dateOfBirth,
        placeOfBirth: t.placeOfBirth, nationality: t.nationality, idType: t.idType,
        idNumber: t.idNumber, idExpiryDate: t.idExpiryDate, address: t.address,
      }));
      fd.append('travelers', JSON.stringify(travelerMeta));

      form.travelers.forEach((t, idx) => {
        if (t.idFrontPhoto) fd.append(`frontPhoto_${idx}`, t.idFrontPhoto);
        if (t.idBackPhoto) fd.append(`backPhoto_${idx}`, t.idBackPhoto);
      });

      const res = await fetch('/api/guest-identity', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Submit failed');
      setSubmitted(true);
    } catch {
      setSigError('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSign = useCallback((dataUrl: string) => {
    setForm((prev) => ({ ...prev, signature: dataUrl }));
    setSigError('');
  }, []);

  const idTypeLabel = (type: IdDocumentType) => gi.personal.idTypes[type];
  const travelerName = (t: TravelerData) =>
    t.firstName || t.lastName ? `${t.firstName} ${t.lastName}`.trim() : null;

  // ── Success screen ──

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4 pt-20">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{gi.success.heading}</h1>
          <p className="text-gray-600 mb-2">{gi.success.message}</p>
          <p className="text-sm text-gray-400 mb-8">
            {form.travelers.length} {gi.multi.guestsCount}
          </p>
          <button onClick={() => { setForm(emptyForm()); setStep('personal'); setSubmitted(false); setTravelerErrors([{}]); setUploadErrors(['']); }}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
            {gi.success.newGuest}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white pt-20 pb-16 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-primary-100 text-primary-700 text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-4">
            KoziBnB
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{gi.pageTitle}</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-lg mx-auto">{gi.pageSubtitle}</p>
          <p className="mt-3 text-xs text-gray-400 italic">{gi.legalNote}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <StepIndicator currentStep={step}
            labels={{ personal: gi.steps.personalInfo, upload: gi.steps.idUpload, signature: gi.steps.signature }} />

          <form onSubmit={handleSubmit} noValidate>

            {/* ── Step 1: Personal Information ── */}
            {step === 'personal' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-800">{gi.personal.heading}</h2>

                {/* Shared stay dates */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-primary-50 rounded-xl border border-primary-100">
                  <Field label={gi.personal.checkInDate} error={dateErrors.checkInDate}>
                    <input type="date" value={form.checkInDate}
                      onChange={(e) => { setForm((p) => ({ ...p, checkInDate: e.target.value })); setDateErrors((p) => ({ ...p, checkInDate: undefined })); }}
                      className={inputCls(!!dateErrors.checkInDate)} />
                  </Field>
                  <Field label={gi.personal.checkOutDate} error={dateErrors.checkOutDate}>
                    <input type="date" value={form.checkOutDate}
                      onChange={(e) => { setForm((p) => ({ ...p, checkOutDate: e.target.value })); setDateErrors((p) => ({ ...p, checkOutDate: undefined })); }}
                      className={inputCls(!!dateErrors.checkOutDate)} />
                  </Field>
                </div>

                {/* Traveler cards */}
                {form.travelers.map((traveler, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Card header */}
                    <div className={`flex items-center justify-between px-4 py-3 ${idx === 0 ? 'bg-primary-600' : 'bg-gray-700'}`}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-semibold text-white">
                          {idx === 0 ? gi.multi.mainTraveler : `${gi.multi.traveler} ${idx + 1}`}
                          {travelerName(traveler) ? ` — ${travelerName(traveler)}` : ''}
                        </span>
                      </div>
                      {idx > 0 && (
                        <button type="button" onClick={() => removeTraveler(idx)}
                          className="text-white/70 hover:text-red-300 text-xs underline transition-colors">
                          {gi.multi.removeTraveler}
                        </button>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="p-5">
                      <TravelerFields
                        traveler={traveler}
                        errors={travelerErrors[idx] ?? {}}
                        onChange={(field, value) => updateTraveler(idx, field, value)}
                        labels={gi.personal}
                      />
                    </div>
                  </div>
                ))}

                {/* Add traveler button */}
                <button type="button" onClick={addTraveler}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-primary-300 text-primary-600 hover:border-primary-500 hover:bg-primary-50 rounded-xl py-3 text-sm font-semibold transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {gi.multi.addTraveler}
                </button>

                {/* Trust banner */}
                <TrustBanner heading={gi.trust.heading} subtitle={gi.trust.subtitle} items={gi.trust.items} />
              </div>
            )}

            {/* ── Step 2: ID Upload ── */}
            {step === 'upload' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-1">{gi.upload.heading}</h2>
                  <p className="text-sm text-gray-500">{gi.upload.instruction}</p>
                </div>

                {form.travelers.map((traveler, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className={`px-4 py-2.5 ${idx === 0 ? 'bg-primary-600' : 'bg-gray-700'}`}>
                      <span className="text-sm font-semibold text-white">
                        {idx === 0 ? gi.multi.mainTraveler : `${gi.multi.traveler} ${idx + 1}`}
                        {travelerName(traveler) ? ` — ${travelerName(traveler)}` : ''}
                      </span>
                    </div>
                    <div className="p-5 space-y-4">
                      <PhotoUpload label={gi.upload.frontSide} file={traveler.idFrontPhoto}
                        onChange={(f) => updateTraveler(idx, 'idFrontPhoto', f)}
                        clickLabel={gi.upload.clickToUpload} dragLabel={gi.upload.dragDrop}
                        fileTypesLabel={gi.upload.fileTypes} previewLabel={gi.upload.preview}
                        changeLabel={gi.upload.change} required />
                      {uploadErrors[idx] && <p className="text-sm text-red-600 -mt-2">{uploadErrors[idx]}</p>}

                      <PhotoUpload label={gi.upload.backSide} file={traveler.idBackPhoto}
                        onChange={(f) => updateTraveler(idx, 'idBackPhoto', f)}
                        clickLabel={gi.upload.clickToUpload} dragLabel={gi.upload.dragDrop}
                        fileTypesLabel={gi.upload.fileTypes} previewLabel={gi.upload.preview}
                        changeLabel={gi.upload.change} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Step 3: Signature & Review ── */}
            {step === 'signature' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-800">{gi.signatureStep.heading}</h2>

                {/* Review — one card per traveler */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{gi.signatureStep.reviewHeading}</h3>
                  {form.travelers.map((traveler, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className={`px-4 py-2.5 ${idx === 0 ? 'bg-primary-600' : 'bg-gray-700'}`}>
                        <span className="text-sm font-semibold text-white">
                          {idx === 0 ? gi.multi.mainTraveler : `${gi.multi.traveler} ${idx + 1}`}
                          {travelerName(traveler) ? ` — ${travelerName(traveler)}` : ''}
                        </span>
                      </div>
                      <div className="p-4 bg-gray-50">
                        <ReviewRow label={gi.personal.firstName} value={traveler.firstName} />
                        <ReviewRow label={gi.personal.lastName} value={traveler.lastName} />
                        <ReviewRow label={gi.personal.dateOfBirth} value={traveler.dateOfBirth} />
                        <ReviewRow label={gi.personal.placeOfBirth} value={traveler.placeOfBirth} />
                        <ReviewRow label={gi.personal.nationality} value={traveler.nationality} />
                        <ReviewRow label={gi.personal.idType} value={idTypeLabel(traveler.idType)} />
                        <ReviewRow label={gi.personal.idNumber} value={traveler.idNumber} />
                        <ReviewRow label={gi.personal.idExpiryDate} value={traveler.idExpiryDate} />
                        <ReviewRow label={gi.personal.address} value={traveler.address} />
                      </div>
                    </div>
                  ))}

                  {/* Stay dates summary */}
                  <div className="bg-primary-50 rounded-xl p-4 border border-primary-100 grid grid-cols-2 gap-4">
                    <ReviewRow label={gi.personal.checkInDate} value={form.checkInDate} />
                    <ReviewRow label={gi.personal.checkOutDate} value={form.checkOutDate} />
                  </div>
                </div>

                {/* Signature */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {gi.signatureStep.signatureLabel} <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-400 mb-2">{gi.signatureStep.signatureInstruction}</p>
                  <SignaturePad onSign={handleSign} clearLabel={gi.signatureStep.clear} />
                  {sigError && <p className="text-sm text-red-600 mt-1">{sigError}</p>}
                </div>

                <div className="bg-primary-50 rounded-lg p-4 border border-primary-100">
                  <p className="text-sm text-primary-700">{gi.signatureStep.submitInstruction}</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button type="button" onClick={goBack} disabled={step === 'personal'}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-0 disabled:pointer-events-none transition-colors">
                {gi.nav.back}
              </button>
              {step !== 'signature' ? (
                <button type="button" onClick={goNext}
                  className="px-6 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors">
                  {gi.nav.next}
                </button>
              ) : (
                <button type="submit" disabled={submitting}
                  className="px-6 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-70 transition-colors flex items-center gap-2">
                  {submitting && (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  )}
                  {submitting ? gi.signatureStep.submitting : gi.signatureStep.submit}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputCls = (hasError: boolean) =>
  `mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition
   ${hasError ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-primary-500'}`;

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    {children}
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

export default GuestIdentityPage;
