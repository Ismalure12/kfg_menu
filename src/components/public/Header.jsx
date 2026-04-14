import Image from 'next/image';
import Link from 'next/link';

/**
 * Shared sticky header.
 * @param {{ right?: React.ReactNode }} props
 */
export default function Header({ right }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 20,
      background: '#fff',
      borderBottom: '1px solid #F0EEEC',
      boxShadow: '0 1px 16px rgba(0,0,0,0.05)',
      padding: '12px 20px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', lineHeight: 0 }}>
        <Image
          src="/logo-transparent.png"
          alt="KFG"
          width={160}
          height={48}
          style={{ height: 42, width: 'auto' }}
          priority
        />
      </Link>
      {right && <div>{right}</div>}
    </div>
  );
}
