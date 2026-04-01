'use client';

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState({ categories: 0, items: 0 });

  useEffect(() => {
    async function loadStats() {
      const [catRes, itemRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/menu-items'),
      ]);
      const cats = await catRes.json();
      const items = await itemRes.json();
      setStats({
        categories: Array.isArray(cats) ? cats.length : 0,
        items: Array.isArray(items) ? items.length : 0,
      });
    }
    loadStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#1A1A1A' }}>Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 max-w-lg">
        <div className="bg-white rounded-lg p-6 border" style={{ borderColor: '#E5E5E5' }}>
          <p className="text-sm font-medium" style={{ color: '#666' }}>Categories</p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#1A1A1A' }}>{stats.categories}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border" style={{ borderColor: '#E5E5E5' }}>
          <p className="text-sm font-medium" style={{ color: '#666' }}>Menu Items</p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#1A1A1A' }}>{stats.items}</p>
        </div>
      </div>
    </div>
  );
}
