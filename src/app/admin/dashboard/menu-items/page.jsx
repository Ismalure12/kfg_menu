'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function MenuItemsPage() {
  const queryClient = useQueryClient();
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', categoryId: '', imageUrl: '', sortOrder: 0, isActive: true,
  });
  const [subItems, setSubItems] = useState([]);
  const [subForm, setSubForm] = useState({ name: '', price: '', sortOrder: 0 });
  const [editingSubId, setEditingSubId] = useState(null);
  const [showSubForm, setShowSubForm] = useState(false);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to load categories');
      return res.json();
    },
    onError: (err) => {
      console.error('[menu-items] categories load error:', err);
      toast.error('Failed to load categories');
    },
  });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['menu-items', filterCategoryId],
    queryFn: async () => {
      const url = filterCategoryId ? `/api/menu-items?categoryId=${filterCategoryId}` : '/api/menu-items';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load menu items');
      return res.json();
    },
    onError: (err) => {
      console.error('[menu-items] load error:', err);
      toast.error('Failed to load menu items');
    },
  });

  const loadSubItems = async (menuItemId) => {
    try {
      const res = await fetch(`/api/sub-items?menuItemId=${menuItemId}`);
      const data = await res.json();
      setSubItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[menu-items] sub-items load error:', err);
      toast.error('Failed to load sub-items');
    }
  };

  // ── Save item mutation ─────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(
        editingId ? `/api/menu-items/${editingId}` : '/api/menu-items',
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
      toast.loading(editingId ? 'Updating item…' : 'Creating item…', { id: 'item-save' });
    },
    onSuccess: () => {
      toast.success(editingId ? 'Item updated' : 'Item created', { id: 'item-save' });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      resetForm();
    },
    onError: (err) => {
      console.error('[menu-items] save error:', err);
      toast.error(err.message || 'Something went wrong', { id: 'item-save' });
    },
  });

  // ── Delete item mutation ───────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/menu-items/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
    },
    onMutate: () => {
      toast.loading('Deleting item…', { id: 'item-delete' });
    },
    onSuccess: () => {
      toast.success('Item deleted', { id: 'item-delete' });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
    onError: (err) => {
      console.error('[menu-items] delete error:', err);
      toast.error(err.message || 'Delete failed', { id: 'item-delete' });
    },
  });

  // ── Toggle active mutation ─────────────────────────────────────────────────
  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }) => {
      const res = await fetch(`/api/menu-items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error('Toggle failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
    onError: (err) => {
      console.error('[menu-items] toggle error:', err);
      toast.error(err.message || 'Toggle failed');
    },
  });

  // ── Sub-item mutations ─────────────────────────────────────────────────────
  const saveSubMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(
        editingSubId ? `/api/sub-items/${editingSubId}` : '/api/sub-items',
        {
          method: editingSubId ? 'PUT' : 'POST',
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
      toast.loading(editingSubId ? 'Updating variant…' : 'Adding variant…', { id: 'sub-save' });
    },
    onSuccess: () => {
      toast.success(editingSubId ? 'Variant updated' : 'Variant added', { id: 'sub-save' });
      resetSubForm();
      loadSubItems(editingId);
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
    onError: (err) => {
      console.error('[menu-items] sub save error:', err);
      toast.error(err.message || 'Something went wrong', { id: 'sub-save' });
    },
  });

  const deleteSubMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/sub-items/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
    },
    onMutate: () => {
      toast.loading('Deleting variant…', { id: 'sub-delete' });
    },
    onSuccess: () => {
      toast.success('Variant deleted', { id: 'sub-delete' });
      loadSubItems(editingId);
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
    onError: (err) => {
      console.error('[menu-items] sub delete error:', err);
      toast.error(err.message || 'Delete failed', { id: 'sub-delete' });
    },
  });

  const resetSubForm = () => {
    setSubForm({ name: '', price: '', sortOrder: 0 });
    setEditingSubId(null);
    setShowSubForm(false);
  };

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', categoryId: '', imageUrl: '', sortOrder: 0, isActive: true });
    setEditingId(null);
    setShowForm(false);
    setImagePreview(null);
    setSubItems([]);
    resetSubForm();
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
      console.error('[menu-items] upload error:', err);
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
      description: form.description || null,
      price: parseFloat(form.price),
      categoryId: parseInt(form.categoryId),
      imageUrl: form.imageUrl || null,
      sortOrder: Number(form.sortOrder),
      isActive: form.isActive,
    };
    saveMutation.mutate(payload);
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      categoryId: item.categoryId,
      imageUrl: item.imageUrl || '',
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    });
    setEditingId(item.id);
    setImagePreview(item.imageUrl);
    setShowForm(true);
    loadSubItems(item.id);
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this menu item?')) return;
    deleteMutation.mutate(id);
  };

  const handleToggleActive = (item) => {
    toggleMutation.mutate({ id: item.id, isActive: !item.isActive });
  };

  const handleSubSubmit = (e) => {
    e.preventDefault();
    const payload = {
      menuItemId: editingId,
      name: subForm.name,
      price: parseFloat(subForm.price),
      sortOrder: Number(subForm.sortOrder),
    };
    saveSubMutation.mutate(payload);
  };

  const handleSubEdit = (sub) => {
    setSubForm({ name: sub.name, price: sub.price, sortOrder: sub.sortOrder });
    setEditingSubId(sub.id);
    setShowSubForm(true);
  };

  const handleSubDelete = (id) => {
    if (!confirm('Delete this sub-item?')) return;
    deleteSubMutation.mutate(id);
  };

  const isSaving = saveMutation.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold" style={{ color: '#1A1A1A' }}>Menu Items</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-3 md:px-4 py-2 rounded-lg text-white text-sm font-medium"
          style={{ backgroundColor: '#E4002B' }}
        >
          Add Item
        </button>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={filterCategoryId}
          onChange={(e) => setFilterCategoryId(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-full md:w-auto"
          style={{ borderColor: '#E5E5E5' }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Modal overlay */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => { if (e.target === e.currentTarget) resetForm(); }}
        >
          <div
            className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
            style={{ animation: 'modalIn 0.2s ease-out' }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#E5E5E5' }}>
              <h2 className="text-lg font-bold" style={{ color: '#1A1A1A' }}>
                {editingId ? 'Edit Item' : 'Add Item'}
              </h2>
              <button
                onClick={resetForm}
                disabled={isSaving}
                className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                style={{ width: '32px', height: '32px' }}
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    style={{ borderColor: '#E5E5E5', fontSize: '16px' }}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  style={{ borderColor: '#E5E5E5', fontSize: '16px' }}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    style={{ borderColor: '#E5E5E5', fontSize: '16px' }}
                  />
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
                <div className="flex items-end pb-1 col-span-2 md:col-span-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      id="itemActive"
                    />
                    <label htmlFor="itemActive" className="text-sm">Active</label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="text-sm w-full"
                />
                {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
                {imagePreview && (
                  <div className="mt-2">
                    <Image src={imagePreview} alt="Preview" width={100} height={100} className="rounded object-cover" style={{ width: '100px', height: '100px' }} />
                  </div>
                )}
              </div>

              {/* Modal footer */}
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

            {/* Sub-items section — only when editing */}
            {editingId && (
              <div className="px-5 py-4 border-t" style={{ borderColor: '#E5E5E5' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold" style={{ color: '#1A1A1A' }}>
                    Sub-Items / Variants
                    <span className="ml-2 text-xs font-normal text-gray-400">({subItems.length})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => { resetSubForm(); setShowSubForm(true); }}
                    className="text-xs px-3 py-1 rounded-lg text-white font-medium"
                    style={{ backgroundColor: '#E4002B' }}
                  >
                    + Add
                  </button>
                </div>

                {/* Sub-item inline form */}
                {showSubForm && (
                  <form onSubmit={handleSubSubmit} className="flex flex-wrap gap-2 mb-3 p-3 rounded-lg" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E5E5' }}>
                    <input
                      type="text"
                      placeholder="Name (e.g. Large)"
                      value={subForm.name}
                      onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
                      required
                      className="flex-1 min-w-[120px] border rounded-lg px-3 py-1.5 text-sm"
                      style={{ borderColor: '#E5E5E5', fontSize: '16px' }}
                    />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Price"
                      value={subForm.price}
                      onChange={(e) => setSubForm({ ...subForm, price: e.target.value })}
                      required
                      className="w-24 border rounded-lg px-3 py-1.5 text-sm"
                      style={{ borderColor: '#E5E5E5', fontSize: '16px' }}
                    />
                    <input
                      type="number"
                      placeholder="Order"
                      value={subForm.sortOrder}
                      onChange={(e) => setSubForm({ ...subForm, sortOrder: e.target.value })}
                      className="w-16 border rounded-lg px-2 py-1.5 text-sm"
                      style={{ borderColor: '#E5E5E5', fontSize: '16px' }}
                    />
                    <button
                      type="submit"
                      disabled={saveSubMutation.isPending}
                      className="px-3 py-1.5 rounded-lg text-white text-xs font-medium disabled:opacity-60 flex items-center gap-1"
                      style={{ backgroundColor: '#E4002B' }}
                    >
                      {saveSubMutation.isPending && (
                        <svg className="animate-spin" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                      )}
                      {editingSubId ? 'Update' : 'Add'}
                    </button>
                    <button type="button" onClick={resetSubForm} className="px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: '#E5E5E5' }}>
                      Cancel
                    </button>
                  </form>
                )}

                {/* Sub-items list */}
                {subItems.length > 0 ? (
                  <div className="space-y-1">
                    {subItems.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: '#F9FAFB' }}>
                        <div className="flex items-center gap-2">
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: sub.isActive ? '#22C55E' : '#999' }} />
                          <span className="font-medium">{sub.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium" style={{ color: '#E4002B' }}>${parseFloat(sub.price).toFixed(2)}</span>
                          <button onClick={() => handleSubEdit(sub)} className="text-blue-600 text-xs">Edit</button>
                          <button
                            onClick={() => handleSubDelete(sub.id)}
                            disabled={deleteSubMutation.isPending}
                            className="text-red-600 text-xs disabled:opacity-60"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-2">No sub-items yet. Add variants like sizes or flavors.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <>
          <div className="hidden md:block bg-white rounded-lg border overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center px-4 py-3 gap-4 border-b last:border-0" style={{ borderColor: '#E5E5E5' }}>
                <div className="flex items-center gap-2">
                  <div className="skeleton rounded shrink-0" style={{ height: '32px', width: '32px' }} />
                  <div className="skeleton rounded" style={{ height: '16px', width: '110px' }} />
                </div>
                <div className="skeleton rounded" style={{ height: '16px', width: '80px' }} />
                <div className="skeleton rounded" style={{ height: '16px', width: '50px' }} />
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
              <div key={i} className="bg-white rounded-lg border p-3" style={{ borderColor: '#E5E5E5' }}>
                <div className="flex gap-3">
                  <div className="skeleton rounded-lg shrink-0" style={{ width: '64px', height: '64px' }} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="skeleton rounded" style={{ height: '16px', width: '100px' }} />
                      <div className="skeleton rounded-full shrink-0" style={{ height: '20px', width: '54px' }} />
                    </div>
                    <div className="flex gap-3">
                      <div className="skeleton rounded" style={{ height: '12px', width: '60px' }} />
                      <div className="skeleton rounded" style={{ height: '12px', width: '50px' }} />
                    </div>
                  </div>
                </div>
                <div className="border-t pt-2 mt-2" style={{ borderColor: '#E5E5E5' }}>
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
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Price</th>
                <th className="text-left px-4 py-3 font-medium">Order</th>
                <th className="text-left px-4 py-3 font-medium">Active</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b last:border-0" style={{ borderColor: '#E5E5E5' }}>
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-2">
                      {item.imageUrl && (
                        <Image src={item.imageUrl} alt="" width={32} height={32} className="rounded object-cover" style={{ width: '32px', height: '32px' }} />
                      )}
                      {item.name}
                      {item.subItems?.length > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#FFF0F0', color: '#E4002B' }}>
                          {item.subItems.length} var
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.category?.name}</td>
                  <td className="px-4 py-3">${parseFloat(item.price).toFixed(2)}</td>
                  <td className="px-4 py-3">{item.sortOrder}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(item)}
                      disabled={toggleMutation.isPending}
                      className="text-xs px-2 py-1 rounded-full font-medium disabled:opacity-60"
                      style={{
                        backgroundColor: item.isActive ? '#DEF7EC' : '#FDE8E8',
                        color: item.isActive ? '#03543F' : '#9B1C1C',
                      }}
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline text-xs mr-3">Edit</button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:underline text-xs disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No menu items yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile cards */}
      {!isLoading && (
        <div className="md:hidden space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border p-3" style={{ borderColor: '#E5E5E5' }}>
              <div className="flex gap-3">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded-lg object-cover shrink-0"
                    style={{ width: '64px', height: '64px' }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-medium text-sm truncate" style={{ color: '#1A1A1A' }}>{item.name}</h3>
                      {item.subItems?.length > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0" style={{ backgroundColor: '#FFF0F0', color: '#E4002B' }}>
                          {item.subItems.length}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleToggleActive(item)}
                      disabled={toggleMutation.isPending}
                      className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0 disabled:opacity-60"
                      style={{
                        backgroundColor: item.isActive ? '#DEF7EC' : '#FDE8E8',
                        color: item.isActive ? '#03543F' : '#9B1C1C',
                      }}
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>{item.category?.name}</span>
                    <span className="font-medium" style={{ color: '#E4002B' }}>${parseFloat(item.price).toFixed(2)}</span>
                    <span>Order: {item.sortOrder}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 border-t pt-2 mt-2" style={{ borderColor: '#E5E5E5' }}>
                <button onClick={() => handleEdit(item)} className="text-blue-600 text-xs font-medium">Edit</button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleteMutation.isPending}
                  className="text-red-600 text-xs font-medium disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="bg-white rounded-lg border p-8 text-center text-gray-400 text-sm" style={{ borderColor: '#E5E5E5' }}>
              No menu items yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}
