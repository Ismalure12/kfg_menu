'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/public/Header';
import golisImg from '@/images/golis.png';
import hormuudImg from '@/images/hormuud.png';
import somtelImg from '@/images/somtel.jpg';

const CARRIERS = [
  { prefix: '90', name: 'Golis',   img: golisImg },
  { prefix: '61', name: 'Hormuud', img: hormuudImg },
  { prefix: '66', name: 'Somtel',  img: somtelImg },
];

function CarrierDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = CARRIERS.find((c) => c.prefix === value) ?? CARRIERS[0];

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '0 10px 0 10px', height: '100%', minHeight: 46,
          background: '#F0EEEC', border: 'none', borderRight: '1px solid #E5E5E5',
          borderRadius: '12px 0 0 12px',
          cursor: 'pointer', outline: 'none',
        }}
      >
        <Image
          src={selected.img}
          alt={selected.name}
          width={36}
          height={24}
          style={{ objectFit: 'contain', borderRadius: 3 }}
        />
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s', flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown list */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0,
          background: '#fff', border: '1px solid #EEE', borderRadius: 12,
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          zIndex: 50, minWidth: 140,
        }}>
          {CARRIERS.map((c, idx) => (
            <button
              key={c.prefix}
              type="button"
              onClick={() => { onChange(c.prefix); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '10px 14px', border: 'none',
                background: c.prefix === value ? '#FFF0F0' : '#fff',
                cursor: 'pointer', textAlign: 'left',
                borderBottom: idx < CARRIERS.length - 1 ? '1px solid #F5F5F5' : 'none',
                borderRadius: idx === 0 ? '12px 12px 0 0' : idx === CARRIERS.length - 1 ? '0 0 12px 12px' : '0',
              }}
              onMouseEnter={(e) => { if (c.prefix !== value) e.currentTarget.style.background = '#FAFAFA'; }}
              onMouseLeave={(e) => { if (c.prefix !== value) e.currentTarget.style.background = '#fff'; }}
            >
              <Image
                src={c.img}
                alt={c.name}
                width={44}
                height={28}
                style={{ objectFit: 'contain', borderRadius: 3, flexShrink: 0 }}
              />
              <span style={{
                fontSize: 13, fontFamily: 'var(--font-work-sans), sans-serif',
                fontWeight: c.prefix === value ? 700 : 500,
                color: c.prefix === value ? '#E4002B' : '#333',
              }}>
                {c.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: '#F5F5F5', border: 'none', borderRadius: 12,
        padding: '8px 14px', cursor: 'pointer', color: '#666',
        fontFamily: 'var(--font-work-sans), sans-serif', fontSize: 13, fontWeight: 500,
      }}
    >
      ← Back to menu
    </button>
  );
}

