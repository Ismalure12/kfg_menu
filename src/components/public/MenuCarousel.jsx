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

function formatPrice(price) {
  return `$${parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
}

function MenuCard({ item, isExpanded, onToggle, expandedWidth }) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (isExpanded && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      const timer = setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }, 370);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isExpandable = hasSubItems || item.description;

  return (
    <div
      ref={cardRef}
      className="shrink-0 flex flex-col items-center"
      style={{
        scrollSnapAlign: 'start',
        width: isExpanded ? `${expandedWidth}px` : '130px',
        transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        cursor: isExpandable ? 'pointer' : 'default',
      }}
      onClick={() => { if (isExpandable) onToggle(item.id); }}
    >
      {/* Collapsed view */}
      {!isExpanded && (
        <div className="flex flex-col items-center" style={{ width: '130px' }}>
          <div
            className="relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '20px',
              border: '2px solid transparent',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#E4002B'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; }}
          >
            {item.imageUrl ? (
              <Image src={item.imageUrl} alt={item.name} fill sizes="120px" className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
                <span style={{ color: '#999999', fontSize: '12px' }}>No image</span>
              </div>
            )}
          </div>

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
        </div>
      )}

      {/* Expanded view — Design G */}
      {isExpanded && (
        <div
          className="flex gap-3 relative"
          style={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '14px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '1px solid #F0F0F0',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => onToggle(item.id)}
            className="absolute cursor-pointer flex items-center justify-center"
            style={{ top: '8px', right: '8px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#F0F0F0', border: 'none', zIndex: 2 }}
          >
            <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>

          {/* Left: Image */}
          <div className="relative shrink-0 overflow-hidden" style={{ width: '110px', height: '110px', borderRadius: '16px' }}>
            {item.imageUrl ? (
              <Image src={item.imageUrl} alt={item.name} fill sizes="110px" className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
                <span style={{ color: '#999', fontSize: '12px' }}>No image</span>
              </div>
            )}
          </div>

          {/* Right: Name + Description + Sub-items */}
          <div className="flex flex-col flex-1 min-w-0" style={{ paddingRight: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-oswald), sans-serif', fontSize: '16px', fontWeight: 700, color: '#1A1A1A', marginBottom: '4px' }}>
              {item.name}
            </h3>

            {item.description && (
              <p style={{ fontFamily: 'var(--font-work-sans), sans-serif', fontSize: '12px', color: '#666', lineHeight: 1.5, marginBottom: hasSubItems ? '6px' : '8px' }}>
                {item.description}
              </p>
            )}

            {hasSubItems ? (
              <div className="flex flex-col">
                {item.subItems.map((sub, i) => (
                  <div
                    key={sub.id || i}
                    className="flex items-center justify-between"
                    style={{ padding: '7px 0', borderBottom: i < item.subItems.length - 1 ? '1px solid #F0F0F0' : 'none' }}
                  >
                    <div className="flex items-center gap-2">
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-work-sans), sans-serif', fontSize: '13px', color: '#333' }}>{sub.name}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-work-sans), sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A1A1A' }}>{formatPrice(sub.price)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span style={{ fontFamily: 'var(--font-work-sans), sans-serif', fontSize: '14px', fontWeight: 700, color: '#E4002B' }}>{formatPrice(item.price)}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MenuCarousel({ category }) {
  const { ref, canScrollLeft, canScrollRight, scrollLeft, scrollRight } = useHorizontalScroll(280);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [containerWidth, setContainerWidth] = useState(320);

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
    setContainerWidth(el.clientWidth);
    const ro = new ResizeObserver(() => {
      if (ref.current) setContainerWidth(ref.current.clientWidth);
    });
    ro.observe(el);
    return () => { el.removeEventListener('scroll', handleScroll); ro.disconnect(); };
  }, [handleScroll, ref]);

  const handleToggle = (id) => setExpandedId(expandedId === id ? null : id);

  return (
    <div>
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
            <MenuCard
              key={item.id}
              item={item}
              isExpanded={expandedId === item.id}
              onToggle={handleToggle}
              expandedWidth={containerWidth - 8}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
