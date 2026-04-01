'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export default function MenuItemsPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', categoryId: '', imageUrl: '', sortOrder: 0, isActive: true,
  });

  const loadData = useCallback(async () => {
    const [catRes, itemRes] = await Promise.all([
      fetch('/api/categories'),
      fetch(`/api/menu-items${filterCategoryId ? `?categoryId=${filterCategoryId}` : ''}`),
    ]);
    const cats = await catRes.json();
    const itms = await itemRes.json();
    setCategories(Array.isArray(cats) ? cats : []);
    setItems(Array.isArray(itms) ? itms : []);
  }, [filterCategoryId]);

  useEffect(() => { loadData(); }, [loadData]);

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', categoryId: '', imageUrl: '', sortOrder: 0, isActive: true });
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
      }
    } catch {
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
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

    if (editingId) {
      await fetch(`/api/menu-items/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('/api/menu-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    resetForm();
    loadData();
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
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this menu item?')) return;
    await fetch(`/api/menu-items/${id}`, { method: 'DELETE' });
    loadData();
  };

  const handleToggleActive = async (item) => {
    await fetch(`/api/menu-items/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !item.isActive }),
    });
    loadData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#1A1A1A' }}>Menu Items</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 rounded-lg text-white text-sm font-medium"
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
          className="border rounded-lg px-3 py-2 text-sm"
          style={{ borderColor: '#E5E5E5' }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-4 mb-6 space-y-3" style={{ borderColor: '#E5E5E5' }}>
          <div className="grid grid-cols-2 gap-3">
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
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                required
                className="w-full border rounded-lg px-3 py-2 text-sm"
                style={{ borderColor: '#E5E5E5' }}
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
              style={{ borderColor: '#E5E5E5' }}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
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
            <div className="flex items-end pb-1">
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
              className="text-sm"
            />
            {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
            {imagePreview && (
              <div className="mt-2">
                <Image src={imagePreview} alt="Preview" width={100} height={100} className="rounded object-cover" style={{ width: '100px', height: '100px' }} />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={uploading} className="px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50" style={{ backgroundColor: '#E4002B' }}>
              {editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: '#E5E5E5' }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg border overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
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
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{item.category?.name}</td>
                <td className="px-4 py-3">${parseFloat(item.price).toFixed(2)}</td>
                <td className="px-4 py-3">{item.sortOrder}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleActive(item)}
                    className="text-xs px-2 py-1 rounded-full font-medium"
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
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No menu items yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