export default function CheckoutClient({ prefill }) {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [name, setName] = useState(prefill?.name ?? '');
  // carrier prefix + local number. If prefill has a phone like "252907454776", extract carrier+local.
  const [carrier, setCarrier] = useState(() => {
    if (!prefill?.phone) return '90';
    const digits = prefill.phone.replace(/\D/g, '').replace(/^252/, '');
    if (digits.startsWith('61')) return '61';
    if (digits.startsWith('66')) return '66';
    return '90';
  });
  const [localPhone, setLocalPhone] = useState(() => {
    if (!prefill?.phone) return '';
    const digits = prefill.phone.replace(/\D/g, '').replace(/^252/, '');
    return digits.replace(/^(90|61|66)/, '');
  });
  const [address, setAddress] = useState(prefill?.address ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('kfg_cart');
    if (!saved || JSON.parse(saved).length === 0) {
      router.replace('/');
      return;
    }
    setCart(JSON.parse(saved));
  }, [router]);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting || waiting) return;
    setError('');
    setSubmitting(true);

    const phone = '252' + carrier + localPhone;

    let reference;
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, address, cart, total }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong'); setSubmitting(false); return; }
      reference = data.reference;
    } catch {
      setError('Network error, please try again');
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setWaiting(true);

    try {
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      });
      const data = await res.json();

      if (data.error === 'cancelled') {
        setError('Payment was cancelled. Please try again.');
        setWaiting(false);
        return;
      }
      if (data.error === 'timeout') {
        setError('Payment request timed out. Please try again.');
        setWaiting(false);
        return;
      }
      if (data.error || !data.success) {
        setError('Payment failed. Please try again.');
        setWaiting(false);
        return;
      }

      await fetch('/api/auth/set-cookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: data.token }),
      });

      localStorage.removeItem('kfg_cart');
      router.push(`/order-confirmed?ref=${data.reference}`);
    } catch {
      setError('Payment failed. Please try again.');
      setWaiting(false);
    }
  }

  if (cart.length === 0) return null;

  return (
    <>
      <style>{`
        .checkout-input {
          width: 100%;
          padding: 11px 16px;
          font-size: 16px;
          border: 1.5px solid #EEE;
          border-radius: 14px;
          outline: none;
          font-family: var(--font-work-sans), sans-serif;
          background: #FAFAFA;
          color: #1A1A1A;
          box-sizing: border-box;
          transition: border-color 0.15s, box-shadow 0.15s;
          -webkit-appearance: none;
          appearance: none;
        }
        .checkout-input:focus {
          border-color: #E4002B;
          box-shadow: 0 0 0 3px rgba(228,0,43,0.08);
          background: #fff;
        }
        .checkout-cols {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        @media (min-width: 768px) {
          .checkout-cols { flex-direction: row; align-items: flex-start; }
          .checkout-col-left { flex: 1; }
          .checkout-col-right { width: 380px; flex-shrink: 0; }
        }
        /* Cart item image: small on mobile, bigger on desktop */
        .cart-item-img {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          flex-shrink: 0;
          overflow: hidden;
          background: #F5F5F5;
          position: relative;
        }
        @media (min-width: 768px) {
          .cart-item-img {
            width: 64px;
            height: 64px;
            border-radius: 12px;
          }
        }
        @keyframes pulse-emoji {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.18); }
        }
      `}</style>

      <div style={{ maxWidth: 900, margin: '0 auto', background: '#FAFAFA', minHeight: '100vh' }}>
        <Header right={<BackButton onClick={() => router.push('/')} />} />

        {/* Content */}
        <div style={{ padding: '24px 20px 60px' }}>
          <h1 style={{
            fontFamily: 'var(--font-oswald), sans-serif',
            fontSize: 26, fontWeight: 700, color: '#1A1A1A', marginBottom: 24,
          }}>
            Checkout
          </h1>

          <div className="checkout-cols">
            {/* Left — Order summary */}
            <div className="checkout-col-left">
              <div style={{
                background: '#fff', borderRadius: 20,
                border: '1px solid #F0EEEC',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: '20px',
                marginBottom: 20,
              }}>
                <h2 style={{
                  fontFamily: 'var(--font-oswald), sans-serif',
                  fontSize: 18, fontWeight: 700, color: '#1A1A1A', marginBottom: 16,
                }}>
                  Your Order
                </h2>

                {cart.map((item, idx) => (
                  <div key={item.localId ?? idx} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 0',
                    borderBottom: idx < cart.length - 1 ? '1px solid #F8F6F4' : 'none',
                  }}>
                    {/* Image */}
                    <div className="cart-item-img">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="(max-width:767px) 48px, 64px"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'linear-gradient(135deg, #F8F5F2 0%, #F0EDE8 100%)',
                          fontSize: 20,
                        }}>
                          🍽️
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontFamily: 'var(--font-oswald), sans-serif',
                        fontSize: 14, fontWeight: 600, color: '#1A1A1A',
                        marginBottom: item.variant ? 4 : 0,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
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

                    {/* Price */}
                    <span style={{
                      fontFamily: 'var(--font-oswald), sans-serif',
                      fontSize: 15, fontWeight: 700, color: '#1A1A1A', flexShrink: 0,
                    }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                {/* Total */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginTop: 16, paddingTop: 14, borderTop: '2px solid #F0EEEC',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-oswald), sans-serif',
                    fontSize: 16, fontWeight: 700, color: '#1A1A1A',
                  }}>Total</span>
                  <span style={{
                    fontFamily: 'var(--font-oswald), sans-serif',
                    fontSize: 22, fontWeight: 700, color: '#E4002B',
                  }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right — Delivery form */}
            <div className="checkout-col-right">
              <div style={{
                background: '#fff', borderRadius: 20,
                border: '1px solid #F0EEEC',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: '20px',
              }}>
                <h2 style={{
                  fontFamily: 'var(--font-oswald), sans-serif',
                  fontSize: 18, fontWeight: 700, color: '#1A1A1A', marginBottom: 20,
                }}>
                  Delivery Details
                </h2>
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{
                      display: 'block', fontSize: 13, color: '#666',
                      fontFamily: 'var(--font-work-sans), sans-serif',
                      marginBottom: 6, fontWeight: 500,
                    }}>Full Name</label>
                    <input
                      className="checkout-input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{
                      display: 'block', fontSize: 13, color: '#666',
                      fontFamily: 'var(--font-work-sans), sans-serif',
                      marginBottom: 6, fontWeight: 500,
                    }}>Phone Number</label>
                    <div style={{
                      display: 'flex', border: '1.5px solid #EEE', borderRadius: 14,
                      background: '#FAFAFA', position: 'relative',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                      onFocusCapture={(e) => {
                        e.currentTarget.style.borderColor = '#E4002B';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(228,0,43,0.08)';
                        e.currentTarget.style.background = '#fff';
                      }}
                      onBlurCapture={(e) => {
                        e.currentTarget.style.borderColor = '#EEE';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.background = '#FAFAFA';
                      }}
                    >
                      {/* Carrier dropdown */}
                      <CarrierDropdown value={carrier} onChange={setCarrier} />
                      {/* Local number */}
                      <input
                        type="tel"
                        value={localPhone}
                        onChange={(e) => setLocalPhone(e.target.value.replace(/\D/g, ''))}
                        required
                        placeholder="7454776"
                        style={{
                          flex: 1, padding: '11px 14px', fontSize: 16,
                          fontFamily: 'var(--font-work-sans), sans-serif',
                          background: 'transparent', border: 'none', outline: 'none',
                          color: '#1A1A1A', minWidth: 0,
                        }}
                      />
                    </div>
                    <p style={{
                      fontSize: 12, color: '#AAA',
                      fontFamily: 'var(--font-work-sans), sans-serif',
                      marginTop: 5,
                    }}>
                      Enter your Waafi/EVC number
                    </p>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{
                      display: 'block', fontSize: 13, color: '#666',
                      fontFamily: 'var(--font-work-sans), sans-serif',
                      marginBottom: 6, fontWeight: 500,
                    }}>Delivery Address</label>
                    <input
                      className="checkout-input"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      placeholder="Garsoor, jidka guure"
                    />
                  </div>

                  {error && (
                    <p style={{
                      fontSize: 13, color: '#E4002B',
                      fontFamily: 'var(--font-work-sans), sans-serif',
                      marginBottom: 12,
                    }}>
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || waiting}
                    style={{
                      width: '100%', padding: '15px',
                      borderRadius: 16, border: 'none',
                      background: submitting || waiting
                        ? '#ccc'
                        : 'linear-gradient(135deg, #E4002B 0%, #FF1A3C 100%)',
                      color: '#fff', cursor: submitting || waiting ? 'not-allowed' : 'pointer',
                      fontFamily: 'var(--font-oswald), sans-serif',
                      fontSize: 17, fontWeight: 700, letterSpacing: 0.3,
                      boxShadow: submitting || waiting ? 'none' : '0 6px 20px rgba(228,0,43,0.35)',
                      transition: 'background 0.15s',
                    }}
                  >
                    {submitting ? 'Processing...' : 'Place Order & Pay →'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Waiting overlay */}
      {waiting && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }}>
          <div style={{
            background: '#fff', borderRadius: 20,
            border: '1px solid #F0EEEC',
            boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
            padding: '40px 32px',
            maxWidth: 380, width: '100%',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 48, marginBottom: 20,
              display: 'inline-block',
              animation: 'pulse-emoji 1.4s ease-in-out infinite',
            }}>
              📱
            </div>
            <h2 style={{
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: 22, fontWeight: 700, color: '#1A1A1A', marginBottom: 12,
            }}>
              Check your phone
            </h2>
            <p style={{
              fontFamily: 'var(--font-work-sans), sans-serif',
              fontSize: 14, color: '#AAA', lineHeight: 1.6,
            }}>
              Approve the payment on your Waafi app to complete your order.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
