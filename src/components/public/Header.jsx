import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
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
        {/* Logo — grayscale by default, color sweeps in on hover */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="KFG"
            width={160}
            height={48}
            style={{ height: '48px', width: 'auto' }}
            priority
          />
        </Link>

        {/* Center brand */}
        <div className="hidden sm:flex flex-col items-center">
          <span
            style={{
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '20px',
              fontWeight: 700,
              color: '#E4002B',
              textTransform: 'uppercase',
              letterSpacing: '4px',
              lineHeight: 1.2,
            }}
          >
            KFG
          </span>
          <span
            style={{
              fontFamily: 'var(--font-work-sans), sans-serif',
              fontSize: '10px',
              fontWeight: 500,
              color: '#AAAAAA',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              marginTop: '3px',
            }}
          >
            Taste the Difference
          </span>
        </div>

        {/* Sign in pill — fills red on hover */}
        <Link
          href="/admin/login"
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
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Sign in
        </Link>
      </div>
    </header>
  );
}
