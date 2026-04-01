export default function MenuSkeleton() {
  return (
    <>
      {/* Skeleton tabs bar */}
      <div
        className="sticky z-40 bg-white"
        style={{ top: '72px', padding: '12px 0', borderBottom: '1px solid #E5E5E5' }}
      >
        <div className="flex max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="inline-flex rounded-lg overflow-hidden" style={{ border: '1.5px solid #E0E0E0' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{
                  width: '100px',
                  height: '38px',
                  borderRight: i < 3 ? '1px solid #E0E0E0' : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Skeleton carousel sections */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 pt-6 pb-8">
        {Array.from({ length: 3 }).map((_, sectionIdx) => (
          <div key={sectionIdx} className="mb-8">
            {/* Category header */}
            <div className="flex items-center justify-between mb-3">
              <div className="skeleton rounded" style={{ height: '22px', width: '140px' }} />
              <div className="skeleton rounded" style={{ height: '14px', width: '60px' }} />
            </div>

            {/* Progress bar skeleton */}
            <div className="skeleton rounded" style={{ height: '2px', width: '100%', marginBottom: '14px' }} />

            {/* Horizontal row of rounded squares */}
            <div className="flex gap-3" style={{ padding: '4px 0' }}>
              {Array.from({ length: sectionIdx === 0 ? 6 : 4 }).map((_, i) => (
                <div key={i} className="shrink-0 flex flex-col items-center" style={{ width: '130px' }}>
                  <div
                    className="skeleton"
                    style={{ width: '120px', height: '120px', borderRadius: '20px' }}
                  />
                  <div className="skeleton rounded mt-2" style={{ height: '12px', width: '80px' }} />
                  <div className="skeleton rounded-full mt-1" style={{ height: '16px', width: '60px' }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
