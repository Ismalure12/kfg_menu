'use client';

import { useState, useEffect, useRef } from 'react';

export default function CategoryTabs({ categories }) {
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug || '');
  const tabsRef = useRef(null);
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

  useEffect(() => {
    if (activeTabRef.current && tabsRef.current) {
      const tab = activeTabRef.current;
      const container = tabsRef.current;
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
      className="sticky z-40 bg-white hide-scrollbar overflow-x-auto"
      style={{
        top: '72px',
        height: '48px',
        borderBottom: '2px solid #E5E5E5',
        WebkitOverflowScrolling: 'touch',
      }}
      ref={tabsRef}
    >
      <div className="flex h-full max-w-[1200px] mx-auto px-4 md:px-6">
        {categories.map((cat) => {
          const isActive = activeSlug === cat.slug;
          return (
            <button
              key={cat.slug}
              ref={isActive ? activeTabRef : null}
              onClick={() => handleClick(cat.slug)}
              className="whitespace-nowrap cursor-pointer shrink-0 relative"
              style={{
                fontFamily: 'var(--font-oswald), sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                padding: '0 16px',
                minWidth: '160px',
                color: isActive ? '#E4002B' : '#666666',
                background: 'none',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                borderBottom: isActive ? '2px solid #E4002B' : '2px solid transparent',
                marginBottom: '-2px',
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
