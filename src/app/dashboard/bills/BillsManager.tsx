'use client';

import { useMemo, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import BillsCharts, { type IncomeRow } from './BillsCharts';

export interface Property { id: string; name: string; address: string | null; }
export type Category = 'electricity' | 'water' | 'gas' | 'internet' | 'maintenance' | 'cleaning' | 'tax' | 'insurance' | 'ads' | 'other';
type Status = 'unpaid' | 'paid';
export interface BillRow {
  id: string; property_id: string; category: Category; title: string; amount: number;
  currency: string; due_date: string; status: Status; paid_at: string | null; notes: string | null;
  properties: { name: string; address: string | null } | null;
}
interface BillDraft {
  id?: string; propertyId: string; category: Category; title: string; amount: string;
  dueDate: string; status: Status; notes: string;
}

const CATEGORIES: Category[] = ['electricity', 'water', 'gas', 'internet', 'maintenance', 'cleaning', 'tax', 'insurance', 'ads', 'other'];
const iso = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function BillsManager({ initialBills, initialIncome, properties }: {
  initialBills: BillRow[]; initialIncome: IncomeRow[]; properties: Property[];
}) {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const [bills, setBills] = useState(initialBills);
  const [propertyFilter, setPropertyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | Status>('');
  const [draft, setDraft] = useState<BillDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [error, setError] = useState('');

  const labels = fr ? {
    title: 'Factures', add: 'Ajouter une facture', property: 'Propriété', all: 'Toutes les propriétés',
    allStatuses: 'Tous les statuts', unpaid: 'À payer', paid: 'Payée', overdue: 'En retard',
    billTitle: 'Titre', category: 'Catégorie', amount: 'Montant', dueDate: 'Échéance', status: 'Statut',
    notes: 'Notes', cancel: 'Annuler', save: 'Enregistrer', delete: 'Supprimer', markPaid: 'Marquer payée',
    markUnpaid: 'Marquer à payer', deleteQuestion: 'Supprimer cette facture ?', irreversible: 'Cette action est définitive.',
    empty: 'Aucune facture', totalUnpaid: 'Total à payer', overdueCount: 'Factures en retard',
  } : {
    title: 'Bills', add: 'Add bill', property: 'Property', all: 'All properties',
    allStatuses: 'All statuses', unpaid: 'Unpaid', paid: 'Paid', overdue: 'Overdue',
    billTitle: 'Title', category: 'Category', amount: 'Amount', dueDate: 'Due date', status: 'Status',
    notes: 'Notes', cancel: 'Cancel', save: 'Save', delete: 'Delete', markPaid: 'Mark as paid',
    markUnpaid: 'Mark as unpaid', deleteQuestion: 'Delete this bill?', irreversible: 'This action cannot be undone.',
    empty: 'No bills', totalUnpaid: 'Total unpaid', overdueCount: 'Overdue bills',
  };
  const categoryLabels: Record<Category, string> = fr ? {
    electricity: 'Électricité', water: 'Eau', gas: 'Gaz', internet: 'Internet', maintenance: 'Entretien',
    cleaning: 'Ménage', tax: 'Taxe', insurance: 'Assurance', ads: 'Publicité', other: 'Autre',
  } : {
    electricity: 'Electricity', water: 'Water', gas: 'Gas', internet: 'Internet', maintenance: 'Maintenance',
    cleaning: 'Cleaning', tax: 'Tax', insurance: 'Insurance', ads: 'Ads', other: 'Other',
  };

  const today = iso(new Date());
  const isOverdue = (bill: BillRow) => bill.status === 'unpaid' && bill.due_date < today;
  const formatAmount = (amount: number, currency: string) =>
    new Intl.NumberFormat(fr ? 'fr-FR' : 'en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);

  const visibleBills = useMemo(() => bills
    .filter((bill) => !propertyFilter || bill.property_id === propertyFilter)
    .filter((bill) => !statusFilter || bill.status === statusFilter)
    .sort((left, right) => left.due_date.localeCompare(right.due_date)),
  [bills, propertyFilter, statusFilter]);

  const totalUnpaid = useMemo(() => bills
    .filter((bill) => bill.status === 'unpaid')
    .filter((bill) => !propertyFilter || bill.property_id === propertyFilter)
    .reduce((sum, bill) => sum + bill.amount, 0), [bills, propertyFilter]);
  const overdueCount = useMemo(() => bills
    .filter((bill) => bill.status === 'unpaid' && bill.due_date < today)
    .filter((bill) => !propertyFilter || bill.property_id === propertyFilter).length,
  [bills, propertyFilter, today]);

  const openNew = () => setDraft({
    propertyId: propertyFilter || properties[0]?.id || '', category: 'other', title: '',
    amount: '', dueDate: today, status: 'unpaid', notes: '',
  });
  const openBill = (bill: BillRow) => setDraft({
    id: bill.id, propertyId: bill.property_id, category: bill.category, title: bill.title,
    amount: String(bill.amount), dueDate: bill.due_date, status: bill.status, notes: bill.notes ?? '',
  });

  const isValid = (value: BillDraft) => value.propertyId && value.title.trim()
    && Number.isFinite(Number(value.amount)) && Number(value.amount) > 0 && value.dueDate;

  const save = async () => {
    if (!draft || !isValid(draft)) return;
    setSaving(true); setError('');
    const response = await fetch(draft.id ? `/api/bills/${draft.id}` : '/api/bills', {
      method: draft.id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...draft, amount: Number(draft.amount) }),
    });
    const result = await response.json();
    if (!response.ok) { setError(result.error || 'Unable to save'); setSaving(false); return; }
    const next = result.bill as BillRow;
    setBills((current) => draft.id ? current.map((bill) => bill.id === next.id ? next : bill) : [...current, next]);
    setSaving(false); setDraft(null);
  };
  const toggleStatus = async () => {
    if (!draft?.id) return;
    setSaving(true); setError('');
    const nextStatus: Status = draft.status === 'paid' ? 'unpaid' : 'paid';
    const response = await fetch(`/api/bills/${draft.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...draft, amount: Number(draft.amount), status: nextStatus }),
    });
    const result = await response.json();
    if (!response.ok) { setError(result.error || 'Unable to save'); setSaving(false); return; }
    const next = result.bill as BillRow;
    setBills((current) => current.map((bill) => bill.id === next.id ? next : bill));
    setSaving(false); setDraft({ ...draft, status: nextStatus });
  };
  const remove = async () => {
    if (!draft?.id) return;
    setSaving(true);
    const response = await fetch(`/api/bills/${draft.id}`, { method: 'DELETE' });
    if (response.ok) { setBills((current) => current.filter((bill) => bill.id !== draft.id)); setDraft(null); }
    else { setError('Unable to delete'); setDeleteConfirm(false); }
    setSaving(false);
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-extrabold text-gray-900">{labels.title}</h1><p className="mt-1 text-sm text-gray-500">{bills.length} {fr ? 'factures' : 'bills'}</p></div>
        <button onClick={openNew} disabled={!properties.length} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 self-start sm:self-auto">+ {labels.add}</button>
      </div>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <BillsCharts bills={bills} income={initialIncome} propertyFilter={propertyFilter} fr={fr} categoryLabels={categoryLabels} />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 sm:max-w-md">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">{labels.totalUnpaid}</p>
          <p className="mt-2 text-3xl font-extrabold text-primary-600">{formatAmount(totalUnpaid, 'MAD')}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">{labels.overdueCount}</p>
          <p className="mt-2 text-3xl font-extrabold text-rose-600">{overdueCount}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
        <select value={propertyFilter} onChange={(event) => setPropertyFilter(event.target.value)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800">
          <option value="">{labels.all}</option>{properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}
        </select>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as '' | Status)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800">
          <option value="">{labels.allStatuses}</option>
          <option value="unpaid">{labels.unpaid}</option>
          <option value="paid">{labels.paid}</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        {visibleBills.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-400">{labels.empty}</p>
        ) : (
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">{labels.billTitle}</th>
                <th className="px-4 py-3">{labels.category}</th>
                <th className="px-4 py-3">{labels.property}</th>
                <th className="px-4 py-3">{labels.dueDate}</th>
                <th className="px-4 py-3">{labels.amount}</th>
                <th className="px-4 py-3">{labels.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleBills.map((bill) => (
                <tr key={bill.id} onClick={() => openBill(bill)} className="cursor-pointer hover:bg-primary-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{bill.title}</td>
                  <td className="px-4 py-3 text-gray-600">{categoryLabels[bill.category]}</td>
                  <td className="px-4 py-3 text-gray-600">{bill.properties?.name ?? ''}</td>
                  <td className={`px-4 py-3 ${isOverdue(bill) ? 'font-semibold text-rose-600' : 'text-gray-600'}`}>{bill.due_date}</td>
                  <td className="px-4 py-3 text-gray-900">{formatAmount(bill.amount, bill.currency)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      bill.status === 'paid' ? 'bg-emerald-100 text-emerald-700'
                        : isOverdue(bill) ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {bill.status === 'paid' ? labels.paid : isOverdue(bill) ? labels.overdue : labels.unpaid}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {draft && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setDraft(null); }}>
        <div role="dialog" aria-modal="true" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
          <div className="border-b px-6 py-5"><h2 className="text-xl font-bold text-gray-900">{draft.id ? draft.title : labels.add}</h2></div>
          <div className="space-y-4 p-6">
            <label className="block text-sm font-medium text-gray-700">{labels.property}<select value={draft.propertyId} onChange={(event) => setDraft({ ...draft, propertyId: event.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900">{properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}</select></label>
            <label className="block text-sm font-medium text-gray-700">{labels.billTitle}<input value={draft.title} maxLength={150} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900" /></label>
            <label className="block text-sm font-medium text-gray-700">{labels.category}<select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value as Category })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900">{CATEGORIES.map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}</select></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-gray-700">{labels.amount} (MAD)<input type="number" min="0.01" step="0.01" value={draft.amount} onChange={(event) => setDraft({ ...draft, amount: event.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900" /></label>
              <label className="text-sm font-medium text-gray-700">{labels.dueDate}<input type="date" value={draft.dueDate} onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900" /></label>
            </div>
            <label className="block text-sm font-medium text-gray-700">{labels.notes}<textarea value={draft.notes} maxLength={1000} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} rows={3} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900" /></label>
            {draft.id && (
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <span className="text-sm font-medium text-gray-700">{draft.status === 'paid' ? labels.paid : labels.unpaid}</span>
                <button onClick={toggleStatus} disabled={saving} className="text-xs font-semibold text-primary-600 hover:underline">{draft.status === 'paid' ? labels.markUnpaid : labels.markPaid}</button>
              </div>
            )}
            {deleteConfirm && <div className="rounded-xl border border-red-200 bg-red-50 p-4"><p className="font-semibold text-red-800">{labels.deleteQuestion}</p><p className="mt-1 text-xs text-red-600">{labels.irreversible}</p><div className="mt-3 flex gap-2"><button onClick={remove} disabled={saving} className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white">{labels.delete}</button><button onClick={() => setDeleteConfirm(false)} className="rounded-lg border bg-white px-4 py-2 text-xs font-semibold text-gray-700">{labels.cancel}</button></div></div>}
          </div>
          <div className="flex flex-col-reverse gap-3 border-t bg-gray-50 px-6 py-4 sm:flex-row sm:justify-between"><div>{draft.id && !deleteConfirm && <button onClick={() => setDeleteConfirm(true)} className="rounded-lg px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">{labels.delete}</button>}</div><div className="flex gap-3"><button onClick={() => setDraft(null)} disabled={saving} className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700">{labels.cancel}</button><button onClick={save} disabled={saving || !isValid(draft)} className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? '…' : labels.save}</button></div></div>
        </div>
      </div>}
      {!properties.length && <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">{fr ? "Ajoutez d'abord une propriété pour gérer les factures." : 'Add a property before managing bills.'}</p>}
    </div>
  );
}
