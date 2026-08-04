'use client';

import { useMemo, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface Property { id: string; name: string; address: string | null; }
interface EventRow {
  id: string; property_id: string; registration_id: string | null; title: string;
  start_date: string; end_date: string; status: 'reserved' | 'blocked';
  source: 'manual' | 'registration'; notes: string | null;
  properties: { name: string; address: string | null } | null;
}
interface EventDraft { id?: string; propertyId: string; title: string; startDate: string; endDate: string; status: 'reserved' | 'blocked'; notes: string; }

const iso = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const addDays = (date: string, amount: number) => {
  const value = new Date(`${date}T12:00:00`);
  value.setDate(value.getDate() + amount);
  return iso(value);
};

export default function CalendarManager({ initialEvents, properties }: {
  initialEvents: EventRow[]; properties: Property[];
}) {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const [events, setEvents] = useState(initialEvents);
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [propertyFilter, setPropertyFilter] = useState('');
  const [draft, setDraft] = useState<EventDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [error, setError] = useState('');
  const [subscriptionUrl, setSubscriptionUrl] = useState('');
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [copied, setCopied] = useState(false);

  const labels = fr ? {
    title: 'Calendrier des réservations', add: 'Ajouter une réservation', today: "Aujourd'hui",
    property: 'Propriété', all: 'Toutes les propriétés', eventTitle: 'Titre', start: 'Arrivée', end: 'Départ',
    status: 'Type', reserved: 'Réservé', blocked: 'Bloqué', notes: 'Notes', cancel: 'Annuler', save: 'Enregistrer',
    delete: 'Supprimer', deleteQuestion: 'Supprimer cet événement ?', irreversible: 'Cette action est définitive.',
    subscribe: 'Ajouter à Google Calendar', copy: 'Copier le lien', copied: 'Lien copié', reset: 'Créer un nouveau lien',
    empty: 'Aucun événement', registration: 'Créé depuis une fiche client', manual: 'Ajout manuel',
  } : {
    title: 'Reservation calendar', add: 'Add reservation', today: 'Today', property: 'Property', all: 'All properties',
    eventTitle: 'Title', start: 'Check-in', end: 'Check-out', status: 'Type', reserved: 'Reserved', blocked: 'Blocked',
    notes: 'Notes', cancel: 'Cancel', save: 'Save', delete: 'Delete', deleteQuestion: 'Delete this event?',
    irreversible: 'This action cannot be undone.', subscribe: 'Add to Google Calendar', copy: 'Copy link', copied: 'Link copied', reset: 'Create a new link',
    empty: 'No events', registration: 'Created from guest registration', manual: 'Added manually',
  };

  const days = useMemo(() => {
    const start = new Date(month.getFullYear(), month.getMonth(), 1);
    const mondayOffset = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - mondayOffset);
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(start); day.setDate(start.getDate() + index); return day;
    });
  }, [month]);
  const visibleEvents = propertyFilter ? events.filter((event) => event.property_id === propertyFilter) : events;
  const eventsForDay = (day: string) => visibleEvents.filter((event) => event.start_date <= day && event.end_date > day);
  const openNew = (date = iso(new Date())) => setDraft({ propertyId: propertyFilter || properties[0]?.id || '', title: '', startDate: date, endDate: addDays(date, 1), status: 'reserved', notes: '' });
  const openEvent = (event: EventRow) => setDraft({ id: event.id, propertyId: event.property_id, title: event.title, startDate: event.start_date, endDate: event.end_date, status: event.status, notes: event.notes ?? '' });

  const save = async () => {
    if (!draft || !draft.propertyId || !draft.title.trim() || draft.endDate <= draft.startDate) return;
    setSaving(true); setError('');
    const response = await fetch(draft.id ? `/api/calendar/${draft.id}` : '/api/calendar', {
      method: draft.id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft),
    });
    const result = await response.json();
    if (!response.ok) { setError(result.error || 'Unable to save'); setSaving(false); return; }
    const next = result.event as EventRow;
    setEvents((current) => draft.id ? current.map((event) => event.id === next.id ? next : event) : [...current, next]);
    setSaving(false); setDraft(null);
  };
  const remove = async () => {
    if (!draft?.id) return;
    setSaving(true);
    const response = await fetch(`/api/calendar/${draft.id}`, { method: 'DELETE' });
    if (response.ok) { setEvents((current) => current.filter((event) => event.id !== draft.id)); setDraft(null); }
    else { setError('Unable to delete'); setDeleteConfirm(false); }
    setSaving(false);
  };
  const showSubscription = async (rotate = false) => {
    setLoadingSubscription(true); setError('');
    const response = await fetch('/api/calendar/feed', { method: rotate ? 'DELETE' : 'GET' });
    const result = await response.json();
    if (!response.ok) setError(result.error || (fr ? 'Impossible de créer le lien calendrier.' : 'Unable to create calendar link.'));
    else { setSubscriptionUrl(result.url); setSubscriptionOpen(true); setCopied(false); }
    setLoadingSubscription(false);
  };
  const copySubscription = async () => {
    await navigator.clipboard.writeText(subscriptionUrl);
    setCopied(true);
  };
  const weekdayLabels = fr ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div><h1 className="text-2xl font-extrabold text-gray-900">{labels.title}</h1><p className="mt-1 text-sm text-gray-500">{events.length} {fr ? 'événements' : 'events'}</p></div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => showSubscription()} disabled={loadingSubscription}
            className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-60">
            G&nbsp; {loadingSubscription ? '…' : labels.subscribe}
          </button>
          <button onClick={() => openNew()} disabled={!properties.length} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50">+ {labels.add}</button>
        </div>
      </div>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="rounded-lg border px-3 py-2 text-gray-700">←</button>
        <button onClick={() => setMonth(new Date())} className="rounded-lg border px-3 py-2 text-xs font-semibold text-gray-700">{labels.today}</button>
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="rounded-lg border px-3 py-2 text-gray-700">→</button>
        <h2 className="min-w-40 text-lg font-bold capitalize text-gray-900">{month.toLocaleDateString(fr ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' })}</h2>
        <select value={propertyFilter} onChange={(event) => setPropertyFilter(event.target.value)} className="ml-auto rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800">
          <option value="">{labels.all}</option>{properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-7 border-b bg-gray-50">{weekdayLabels.map((day) => <div key={day} className="px-2 py-3 text-center text-xs font-semibold uppercase text-gray-500">{day}</div>)}</div>
          <div className="grid grid-cols-7">{days.map((day) => { const date = iso(day); const dayEvents = eventsForDay(date); const currentMonth = day.getMonth() === month.getMonth(); return (
            <button key={date} type="button" onClick={() => openNew(date)} className={`min-h-28 border-b border-r p-2 text-left align-top hover:bg-primary-50 ${currentMonth ? 'bg-white' : 'bg-gray-50/70'}`}>
              <span className={`text-xs font-semibold ${date === iso(new Date()) ? 'rounded-full bg-primary-600 px-2 py-1 text-white' : currentMonth ? 'text-gray-700' : 'text-gray-400'}`}>{day.getDate()}</span>
              <div className="mt-2 space-y-1">{dayEvents.slice(0, 3).map((event) => <span key={event.id} role="button" tabIndex={0} onClick={(click) => { click.stopPropagation(); openEvent(event); }} className={`block truncate rounded px-2 py-1 text-[11px] font-semibold ${event.status === 'blocked' ? 'bg-amber-100 text-amber-800' : 'bg-primary-100 text-primary-800'}`}>{event.title}</span>)}{dayEvents.length > 3 && <span className="text-[10px] text-gray-400">+{dayEvents.length - 3}</span>}</div>
            </button>); })}</div>
        </div>
      </div>

      {subscriptionOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setSubscriptionOpen(false); }}>
        <div role="dialog" aria-modal="true" aria-labelledby="calendar-subscription-title" className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="border-b px-6 py-5">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl font-bold text-blue-700">G</div>
            <h2 id="calendar-subscription-title" className="text-xl font-bold text-gray-900">{labels.subscribe}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">{fr ? 'Aucune carte bancaire ni clé Google Cloud requise. Ajoutez ce calendrier privé depuis un ordinateur.' : 'No payment card or Google Cloud key is required. Add this private calendar from a computer.'}</p>
          </div>
          <div className="space-y-5 p-6">
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">1</span><span>{fr ? 'Ouvrez Google Calendar sur un ordinateur.' : 'Open Google Calendar on a computer.'}</span></li>
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">2</span><span>{fr ? 'À gauche, cliquez sur Autres agendas +, puis À partir de l’URL.' : 'On the left, click Other calendars +, then From URL.'}</span></li>
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">3</span><span>{fr ? 'Collez le lien privé ci-dessous et cliquez sur Ajouter un agenda.' : 'Paste the private link below and click Add calendar.'}</span></li>
            </ol>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">{fr ? 'Lien privé' : 'Private link'}</label>
              <div className="flex flex-col gap-2 sm:flex-row"><input readOnly value={subscriptionUrl} onFocus={(event) => event.currentTarget.select()} className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-800" /><button onClick={copySubscription} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">{copied ? labels.copied : labels.copy}</button></div>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">{fr ? 'Gardez ce lien secret. Toute personne qui le possède peut voir les réservations. Google choisit la fréquence d’actualisation, les changements peuvent donc apparaître avec un délai.' : 'Keep this link secret. Anyone who has it can view the reservations. Google controls subscription refresh timing, so changes may appear with a delay.'}</div>
          </div>
          <div className="flex flex-col-reverse gap-3 border-t bg-gray-50 px-6 py-4 sm:flex-row sm:justify-between"><button onClick={() => showSubscription(true)} className="text-xs font-semibold text-red-600 hover:underline">{labels.reset}</button><button onClick={() => setSubscriptionOpen(false)} className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100">{fr ? 'Fermer' : 'Close'}</button></div>
        </div>
      </div>}

      {draft && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setDraft(null); }}>
        <div role="dialog" aria-modal="true" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
          <div className="border-b px-6 py-5"><h2 className="text-xl font-bold text-gray-900">{draft.id ? draft.title : labels.add}</h2>{draft.id && <p className="mt-1 text-xs text-gray-500">{events.find((event) => event.id === draft.id)?.source === 'registration' ? labels.registration : labels.manual}</p>}</div>
          <div className="space-y-4 p-6">
            <label className="block text-sm font-medium text-gray-700">{labels.property}<select value={draft.propertyId} onChange={(event) => setDraft({ ...draft, propertyId: event.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900">{properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}</select></label>
            <label className="block text-sm font-medium text-gray-700">{labels.eventTitle}<input value={draft.title} maxLength={150} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900" /></label>
            <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-gray-700">{labels.start}<input type="date" value={draft.startDate} onChange={(event) => setDraft({ ...draft, startDate: event.target.value, endDate: draft.endDate <= event.target.value ? addDays(event.target.value, 1) : draft.endDate })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900" /></label><label className="text-sm font-medium text-gray-700">{labels.end}<input type="date" min={addDays(draft.startDate, 1)} value={draft.endDate} onChange={(event) => setDraft({ ...draft, endDate: event.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900" /></label></div>
            <label className="block text-sm font-medium text-gray-700">{labels.status}<select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as EventDraft['status'] })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"><option value="reserved">{labels.reserved}</option><option value="blocked">{labels.blocked}</option></select></label>
            <label className="block text-sm font-medium text-gray-700">{labels.notes}<textarea value={draft.notes} maxLength={1000} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} rows={3} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900" /></label>
            {deleteConfirm && <div className="rounded-xl border border-red-200 bg-red-50 p-4"><p className="font-semibold text-red-800">{labels.deleteQuestion}</p><p className="mt-1 text-xs text-red-600">{labels.irreversible}</p><div className="mt-3 flex gap-2"><button onClick={remove} disabled={saving} className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white">{labels.delete}</button><button onClick={() => setDeleteConfirm(false)} className="rounded-lg border bg-white px-4 py-2 text-xs font-semibold text-gray-700">{labels.cancel}</button></div></div>}
          </div>
          <div className="flex flex-col-reverse gap-3 border-t bg-gray-50 px-6 py-4 sm:flex-row sm:justify-between"><div>{draft.id && !deleteConfirm && <button onClick={() => setDeleteConfirm(true)} className="rounded-lg px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">{labels.delete}</button>}</div><div className="flex gap-3"><button onClick={() => setDraft(null)} disabled={saving} className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700">{labels.cancel}</button><button onClick={save} disabled={saving || !draft.title || draft.endDate <= draft.startDate} className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? '…' : labels.save}</button></div></div>
        </div>
      </div>}
      {!properties.length && <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">{fr ? "Ajoutez d'abord une propriété pour utiliser le calendrier." : 'Add a property before using the calendar.'}</p>}
    </div>
  );
}
