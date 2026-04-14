'use client';

import { useState, useEffect, useRef } from 'react';

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString();
}

function OrderRow({ order, isNew }) {
  const [expanded, setExpanded] = useState(false);
  const items = Array.isArray(order.items) ? order.items : [];
  const itemSummary = items.map((i) => `${i.name}${i.variant ? ` (${i.variant})` : ''} ×${i.quantity}`).join(', ');

  return (
    <div
      className={`bg-white border rounded-lg mb-3 overflow-hidden transition-all ${isNew ? 'ring-2 ring-red-400' : ''}`}
      style={{ borderColor: isNew ? '#E4002B' : '#E5E5E5' }}
    >
      {/* Header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-4 flex items-start gap-3"
      >
        {/* Status dot */}
        <span className="mt-1 w-2 h-2 rounded-full shrink-0" style={{ background: '#22c55e' }} />

        <div className="flex-1 min-w-0">
          {/* Top line */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm" style={{ color: '#1A1A1A' }}>
              {order.customer?.name ?? '—'}
            </span>
            {isNew && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#FEE2E2', color: '#E4002B' }}>
                NEW
              </span>
            )}
            <span className="text-xs" style={{ color: '#999' }}>{timeAgo(order.createdAt)}</span>
          </div>
          {/* Phone + address */}
          <p className="text-xs mt-0.5" style={{ color: '#666' }}>
            {order.customer?.phone} · {order.address}
          </p>
          {/* Item summary */}
          <p className="text-xs mt-1 truncate" style={{ color: '#AAA' }}>{itemSummary}</p>
        </div>

        {/* Total + chevron */}
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className="font-bold text-sm" style={{ color: '#E4002B' }}>
            ${parseFloat(order.total).toFixed(2)}
          </span>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#AAA" strokeWidth="2.5" strokeLinecap="round"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: '#F5F5F5' }}>
          <div className="pt-3 space-y-1">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm py-1">
                <span style={{ color: '#333' }}>
                  {item.name}
                  {item.variant && (
                    <span className="ml-1 text-xs px-1.5 py-0.5 rounded" style={{ background: '#FFF0F0', color: '#E4002B' }}>
                      {item.variant}
                    </span>
                  )}
                  <span style={{ color: '#999' }}> ×{item.quantity}</span>
                </span>
                <span className="font-semibold" style={{ color: '#1A1A1A' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: '#F0EEEC' }}>
              <span className="font-bold text-sm" style={{ color: '#1A1A1A' }}>Total</span>
              <span className="font-bold text-base" style={{ color: '#E4002B' }}>
                ${parseFloat(order.total).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-3 text-xs space-y-1" style={{ color: '#666' }}>
            <p><span className="font-semibold">Ref:</span> {order.reference}</p>
            <p><span className="font-semibold">Address:</span> {order.address}</p>
            <p><span className="font-semibold">Phone:</span> {order.customer?.phone}</p>
            <p><span className="font-semibold">Status:</span> <span className="capitalize">{order.status}</span></p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newIds, setNewIds] = useState(new Set());
  const [newCount, setNewCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const lastIdRef = useRef(0);
  const esRef = useRef(null);

  // Initial load
  useEffect(() => {
    fetch('/api/admin/orders')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
          if (data.length > 0) {
            lastIdRef.current = Math.max(...data.map((o) => o.id));
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // SSE for real-time new orders
  useEffect(() => {
    function connect() {
      const es = new EventSource(`/api/admin/orders/stream?lastId=${lastIdRef.current}`);
      esRef.current = es;

      es.onopen = () => setConnected(true);

      es.onmessage = (e) => {
        try {
          const incoming = JSON.parse(e.data);
          if (!Array.isArray(incoming) || incoming.length === 0) return;

          lastIdRef.current = Math.max(...incoming.map((o) => o.id));
          const incomingIds = new Set(incoming.map((o) => o.id));

          setOrders((prev) => [...incoming, ...prev]);
          setNewIds((prev) => new Set([...prev, ...incomingIds]));
          setNewCount((c) => c + incoming.length);
        } catch { /* ignore parse errors */ }
      };

      es.onerror = () => {
        setConnected(false);
        es.close();
        // Reconnect after 5 s with updated lastId
        setTimeout(connect, 5_000);
      };
    }

    connect();
    return () => {
      esRef.current?.close();
    };
  }, []);

  const clearNew = () => {
    setNewIds(new Set());
    setNewCount(0);
  };

  return (
    <div>
      {/* Page heading */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: '#1A1A1A' }}>Orders</h1>
          {newCount > 0 && (
            <button
              onClick={clearNew}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: '#FEE2E2', color: '#E4002B' }}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
              {newCount} new — dismiss
            </button>
          )}
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5 text-xs" style={{ color: connected ? '#22c55e' : '#999' }}>
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: connected ? '#22c55e' : '#ccc', animation: connected ? 'pulse 2s infinite' : 'none' }}
          />
          {connected ? 'Live' : 'Reconnecting…'}
        </div>
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border rounded-lg p-4" style={{ borderColor: '#E5E5E5' }}>
              <div className="skeleton h-4 w-1/3 rounded mb-2" />
              <div className="skeleton h-3 w-2/3 rounded mb-1" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20" style={{ color: '#AAA' }}>
          <div className="text-4xl mb-3">📋</div>
          <p className="font-medium">No orders yet</p>
          <p className="text-sm mt-1">Orders will appear here in real-time</p>
        </div>
      ) : (
        <div>
          <p className="text-xs mb-4" style={{ color: '#999' }}>
            {orders.length} order{orders.length !== 1 ? 's' : ''} total
          </p>
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              isNew={newIds.has(order.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
