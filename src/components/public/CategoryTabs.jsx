'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const STICKY_HEIGHT = 120; // header (72) + tabs (~48)

export default function CategoryTabs({ categories }) {
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug || '');
  const scrollContainerRef = useRef(null);
  const activeTabRef = useRef(null);
  const isClickScrolling = useRef(false);
  const clickTimeout = useRef(null);

  // Scroll-based active tab detection — replaces IntersectionObserver.
  // Finds the section whose top is closest to (but not far below) the sticky bar.
  const updateActiveOnScroll = useCallback(() => {
    if (isClickScrolling.current) return;

    let bestSlug = categories[0]?.slug || '';
    let bestDistance = Infinity;

    for (const cat of categories) {
      const el = document.getElementById(cat.slug);
      if (!el) continue;
      const top = el.getBoundingClientRect().top - STICKY_HEIGHT;
      // Section whose top is at or above the sticky bar, closest to it
      if (top <= 20 && Math.abs(top) < bestDistance) {
        bestDistance = Math.abs(top);
        bestSlug = cat.slug;
      }
    }

    setActiveSlug(bestSlug);
  }, [categories]);

  useEffect(() => {
    window.addEventListener('scroll', updateActiveOnScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateActiveOnScroll);
  }, [updateActiveOnScroll]);

  // Auto-scroll the tab bar to keep the active tab centered
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const tab = activeTabRef.current;
      const container = scrollContainerRef.current;
      const scrollLeft = tab.offsetLeft - container.offsetWidth / 2 + tab.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeSlug]);

  const handleClick = (slug) => {
    const el = document.getElementById(slug);
    if (!el) return;

    // Suppress scroll-spy while we programmatically scroll
    isClickScrolling.current = true;
    setActiveSlug(slug);

    if (clickTimeout.current) clearTimeout(clickTimeout.current);

    const sectionRect = el.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const availableH = viewportH - STICKY_HEIGHT;
    const sectionH = sectionRect.height;

    let targetScrollY;

    if (sectionH <= availableH) {
      // Section fits — center it vertically in the available space
      const offset = (availableH - sectionH) / 2;
      targetScrollY = window.scrollY + sectionRect.top - STICKY_HEIGHT - offset;
    } else {
      // Section too tall — scroll to its top
      targetScrollY = window.scrollY + sectionRect.top - STICKY_HEIGHT;
    }

    // Clamp to valid scroll range
    const maxScroll = document.documentElement.scrollHeight - viewportH;
    targetScrollY = Math.max(0, Math.min(targetScrollY, maxScroll));

    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });

    // Re-enable scroll-spy after the scroll animation finishes
    clickTimeout.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  };

  return (
    <nav
      className="sticky z-40 bg-white"
      style={{
        top: '72px',
        padding: '12px 0',
        borderBottom: '1px solid #E5E5E5',
      }}
    >
      <div
        ref={scrollContainerRef}
        className="flex max-w-[1200px] mx-auto px-4 md:px-6 overflow-x-auto hide-scrollbar"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="inline-flex rounded-lg overflow-hidden shrink-0" style={{ border: '1.5px solid #E0E0E0' }}>
          {categories.map((cat, i) => {
            const isActive = activeSlug === cat.slug;
            return (
              <button
                key={cat.slug}
                ref={isActive ? activeTabRef : null}
                onClick={() => handleClick(cat.slug)}
                className="whitespace-nowrap cursor-pointer shrink-0 category-tab-box"
                style={{
                  fontFamily: 'var(--font-work-sans), sans-serif',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  padding: '10px 18px',
                  backgroundColor: isActive ? '#E4002B' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#555555',
                  border: 'none',
                  borderRight: i < categories.length - 1 ? '1px solid #E0E0E0' : 'none',
                  transition: 'all 0.25s ease',
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
