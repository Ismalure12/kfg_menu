'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ email: '', password: '', role: 'user' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => { if (d.userId) setCurrentUserId(d.userId); })
      .catch(() => {});
  }, []);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      if (res.status === 403) return { denied: true, users: [] };
      if (!res.ok) throw new Error('Failed to load users');
      const users = await res.json();
      return { denied: false, users: Array.isArray(users) ? users : [] };
    },
    onError: (err) => {
      console.error('[users] load error:', err);
      toast.error('Failed to load users');
    },
  });

  const accessDenied = data?.denied ?? false;
  const users = data?.users ?? [];

  // ── Save mutation ──────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(
        editingId ? `/api/users/${editingId}` : '/api/users',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      return res.json();
    },
    onMutate: () => {
      toast.loading(editingId ? 'Updating user…' : 'Creating user…', { id: 'user-save' });
    },
    onSuccess: () => {
      toast.success(editingId ? 'User updated' : 'User created', { id: 'user-save' });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      resetForm();
    },
    onError: (err) => {
      console.error('[users] save error:', err);
      toast.dismiss('user-save');
      setFormError(err.message || 'Something went wrong');
    },
  });

  // ── Delete mutation ────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Delete failed');
      }
    },
    onMutate: () => {
      toast.loading('Deleting user…', { id: 'user-delete' });
    },
    onSuccess: () => {
      toast.success('User deleted', { id: 'user-delete' });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      console.error('[users] delete error:', err);
      toast.error(err.message || 'Delete failed', { id: 'user-delete' });
    },
  });

  const resetForm = () => {
    setForm({ email: '', password: '', role: 'user' });
    setEditingId(null);
    setShowForm(false);
    setFormError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (editingId) {
      saveMutation.mutate({ email: form.email, role: form.role });
    } else {
      if (!form.password || form.password.length < 6) {
        setFormError('Password must be at least 6 characters');
        return;
      }
      saveMutation.mutate(form);
    }
  };

  const handleEdit = (user) => {
    setForm({ email: user.email, password: '', role: user.role });
    setEditingId(user.id);
    setShowForm(true);
    setFormError('');
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this user?')) return;
    deleteMutation.mutate(id);
  };

  const isSaving = saveMutation.isPending;

  if (!isLoading && accessDenied) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-3">&#128274;</div>
          <h2 className="text-lg font-bold mb-1" style={{ color: '#1A1A1A' }}>Access Denied</h2>
          <p className="text-sm" style={{ color: '#666' }}>Only admins can manage users.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold" style={{ color: '#1A1A1A' }}>Users</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-3 md:px-4 py-2 rounded-lg text-white text-sm font-medium"
          style={{ backgroundColor: '#E4002B' }}
        >
          Add User
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
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#E5E5E5' }}>
              <h2 className="text-lg font-bold" style={{ color: '#1A1A1A' }}>
                {editingId ? 'Edit User' : 'Add User'}
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

            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  style={{ borderColor: '#E5E5E5', fontSize: '16px' }}
                />
              </div>
              {!editingId && (
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={6}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    style={{ borderColor: '#E5E5E5', fontSize: '16px' }}
                    placeholder="Min 6 characters"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  style={{ borderColor: '#E5E5E5', fontSize: '16px' }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {formError && (
                <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{formError}</div>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
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
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center px-4 py-3 gap-4 border-b last:border-0" style={{ borderColor: '#E5E5E5' }}>
                <div className="skeleton rounded" style={{ height: '16px', width: '160px' }} />
                <div className="skeleton rounded-full" style={{ height: '24px', width: '60px' }} />
                <div className="skeleton rounded" style={{ height: '16px', width: '100px' }} />
                <div className="flex gap-2 ml-auto">
                  <div className="skeleton rounded" style={{ height: '16px', width: '30px' }} />
                  <div className="skeleton rounded" style={{ height: '16px', width: '40px' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="md:hidden space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border p-4" style={{ borderColor: '#E5E5E5' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="skeleton rounded" style={{ height: '16px', width: '140px' }} />
                  <div className="skeleton rounded-full" style={{ height: '24px', width: '60px' }} />
                </div>
                <div className="skeleton rounded" style={{ height: '12px', width: '100px' }} />
                <div className="border-t pt-3 mt-3" style={{ borderColor: '#E5E5E5' }}>
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
      {!isLoading && !accessDenied && (
        <div className="hidden md:block bg-white rounded-lg border overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: '#E5E5E5', backgroundColor: '#F9FAFB' }}>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium">Created</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b last:border-0" style={{ borderColor: '#E5E5E5' }}>
                  <td className="px-4 py-3 font-medium">
                    {user.email}
                    {user.id === currentUserId && (
                      <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#F0F0F0', color: '#666' }}>you</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: user.role === 'admin' ? '#EDE9FE' : '#E0F2FE',
                        color: user.role === 'admin' ? '#6D28D9' : '#0369A1',
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEdit(user)} className="text-blue-600 hover:underline text-xs mr-3">Edit</button>
                    {user.id !== currentUserId && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:underline text-xs disabled:opacity-60"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No users yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile cards */}
      {!isLoading && !accessDenied && (
        <div className="md:hidden space-y-3">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg border p-4" style={{ borderColor: '#E5E5E5' }}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-sm truncate" style={{ color: '#1A1A1A' }}>
                  {user.email}
                  {user.id === currentUserId && (
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#F0F0F0', color: '#666' }}>you</span>
                  )}
                </h3>
                <span
                  className="text-xs px-2 py-1 rounded-full font-medium shrink-0"
                  style={{
                    backgroundColor: user.role === 'admin' ? '#EDE9FE' : '#E0F2FE',
                    color: user.role === 'admin' ? '#6D28D9' : '#0369A1',
                  }}
                >
                  {user.role}
                </span>
              </div>
              <p className="text-xs mb-3" style={{ color: '#999' }}>
                Created {new Date(user.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-3 border-t pt-3" style={{ borderColor: '#E5E5E5' }}>
                <button onClick={() => handleEdit(user)} className="text-blue-600 text-xs font-medium">Edit</button>
                {user.id !== currentUserId && (
                  <button
                    onClick={() => handleDelete(user.id)}
                    disabled={deleteMutation.isPending}
                    className="text-red-600 text-xs font-medium disabled:opacity-60"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="bg-white rounded-lg border p-8 text-center text-gray-400 text-sm" style={{ borderColor: '#E5E5E5' }}>
              No users yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}
