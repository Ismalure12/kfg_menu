'use client';

import { useState, useEffect, useRef } from 'react';

export default function CategoryTabs({ categories }) {
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug || '');
  const scrollContainerRef = useRef(null);
  const activeTabRef = useRef(null);

  useEffect(() => {
    const sections = categories.map((cat) => document.getElementById(cat.slug));
    const validSections = sections.filter(Boolean);

    if (validSections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.reduce((prev, curr) =>
            prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr
          );
          setActiveSlug(topmost.target.id);
        }
      },
      {
        rootMargin: '-120px 0px 0px 0px',
        threshold: 0.3,
      }
    );

    validSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [categories]);

  // Auto-scroll the tab bar to keep the active tab visible
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const tab = activeTabRef.current;
      const container = scrollContainerRef.current;
      const scrollLeft = tab.offsetLeft - container.offsetWidth / 2 + tab.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeSlug]);

  const handleClick = (slug) => {
    setActiveSlug(slug);
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
