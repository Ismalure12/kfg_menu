const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

const MENU = [
  {
    name: 'Chicken',
    slug: 'chicken',
    sortOrder: 1,
    items: [
      { name: '1 pc Leg', price: 2.5, description: 'Chicken Leg', sortOrder: 1 },
      { name: 'Snack Box', price: 4, description: '2 pcs Chicken + Fries', sortOrder: 2 },
      { name: 'Dinner 3pc', price: 5.5, description: '3 pcs Chicken + Fries', sortOrder: 3 },
      { name: 'Dinner 4pc', price: 7, description: '4 pcs Chicken + Fries', sortOrder: 4 },
      { name: '9 pc Meal', price: 9, description: '9 pc + Fries + 2 Drinks', sortOrder: 5 },
      { name: '12 pc Meal', price: 14, description: '12 pc + Fries + 2 Drinks', sortOrder: 6 },
      { name: '15 pc Meal', price: 20, description: '15 pc + 2 Fries + 4 Drinks', sortOrder: 7 },
      { name: '18 pc Meal', price: 26, description: '18 pc + Fries + 5 Drinks', sortOrder: 8 },
      { name: 'Box Meal Combo', price: 16, description: 'Box meal combo', sortOrder: 9 },
    ],
  },
  {
    name: 'Strips',
    slug: 'strips',
    sortOrder: 2,
    items: [
      {
        name: 'Chicken Strips',
        price: 5,
        description: 'Crispy chicken strips with fries',
        sortOrder: 1,
        subItems: [
          { name: 'Small (5 pcs + Fries)', price: 5, sortOrder: 1 },
          { name: 'Medium (8 pcs + Fries)', price: 7.5, sortOrder: 2 },
          { name: 'Large (12 pcs + Fries)', price: 9, sortOrder: 3 },
        ],
      },
      {
        name: 'Strip Fish',
        price: 3.5,
        description: 'Crispy fish strips',
        sortOrder: 2,
        subItems: [
          { name: 'Small (3 pcs)', price: 3.5, sortOrder: 1 },
          { name: 'Medium (6 pcs)', price: 5, sortOrder: 2 },
          { name: 'Family (9 pcs)', price: 7.5, sortOrder: 3 },
        ],
      },
    ],
  },
  {
    name: 'Pizza',
    slug: 'pizza',
    sortOrder: 3,
    items: [
      {
        name: 'Pizza Chicken',
        price: 8,
        sortOrder: 1,
        subItems: [
          { name: 'Small', price: 8, sortOrder: 1 },
          { name: 'Medium', price: 10, sortOrder: 2 },
          { name: 'Large', price: 12, sortOrder: 3 },
        ],
      },
      {
        name: 'Pizza Fish',
        price: 11,
        sortOrder: 2,
        subItems: [
          { name: 'Small', price: 11, sortOrder: 1 },
          { name: 'Medium', price: 13, sortOrder: 2 },
          { name: 'Large', price: 15, sortOrder: 3 },
        ],
      },
      {
        name: 'Pizza Meat',
        price: 10,
        sortOrder: 3,
        subItems: [
          { name: 'Small', price: 10, sortOrder: 1 },
          { name: 'Medium', price: 13, sortOrder: 2 },
          { name: 'Large', price: 15, sortOrder: 3 },
        ],
      },
      {
        name: 'Pizza Margherita',
        price: 8,
        sortOrder: 4,
        subItems: [
          { name: 'Small', price: 8, sortOrder: 1 },
          { name: 'Medium', price: 10, sortOrder: 2 },
          { name: 'Large', price: 12, sortOrder: 3 },
        ],
      },
      {
        name: 'Pizza Orkha',
        price: 10,
        sortOrder: 5,
        subItems: [
          { name: 'Small', price: 10, sortOrder: 1 },
          { name: 'Medium', price: 13, sortOrder: 2 },
          { name: 'Large', price: 15, sortOrder: 3 },
        ],
      },
    ],
  },
  {
    name: 'Burgers',
    slug: 'burgers',
    sortOrder: 4,
    items: [
      {
        name: 'Chicken Burger',
        price: 4,
        sortOrder: 1,
        subItems: [
          { name: 'Regular', price: 4, sortOrder: 1 },
          { name: 'Large', price: 6, sortOrder: 2 },
        ],
      },
      {
        name: 'Fish Burger',
        price: 4,
        sortOrder: 2,
        subItems: [
          { name: 'Regular', price: 4, sortOrder: 1 },
          { name: 'Large', price: 6, sortOrder: 2 },
        ],
      },
      {
        name: 'Meat Burger',
        price: 4,
        sortOrder: 3,
        subItems: [
          { name: 'Regular', price: 4, sortOrder: 1 },
          { name: 'Large', price: 6, sortOrder: 2 },
        ],
      },
    ],
  },
  {
    name: 'Wraps',
    slug: 'wraps',
    sortOrder: 5,
    items: [
      { name: 'Chicken Wrap', price: 4, sortOrder: 1 },
      { name: 'Fish Wrap', price: 4, sortOrder: 2 },
      { name: 'Meat Wrap', price: 5, sortOrder: 3 },
    ],
  },
  {
    name: 'Box Master',
    slug: 'box-master',
    sortOrder: 6,
    items: [
      { name: 'Chicken Box Master', price: 6, sortOrder: 1 },
      { name: 'Fish Box Master', price: 5.5, sortOrder: 2 },
      { name: 'Meat Box Master', price: 7, sortOrder: 3 },
    ],
  },
  {
    name: 'Nuggets & Extras',
    slug: 'nuggets-extras',
    sortOrder: 7,
    items: [
      { name: 'Nuggets (9 pcs)', price: 3.5, description: '9 pcs nuggets', sortOrder: 1 },
      { name: 'Chicken Popcorn + Fries', price: 3.5, sortOrder: 2 },
      { name: 'Chips Only', price: 1, sortOrder: 3 },
      { name: 'Mayonnaise', price: 1.5, sortOrder: 4 },
      { name: 'Mushroom Sauce', price: 1.5, sortOrder: 5 },
      { name: 'Marinara Sauce', price: 1.5, sortOrder: 6 },
    ],
  },
];

async function main() {
  console.log('Clearing existing menu data...');

  // Delete in order: sub_items -> menu_items -> categories
  await prisma.subItem.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();

  console.log('Cleared.\n');

  for (const cat of MENU) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
    console.log(`Category: ${category.name}`);

    for (const item of cat.items) {
      const menuItem = await prisma.menuItem.create({
        data: {
          categoryId: category.id,
          name: item.name,
          price: item.price,
          description: item.description || null,
          sortOrder: item.sortOrder,
          isActive: true,
        },
      });
      console.log(`  + ${menuItem.name} — $${item.price}`);

      if (item.subItems) {
        for (const sub of item.subItems) {
          await prisma.subItem.create({
            data: {
              menuItemId: menuItem.id,
              name: sub.name,
              price: sub.price,
              sortOrder: sub.sortOrder,
              isActive: true,
            },
          });
          console.log(`    - ${sub.name}: $${sub.price}`);
        }
      }
    }
    console.log('');
  }

  console.log('Done! KFG menu seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
