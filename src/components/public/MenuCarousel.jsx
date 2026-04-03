'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

function useHorizontalScroll(scrollAmount = 280) {
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

function ChevronLeft() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

function ChevronDown({ rotated = false }) {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#E4002B"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: 'transform 0.3s ease',
        transform: rotated ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function formatPrice(price) {
  return `$${parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
}

function MenuCard({ item }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [open]);

  const toggle = () => { if (item.description) setOpen(!open); };

  return (
    <div
      className="shrink-0 flex flex-col items-center"
      style={{ scrollSnapAlign: 'start', width: '130px', cursor: item.description ? 'pointer' : 'default' }}
      onClick={toggle}
    >
      {/* Rounded square image with hover float */}
      <div
        className="relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '20px',
          border: open ? '2px solid #E4002B' : '2px solid transparent',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        }}
        onMouseEnter={(e) => { if (!open) e.currentTarget.style.borderColor = '#E4002B'; }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.borderColor = 'transparent'; }}
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="120px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
            <span style={{ color: '#999999', fontSize: '12px' }}>No image</span>
          </div>
        )}
      </div>

      {/* Name */}
      <h3
        className="text-center line-clamp-2 mt-2"
        style={{
          fontFamily: 'var(--font-work-sans), sans-serif',
          fontSize: '12px',
          fontWeight: 600,
          color: '#1A1A1A',
          lineHeight: 1.3,
          textTransform: 'uppercase',
        }}
      >
        {item.name}
      </h3>

      {/* Price pill */}
      <span
        className="mt-1 inline-block rounded-full"
        style={{
          fontFamily: 'var(--font-work-sans), sans-serif',
          fontSize: '11px',
          fontWeight: 700,
          color: '#E4002B',
          backgroundColor: '#FFF0F0',
          padding: '2px 10px',
        }}
      >
        {formatPrice(item.price)}
      </span>

      {/* Chevron toggle — only if description exists */}
      {item.description && (
        <button
          onClick={(e) => { e.stopPropagation(); toggle(); }}
          className="mt-1 flex items-center justify-center cursor-pointer"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: open ? '#FFF0F0' : 'transparent',
            border: 'none',
            transition: 'background-color 0.2s',
          }}
        >
          <ChevronDown rotated={open} />
        </button>
      )}

      {/* Slide-down description */}
      <div
        style={{
          overflow: 'hidden',
          transition: 'max-height 0.35s ease, opacity 0.3s ease',
          maxHeight: open ? `${height}px` : '0px',
          opacity: open ? 1 : 0,
        }}
      >
        <p
          ref={contentRef}
          style={{
            fontFamily: 'var(--font-work-sans), sans-serif',
            fontSize: '11px',
            color: '#666666',
            lineHeight: 1.4,
            textAlign: 'center',
            padding: '6px 4px 2px',
            maxWidth: '130px',
          }}
        >
          {item.description}
        </p>
      </div>
    </div>
  );
}

export default function MenuCarousel({ category }) {
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
    <div className="mb-8">
      {/* Category header with item count */}
      <div className="flex items-center justify-between mb-3">
        <h2 style={{
          fontFamily: 'var(--font-oswald), sans-serif',
          fontSize: '1.375rem',
          fontWeight: 700,
          color: '#1A1A1A',
          letterSpacing: '0.3px',
        }}>
          {category.name}
        </h2>
        <span style={{
          fontFamily: 'var(--font-work-sans), sans-serif',
          fontSize: '12px',
          fontWeight: 500,
          color: '#E4002B',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {category.items.length} items
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: '2px', backgroundColor: '#EEEEEE', borderRadius: '1px', marginBottom: '14px' }}>
        <div
          style={{
            height: '100%',
            backgroundColor: '#E4002B',
            borderRadius: '1px',
            width: `${Math.max(20, scrollProgress * 100)}%`,
            transition: 'width 0.1s ease-out',
          }}
        />
      </div>

      <div className="relative">
        {/* Left pill arrow */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
            style={{
              width: '32px',
              height: '56px',
              borderRadius: '0 8px 8px 0',
              backgroundColor: 'rgba(228,0,43,0.9)',
              border: 'none',
              boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
            }}
          >
            <ChevronLeft />
          </button>
        )}

        {/* Right pill arrow */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
            style={{
              width: '32px',
              height: '56px',
              borderRadius: '8px 0 0 8px',
              backgroundColor: 'rgba(228,0,43,0.9)',
              border: 'none',
              boxShadow: '-2px 0 8px rgba(0,0,0,0.15)',
            }}
          >
            <ChevronRight />
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
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
