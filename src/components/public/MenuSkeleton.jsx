export default function MenuSkeleton() {
  return (
    <>
      {/* Skeleton tab strip — mirrors .tab-strip in MenuPreview */}
      <div
        className="sticky z-40 bg-white"
        style={{ top: '72px', borderBottom: '1px solid #E5E5E5', overflowX: 'hidden' }}
      >
        <div style={{ display: 'flex', height: 48, alignItems: 'center' }}>
          {[64, 44, 70, 52, 84, 50].map((w, i) => (
            <div
              key={i}
              className="skeleton rounded"
              style={{ width: w, height: 10, flexShrink: 0, margin: '0 16px' }}
            />
          ))}
        </div>
      </div>

      {/* Skeleton grid — mirrors .menu-content + .menu-grid */}
      <style>{`
        .sk-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 900px) {
          .sk-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; }
        }
      `}</style>

      <div style={{ padding: '0 16px 40px', maxWidth: 900, margin: '0 auto' }}>
        {[4, 3, 5].map((count, si) => (
          <div key={si}>
            {/* Section title */}
            <div
              className="skeleton rounded"
              style={{ height: 20, width: 120 + si * 24, margin: '32px 0 16px' }}
            />
            {/* Card grid */}
            <div className="sk-grid">
              {Array.from({ length: count }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    border: '1px solid #EEEEEE',
                    overflow: 'hidden',
                  }}
                >
                  {/* Square image */}
                  <div className="skeleton" style={{ width: '100%', aspectRatio: '1 / 1' }} />
                  {/* Card body */}
                  <div style={{ padding: '12px' }}>
                    <div className="skeleton rounded" style={{ height: 10, width: '80%', marginBottom: 7 }} />
                    <div className="skeleton rounded" style={{ height: 10, width: '55%', marginBottom: 10 }} />
                    <div className="skeleton rounded" style={{ height: 15, width: '38%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
