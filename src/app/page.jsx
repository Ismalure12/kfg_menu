import prisma from '@/lib/prisma';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import CategoryTabs from '@/components/public/CategoryTabs';
import MenuCarousel from '@/components/public/MenuCarousel';

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      items: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  // Filter out categories with no active items and serialize Decimal prices
  const visibleCategories = categories
    .filter((cat) => cat.items.length > 0)
    .map((cat) => ({
      ...cat,
      items: cat.items.map((item) => ({
        ...item,
        price: item.price.toString(),
      })),
    }));

  return (
    <>
      <Header />
      {visibleCategories.length === 0 ? (
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 72px)' }}>
          <p style={{ fontSize: '18px', color: '#666666' }}>Menu coming soon!</p>
        </div>
      ) : (
        <>
          <CategoryTabs categories={visibleCategories.map(({ id, name, slug }) => ({ id, name, slug }))} />
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 pt-6 pb-8">
            {visibleCategories.map((category) => (
              <section
                key={category.slug}
                id={category.slug}
                style={{ scrollMarginTop: '120px' }}
              >
                <MenuCarousel category={category} />
              </section>
            ))}
          </div>
        </>
      )}
      <Footer />
    </>
  );
}
