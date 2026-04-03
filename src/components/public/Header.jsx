import Link from 'next/link';
import Image from 'next/image';

export default function Header({ phone }) {
  return (
    <header
      className="sticky top-0 z-50 relative bg-white/90 backdrop-blur-lg"
      style={{
        height: '72px',
        minHeight: '72px',
        boxShadow: '0 1px 12px rgba(0,0,0,0.04)',
      }}
    >
      {/* Animated gradient accent line at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px] gradient-line-animate"
        style={{ background: 'linear-gradient(90deg, #E4002B, #FF6B81, #E4002B, #FF6B81)', backgroundSize: '200% 100%' }}
      />

      <div
        className="flex items-center justify-between h-full mx-auto"
        style={{
          maxWidth: '1200px',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
      >
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo-transparent.png"
            alt="KFG"
            width={160}
            height={48}
            style={{ height: '48px', width: 'auto' }}
            priority
          />
        </Link>

        {/* Call us pill */}
        <a
          href={phone ? `tel:${phone}` : '#'}
          className="shrink-0 flex items-center gap-2 rounded-full pill-hover"
          style={{
            fontFamily: 'var(--font-work-sans), sans-serif',
            color: '#333333',
            fontWeight: 500,
            fontSize: '14px',
            border: '1.5px solid #E0E0E0',
            padding: '7px 18px',
            textDecoration: 'none',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Call us
        </a>
      </div>
    </header>
  );
}
