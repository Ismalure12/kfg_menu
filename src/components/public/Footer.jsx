import Image from 'next/image';

const iconStyle = "flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110";

const icons = {
  whatsapp: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#999999">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  tiktok: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#999999">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z" />
    </svg>
  ),
};

function buildUrl(platform, value) {
  if (platform === 'whatsapp') {
    const digits = value.replace(/\D/g, '');
    return `https://wa.me/${digits}`;
  }
  if (platform === 'instagram') {
    return value.startsWith('http') ? value : `https://instagram.com/${value.replace(/^@/, '')}`;
  }
  if (platform === 'facebook') {
    return value.startsWith('http') ? value : `https://facebook.com/${value}`;
  }
  if (platform === 'tiktok') {
    return value.startsWith('http') ? value : `https://tiktok.com/@${value.replace(/^@/, '')}`;
  }
  return value;
}

export default function Footer({ socialLinks = {} }) {
  const platforms = ['whatsapp', 'instagram', 'facebook', 'tiktok'];
  const activeLinks = platforms.filter((p) => socialLinks[p] && icons[p]);

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
        {activeLinks.length > 0 && (
          <div className="flex items-center gap-4 mt-6">
            {activeLinks.map((platform) => (
              <a
                key={platform}
                href={buildUrl(platform, socialLinks[platform])}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={platform}
                className={iconStyle}
                style={{ width: '40px', height: '40px', backgroundColor: '#333333' }}
              >
                {icons[platform]}
              </a>
            ))}
          </div>
        )}

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
