'use client';

import { useState, useEffect, useRef } from 'react';
import { createBrowserSupabase } from '@/lib/supabase-browser';

interface Property {
  id: string;
  name: string;
  address: string | null;
  slug: string;
  created_at: string;
}

interface Photo { id: string; url: string; }

function PropertyPhotos({ propertyId }: { propertyId: string }) {
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createBrowserSupabase();

  const load = async () => {
    const { data } = await supabase
      .from('property_photos').select('id, url').eq('property_id', propertyId).order('sort_order').order('created_at');
    setPhotos(data ?? []);
  };

  // Fetched once when this section mounts (i.e. when the owner expands it).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    setError('');
    const fd = new FormData();
    Array.from(files).forEach((file) => fd.append('photos', file));
    const response = await fetch(`/api/properties/${propertyId}/photos`, { method: 'POST', body: fd });
    const result = await response.json();
    if (!response.ok) { setError(result.error || 'Upload failed'); setUploading(false); return; }
    await load();
    setUploading(false);
  };

  const handleDelete = async (photoId: string) => {
    setPhotos((prev) => prev?.filter((photo) => photo.id !== photoId) ?? null);
    await fetch(`/api/properties/${propertyId}/photos/${photoId}`, { method: 'DELETE' });
  };

  if (photos === null) return <p className="text-xs text-gray-400">Loading photos…</p>;

  return (
    <div>
      <p className="text-xs text-gray-400 mb-2">Shown to guests on the registration page.</p>
      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
      <div className="flex flex-wrap gap-3">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt="" className="h-full w-full object-cover" />
            <button type="button" onClick={() => handleDelete(photo.id)}
              className="absolute top-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100">
              ×
            </button>
          </div>
        ))}
        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
          className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-primary-400 hover:text-primary-600 disabled:opacity-60">
          <span className="text-xl leading-none">+</span>
          <span className="text-[10px] mt-0.5">{uploading ? '…' : 'Add'}</span>
        </button>
      </div>
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
        onChange={(e) => { handleUpload(e.target.files); e.target.value = ''; }} />
    </div>
  );
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function PropertyCard({
  property,
  onDelete,
  onUpdate,
}: {
  property: Property;
  onDelete: (id: string) => void;
  onUpdate: (id: string, name: string, address: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(property.name);
  const [editAddress, setEditAddress] = useState(property.address ?? '');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);

  const guestUrl = typeof window !== 'undefined' ? `${window.location.origin}/register/${property.slug}` : '';

  const copyLink = () => {
    navigator.clipboard.writeText(guestUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    await onUpdate(property.id, editName.trim(), editAddress.trim());
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditName(property.name);
    setEditAddress(property.address ?? '');
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-5">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Property name</label>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Address <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <p className="text-xs text-gray-400">Slug <code className="bg-gray-100 px-1 rounded">/register/{property.slug}</code> cannot be changed to avoid breaking existing guest links.</p>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving || !editName.trim()}
              className="px-4 py-1.5 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={handleCancel}
              className="px-4 py-1.5 border border-gray-300 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900">{property.name}</p>
          {property.address && <p className="text-sm text-gray-500 mt-0.5">{property.address}</p>}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 truncate max-w-xs">
              /register/{property.slug}
            </code>
            <button onClick={copyLink} className="text-xs text-primary-600 hover:underline whitespace-nowrap">
              {copied ? 'Copied!' : 'Copy link'}
            </button>
            <a href={guestUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-gray-600">↗ Preview</a>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 sm:mt-1">
          <button onClick={() => setShowPhotos((v) => !v)} className="text-xs text-gray-500 hover:text-gray-800 transition-colors">
            {showPhotos ? 'Hide photos' : 'Photos'}
          </button>
          <button onClick={() => setEditing(true)} className="text-xs text-gray-500 hover:text-gray-800 transition-colors">
            Edit
          </button>
          <button onClick={() => onDelete(property.id)} className="text-xs text-red-400 hover:text-red-600 transition-colors">
            Delete
          </button>
        </div>
      </div>
      {showPhotos && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <PropertyPhotos propertyId={property.id} />
        </div>
      )}
    </div>
  );
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [slug, setSlug] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const supabase = createBrowserSupabase();

  const loadProperties = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });
    setProperties(data ?? []);
    setLoading(false);
  };

  // The client and loader are intentionally created once for this page mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadProperties(); }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(slugify(val));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error: err } = await supabase
      .from('properties')
      .insert({ owner_id: user.id, name, address: address || null, slug });

    if (err) {
      setError(err.message.includes('unique') ? 'That URL slug is already taken. Try a different name.' : err.message);
      setSaving(false);
      return;
    }

    setName(''); setAddress(''); setSlug('');
    await loadProperties();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this property? All linked registrations will be unlinked.')) return;
    await supabase.from('properties').delete().eq('id', id);
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdate = async (id: string, newName: string, newAddress: string) => {
    const { error: err } = await supabase
      .from('properties')
      .update({ name: newName, address: newAddress || null })
      .eq('id', id);
    if (!err) {
      setProperties((prev) =>
        prev.map((p) => p.id === id ? { ...p, name: newName, address: newAddress || null } : p)
      );
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-8">Properties</h1>

      {/* Add property form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 max-w-xl">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Add a property</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Property name</label>
            <input value={name} onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Villa des Orangers, Marrakech"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
              required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address <span className="text-gray-400 font-normal">(optional)</span></label>
            <input value={address} onChange={(e) => setAddress(e.target.value)}
              placeholder="12 Rue des Jardins, Marrakech"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Guest link slug</label>
            <div className="mt-1 flex rounded-lg border border-gray-300 overflow-hidden">
              <span className="bg-gray-50 px-3 py-2 text-xs text-gray-400 border-r border-gray-300 flex items-center whitespace-nowrap">
                kozibnb.ma/register/
              </span>
              <input value={slug} onChange={(e) => setSlug(slugify(e.target.value))}
                className="flex-1 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                required />
            </div>
            <p className="text-xs text-gray-400 mt-1">Unique URL you share with arriving guests.</p>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={saving || !slug}
            className="px-5 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors">
            {saving ? 'Adding...' : 'Add property'}
          </button>
        </form>
      </div>

      {/* Properties list */}
      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : properties.length === 0 ? (
        <p className="text-sm text-gray-400">No properties yet. Add your first one above.</p>
      ) : (
        <div className="space-y-4 max-w-2xl">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} onDelete={handleDelete} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}
