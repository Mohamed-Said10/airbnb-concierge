'use client';

import { useEffect, useRef, useState } from 'react';

export interface BookedRange { start: string; end: string; }

interface Props {
  id?: string;
  label: string;
  value: string;
  onChange: (date: string) => void;
  minDate: string;
  maxDate?: string;
  /** Disable days that fall inside a booked range. The checkout picker leaves this
   * off — its reachable range is already bounded by maxDate (the first booked day
   * after check-in), so the checkout day itself (a turnover day) stays selectable. */
  blockBookedDays?: boolean;
  bookedRanges: BookedRange[];
  placeholder: string;
  error?: string;
  locale: string;
}

const iso = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isBooked = (date: string, ranges: BookedRange[]) =>
  ranges.some((range) => date >= range.start && date < range.end);

export default function BookingDatePicker({
  id, label, value, onChange, minDate, maxDate, blockBookedDays = true, bookedRanges, placeholder, error, locale,
}: Props) {
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    const [year, month] = (value || minDate).split('-').map(Number);
    return new Date(year, (month || 1) - 1, 1);
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const fr = locale === 'fr';

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const openPicker = () => {
    const [year, month] = (value || minDate).split('-').map(Number);
    setViewMonth(new Date(year, (month || 1) - 1, 1));
    setOpen(true);
  };

  const days = (() => {
    const start = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    const mondayOffset = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - mondayOffset);
    return Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  })();

  const weekdayLabels = fr ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const monthLabel = viewMonth.toLocaleDateString(fr ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' });
  const today = iso(new Date());
  const displayValue = value
    ? new Date(`${value}T12:00:00`).toLocaleDateString(fr ? 'fr-FR' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  return (
    <div ref={containerRef} id={id} className="relative">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <button type="button" onClick={() => (open ? setOpen(false) : openPicker())}
        className={`mt-1 flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-left text-sm shadow-sm transition focus:outline-none focus:ring-2
          ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'}`}>
        <span className={displayValue ? 'text-gray-950' : 'text-gray-400'}>{displayValue || placeholder}</span>
        <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      {open && (
        <div className="absolute z-30 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <button type="button" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
              aria-label={fr ? 'Mois précédent' : 'Previous month'}
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-semibold capitalize text-gray-900">{monthLabel}</span>
            <button type="button" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
              aria-label={fr ? 'Mois suivant' : 'Next month'}
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="mb-1 grid grid-cols-7 gap-0.5">
            {weekdayLabels.map((weekday) => (
              <div key={weekday} className="text-center text-[10px] font-semibold uppercase text-gray-400">{weekday}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {days.map((day) => {
              const dateStr = iso(day);
              const booked = isBooked(dateStr, bookedRanges);
              const disabled = dateStr < minDate || (!!maxDate && dateStr > maxDate) || (blockBookedDays && booked);
              const selected = dateStr === value;
              const isToday = dateStr === today;
              return (
                <button key={dateStr} type="button" disabled={disabled}
                  onClick={() => { onChange(dateStr); setOpen(false); }}
                  aria-label={dateStr}
                  className={`relative h-8 rounded-md text-xs font-medium transition-colors
                    ${disabled ? 'text-gray-300' : 'text-gray-700 hover:bg-primary-50'}
                    ${selected ? '!bg-primary-600 !text-white' : ''}
                    ${isToday && !selected ? 'ring-1 ring-inset ring-primary-300' : ''}
                    ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                  {day.getDate()}
                  {booked && !selected && (
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-md">
                      <span className="h-px w-[140%] rotate-45 bg-gray-300" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-1.5 border-t border-gray-100 pt-2 text-[11px] text-gray-500">
            <span className="relative inline-block h-3 w-5 shrink-0 overflow-hidden rounded bg-gray-100">
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="h-px w-[140%] rotate-45 bg-gray-300" />
              </span>
            </span>
            {fr ? 'Déjà réservé' : 'Already booked'}
          </div>
        </div>
      )}
    </div>
  );
}
