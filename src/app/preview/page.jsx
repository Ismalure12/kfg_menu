'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

const SAMPLE_ITEMS = [
  { id: 1, name: 'Classic Burger', price: '8.99', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/casey-lee-awj7sRviVXo-unsplash.jpg' },
  { id: 2, name: 'Crispy Fried Chicken', price: '10.99', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/kristof-korody-O3gB6kC0wmI-unsplash.jpg' },
  { id: 3, name: 'Loaded Fries', price: '5.99', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/eugene-Xk0jQPZseMk-unsplash.jpg' },
  { id: 4, name: 'Chocolate Cake', price: '5.99', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/chocolate-cake.jpg' },
];

const SAMPLE_CATEGORIES = ['Burgers', 'Chicken', 'Sides & Extras', 'Drinks', 'Desserts'];

function formatPrice(price) {
  return `USh${parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
}

// ─── SECTION WRAPPER ────────────────────────────────────────────────
function SectionTitle({ title }) {
  return (
    <h2
      className="text-2xl font-bold uppercase tracking-wide mb-8"
      style={{
        fontFamily: 'var(--font-oswald), sans-serif',
        color: '#1A1A1A',
        borderLeft: '4px solid #E4002B',
        paddingLeft: '16px',
      }}
    >
      {title}
    </h2>
  );
}

function VariantLabel({ label, description }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span
        className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
        style={{ backgroundColor: '#E4002B', color: '#fff' }}
      >
        {label}
      </span>
      <span style={{ fontSize: '14px', color: '#666666', fontFamily: 'var(--font-work-sans)' }}>
        {description}
      </span>
    </div>
  );
}

function PreviewFrame({ children, className = '' }) {
  return (
    <div
      className={`rounded-lg overflow-hidden mb-10 ${className}`}
      style={{ border: '1px solid #E5E5E5' }}
    >
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  HEADER DESIGNS
// ═══════════════════════════════════════════════════════════════════════

function HeaderA() {
  return (
    <header className="bg-white" style={{ height: '72px', borderBottom: '1px solid #E5E5E5' }}>
      <div className="flex items-center justify-between h-full mx-auto px-4 md:px-6" style={{ maxWidth: '1200px' }}>
        <div className="shrink-0">
          <Image src="/logo.png" alt="KFG" width={160} height={48} style={{ height: '48px', width: 'auto' }} />
        </div>
        <div className="hidden sm:flex flex-col items-center">
          <span style={{ fontFamily: 'var(--font-oswald)', fontSize: '18px', fontWeight: 700, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '2px' }}>
            KFG
          </span>
          <span style={{ fontFamily: 'var(--font-work-sans)', fontSize: '11px', color: '#999999', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '2px' }}>
            Taste the Difference
          </span>
        </div>
        <div className="shrink-0 flex items-center gap-2" style={{ fontFamily: 'var(--font-work-sans)', color: '#333333', fontWeight: 500, fontSize: '15px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Sign in
        </div>
      </div>
    </header>
  );
}

function HeaderB() {
  return (
    <header className="relative bg-white/90 backdrop-blur-lg" style={{ height: '72px', boxShadow: '0 1px 12px rgba(0,0,0,0.04)' }}>
      {/* Animated gradient accent line at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px] gradient-line-animate"
        style={{ background: 'linear-gradient(90deg, #E4002B, #FF6B81, #E4002B, #FF6B81)', backgroundSize: '200% 100%' }}
      />

      <div className="flex items-center justify-between h-full mx-auto px-4 md:px-6" style={{ maxWidth: '1200px' }}>
        {/* Logo — grayscale by default, color sweeps in on hover */}
        <div className="shrink-0 logo-hover-sweep cursor-pointer">
          <Image src="/logo.png" alt="KFG" width={160} height={48} style={{ height: '48px', width: 'auto' }} />
        </div>

        {/* Center brand */}
        <div className="hidden sm:flex flex-col items-center">
          <span style={{
            fontFamily: 'var(--font-oswald)',
            fontSize: '20px',
            fontWeight: 700,
            color: '#E4002B',
            textTransform: 'uppercase',
            letterSpacing: '4px',
            lineHeight: 1.2,
          }}>
            KFG
          </span>
          <span style={{
            fontFamily: 'var(--font-work-sans)',
            fontSize: '10px',
            fontWeight: 500,
            color: '#AAAAAA',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            marginTop: '3px',
          }}>
            Taste the Difference
          </span>
        </div>

        {/* Sign in pill — fills red on hover */}
        <div
          className="shrink-0 flex items-center gap-2 rounded-full pill-hover cursor-pointer"
          style={{
            fontFamily: 'var(--font-work-sans)',
            color: '#333333',
            fontWeight: 500,
            fontSize: '14px',
            border: '1.5px solid #E0E0E0',
            padding: '7px 18px',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Sign in
        </div>
      </div>
    </header>
  );
}

function HeaderC() {
  return (
    <header className="bg-white" style={{ height: '80px', borderTop: '4px solid #E4002B', borderBottom: '1px solid #E5E5E5' }}>
      <div className="flex items-center justify-between h-full mx-auto px-4 md:px-6" style={{ maxWidth: '1200px' }}>
        <div className="shrink-0">
          <Image src="/logo.png" alt="KFG" width={180} height={52} style={{ height: '52px', width: 'auto' }} />
        </div>
        <div className="hidden sm:flex flex-col items-center">
          <span style={{ fontFamily: 'var(--font-oswald)', fontSize: '24px', fontWeight: 700, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '3px' }}>
            KFG
          </span>
          <span style={{ fontFamily: 'var(--font-work-sans)', fontSize: '12px', color: '#666666', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '2px' }}>
            Taste the Difference
          </span>
        </div>
        <div className="shrink-0 flex items-center gap-2" style={{ fontFamily: 'var(--font-work-sans)', color: '#E4002B', fontWeight: 600, fontSize: '15px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E4002B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Sign in
        </div>
      </div>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  FOOTER DESIGNS
// ═══════════════════════════════════════════════════════════════════════

function FooterA() {
  return (
    <footer style={{ backgroundColor: '#1A1A1A', padding: '48px 24px 36px' }}>
      <div className="flex flex-col items-center mx-auto" style={{ maxWidth: '1200px' }}>
        <Image
          src="/logo-transparent.png"
          alt="KFG"
          width={160}
          height={48}
          style={{ height: '48px', width: 'auto' }}
        />
        <p style={{ fontFamily: 'var(--font-work-sans)', fontSize: '13px', color: '#888888', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '14px' }}>
          Taste the Difference
        </p>
        <div style={{ width: '40px', height: '2px', backgroundColor: '#E4002B', margin: '24px 0', borderRadius: '1px' }} />
        <p style={{ fontFamily: 'var(--font-work-sans)', fontSize: '13px', color: '#555555' }}>
          &copy; {new Date().getFullYear()} KFG. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterB() {
  return (
    <footer style={{ backgroundColor: '#1A1A1A', padding: '48px 24px 36px' }}>
      <div className="mx-auto" style={{ maxWidth: '1200px' }}>
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          {/* Left: Logo + slogan */}
          <div className="flex flex-col items-center md:items-start">
            <Image
              src="/logo-transparent.png"
              alt="KFG"
              width={160}
              height={48}
              style={{ height: '48px', width: 'auto' }}
            />
            <p style={{ fontFamily: 'var(--font-work-sans)', fontSize: '13px', color: '#888888', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '10px' }}>
              Taste the Difference
            </p>
          </div>
          {/* Right: Hours + Contact */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span style={{ fontFamily: 'var(--font-work-sans)', fontSize: '14px', color: '#999999' }}>
                Open Daily: 10:00 AM &ndash; 10:00 PM
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span style={{ fontFamily: 'var(--font-work-sans)', fontSize: '14px', color: '#999999' }}>
                +256 700 000 000
              </span>
            </div>
          </div>
        </div>
        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: '#E4002B', opacity: 0.3, margin: '28px 0' }} />
        {/* Copyright */}
        <p className="text-center" style={{ fontFamily: 'var(--font-work-sans)', fontSize: '13px', color: '#555555' }}>
          &copy; {new Date().getFullYear()} KFG. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterC() {
  return (
    <footer style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)', padding: '48px 24px 36px' }}>
      <div className="flex flex-col items-center mx-auto" style={{ maxWidth: '1200px' }}>
        <Image
          src="/logo-transparent.png"
          alt="KFG"
          width={160}
          height={48}
          style={{ height: '48px', width: 'auto' }}
        />
        <p style={{ fontFamily: 'var(--font-work-sans)', fontSize: '13px', color: '#999999', letterSpacing: '2.5px', textTransform: 'uppercase', marginTop: '14px' }}>
          Taste the Difference
        </p>
        {/* Social icons */}
        <div className="flex items-center gap-4 mt-6">
          {/* Instagram */}
          <a href="#" className="flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110" style={{ width: '40px', height: '40px', backgroundColor: '#333333' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          {/* Facebook */}
          <a href="#" className="flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110" style={{ width: '40px', height: '40px', backgroundColor: '#333333' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          {/* X / Twitter */}
          <a href="#" className="flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110" style={{ width: '40px', height: '40px', backgroundColor: '#333333' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#999999">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
        {/* Divider */}
        <div style={{ width: '60px', height: '2px', backgroundColor: '#E4002B', margin: '24px 0', borderRadius: '1px' }} />
        <p style={{ fontFamily: 'var(--font-work-sans)', fontSize: '13px', color: '#555555' }}>
          &copy; {new Date().getFullYear()} KFG. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  CATEGORY TAB DESIGNS
// ═══════════════════════════════════════════════════════════════════════

function TabsA() {
  const [active, setActive] = useState(0);
  return (
    <nav className="bg-white hide-scrollbar overflow-x-auto" style={{ borderBottom: '2px solid #E5E5E5' }}>
      <div className="flex h-[48px] max-w-[1200px] mx-auto px-4 md:px-6">
        {SAMPLE_CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            onClick={() => setActive(i)}
            className="whitespace-nowrap shrink-0 flex items-center justify-center h-full cursor-pointer"
            style={{
              fontFamily: 'var(--font-oswald)',
              fontSize: '14px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '0 16px',
              minWidth: '140px',
              color: active === i ? '#E4002B' : '#666666',
              borderBottom: active === i ? '2px solid #E4002B' : '2px solid transparent',
              marginBottom: '-2px',
              background: 'none',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => { if (active !== i) e.currentTarget.style.color = '#E4002B'; }}
            onMouseLeave={(e) => { if (active !== i) e.currentTarget.style.color = '#666666'; }}
          >
            {cat}
          </button>
        ))}
      </div>
    </nav>
  );
}

function TabsB() {
  const [active, setActive] = useState(0);
  return (
    <nav className="hide-scrollbar overflow-x-auto" style={{ backgroundColor: '#F5F5F5', padding: '8px 0' }}>
      <div className="flex gap-2 max-w-[1200px] mx-auto px-4 md:px-6">
        {SAMPLE_CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            onClick={() => setActive(i)}
            className="whitespace-nowrap shrink-0 cursor-pointer"
            style={{
              fontFamily: 'var(--font-work-sans)',
              fontSize: '13px',
              fontWeight: active === i ? 600 : 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '8px 20px',
              borderRadius: '999px',
              backgroundColor: active === i ? '#E4002B' : 'transparent',
              color: active === i ? '#FFFFFF' : '#666666',
              border: 'none',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => { if (active !== i) { e.currentTarget.style.backgroundColor = 'rgba(228,0,43,0.1)'; e.currentTarget.style.color = '#E4002B'; } }}
            onMouseLeave={(e) => { if (active !== i) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; } }}
          >
            {cat}
          </button>
        ))}
      </div>
    </nav>
  );
}

function TabsC() {
  const [active, setActive] = useState(0);
  return (
    <nav className="bg-white hide-scrollbar overflow-x-auto" style={{ padding: '12px 0' }}>
      <div className="flex max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="inline-flex rounded-lg overflow-hidden" style={{ border: '1.5px solid #E0E0E0' }}>
          {SAMPLE_CATEGORIES.map((cat, i) => (
            <button
              key={cat}
              onClick={() => setActive(i)}
              className="whitespace-nowrap cursor-pointer"
              style={{
                fontFamily: 'var(--font-work-sans)',
                fontSize: '13px',
                fontWeight: active === i ? 600 : 500,
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
                padding: '10px 22px',
                backgroundColor: active === i ? '#E4002B' : '#FFFFFF',
                color: active === i ? '#FFFFFF' : '#555555',
                border: 'none',
                borderRight: i < SAMPLE_CATEGORIES.length - 1 ? '1px solid #E0E0E0' : 'none',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => { if (active !== i) { e.currentTarget.style.backgroundColor = '#FFF0F0'; e.currentTarget.style.color = '#E4002B'; } }}
              onMouseLeave={(e) => { if (active !== i) { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#555555'; } }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function TabsD() {
  const [active, setActive] = useState(0);
  return (
    <nav className="bg-white hide-scrollbar overflow-x-auto" style={{ borderBottom: '1px solid #F0F0F0' }}>
      <div className="flex h-[56px] max-w-[1200px] mx-auto px-4 md:px-6">
        {SAMPLE_CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            onClick={() => setActive(i)}
            className="whitespace-nowrap shrink-0 flex flex-col items-center justify-center h-full cursor-pointer relative"
            style={{
              fontFamily: 'var(--font-work-sans)',
              fontSize: '14px',
              fontWeight: active === i ? 600 : 400,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              padding: '0 20px',
              minWidth: '120px',
              color: active === i ? '#E4002B' : '#999999',
              background: 'none',
              border: 'none',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => { if (active !== i) e.currentTarget.style.color = '#E4002B'; }}
            onMouseLeave={(e) => { if (active !== i) e.currentTarget.style.color = '#999999'; }}
          >
            {cat}
            {active === i && (
              <span
                className="absolute bottom-2 rounded-full"
                style={{
                  width: '5px',
                  height: '5px',
                  backgroundColor: '#E4002B',
                }}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  CARD DESIGNS
// ═══════════════════════════════════════════════════════════════════════

function CardImage({ item }) {
  return item.imageUrl ? (
    <Image
      src={item.imageUrl}
      alt={item.name}
      fill
      sizes="(max-width: 768px) 50vw, 25vw"
      className="object-cover"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
      <span style={{ color: '#999999', fontSize: '13px' }}>No image</span>
    </div>
  );
}

function CardA({ item }) {
  return (
    <div
      className="overflow-hidden bg-white flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{
        borderRadius: '12px',
        border: '1px solid #EEEEEE',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
        <CardImage item={item} />
      </div>
      <div className="flex flex-col p-3">
        <h3
          className="line-clamp-2"
          style={{
            fontFamily: 'var(--font-work-sans)',
            fontSize: '14px',
            fontWeight: 600,
            color: '#1A1A1A',
            lineHeight: 1.3,
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          {item.name}
        </h3>
        <p style={{ fontFamily: 'var(--font-work-sans)', fontSize: '15px', fontWeight: 700, color: '#E4002B' }}>
          {formatPrice(item.price)}
        </p>
      </div>
    </div>
  );
}

function CardB({ item }) {
  return (
    <div
      className="overflow-hidden bg-white flex flex-col transition-all duration-200 hover:-translate-y-1"
      style={{
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}
    >
      <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
        <CardImage item={item} />
        {/* Price badge on image */}
        <div
          className="absolute bottom-2 right-2 rounded-full shadow-md"
          style={{
            backgroundColor: '#E4002B',
            color: '#FFFFFF',
            fontFamily: 'var(--font-work-sans)',
            fontSize: '12px',
            fontWeight: 700,
            padding: '4px 12px',
          }}
        >
          {formatPrice(item.price)}
        </div>
      </div>
      <div className="flex flex-col p-3">
        <h3
          className="line-clamp-2"
          style={{
            fontFamily: 'var(--font-work-sans)',
            fontSize: '15px',
            fontWeight: 600,
            color: '#1A1A1A',
            lineHeight: 1.3,
            textTransform: 'uppercase',
          }}
        >
          {item.name}
        </h3>
      </div>
    </div>
  );
}

function CardC({ item }) {
  return (
    <div
      className="overflow-hidden bg-white flex flex-col transition-all duration-200 hover:bg-gray-50"
      style={{ borderBottom: '3px solid #E4002B' }}
    >
      <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
        <CardImage item={item} />
      </div>
      <div className="flex items-start justify-between p-3 gap-2">
        <h3
          className="line-clamp-2 flex-1"
          style={{
            fontFamily: 'var(--font-work-sans)',
            fontSize: '14px',
            fontWeight: 600,
            color: '#1A1A1A',
            lineHeight: 1.3,
            textTransform: 'uppercase',
          }}
        >
          {item.name}
        </h3>
        <p className="shrink-0" style={{ fontFamily: 'var(--font-work-sans)', fontSize: '15px', fontWeight: 700, color: '#E4002B' }}>
          {formatPrice(item.price)}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  HORIZONTAL SCROLL CAROUSEL DESIGNS
// ═══════════════════════════════════════════════════════════════════════

const SCROLL_CATEGORIES = [
  {
    name: 'Burgers',
    items: [
      { id: 1, name: 'Classic Burger', price: '8.99', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/casey-lee-awj7sRviVXo-unsplash.jpg' },
      { id: 2, name: 'Cheese Burger', price: '10.99', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/casey-lee-awj7sRviVXo-unsplash.jpg' },
      { id: 3, name: 'Double Patty', price: '14.99', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/casey-lee-awj7sRviVXo-unsplash.jpg' },
      { id: 4, name: 'BBQ Burger', price: '12.99', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/casey-lee-awj7sRviVXo-unsplash.jpg' },
      { id: 5, name: 'Chicken Burger', price: '9.99', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/casey-lee-awj7sRviVXo-unsplash.jpg' },
      { id: 6, name: 'Veggie Burger', price: '8.49', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/casey-lee-awj7sRviVXo-unsplash.jpg' },
      { id: 7, name: 'Spicy Burger', price: '11.99', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/casey-lee-awj7sRviVXo-unsplash.jpg' },
      { id: 8, name: 'Mushroom Burger', price: '12.49', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/casey-lee-awj7sRviVXo-unsplash.jpg' },
    ],
  },
  {
    name: 'Chicken',
    items: [
      { id: 9, name: 'Crispy Fried Chicken', price: '10.99', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/kristof-korody-O3gB6kC0wmI-unsplash.jpg' },
      { id: 10, name: 'Grilled Chicken', price: '11.99', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/kristof-korody-O3gB6kC0wmI-unsplash.jpg' },
      { id: 11, name: 'Chicken Wings', price: '9.49', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/kristof-korody-O3gB6kC0wmI-unsplash.jpg' },
      { id: 12, name: 'Chicken Strips', price: '8.99', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/kristof-korody-O3gB6kC0wmI-unsplash.jpg' },
      { id: 13, name: 'Spicy Wings', price: '10.49', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/kristof-korody-O3gB6kC0wmI-unsplash.jpg' },
      { id: 14, name: 'Lemon Herb Chicken', price: '12.99', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/kristof-korody-O3gB6kC0wmI-unsplash.jpg' },
    ],
  },
  {
    name: 'Sides & Extras',
    items: [
      { id: 15, name: 'Loaded Fries', price: '5.99', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/eugene-Xk0jQPZseMk-unsplash.jpg' },
      { id: 16, name: 'Onion Rings', price: '4.99', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/eugene-Xk0jQPZseMk-unsplash.jpg' },
      { id: 17, name: 'Coleslaw', price: '3.49', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/eugene-Xk0jQPZseMk-unsplash.jpg' },
      { id: 18, name: 'Mozzarella Sticks', price: '6.49', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/eugene-Xk0jQPZseMk-unsplash.jpg' },
      { id: 19, name: 'Sweet Potato Fries', price: '5.49', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/eugene-Xk0jQPZseMk-unsplash.jpg' },
    ],
  },
];

// ─── Shared scroll hook ────────────────────────────────────────────
function useHorizontalScroll(scrollAmount = 320) {
  const ref = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  const scrollLeft = () => ref.current?.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  const scrollRight = () => ref.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' });

  return { ref, canScrollLeft, canScrollRight, scrollLeft, scrollRight };
}

// ─── Arrow SVGs ────────────────────────────────────────────────────
function ChevronLeft({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ChevronRight({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  DESIGN A — Clean Snap Carousel (CSS-only scroll, minimal arrows)
//  Inspired by: Uber Eats / DoorDash category rows
//  Gradient fade edges, circular arrow buttons, snap-to-card
// ═══════════════════════════════════════════════════════════════════

function CarouselA({ category }) {
  const { ref, canScrollLeft, canScrollRight, scrollLeft, scrollRight } = useHorizontalScroll(300);

  return (
    <div className="mb-10">
      {/* Category header */}
      <h3 style={{
        fontFamily: 'var(--font-oswald)',
        fontSize: '20px',
        fontWeight: 700,
        color: '#1A1A1A',
        marginBottom: '14px',
        paddingLeft: '4px',
      }}>
        {category.name}
      </h3>

      <div className="relative group">
        {/* Fade edges */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #FAFAFA, transparent)' }} />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #FAFAFA, transparent)' }} />
        )}

        {/* Left arrow */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{
              width: '40px', height: '40px', borderRadius: '50%',
              backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)', color: '#1A1A1A',
            }}
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {/* Right arrow */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{
              width: '40px', height: '40px', borderRadius: '50%',
              backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)', color: '#1A1A1A',
            }}
          >
            <ChevronRight size={18} />
          </button>
        )}

        {/* Scroll container */}
        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto hide-scrollbar"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            padding: '4px 0',
          }}
        >
          {category.items.map((item) => (
            <div
              key={item.id}
              className="shrink-0 transition-transform duration-200 hover:-translate-y-1"
              style={{
                scrollSnapAlign: 'start',
                width: '160px',
              }}
            >
              <div className="overflow-hidden bg-white" style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
                  <CardImage item={item} />
                  <div
                    className="absolute bottom-2 right-2 rounded-full shadow-md"
                    style={{
                      backgroundColor: '#E4002B', color: '#FFFFFF',
                      fontFamily: 'var(--font-work-sans)', fontSize: '11px',
                      fontWeight: 700, padding: '3px 10px',
                    }}
                  >
                    {formatPrice(item.price)}
                  </div>
                </div>
                <div className="p-2.5">
                  <h4 className="line-clamp-2" style={{
                    fontFamily: 'var(--font-work-sans)', fontSize: '13px',
                    fontWeight: 600, color: '#1A1A1A', lineHeight: 1.3,
                    textTransform: 'uppercase',
                  }}>
                    {item.name}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  DESIGN B — Bold Card Carousel (Netflix / Spotify style)
//  Larger cards, always-visible sleek arrows in header row,
//  card with image overlay gradient + text on image
// ═══════════════════════════════════════════════════════════════════

function CarouselB({ category }) {
  const { ref, canScrollLeft, canScrollRight, scrollLeft, scrollRight } = useHorizontalScroll(340);

  return (
    <div className="mb-12">
      {/* Category header with inline arrows */}
      <div className="flex items-center justify-between mb-4">
        <h3 style={{
          fontFamily: 'var(--font-oswald)',
          fontSize: '22px',
          fontWeight: 700,
          color: '#1A1A1A',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {category.name}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="flex items-center justify-center cursor-pointer transition-all duration-200"
            style={{
              width: '36px', height: '36px', borderRadius: '8px',
              backgroundColor: canScrollLeft ? '#1A1A1A' : '#E5E5E5',
              color: canScrollLeft ? '#FFFFFF' : '#AAAAAA',
              border: 'none',
            }}
          >
            <ChevronLeft size={16} color={canScrollLeft ? '#FFFFFF' : '#AAAAAA'} />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="flex items-center justify-center cursor-pointer transition-all duration-200"
            style={{
              width: '36px', height: '36px', borderRadius: '8px',
              backgroundColor: canScrollRight ? '#E4002B' : '#E5E5E5',
              color: canScrollRight ? '#FFFFFF' : '#AAAAAA',
              border: 'none',
            }}
          >
            <ChevronRight size={16} color={canScrollRight ? '#FFFFFF' : '#AAAAAA'} />
          </button>
        </div>
      </div>

      {/* Scroll container */}
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto hide-scrollbar"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          padding: '4px 0',
        }}
      >
        {category.items.map((item) => (
          <div
            key={item.id}
            className="shrink-0 cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
            style={{
              scrollSnapAlign: 'start',
              width: '200px',
            }}
          >
            <div className="relative overflow-hidden" style={{ borderRadius: '14px', aspectRatio: '3/4' }}>
              <CardImage item={item} />
              {/* Dark gradient overlay from bottom */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)' }}
              />
              {/* Text on image */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h4 className="line-clamp-2" style={{
                  fontFamily: 'var(--font-work-sans)', fontSize: '14px',
                  fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3,
                  textTransform: 'uppercase', marginBottom: '4px',
                }}>
                  {item.name}
                </h4>
                <span style={{
                  fontFamily: 'var(--font-work-sans)', fontSize: '13px',
                  fontWeight: 600, color: '#FF8A8A',
                }}>
                  {formatPrice(item.price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  DESIGN C — Compact Horizontal Strip (Instagram Stories style)
//  Circular/rounded square images, name below, pill arrow on edge,
//  thin red progress bar showing scroll position
// ═══════════════════════════════════════════════════════════════════

function CarouselC({ category }) {
  const { ref, canScrollLeft, canScrollRight, scrollLeft, scrollRight } = useHorizontalScroll(280);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollProgress(max > 0 ? el.scrollLeft / max : 0);
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll, ref]);

  return (
    <div className="mb-10">
      {/* Category header with progress bar */}
      <div className="flex items-center justify-between mb-3">
        <h3 style={{
          fontFamily: 'var(--font-oswald)',
          fontSize: '18px',
          fontWeight: 700,
          color: '#1A1A1A',
          letterSpacing: '0.3px',
        }}>
          {category.name}
        </h3>
        <span style={{
          fontFamily: 'var(--font-work-sans)', fontSize: '12px',
          fontWeight: 500, color: '#E4002B', textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {category.items.length} items
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: '2px', backgroundColor: '#EEEEEE', borderRadius: '1px', marginBottom: '14px' }}>
        <div
          style={{
            height: '100%', backgroundColor: '#E4002B', borderRadius: '1px',
            width: `${Math.max(20, scrollProgress * 100)}%`,
            transition: 'width 0.1s ease-out',
          }}
        />
      </div>

      <div className="relative">
        {/* Pill arrows on edges */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
            style={{
              width: '32px', height: '56px', borderRadius: '0 8px 8px 0',
              backgroundColor: 'rgba(228,0,43,0.9)', color: '#FFFFFF',
              border: 'none', boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
            }}
          >
            <ChevronLeft size={16} color="#FFFFFF" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
            style={{
              width: '32px', height: '56px', borderRadius: '8px 0 0 8px',
              backgroundColor: 'rgba(228,0,43,0.9)', color: '#FFFFFF',
              border: 'none', boxShadow: '-2px 0 8px rgba(0,0,0,0.15)',
            }}
          >
            <ChevronRight size={16} color="#FFFFFF" />
          </button>
        )}

        {/* Scroll container */}
        <div
          ref={ref}
          className="flex gap-3 overflow-x-auto hide-scrollbar"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            padding: '4px 0',
          }}
        >
          {category.items.map((item) => (
            <div
              key={item.id}
              className="shrink-0 flex flex-col items-center cursor-pointer group"
              style={{ scrollSnapAlign: 'start', width: '130px' }}
            >
              {/* Rounded square image with red ring on hover */}
              <div
                className="relative overflow-hidden transition-all duration-300 group-hover:shadow-lg"
                style={{
                  width: '120px', height: '120px', borderRadius: '20px',
                  border: '2px solid transparent',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#E4002B'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                <CardImage item={item} />
              </div>
              {/* Name */}
              <h4
                className="text-center line-clamp-2 mt-2"
                style={{
                  fontFamily: 'var(--font-work-sans)', fontSize: '12px',
                  fontWeight: 600, color: '#1A1A1A', lineHeight: 1.3,
                  textTransform: 'uppercase',
                }}
              >
                {item.name}
              </h4>
              {/* Price pill */}
              <span
                className="mt-1 inline-block rounded-full"
                style={{
                  fontFamily: 'var(--font-work-sans)', fontSize: '11px',
                  fontWeight: 700, color: '#E4002B',
                  backgroundColor: '#FFF0F0', padding: '2px 10px',
                }}
              >
                {formatPrice(item.price)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  PREVIEW PAGE
// ═══════════════════════════════════════════════════════════════════════

export default function PreviewPage() {
  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="text-center py-12 px-4" style={{ backgroundColor: '#1A1A1A' }}>
        <h1
          style={{
            fontFamily: 'var(--font-oswald)',
            fontSize: '36px',
            fontWeight: 700,
            color: '#FFFFFF',
            textTransform: 'uppercase',
            letterSpacing: '3px',
          }}
        >
          KFG Design Preview
        </h1>
        <p style={{ fontFamily: 'var(--font-work-sans)', fontSize: '16px', color: '#999999', marginTop: '8px' }}>
          Pick your favorite design for each component
        </p>
        <div className="mx-auto mt-4" style={{ width: '60px', height: '3px', backgroundColor: '#E4002B', borderRadius: '2px' }} />
      </div>

      <div className="mx-auto px-4 md:px-6 py-16" style={{ maxWidth: '1200px' }}>

        {/* ── HEADERS ─────────────────────────────────────────────── */}
        <section className="mb-20">
          <SectionTitle title="Header Designs" />

          <VariantLabel label="Design A" description="Clean Minimal" />
          <PreviewFrame>
            <HeaderA />
          </PreviewFrame>

          <VariantLabel label="Design B" description="Glassmorphism with Gradient Accent" />
          <PreviewFrame className="relative" style={{ background: 'linear-gradient(135deg, #f0f0f0, #e8e8e8)' }}>
            <HeaderB />
          </PreviewFrame>

          <VariantLabel label="Design C" description="Bold with Red Accent Bar" />
          <PreviewFrame>
            <HeaderC />
          </PreviewFrame>
        </section>

        {/* ── FOOTERS ─────────────────────────────────────────────── */}
        <section className="mb-20">
          <SectionTitle title="Footer Designs" />

          <VariantLabel label="Design A" description="Simple Elegant" />
          <PreviewFrame>
            <FooterA />
          </PreviewFrame>

          <VariantLabel label="Design B" description="Two-Column with Info" />
          <PreviewFrame>
            <FooterB />
          </PreviewFrame>

          <VariantLabel label="Design C" description="Gradient with Social Icons" />
          <PreviewFrame>
            <FooterC />
          </PreviewFrame>
        </section>

        {/* ── CATEGORY TABS ────────────────────────────────────────── */}
        <section className="mb-20">
          <SectionTitle title="Category Tab Designs" />

          <VariantLabel label="Design A" description="Classic Underline" />
          <PreviewFrame>
            <TabsA />
          </PreviewFrame>

          <VariantLabel label="Design B" description="Pill Tabs" />
          <PreviewFrame>
            <TabsB />
          </PreviewFrame>

          <VariantLabel label="Design C" description="Boxed Segments" />
          <PreviewFrame>
            <TabsC />
          </PreviewFrame>

          <VariantLabel label="Design D" description="Minimal with Dot Indicator" />
          <PreviewFrame>
            <TabsD />
          </PreviewFrame>
        </section>

        {/* ── HORIZONTAL SCROLL CAROUSELS ─────────────────────────── */}
        <section className="mb-20">
          <SectionTitle title="Horizontal Scroll Layouts" />
          <p className="mb-8" style={{ fontFamily: 'var(--font-work-sans)', fontSize: '14px', color: '#666666', marginTop: '-20px' }}>
            Each category = one horizontal row. Swipe on mobile, click arrows on desktop.
          </p>

          <VariantLabel label="Design A" description="Clean Snap Carousel — Uber Eats / DoorDash style. Fade edges, circular arrows appear on hover." />
          <PreviewFrame>
            <div style={{ padding: '20px 16px', backgroundColor: '#FAFAFA' }}>
              {SCROLL_CATEGORIES.map((cat) => (
                <CarouselA key={cat.name} category={cat} />
              ))}
            </div>
          </PreviewFrame>

          <VariantLabel label="Design B" description="Bold Card Carousel — Netflix style. Dark overlay on tall cards, always-visible header arrows." />
          <PreviewFrame>
            <div style={{ padding: '20px 16px', backgroundColor: '#FAFAFA' }}>
              {SCROLL_CATEGORIES.map((cat) => (
                <CarouselB key={cat.name} category={cat} />
              ))}
            </div>
          </PreviewFrame>

          <VariantLabel label="Design C" description="Compact Strip — Instagram Stories style. Rounded squares, scroll progress bar, red pill arrows." />
          <PreviewFrame>
            <div style={{ padding: '20px 16px', backgroundColor: '#FAFAFA' }}>
              {SCROLL_CATEGORIES.map((cat) => (
                <CarouselC key={cat.name} category={cat} />
              ))}
            </div>
          </PreviewFrame>
        </section>

        {/* ── CARDS ───────────────────────────────────────────────── */}
        <section className="mb-20">
          <SectionTitle title="Menu Card Designs" />

          <VariantLabel label="Design A" description="Rounded Clean with Hover Lift" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {SAMPLE_ITEMS.map((item) => (
              <CardA key={item.id} item={item} />
            ))}
          </div>

          <VariantLabel label="Design B" description="Floating with Price Badge on Image" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {SAMPLE_ITEMS.map((item) => (
              <CardB key={item.id} item={item} />
            ))}
          </div>

          <VariantLabel label="Design C" description="Minimal Flat with Red Bottom Accent" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {SAMPLE_ITEMS.map((item) => (
              <CardC key={item.id} item={item} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
