import prisma from '@/lib/prisma';
import Footer from '@/components/public/Footer';
import MenuPreview from '@/components/public/MenuPreview';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [categories, socialLinks] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            subItems: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    }),
    prisma.socialLink.findMany(),
  ]);

  const socialMap = {};
  socialLinks.forEach((link) => {
    socialMap[link.platform] = link.value;
  });

  // Transform DB data into the menu format
  const menuCategories = [];

  for (const cat of categories) {
    if (cat.items.length === 0) continue;

    const items = cat.items.map((item) => {
      const hasVariants = item.subItems && item.subItems.length > 0;
      return {
        id: item.id.toString(),
        name: item.name,
        desc: item.description || '',
        imageUrl: item.imageUrl,
        price: hasVariants ? undefined : parseFloat(item.price.toString()),
        variants: hasVariants
          ? item.subItems.map((sub) => ({
              label: sub.name,
              price: parseFloat(sub.price.toString()),
            }))
          : undefined,
      };
    });

    const hasAnyVariants = items.some((i) => i.variants);
    menuCategories.push({
      id: cat.slug,
      name: cat.name,
      imageUrl: cat.imageUrl ?? null,
      layout: hasAnyVariants ? 'grid' : 'list',
      items,
    });
  }

  return (
    <>
      <MenuPreview categories={menuCategories} />
      <Footer socialLinks={socialMap} />
    </>
  );
}
