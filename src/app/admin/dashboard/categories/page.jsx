'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', sortOrder: 0, isActive: true, imageUrl: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to load categories');
      return res.json();
    },
    onError: (err) => {
      console.error('[categories] load error:', err);
      toast.error('Failed to load categories');
    },
  });

  // ── Save mutation (create or update) ──────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(
        editingId ? `/api/categories/${editingId}` : '/api/categories',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Request failed (${res.status})`);
      }
      return res.json();
    },
    onMutate: () => {
      toast.loading(editingId ? 'Updating category…' : 'Creating category…', { id: 'cat-save' });
    },
    onSuccess: () => {
      toast.success(editingId ? 'Category updated' : 'Category created', { id: 'cat-save' });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      resetForm();
    },
    onError: (err) => {
      console.error('[categories] save error:', err);
      toast.error(err.message || 'Something went wrong', { id: 'cat-save' });
    },
  });

  // ── Delete mutation ────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
    },
    onMutate: () => {
      toast.loading('Deleting category…', { id: 'cat-delete' });
    },
    onSuccess: () => {
      toast.success('Category deleted', { id: 'cat-delete' });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err) => {
      console.error('[categories] delete error:', err);
      toast.error(err.message || 'Delete failed', { id: 'cat-delete' });
    },
  });

  // ── Toggle active mutation ─────────────────────────────────────────────────
  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }) => {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error('Toggle failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err) => {
      console.error('[categories] toggle error:', err);
      toast.error(err.message || 'Toggle failed');
    },
  });

  const resetForm = () => {
    setForm({ name: '', sortOrder: 0, isActive: true, imageUrl: '' });
    setEditingId(null);
    setShowForm(false);
    setImagePreview(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setImagePreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, imageUrl: data.url }));
        toast.success('Image uploaded');
      } else {
        throw new Error('No URL returned');
      }
    } catch (err) {
      console.error('[categories] upload error:', err);
      toast.error('Image upload failed');
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      sortOrder: Number(form.sortOrder),
      isActive: form.isActive,
      imageUrl: form.imageUrl || null,
    };
    saveMutation.mutate(payload);
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, sortOrder: cat.sortOrder, isActive: cat.isActive, imageUrl: cat.imageUrl || '' });
    setImagePreview(cat.imageUrl || null);
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this category and all its items?')) return;
    deleteMutation.mutate(id);
  };

  const handleToggleActive = (cat) => {
    toggleMutation.mutate({ id: cat.id, isActive: !cat.isActive });
  };

  const isSaving = saveMutation.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold" style={{ color: '#1A1A1A' }}>Categories</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-3 md:px-4 py-2 rounded-lg text-white text-sm font-medium"
          style={{ backgroundColor: '#E4002B' }}
        >
          Add Category
        </button>
      </div>

      {/* Modal overlay */}
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
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#E5E5E5' }}>
              <h2 className="text-lg font-bold" style={{ color: '#1A1A1A' }}>
                {editingId ? 'Edit Category' : 'Add Category'}
              </h2>
              <button
                onClick={resetForm}
                className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                style={{ width: '32px', height: '32px' }}
                disabled={isSaving}
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  style={{ borderColor: '#E5E5E5', fontSize: '16px' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category Image</label>
                <div className="flex items-center gap-3">
                  {imagePreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="rounded-lg object-cover flex-shrink-0"
                      style={{ width: 56, height: 56, border: '1px solid #E5E5E5' }}
                    />
                  )}
                  <label
                    className="flex-1 flex items-center justify-center gap-2 border rounded-lg px-3 py-2 text-sm cursor-pointer"
                    style={{ borderColor: '#E5E5E5', borderStyle: 'dashed', color: '#666' }}
                  >
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    {uploading ? 'Uploading…' : imagePreview ? 'Change image' : 'Upload image'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  style={{ borderColor: '#E5E5E5', fontSize: '16px' }}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  id="isActive"
                />
                <label htmlFor="isActive" className="text-sm">Active</label>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSaving || uploading}
                  className="px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-60 flex items-center gap-2"
                  style={{ backgroundColor: '#E4002B' }}
                >
                  {isSaving && (
                    <svg className="animate-spin" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                  )}
                  {isSaving ? (editingId ? 'Updating…' : 'Creating…') : (editingId ? 'Update' : 'Create')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg text-sm font-medium border disabled:opacity-60"
                  style={{ borderColor: '#E5E5E5' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <>
          <div className="hidden md:block bg-white rounded-lg border overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center px-4 py-3 gap-4 border-b last:border-0" style={{ borderColor: '#E5E5E5' }}>
                <div className="flex items-center gap-2">
                  <div className="skeleton rounded-full" style={{ height: '28px', width: '28px' }} />
                  <div className="skeleton rounded" style={{ height: '16px', width: '120px' }} />
                </div>
                <div className="skeleton rounded" style={{ height: '16px', width: '100px' }} />
                <div className="skeleton rounded" style={{ height: '16px', width: '30px' }} />
                <div className="skeleton rounded-full" style={{ height: '24px', width: '60px' }} />
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
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="skeleton rounded-full" style={{ height: '28px', width: '28px' }} />
                    <div className="skeleton rounded" style={{ height: '16px', width: '100px' }} />
                  </div>
                  <div className="skeleton rounded-full" style={{ height: '24px', width: '60px' }} />
                </div>
                <div className="flex gap-4 mb-3">
                  <div className="skeleton rounded" style={{ height: '12px', width: '80px' }} />
                  <div className="skeleton rounded" style={{ height: '12px', width: '60px' }} />
                </div>
                <div className="border-t pt-3" style={{ borderColor: '#E5E5E5' }}>
                  <div className="flex gap-3">
                    <div className="skeleton rounded" style={{ height: '14px', width: '30px' }} />
                    <div className="skeleton rounded" style={{ height: '14px', width: '40px' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Desktop table */}
      {!isLoading && (
        <div className="hidden md:block bg-white rounded-lg border overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: '#E5E5E5', backgroundColor: '#F9FAFB' }}>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Slug</th>
                <th className="text-left px-4 py-3 font-medium">Order</th>
                <th className="text-left px-4 py-3 font-medium">Active</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b last:border-0" style={{ borderColor: '#E5E5E5' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {cat.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cat.imageUrl} alt="" className="rounded-full object-cover flex-shrink-0" style={{ width: 28, height: 28 }} />
                      ) : (
                        <div className="rounded-full flex-shrink-0 flex items-center justify-center text-xs" style={{ width: 28, height: 28, background: '#F5F5F5', color: '#AAA' }}>?</div>
                      )}
                      <span className="font-medium">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                  <td className="px-4 py-3">{cat.sortOrder}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(cat)}
                      disabled={toggleMutation.isPending}
                      className="text-xs px-2 py-1 rounded-full font-medium disabled:opacity-60"
                      style={{
                        backgroundColor: cat.isActive ? '#DEF7EC' : '#FDE8E8',
                        color: cat.isActive ? '#03543F' : '#9B1C1C',
                      }}
                    >
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:underline text-xs mr-3">Edit</button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:underline text-xs disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No categories yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile cards */}
      {!isLoading && (
        <div className="md:hidden space-y-3">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-lg border p-4" style={{ borderColor: '#E5E5E5' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {cat.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cat.imageUrl} alt="" className="rounded-full object-cover flex-shrink-0" style={{ width: 28, height: 28 }} />
                  ) : (
                    <div className="rounded-full flex-shrink-0 flex items-center justify-center text-xs" style={{ width: 28, height: 28, background: '#F5F5F5', color: '#AAA' }}>?</div>
                  )}
                  <h3 className="font-medium text-sm" style={{ color: '#1A1A1A' }}>{cat.name}</h3>
                </div>
                <button
                  onClick={() => handleToggleActive(cat)}
                  disabled={toggleMutation.isPending}
                  className="text-xs px-2 py-1 rounded-full font-medium disabled:opacity-60"
                  style={{
                    backgroundColor: cat.isActive ? '#DEF7EC' : '#FDE8E8',
                    color: cat.isActive ? '#03543F' : '#9B1C1C',
                  }}
                >
                  {cat.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span>Slug: {cat.slug}</span>
                <span>Order: {cat.sortOrder}</span>
              </div>
              <div className="flex gap-3 border-t pt-3" style={{ borderColor: '#E5E5E5' }}>
                <button onClick={() => handleEdit(cat)} className="text-blue-600 text-xs font-medium">Edit</button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  disabled={deleteMutation.isPending}
                  className="text-red-600 text-xs font-medium disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="bg-white rounded-lg border p-8 text-center text-gray-400 text-sm" style={{ borderColor: '#E5E5E5' }}>
              No categories yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}
