export default function MenuSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8">
      {/* Fake category title */}
      <div className="skeleton h-6 w-40 rounded mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden" style={{ borderRadius: '12px' }}>
            <div className="skeleton w-full" style={{ aspectRatio: '1/1' }} />
            <div className="p-3">
              <div className="skeleton h-4 w-3/4 rounded mb-2" />
              <div className="skeleton h-4 w-1/3 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
