'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

// ─── Icons ───────────────────────────────────────────────────────────────────
function PlusIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M5 12h14" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M16 16l5 5" />
    </svg>
  );
}

function XIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}

// ─── Category icons map ───────────────────────────────────────────────────────
const CAT_ICONS = {
  chicken: '🍗', strips: '🍟', pizza: '🍕',
  burgers: '🍔', wraps: '🌯', 'box-master': '🥡',
  'nuggets-extras': '🍿', sauces: '🫙',
};

// ─── UUID helper ─────────────────────────────────────────────────────────────
function getOrCreateCartId() {
  let id = localStorage.getItem('kfg_cart_id');
  if (!id) {
    id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `cart-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('kfg_cart_id', id);
  }
  return id;
}

// ─── Placeholder ─────────────────────────────────────────────────────────────
function Placeholder({ emoji = '🍽️' }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #F8F5F2 0%, #F0EDE8 100%)',
      fontSize: 32, color: '#CCC',
    }}>
      {emoji}
    </div>
  );
}

// ─── Grid Card ───────────────────────────────────────────────────────────────
function GridCard({ item, onAdd, selectedVariants, setSelectedVariant }) {
  const selIdx = selectedVariants[item.id] ?? 0;
  const currentVariant = item.variants?.[selIdx];
  const price = item.price ?? currentVariant?.price;
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        border: hovered ? '1px solid #FFD0D0' : '1px solid #F0EEEC',
        boxShadow: hovered
          ? '0 12px 32px rgba(228,0,43,0.10), 0 4px 12px rgba(0,0,0,0.06)'
          : '0 2px 8px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        transition: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
        position: 'relative',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', background: '#F8F5F2', overflow: 'hidden' }}>
        {item.imageUrl
          ? <Image src={item.imageUrl} alt={item.name} fill sizes="(max-width:640px) 45vw, 240px" className="object-cover" style={{ transition: 'transform 0.4s ease', transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />
          : <Placeholder />
        }
        {item.popular && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            background: 'linear-gradient(135deg, #E4002B, #FF3A5C)',
            color: '#fff', fontSize: 10, fontWeight: 700,
            padding: '4px 10px', borderRadius: 20, letterSpacing: 0.5,
            boxShadow: '0 2px 8px rgba(228,0,43,0.4)',
          }}>🔥 Popular</span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p style={{
          fontFamily: 'var(--font-oswald), sans-serif',
          fontSize: 15, fontWeight: 600, color: '#1A1A1A',
          marginBottom: 3, lineHeight: 1.3,
        }}>
          {item.name}
        </p>
        {item.desc && (
          <p style={{ fontSize: 11, color: '#AAA', marginBottom: 10, lineHeight: 1.4 }}>
            {item.desc}
          </p>
        )}

        {/* Variant chips */}
        {item.variants && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
            {item.variants.map((v, i) => (
              <button
                key={v.label}
                onClick={(e) => { e.stopPropagation(); setSelectedVariant(item.id, i); }}
                style={{
                  padding: '5px 11px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                  border: i === selIdx ? '1.5px solid #E4002B' : '1px solid #EBEBEB',
                  background: i === selIdx ? '#FFF0F0' : '#FAFAFA',
                  color: i === selIdx ? '#E4002B' : '#999',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                  fontFamily: 'var(--font-work-sans), sans-serif',
                  boxShadow: i === selIdx ? '0 2px 6px rgba(228,0,43,0.15)' : 'none',
                }}
              >
                {v.label} · ${v.price}
              </button>
            ))}
          </div>
        )}

        {/* Price + Add — always at bottom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 10 }}>
          <span style={{
            fontFamily: 'var(--font-oswald), sans-serif',
            fontSize: 20, fontWeight: 700, color: '#1A1A1A',
          }}>
            ${price}
          </span>
          <button
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onMouseLeave={() => setPressed(false)}
            onClick={(e) => {
              e.stopPropagation();
              const label = item.variants ? item.variants[selIdx].label : '';
              onAdd(item.name, price, label);
            }}
            style={{
              width: 38, height: 38, borderRadius: 12,
              background: pressed
                ? '#C8001F'
                : hovered ? '#FF1A3C' : '#E4002B',
              border: 'none', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: pressed ? 'none' : '0 4px 12px rgba(228,0,43,0.35)',
              transform: pressed ? 'scale(0.9)' : 'scale(1)',
              transition: 'all 0.12s ease',
            }}
          >
            <PlusIcon size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── List Row ─────────────────────────────────────────────────────────────────
function ListRow({ item, onAdd, selectedVariants, setSelectedVariant, animDelay }) {
  const selIdx = selectedVariants[item.id] ?? 0;
  const price = item.price ?? item.variants?.[selIdx]?.price;
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', gap: 14, padding: '14px 16px', alignItems: 'center',
        borderRadius: 16, marginBottom: 4,
        background: hovered ? '#FFFAFA' : 'transparent',
        border: hovered ? '1px solid #FFE8E8' : '1px solid transparent',
        boxShadow: hovered ? '0 2px 12px rgba(228,0,43,0.05)' : 'none',
        transition: 'all 0.18s ease',
        animation: 'fadeSlideUp 0.35s ease both',
        animationDelay: `${animDelay}ms`,
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: 72, height: 72, borderRadius: 16,
        flexShrink: 0, overflow: 'hidden', position: 'relative',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}>
        {item.imageUrl
          ? <Image src={item.imageUrl} alt={item.name} fill sizes="72px" className="object-cover" />
          : <Placeholder emoji="🍽️" />
        }
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{
            fontFamily: 'var(--font-oswald), sans-serif',
            fontSize: 15, fontWeight: 600, color: '#1A1A1A',
          }}>
            {item.name}
          </span>
          {item.popular && (
            <span style={{
              fontSize: 9, fontWeight: 700, color: '#E4002B',
              background: '#FFF0F0', padding: '2px 8px', borderRadius: 10,
              letterSpacing: 0.3,
            }}>
              🔥 Popular
            </span>
          )}
        </div>
        {item.desc && (
          <p style={{ fontSize: 12, color: '#AAA', lineHeight: 1.4, marginBottom: item.variants ? 6 : 0 }}>
            {item.desc}
          </p>
        )}
        {item.variants && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {item.variants.map((v, i) => (
              <button
                key={v.label}
                onClick={(e) => { e.stopPropagation(); setSelectedVariant(item.id, i); }}
                style={{
                  padding: '3px 10px', borderRadius: 14, fontSize: 11, fontWeight: 600,
                  border: i === selIdx ? '1.5px solid #E4002B' : '1px solid #EBEBEB',
                  background: i === selIdx ? '#FFF0F0' : '#FAFAFA',
                  color: i === selIdx ? '#E4002B' : '#999',
                  cursor: 'pointer', fontFamily: 'var(--font-work-sans), sans-serif',
                  transition: 'all 0.15s ease',
                }}
              >
                {v.label} · ${v.price}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price + Add */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        {price != null && (
          <span style={{
            fontFamily: 'var(--font-oswald), sans-serif',
            fontSize: 18, fontWeight: 700, color: '#1A1A1A',
          }}>
            ${price}
          </span>
        )}
        {price != null && (
          <button
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onMouseLeave={() => setPressed(false)}
            onClick={(e) => {
              e.stopPropagation();
              const label = item.variants ? item.variants[selIdx].label : '';
              onAdd(item.name, price, label);
            }}
            style={{
              width: 36, height: 36, borderRadius: 11,
              background: pressed ? '#C8001F' : '#E4002B',
              border: 'none', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: pressed ? 'none' : '0 3px 10px rgba(228,0,43,0.30)',
              transform: pressed ? 'scale(0.88)' : 'scale(1)',
              transition: 'all 0.12s ease',
            }}
          >
            <PlusIcon size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Sauce Pill ───────────────────────────────────────────────────────────────
function SaucePill({ item, onAdd }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 10px 8px 10px', borderRadius: 40,
        background: hovered ? '#FFF8F8' : '#FAFAFA',
        border: hovered ? '1px solid #FFD0D0' : '1px solid #F0EEEC',
        boxShadow: hovered ? '0 4px 12px rgba(228,0,43,0.08)' : 'none',
        transition: 'all 0.18s ease',
      }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: '50%',
        overflow: 'hidden', background: '#F0EDE8', flexShrink: 0, position: 'relative',
      }}>
        {item.imageUrl
          ? <Image src={item.imageUrl} alt={item.name} fill sizes="34px" className="object-cover" />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🫙</div>
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          fontFamily: 'var(--font-work-sans), sans-serif',
          fontSize: 13, fontWeight: 600, color: '#444', display: 'block',
        }}>
          {item.name}
        </span>
        {item.price != null && (
          <span style={{ fontSize: 12, color: '#E4002B', fontWeight: 700 }}>
            ${Number(item.price).toFixed(2)}
          </span>
        )}
      </div>
      {item.price != null && (
        <button
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
          onClick={() => onAdd(item.name, item.price, '')}
          style={{
            width: 30, height: 30, borderRadius: 9, flexShrink: 0,
            background: pressed ? '#C8001F' : '#E4002B',
            border: 'none', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: pressed ? 'none' : '0 3px 8px rgba(228,0,43,0.30)',
            transform: pressed ? 'scale(0.88)' : 'scale(1)',
            transition: 'all 0.12s ease',
          }}
        >
          <PlusIcon size={13} />
        </button>
      )}
    </div>
  );
}

// ─── Cart Panel ───────────────────────────────────────────────────────────────
function CartPanel({ cart, onClose, onRemove, onUpdateQty, cartTotal }) {
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          zIndex: 40, backdropFilter: 'blur(2px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 820, zIndex: 50,
        background: '#fff',
        borderRadius: '24px 24px 0 0',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
        animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        maxHeight: '75vh', display: 'flex', flexDirection: 'column',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: '#E5E5E5' }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 24px 12px',
          borderBottom: '1px solid #F5F3F0',
        }}>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: 20, fontWeight: 700, color: '#1A1A1A', marginBottom: 2,
            }}>
              Your Order
            </h3>
            <p style={{ fontSize: 12, color: '#999' }}>
              {totalItems} item{totalItems !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: '#F5F5F5', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#666',
            }}
          >
            <XIcon size={16} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px' }}>
          {cart.map((item, idx) => (
            <div key={item.localId ?? item.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 0',
              borderBottom: idx < cart.length - 1 ? '1px solid #F8F6F4' : 'none',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#FFF0F0', color: '#E4002B',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>
                {idx + 1}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: 'var(--font-oswald), sans-serif',
                  fontSize: 14, fontWeight: 600, color: '#1A1A1A',
                }}>
                  {item.name}
                </p>
                {item.variant && (
                  <span style={{
                    fontSize: 11, color: '#E4002B', fontWeight: 500,
                    background: '#FFF0F0', padding: '1px 7px', borderRadius: 5,
                  }}>
                    {item.variant}
                  </span>
                )}
              </div>

              {/* Qty */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  onClick={() => onUpdateQty(item.localId ?? item.id, -1)}
                  style={{
                    width: 24, height: 24, borderRadius: 6, border: '1px solid #EBEBEB',
                    background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#666',
                  }}
                >
                  <MinusIcon />
                </button>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', minWidth: 14, textAlign: 'center' }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQty(item.localId ?? item.id, 1)}
                  style={{
                    width: 24, height: 24, borderRadius: 6, border: '1px solid #EBEBEB',
                    background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#666',
                  }}
                >
                  <PlusIcon size={11} />
                </button>
              </div>

              <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', minWidth: 44, textAlign: 'right' }}>
                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
              </span>

              <button
                onClick={() => onRemove(item.localId ?? item.id)}
                style={{
                  width: 28, height: 28, borderRadius: 7, border: '1px solid #F0EEEC',
                  background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#CCC', transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#FFF0F0'; e.currentTarget.style.color = '#E4002B'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#FAFAFA'; e.currentTarget.style.color = '#CCC'; }}
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px 28px',
          borderTop: '1px solid #F5F3F0',
          background: '#fff',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontFamily: 'var(--font-oswald), sans-serif', fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>Total</span>
            <span style={{ fontFamily: 'var(--font-oswald), sans-serif', fontSize: 20, fontWeight: 700, color: '#E4002B' }}>${cartTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', padding: '15px', borderRadius: 16, border: 'none',
              background: 'linear-gradient(135deg, #E4002B 0%, #FF1A3C 100%)',
              color: '#fff', cursor: 'pointer',
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: 17, fontWeight: 700, letterSpacing: 0.3,
              boxShadow: '0 6px 20px rgba(228,0,43,0.35)',
            }}
          >
            🍽️ Continue Browsing
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MenuPreview({ categories }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [cart, setCart] = useState([]);       // { localId, id?, name, variant, price, quantity }
  const [selectedVariants, setSelectedVariants] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const catStripRef = useRef(null);
  const sectionRefs = useRef({});

  // Init cartId + load persisted cart
  useEffect(() => {
    const id = getOrCreateCartId();
    fetch(`/api/cart?cartId=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCart(data.map((i) => ({
            localId: i.id,
            id: i.id,
            name: i.itemName,
            variant: i.variantLabel || '',
            price: parseFloat(i.price),
            quantity: i.quantity,
          })));
        }
      })
      .catch(() => {});
  }, []);

  // Add to cart (optimistic + API)
  const addToCart = useCallback(async (name, price, variant) => {
    const localId = Date.now() + Math.random();
    const newItem = { localId, name, variant, price: parseFloat(price), quantity: 1 };

    setCart((prev) => {
      // If same item+variant already in cart, increment qty
      const existing = prev.find((i) => i.name === name && i.variant === variant);
      if (existing) {
        return prev.map((i) =>
          i.name === name && i.variant === variant
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, newItem];
    });
    setCartBump(true);
    setTimeout(() => setCartBump(false), 300);

    // Persist to DB — always read cartId from localStorage, never from state
    const cId = getOrCreateCartId();
    const existing = cart.find((i) => i.name === name && i.variant === variant);
    if (existing && existing.id) {
      const newQty = existing.quantity + 1;
      fetch(`/api/cart/${existing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty }),
      }).catch(() => {});
    } else {
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId: cId, itemName: name, variantLabel: variant || null, price: parseFloat(price) }),
      })
        .then((r) => r.json())
        .then((saved) => {
          setCart((prev) =>
            prev.map((i) =>
              i.localId === localId ? { ...i, id: saved.id } : i
            )
          );
        })
        .catch(() => {});
    }
  }, [cart]);

  // Remove from cart
  const removeFromCart = useCallback((localId) => {
    const item = cart.find((i) => (i.localId ?? i.id) === localId);
    setCart((prev) => prev.filter((i) => (i.localId ?? i.id) !== localId));
    if (item?.id) {
      fetch(`/api/cart/${item.id}`, { method: 'DELETE' }).catch(() => {});
    }
  }, [cart]);

  // Update qty in cart panel
  const updateQtyInCart = useCallback((localId, delta) => {
    const item = cart.find((i) => (i.localId ?? i.id) === localId);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty < 1) { removeFromCart(localId); return; }
    setCart((prev) =>
      prev.map((i) => (i.localId ?? i.id) === localId ? { ...i, quantity: newQty } : i)
    );
    if (item.id) {
      fetch(`/api/cart/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty }),
      }).catch(() => {});
    }
  }, [cart, removeFromCart]);

  const setSelectedVariant = (itemId, idx) =>
    setSelectedVariants((prev) => ({ ...prev, [itemId]: idx }));

  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  // Filtered categories
  const filteredCategories = searchQuery.trim()
    ? categories.map((cat) => ({
        ...cat,
        items: cat.items.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((cat) => cat.items.length > 0)
    : activeCategory
      ? categories.filter((c) => c.id === activeCategory)
      : categories;

  // IntersectionObserver: no auto-scroll — tabs stay put while user scrolls
  useEffect(() => {
    if (activeCategory) return;
    const observer = new IntersectionObserver(
      () => { /* intentionally empty — tabs don't scroll on page scroll */ },
      { threshold: 0.3 }
    );
    Object.values(sectionRefs.current).forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [activeCategory]);

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bump {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
        @keyframes slideUp {
          from { transform: translate(-50%, 100%); }
          to   { transform: translate(-50%, 0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        /* Tab strip: hidden scrollbar on mobile, thin visible one on desktop */
        .tab-strip {
          -webkit-overflow-scrolling: touch;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .tab-strip::-webkit-scrollbar { display: none; }
        @media (min-width: 768px) {
          .tab-strip { scrollbar-width: thin; scrollbar-color: #E5E5E5 transparent; }
          .tab-strip::-webkit-scrollbar { display: block; height: 3px; }
          .tab-strip::-webkit-scrollbar-track { background: transparent; }
          .tab-strip::-webkit-scrollbar-thumb { background: #E0E0E0; border-radius: 2px; }
        }
        /* keep hide-scrollbar for any other uses */
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 11px 16px;
          font-size: 13px;
          font-weight: 500;
          color: #AAA;
          background: none;
          border: none;
          border-bottom: 2.5px solid transparent;
          white-space: nowrap;
          cursor: pointer;
          font-family: var(--font-work-sans), sans-serif;
          transition: color 0.15s, border-color 0.15s;
          letter-spacing: 0.2px;
        }
        .tab-btn:hover { color: #555; }
        .tab-btn.active {
          color: #E4002B;
          font-weight: 700;
          border-bottom-color: #E4002B;
        }

        .search-input {
          width: 100%;
          padding: 11px 16px;
          font-size: 16px; /* Must be ≥16px to prevent iOS auto-zoom */
          border: 1.5px solid #EEE;
          border-radius: 14px;
          outline: none;
          font-family: var(--font-work-sans), sans-serif;
          background: #FAFAFA;
          transition: border-color 0.15s, box-shadow 0.15s;
          color: #1A1A1A;
          -webkit-appearance: none;
          appearance: none;
          transform: translateZ(0); /* prevent layout shift on focus */
        }
        .search-input:focus {
          border-color: #E4002B;
          box-shadow: 0 0 0 3px rgba(228,0,43,0.08);
          background: #fff;
        }
        .search-input::placeholder { color: #BBBBBB; font-size: 15px; }

        /* Responsive grid */
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 480px) {
          .menu-grid { gap: 14px; }
        }
        @media (min-width: 640px) {
          .menu-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }
        @media (min-width: 900px) {
          .menu-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; }
        }

        /* Responsive padding */
        .menu-content {
          padding: 0 16px 40px;
        }
        @media (min-width: 480px) {
          .menu-content { padding: 0 20px 40px; }
        }
        @media (min-width: 768px) {
          .menu-content { padding: 0 28px 40px; }
        }

        .header-inner {
          padding: 12px 16px 0;
        }
        @media (min-width: 480px) {
          .header-inner { padding: 14px 20px 0; }
        }
        @media (min-width: 768px) {
          .header-inner { padding: 14px 28px 0; }
        }
      `}</style>

      <div style={{ maxWidth: 900, margin: '0 auto', background: '#FAFAFA', minHeight: '100vh' }}>

        {/* ── Sticky header ────────────────────────────────────────────────── */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 20,
          background: '#fff',
          borderBottom: '1px solid #F0EEEC',
          boxShadow: '0 1px 16px rgba(0,0,0,0.05)',
        }}>
          <div className="header-inner">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              {/* Logo */}
              <Image
                src="/logo-transparent.png"
                alt="KFG"
                width={160}
                height={48}
                style={{ height: 42, width: 'auto' }}
                priority
              />

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {/* Search toggle */}
                <button
                  onClick={() => {
                    const opening = !searchOpen;
                    setSearchOpen(opening);
                    setSearchQuery('');
                    setActiveCategory(null);
                    if (opening) window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: searchOpen ? '#FFF0F0' : '#F5F5F5',
                    border: searchOpen ? '1px solid #FFD0D0' : '1px solid transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: searchOpen ? '#E4002B' : '#888',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <SearchIcon />
                </button>

                {/* Cart button */}
                <button
                  onClick={() => cart.length > 0 && setCartOpen(true)}
                  style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: cart.length > 0 ? '#FFF0F0' : '#F5F5F5',
                    border: cart.length > 0 ? '1px solid #FFD0D0' : '1px solid transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: cart.length > 0 ? '#E4002B' : '#888',
                    cursor: cart.length > 0 ? 'pointer' : 'default',
                    position: 'relative',
                    animation: cartBump ? 'bump 0.3s ease' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  <CartIcon />
                  {totalItems > 0 && (
                    <span style={{
                      position: 'absolute', top: -4, right: -4,
                      width: 18, height: 18, borderRadius: '50%',
                      background: '#E4002B', color: '#fff',
                      fontSize: 10, fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(228,0,43,0.4)',
                      border: '1.5px solid #fff',
                    }}>
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Search box */}
            {searchOpen && (
              <div style={{ paddingBottom: 10 }}>
                <input
                  autoFocus
                  className="search-input"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}

            {/* Category tab strip — sauces excluded (shown in content under All) */}
            <div ref={catStripRef} className="tab-strip" style={{ display: 'flex' }}>
              <button
                className={`tab-btn${!activeCategory ? ' active' : ''}`}
                onClick={() => {
                  setActiveCategory(null);
                  setSearchQuery('');
                  setSearchOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                All
              </button>
              {categories.filter((c) => c.layout !== 'sauce').map((cat) => (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.id}`}
                  className={`tab-btn${activeCategory === cat.id ? ' active' : ''}`}
                  onClick={() => {
                    setActiveCategory(activeCategory === cat.id ? null : cat.id);
                    setSearchQuery('');
                    setSearchOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {cat.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cat.imageUrl}
                      alt=""
                      style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                  ) : (
                    <span style={{ fontSize: 15, lineHeight: 1 }}>{CAT_ICONS[cat.id] || '🍽️'}</span>
                  )}
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────────────────── */}
        <div className="menu-content" style={totalItems > 0 ? { paddingBottom: 100 } : undefined}>

          {/* ── Search results mode ────────────────────────────────────────── */}
          {searchQuery.trim() && (() => {
            const allMatches = categories.flatMap((cat) =>
              cat.items
                .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item) => ({ ...item, _catName: cat.name, _layout: cat.layout }))
            );
            if (allMatches.length === 0) {
              return (
                <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                  <div style={{ fontSize: 48, marginBottom: 14 }}>🔍</div>
                  <p style={{
                    fontFamily: 'var(--font-oswald), sans-serif',
                    fontSize: 18, fontWeight: 700, color: '#AAA', marginBottom: 6,
                  }}>No items found</p>
                  <p style={{ fontSize: 13, color: '#CCC' }}>Try a different search term</p>
                </div>
              );
            }
            return (
              <div>
                <p style={{
                  fontSize: 13, color: '#AAA', padding: '18px 4px 12px',
                  fontFamily: 'var(--font-work-sans), sans-serif',
                }}>
                  {allMatches.length} result{allMatches.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
                </p>
                <div className="menu-grid">
                  {allMatches.map((item) => (
                    <GridCard
                      key={item.id}
                      item={item}
                      onAdd={addToCart}
                      selectedVariants={selectedVariants}
                      setSelectedVariant={setSelectedVariant}
                    />
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ── Normal / category-filtered mode ───────────────────────────── */}
          {!searchQuery.trim() && filteredCategories.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 24px', color: '#CCC' }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>🍽️</div>
              <p style={{
                fontFamily: 'var(--font-oswald), sans-serif',
                fontSize: 18, fontWeight: 700, color: '#AAA', marginBottom: 6,
              }}>
                Menu coming soon!
              </p>
            </div>
          )}

          {!searchQuery.trim() && filteredCategories.map((cat) => (
            <div
              key={cat.id}
              ref={(el) => (sectionRefs.current[cat.id] = el)}
              data-cat-id={cat.id}
              style={{ paddingTop: 28 }}
            >
              {/* Section header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>{CAT_ICONS[cat.id] || '🍽️'}</span>
                <h2 style={{
                  fontFamily: 'var(--font-oswald), sans-serif',
                  fontSize: 22, fontWeight: 700, color: '#1A1A1A',
                  letterSpacing: 0.3,
                }}>
                  {cat.name}
                </h2>
                <span style={{
                  fontSize: 11, color: '#CCC',
                  background: '#F5F5F5', padding: '2px 10px', borderRadius: 10,
                  fontFamily: 'var(--font-work-sans), sans-serif', fontWeight: 600,
                }}>
                  {cat.items.length}
                </span>
              </div>

              {/* Grid layout */}
              {cat.layout === 'grid' && (
                <div className="menu-grid">
                  {cat.items.map((item) => (
                    <GridCard
                      key={item.id}
                      item={item}
                      onAdd={addToCart}
                      selectedVariants={selectedVariants}
                      setSelectedVariant={setSelectedVariant}
                    />
                  ))}
                </div>
              )}

              {/* List layout */}
              {cat.layout === 'list' && (
                <div style={{
                  background: '#fff', borderRadius: 20,
                  border: '1px solid #F0EEEC',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  overflow: 'hidden', padding: '4px 4px',
                }}>
                  {cat.items.map((item, i) => (
                    <ListRow
                      key={item.id}
                      item={item}
                      onAdd={addToCart}
                      selectedVariants={selectedVariants}
                      setSelectedVariant={setSelectedVariant}
                      animDelay={i * 40}
                    />
                  ))}
                </div>
              )}

              {/* Sauce pills */}
              {cat.layout === 'sauce' && (
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {cat.items.map((item) => (
                    <SaucePill key={item.id} item={item} onAdd={addToCart} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Sticky cart bar ───────────────────────────────────────────────── */}
        {totalItems > 0 && (
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 900, zIndex: 30,
            background: '#fff', borderTop: '1px solid #F0EEEC',
            padding: '12px 20px 20px',
            boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
            animation: 'fadeSlideUp 0.3s ease',
          }}>
            <button
              onClick={() => setCartOpen(true)}
              style={{
                width: '100%', padding: '15px 24px',
                borderRadius: 16,
                background: 'linear-gradient(135deg, #E4002B 0%, #FF1A3C 100%)',
                border: 'none', color: '#fff', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                boxShadow: '0 6px 24px rgba(228,0,43,0.30)',
                transition: 'transform 0.1s, box-shadow 0.1s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(228,0,43,0.38)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 24px rgba(228,0,43,0.30)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'rgba(255,255,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-oswald), sans-serif', fontSize: 13, fontWeight: 700,
                }}>
                  {totalItems}
                </span>
                <span style={{
                  fontFamily: 'var(--font-oswald), sans-serif',
                  fontSize: 16, fontWeight: 700, letterSpacing: 0.3,
                }}>
                  View Order
                </span>
              </div>
              <span style={{
                fontFamily: 'var(--font-oswald), sans-serif',
                fontSize: 17, fontWeight: 700,
              }}>
                ${cartTotal.toFixed(2)}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* ── Cart Panel ──────────────────────────────────────────────────────── */}
      {cartOpen && (
        <CartPanel
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onUpdateQty={updateQtyInCart}
          cartTotal={cartTotal}
        />
      )}
    </>
  );
}
