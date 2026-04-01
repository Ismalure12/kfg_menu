import Image from 'next/image';

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)', padding: '48px 24px 36px' }}>
      <div className="flex flex-col items-center mx-auto" style={{ maxWidth: '1200px' }}>
        {/* Logo */}
        <Image
          src="/logo-transparent.png"
          alt="KFG"
          width={160}
          height={48}
          style={{ height: '48px', width: 'auto' }}
        />

        {/* Slogan */}
        <p
          style={{
            fontFamily: 'var(--font-work-sans), sans-serif',
            fontSize: '13px',
            color: '#999999',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            marginTop: '14px',
          }}
        >
          Taste the Difference
        </p>

        {/* Social icons */}
        <div className="flex items-center gap-4 mt-6">
          {/* Instagram */}
          <a href="#" className="flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110" style={{ width: '40px', height: '40px', backgroundColor: '#333333' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          {/* Facebook */}
          <a href="#" className="flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110" style={{ width: '40px', height: '40px', backgroundColor: '#333333' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          {/* X / Twitter */}
          <a href="#" className="flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110" style={{ width: '40px', height: '40px', backgroundColor: '#333333' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#999999">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>

        {/* Divider */}
        <div style={{ width: '60px', height: '2px', backgroundColor: '#E4002B', margin: '24px 0', borderRadius: '1px' }} />

        {/* Copyright */}
        <p
          style={{
            fontFamily: 'var(--font-work-sans), sans-serif',
            fontSize: '13px',
            color: '#555555',
          }}
        >
          &copy; {new Date().getFullYear()} KFG. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
