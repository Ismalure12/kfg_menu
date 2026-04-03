'use client';

import { useState, useEffect, useCallback } from 'react';

const PLATFORMS = [
  { value: 'phone', label: 'Phone', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )},
  { value: 'whatsapp', label: 'WhatsApp', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )},
  { value: 'instagram', label: 'Instagram', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )},
  { value: 'facebook', label: 'Facebook', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )},
  { value: 'twitter', label: 'X / Twitter', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )},
  { value: 'tiktok', label: 'TikTok', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.88a8.28 8.28 0 0 0 4.76 1.5V6.93a4.84 4.84 0 0 1-1-.24z" />
    </svg>
  )},
  { value: 'website', label: 'Website', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )},
];

function getPlatformInfo(platform) {
  return PLATFORMS.find((p) => p.value === platform) || { value: platform, label: platform, icon: null };
}

export default function SocialLinksPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ platform: '', value: '' });
  const [error, setError] = useState('');

  const loadLinks = useCallback(async () => {
    const res = await fetch('/api/social-links');
    const data = await res.json();
    setLinks(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { loadLinks(); }, [loadLinks]);

  const usedPlatforms = links.map((l) => l.platform);
  const availablePlatforms = PLATFORMS.filter((p) => !usedPlatforms.includes(p.value));

  const resetForm = () => {
    setForm({ platform: '', value: '' });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (editingId) {
      const res = await fetch(`/api/social-links/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: form.value }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to update');
        return;
      }
    } else {
      const res = await fetch('/api/social-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: form.platform, value: form.value }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create');
        return;
      }
    }

    resetForm();
    loadLinks();
  };

  const handleEdit = (link) => {
    setForm({ platform: link.platform, value: link.value });
    setEditingId(link.id);
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this social link?')) return;
    await fetch(`/api/social-links/${id}`, { method: 'DELETE' });
    loadLinks();
  };

  const getPlaceholder = (platform) => {
    switch (platform) {
      case 'phone':
      case 'whatsapp':
        return '+256 700 000 000';
      case 'instagram':
        return 'https://instagram.com/yourpage';
      case 'facebook':
        return 'https://facebook.com/yourpage';
      case 'twitter':
        return 'https://x.com/yourhandle';
      case 'tiktok':
        return 'https://tiktok.com/@yourhandle';
      case 'website':
        return 'https://yourwebsite.com';
      default:
        return 'Enter value';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold" style={{ color: '#1A1A1A' }}>Social Links</h1>
        {availablePlatforms.length > 0 && (
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="px-3 md:px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: '#E4002B' }}
          >
            Add Link
          </button>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => { if (e.target === e.currentTarget) resetForm(); }}
        >
          <div
            className="bg-white rounded-xl w-full max-w-md shadow-xl"
            style={{ animation: 'modalIn 0.2s ease-out' }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#E5E5E5' }}>
              <h2 className="text-lg font-bold" style={{ color: '#1A1A1A' }}>
                {editingId ? 'Edit Link' : 'Add Link'}
              </h2>
              <button
                onClick={resetForm}
                className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                style={{ width: '32px', height: '32px' }}
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
              {error && (
                <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</div>
              )}

              {!editingId && (
                <div>
                  <label className="block text-sm font-medium mb-1">Platform</label>
                  <select
                    value={form.platform}
                    onChange={(e) => setForm({ ...form, platform: e.target.value })}
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    style={{ borderColor: '#E5E5E5' }}
                  >
                    <option value="">Select platform...</option>
                    {availablePlatforms.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {editingId && (
                <div>
                  <label className="block text-sm font-medium mb-1">Platform</label>
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                    {getPlatformInfo(form.platform).icon}
                    {getPlatformInfo(form.platform).label}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">
                  {form.platform === 'phone' || form.platform === 'whatsapp' ? 'Phone Number' : 'URL'}
                </label>
                <input
                  type="text"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  required
                  placeholder={getPlaceholder(form.platform)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  style={{ borderColor: '#E5E5E5' }}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: '#E4002B' }}>
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: '#E5E5E5' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <>
          <div className="hidden md:block bg-white rounded-lg border overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center px-4 py-3 gap-4 border-b last:border-0" style={{ borderColor: '#E5E5E5' }}>
                <div className="skeleton rounded-full" style={{ height: '32px', width: '32px' }} />
                <div className="skeleton rounded" style={{ height: '16px', width: '100px' }} />
                <div className="skeleton rounded" style={{ height: '16px', width: '200px' }} />
                <div className="flex gap-2 ml-auto">
                  <div className="skeleton rounded" style={{ height: '16px', width: '30px' }} />
                  <div className="skeleton rounded" style={{ height: '16px', width: '40px' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="md:hidden space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border p-4" style={{ borderColor: '#E5E5E5' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="skeleton rounded-full" style={{ height: '32px', width: '32px' }} />
                  <div className="skeleton rounded" style={{ height: '16px', width: '80px' }} />
                </div>
                <div className="skeleton rounded" style={{ height: '14px', width: '180px', marginBottom: '12px' }} />
                <div className="flex gap-3 border-t pt-3" style={{ borderColor: '#E5E5E5' }}>
                  <div className="skeleton rounded" style={{ height: '14px', width: '30px' }} />
                  <div className="skeleton rounded" style={{ height: '14px', width: '40px' }} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Desktop table */}
      {!loading && (
        <div className="hidden md:block bg-white rounded-lg border overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: '#E5E5E5', backgroundColor: '#F9FAFB' }}>
                <th className="text-left px-4 py-3 font-medium">Platform</th>
                <th className="text-left px-4 py-3 font-medium">Value</th>
                <th className="text-left px-4 py-3 font-medium">Updated</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => {
                const info = getPlatformInfo(link.platform);
                return (
                  <tr key={link.id} className="border-b last:border-0" style={{ borderColor: '#E5E5E5' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 font-medium">
                        <span className="text-gray-500">{info.icon}</span>
                        {info.label}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 break-all max-w-xs">{link.value}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(link.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(link)} className="text-blue-600 hover:underline text-xs mr-3">Edit</button>
                      <button onClick={() => handleDelete(link.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                    </td>
                  </tr>
                );
              })}
              {links.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No social links yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile cards */}
      {!loading && (
        <div className="md:hidden space-y-3">
          {links.map((link) => {
            const info = getPlatformInfo(link.platform);
            return (
              <div key={link.id} className="bg-white rounded-lg border p-4" style={{ borderColor: '#E5E5E5' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{ width: '36px', height: '36px', backgroundColor: '#F5F5F5', color: '#666' }}
                  >
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm" style={{ color: '#1A1A1A' }}>{info.label}</h3>
                    <p className="text-xs text-gray-400">
                      Updated {new Date(link.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 break-all">{link.value}</p>
                <div className="flex gap-3 border-t pt-3" style={{ borderColor: '#E5E5E5' }}>
                  <button onClick={() => handleEdit(link)} className="text-blue-600 text-xs font-medium">Edit</button>
                  <button onClick={() => handleDelete(link.id)} className="text-red-600 text-xs font-medium">Delete</button>
                </div>
              </div>
            );
          })}
          {links.length === 0 && (
            <div className="bg-white rounded-lg border p-8 text-center text-gray-400 text-sm" style={{ borderColor: '#E5E5E5' }}>
              No social links yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}
