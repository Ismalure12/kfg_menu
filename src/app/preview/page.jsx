import prisma from '@/lib/prisma';
import Footer from '@/components/public/Footer';
import MenuPreview from '@/components/public/MenuPreview';

const SAUCE_KEYWORDS = ['sauce', 'mayonnaise', 'mayo', 'coleslaw'];

function isSauceItem(name) {
  const lower = name.toLowerCase();
  return SAUCE_KEYWORDS.some((kw) => lower.includes(kw));
}

export default async function PreviewPage() {
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

  // Transform DB data into the preview format
  const menuCategories = [];
  const sauceItems = [];

  for (const cat of categories) {
    if (cat.items.length === 0) continue;

    const regularItems = [];

    for (const item of cat.items) {
      // Separate sauce-type items into their own category
      if (isSauceItem(item.name)) {
        sauceItems.push({
          id: item.id.toString(),
          name: item.name,
          imageUrl: item.imageUrl,
          price: parseFloat(item.price.toString()),
        });
        continue;
      }

      const hasVariants = item.subItems && item.subItems.length > 0;

      regularItems.push({
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
      });
    }

    if (regularItems.length > 0) {
      const hasAnyVariants = regularItems.some((i) => i.variants);
      menuCategories.push({
        id: cat.slug,
        name: cat.name,
        layout: hasAnyVariants ? 'grid' : 'list',
        items: regularItems,
      });
    }
  }

  // Add sauces as a separate category at the end
  if (sauceItems.length > 0) {
    menuCategories.push({
      id: 'sauces',
      name: 'Sauces',
      layout: 'sauce',
      items: sauceItems,
    });
  }

  return (
    <>
      <MenuPreview categories={menuCategories} />
      <Footer socialLinks={socialMap} />
    </>
  );
}
