'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { label: 'Overview', href: '/admin/dashboard' },
  { label: 'Categories', href: '/admin/dashboard/categories' },
  { label: 'Menu Items', href: '/admin/dashboard/menu-items' },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r shrink-0" style={{ borderColor: '#E5E5E5' }}>
        <div className="p-4 border-b" style={{ borderColor: '#E5E5E5' }}>
          <h2 className="font-bold text-lg" style={{ color: '#1A1A1A' }}>Admin Panel</h2>
        </div>
        <nav className="p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-md text-sm font-medium mb-1"
                style={{
                  backgroundColor: isActive ? '#FEE2E2' : 'transparent',
                  color: isActive ? '#E4002B' : '#333',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 mt-auto">
          <button
            onClick={handleLogout}
            className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
