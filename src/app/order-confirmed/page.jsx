'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Suspense } from 'react';

function OrderConfirmedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ref) { router.replace('/'); return; }
    fetch(`/api/order?ref=${encodeURIComponent(ref)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError('Order not found'); setLoading(false); return; }
        setOrder(data);
        setLoading(false);
      })
      .catch(() => { setError('Failed to load order'); setLoading(false); });
  }, [ref, router]);

  const total = order ? parseFloat(order.total) : 0;

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ maxWidth: 900, margin: '0 auto', background: '#FAFAFA', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 20,
          background: '#fff',
          borderBottom: '1px solid #F0EEEC',
          boxShadow: '0 1px 16px rgba(0,0,0,0.05)',
          padding: '12px 20px',
        }}>
          <Image src="/logo-transparent.png" alt="KFG" width={160} height={48} style={{ height: 42, width: 'auto' }} priority />
        </div>

        {/* Content */}
        <div style={{ padding: '40px 20px 60px', display: 'flex', justifyContent: 'center' }}>
          {loading && (
            <div style={{ textAlign: 'center', color: '#AAA', marginTop: 60 }}>
              <p style={{ fontFamily: 'var(--font-work-sans), sans-serif', fontSize: 15 }}>Loading your order...</p>
            </div>
          )}
          {error && (
            <div style={{ textAlign: 'center', color: '#AAA', marginTop: 60 }}>
              <p style={{ fontFamily: 'var(--font-work-sans), sans-serif', fontSize: 15 }}>{error}</p>
            </div>
          )}
          {order && (
            <div style={{
              background: '#fff', borderRadius: 20,
              border: '1px solid #F0EEEC',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              padding: '40px 32px',
              maxWidth: 480, width: '100%',
              textAlign: 'center',
              animation: 'fadeSlideUp 0.4s ease',
            }}>
              {/* Checkmark */}
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: '#FFF0F0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: 36,
              }}>
                ✅
              </div>

              <h1 style={{
                fontFamily: 'var(--font-oswald), sans-serif',
                fontSize: 28, fontWeight: 700, color: '#1A1A1A', marginBottom: 8,
              }}>
                Order Confirmed!
              </h1>
              <p style={{
                fontFamily: 'var(--font-work-sans), sans-serif',
                fontSize: 14, color: '#666', marginBottom: 24, lineHeight: 1.5,
              }}>
                Delivering to: <strong>{order.address}</strong>
              </p>

              {/* Items */}
              <div style={{ textAlign: 'left', marginBottom: 20 }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    padding: '10px 0',
                    borderBottom: idx < order.items.length - 1 ? '1px solid #F8F6F4' : 'none',
                    gap: 12,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontFamily: 'var(--font-oswald), sans-serif',
                        fontSize: 14, fontWeight: 600, color: '#1A1A1A',
                        marginBottom: item.variant ? 4 : 0,
                      }}>
                        {item.name}
                        {item.quantity > 1 && (
                          <span style={{ color: '#AAA', fontWeight: 400, fontSize: 13 }}> × {item.quantity}</span>
                        )}
                      </p>
                      {item.variant && (
                        <span style={{
                          fontSize: 11, color: '#E4002B', fontWeight: 500,
                          background: '#FFF0F0', padding: '2px 8px', borderRadius: 6,
                          display: 'inline-block',
                        }}>
                          {item.variant}
                        </span>
                      )}
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-oswald), sans-serif',
                      fontSize: 14, fontWeight: 700, color: '#1A1A1A', flexShrink: 0,
                    }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginTop: 14, paddingTop: 12, borderTop: '2px solid #F0EEEC',
                }}>
                  <span style={{ fontFamily: 'var(--font-oswald), sans-serif', fontSize: 15, fontWeight: 700, color: '#1A1A1A' }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-oswald), sans-serif', fontSize: 20, fontWeight: 700, color: '#E4002B' }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push('/')}
                style={{
                  width: '100%', padding: '13px 20px',
                  borderRadius: 16,
                  border: '1.5px solid #E4002B',
                  background: 'transparent',
                  color: '#E4002B',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-oswald), sans-serif',
                  fontSize: 16, fontWeight: 700, letterSpacing: 0.3,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#FFF0F0'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                Back to Menu
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmedContent />
    </Suspense>
  );
}
