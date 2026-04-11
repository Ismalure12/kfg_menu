export default function MenuSkeleton() {
  return (
    <>
      <style>{`
        .sk-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 480px) { .sk-grid { gap: 14px; } }
        @media (min-width: 900px) { .sk-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; } }

        .sk-content { padding: 0 16px 40px; }
        @media (min-width: 480px) { .sk-content { padding: 0 20px 40px; } }
        @media (min-width: 768px) { .sk-content { padding: 0 28px 40px; } }

        .sk-header-inner { padding: 12px 16px 0; }
        @media (min-width: 480px) { .sk-header-inner { padding: 14px 20px 0; } }
        @media (min-width: 768px) { .sk-header-inner { padding: 14px 28px 0; } }
      `}</style>

      <div style={{ maxWidth: 900, margin: '0 auto', background: '#FAFAFA', minHeight: '100vh' }}>

        {/* ── Skeleton sticky header ─────────────────────────────────────── */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 20,
          background: '#fff',
          borderBottom: '1px solid #F0EEEC',
          boxShadow: '0 1px 16px rgba(0,0,0,0.05)',
        }}>
          <div className="sk-header-inner">
            {/* Logo + action buttons row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div className="skeleton rounded" style={{ height: 36, width: 140 }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <div className="skeleton rounded" style={{ width: 40, height: 40, borderRadius: 12 }} />
                <div className="skeleton rounded" style={{ width: 40, height: 40, borderRadius: 12 }} />
              </div>
            </div>

            {/* Tab strip */}
            <div style={{ display: 'flex', gap: 0, paddingBottom: 0 }}>
              {[52, 72, 58, 80, 64, 56, 68].map((w, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 14px', gap: 4 }}>
                  <div className="skeleton rounded-full" style={{ width: 20, height: 20 }} />
                  <div className="skeleton rounded" style={{ width: w - 20, height: 8 }} />
                  {i === 0 && (
                    <div style={{ height: 2.5, width: '100%', background: '#E8E8E8', borderRadius: 1 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Skeleton content ───────────────────────────────────────────── */}
        <div className="sk-content">
          {[4, 3, 5].map((count, si) => (
            <div key={si}>
              {/* Section header: sticker + title + count badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '28px 0 16px' }}>
                <div className="skeleton rounded-full" style={{ width: 36, height: 36, flexShrink: 0 }} />
                <div className="skeleton rounded" style={{ height: 22, width: 100 + si * 30 }} />
                <div className="skeleton rounded" style={{ height: 18, width: 32, borderRadius: 10 }} />
              </div>

              {/* Card grid */}
              <div className="sk-grid">
                {Array.from({ length: count }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      background: '#fff',
                      borderRadius: 20,
                      border: '1px solid #F0EEEC',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    {/* Square-ish image area (4:3) */}
                    <div className="skeleton" style={{ width: '100%', aspectRatio: '4 / 3' }} />
                    {/* Card body */}
                    <div style={{ padding: '14px 14px 16px' }}>
                      <div className="skeleton rounded" style={{ height: 12, width: '85%', marginBottom: 6 }} />
                      <div className="skeleton rounded" style={{ height: 10, width: '60%', marginBottom: 14 }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="skeleton rounded" style={{ height: 20, width: 44 }} />
                        <div className="skeleton rounded" style={{ width: 38, height: 38, borderRadius: 12 }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
