'use client';

import Image from 'next/image';

export default function MenuItemCard({ item }) {
  return (
    <div
      className="overflow-hidden bg-white flex flex-col transition-all duration-200 hover:-translate-y-1"
      style={{
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        cursor: 'default',
      }}
    >
      {/* Image with price badge */}
      <div className="relative w-full" style={{ aspectRatio: '1/1', backgroundColor: '#F5F5F5' }}>
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
            <span style={{ color: '#999999', fontSize: '13px' }}>No image</span>
          </div>
        )}
        {/* Price badge */}
        <div
          className="absolute bottom-2 right-2 rounded-full shadow-md"
          style={{
            backgroundColor: '#E4002B',
            color: '#FFFFFF',
            fontFamily: 'var(--font-work-sans), sans-serif',
            fontSize: '12px',
            fontWeight: 700,
            padding: '4px 12px',
          }}
        >
          ${parseFloat(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
      </div>

      {/* Name only — price is on the image */}
      <div className="flex flex-col p-3">
        <h3
          className="line-clamp-2"
          style={{
            fontFamily: 'var(--font-work-sans), sans-serif',
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
