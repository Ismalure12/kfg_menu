'use client';

import { useState, useEffect, useCallback } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', sortOrder: 0, isActive: true });

  const loadCategories = useCallback(async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  const resetForm = () => {
    setForm({ name: '', sortOrder: 0, isActive: true });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name: form.name, sortOrder: Number(form.sortOrder), isActive: form.isActive };

    if (editingId) {
      await fetch(`/api/categories/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    resetForm();
    loadCategories();
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, sortOrder: cat.sortOrder, isActive: cat.isActive });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category and all its items?')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    loadCategories();
  };

  const handleToggleActive = async (cat) => {
    await fetch(`/api/categories/${cat.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !cat.isActive }),
    });
    loadCategories();
  };

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

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-4 mb-6 space-y-3" style={{ borderColor: '#E5E5E5' }}>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm"
              style={{ borderColor: '#E5E5E5' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sort Order</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              style={{ borderColor: '#E5E5E5' }}
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
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: '#E4002B' }}>
              {editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: '#E5E5E5' }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Loading skeleton */}
      {loading && (
        <>
          <div className="hidden md:block bg-white rounded-lg border overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center px-4 py-3 gap-4 border-b last:border-0" style={{ borderColor: '#E5E5E5' }}>
                <div className="skeleton rounded" style={{ height: '16px', width: '120px' }} />
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
                  <div className="skeleton rounded" style={{ height: '16px', width: '100px' }} />
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
      {!loading && <div className="hidden md:block bg-white rounded-lg border overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
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
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                <td className="px-4 py-3">{cat.sortOrder}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleActive(cat)}
                    className="text-xs px-2 py-1 rounded-full font-medium"
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
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No categories yet</td></tr>
            )}
          </tbody>
        </table>
      </div>}

      {/* Mobile cards */}
      {!loading && <div className="md:hidden space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-lg border p-4" style={{ borderColor: '#E5E5E5' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm" style={{ color: '#1A1A1A' }}>{cat.name}</h3>
              <button
                onClick={() => handleToggleActive(cat)}
                className="text-xs px-2 py-1 rounded-full font-medium"
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
              <button onClick={() => handleDelete(cat.id)} className="text-red-600 text-xs font-medium">Delete</button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="bg-white rounded-lg border p-8 text-center text-gray-400 text-sm" style={{ borderColor: '#E5E5E5' }}>
            No categories yet
          </div>
        )}
      </div>}
    </div>
  );
}
