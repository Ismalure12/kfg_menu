'use client';

import Image from 'next/image';

const SAMPLE_ITEMS = [
  { id: 1, name: 'Classic Burger', price: '8.99', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/casey-lee-awj7sRviVXo-unsplash.jpg' },
  { id: 2, name: 'Crispy Fried Chicken', price: '10.99', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/kristof-korody-O3gB6kC0wmI-unsplash.jpg' },
  { id: 3, name: 'Loaded Fries', price: '5.99', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu/eugene-Xk0jQPZseMk-unsplash.jpg' },
  { id: 4, name: 'Chocolate Cake', price: '5.99', imageUrl: 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/chocolate-cake.jpg' },
];

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
