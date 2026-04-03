const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

const BLOB_BASE = 'https://tioyhhs1jb76lw5p.public.blob.vercel-storage.com/menu';

const MENU_DATA = [
  {
    name: 'Burgers',
    slug: 'burgers',
    sortOrder: 1,
    items: [
      { name: 'Classic Beef Burger', price: 15000, imageUrl: `${BLOB_BASE}/classic-beef-burger.jpg`, sortOrder: 1 },
      { name: 'Cheese Burger', price: 18000, imageUrl: `${BLOB_BASE}/cheese-burger.jpg`, sortOrder: 2 },
      { name: 'Double Patty Burger', price: 25000, imageUrl: `${BLOB_BASE}/double-patty-burger.jpg`, sortOrder: 3 },
      { name: 'BBQ Bacon Burger', price: 22000, imageUrl: `${BLOB_BASE}/bbq-bacon-burger.jpg`, sortOrder: 4 },
      { name: 'Chicken Burger', price: 16000, imageUrl: `${BLOB_BASE}/chicken-burger.jpg`, sortOrder: 5 },
      { name: 'Spicy Jalapeño Burger', price: 20000, imageUrl: `${BLOB_BASE}/spicy-jalape-o-burger.jpg`, sortOrder: 6 },
      { name: 'Mushroom Swiss Burger', price: 21000, imageUrl: `${BLOB_BASE}/mushroom-swiss-burger.jpg`, sortOrder: 7 },
      { name: 'Veggie Burger', price: 14000, imageUrl: `${BLOB_BASE}/veggie-burger.jpg`, sortOrder: 8 },
    ],
  },
  {
    name: 'Fried Chicken',
    slug: 'fried-chicken',
    sortOrder: 2,
    items: [
      { name: 'Crispy Fried Chicken (3pc)', price: 18000, imageUrl: `${BLOB_BASE}/crispy-fried-chicken-3pc.jpg`, sortOrder: 1 },
      { name: 'Spicy Wings (6pc)', price: 15000, imageUrl: `${BLOB_BASE}/spicy-wings-6pc.jpg`, sortOrder: 2 },
      { name: 'Chicken Strips (5pc)', price: 14000, imageUrl: `${BLOB_BASE}/chicken-strips-5pc.jpg`, sortOrder: 3 },
      { name: 'Chicken Drumsticks (4pc)', price: 20000, imageUrl: `${BLOB_BASE}/chicken-drumsticks-4pc.jpg`, sortOrder: 4 },
      { name: 'Grilled Chicken Thighs', price: 22000, imageUrl: `${BLOB_BASE}/grilled-chicken-thighs.jpg`, sortOrder: 5 },
      { name: 'Lemon Herb Chicken', price: 19000, imageUrl: `${BLOB_BASE}/lemon-herb-chicken.jpg`, sortOrder: 6 },
      { name: 'Honey Garlic Wings (6pc)', price: 17000, imageUrl: `${BLOB_BASE}/honey-garlic-wings-6pc.jpg`, sortOrder: 7 },
      { name: 'Chicken Bucket (8pc)', price: 35000, imageUrl: `${BLOB_BASE}/chicken-bucket-8pc.jpg`, sortOrder: 8 },
    ],
  },
  {
    name: 'Pizza',
    slug: 'pizza',
    sortOrder: 3,
    items: [
      { name: 'Margherita Pizza', price: 20000, imageUrl: `${BLOB_BASE}/margherita-pizza.jpg`, sortOrder: 1 },
      { name: 'Pepperoni Pizza', price: 25000, imageUrl: `${BLOB_BASE}/pepperoni-pizza.jpg`, sortOrder: 2 },
      { name: 'BBQ Chicken Pizza', price: 28000, imageUrl: `${BLOB_BASE}/bbq-chicken-pizza.jpg`, sortOrder: 3 },
      { name: 'Veggie Supreme', price: 23000, imageUrl: `${BLOB_BASE}/veggie-supreme.jpg`, sortOrder: 4 },
      { name: 'Meat Lovers Pizza', price: 30000, imageUrl: `${BLOB_BASE}/meat-lovers-pizza.jpg`, sortOrder: 5 },
      { name: 'Hawaiian Pizza', price: 24000, imageUrl: `${BLOB_BASE}/hawaiian-pizza.jpg`, sortOrder: 6 },
      { name: 'Four Cheese Pizza', price: 26000, imageUrl: `${BLOB_BASE}/four-cheese-pizza.jpg`, sortOrder: 7 },
      { name: 'Mushroom & Truffle Pizza', price: 32000, imageUrl: `${BLOB_BASE}/mushroom-truffle-pizza.jpg`, sortOrder: 8 },
    ],
  },
  {
    name: 'Sides & Extras',
    slug: 'sides-extras',
    sortOrder: 4,
    items: [
      { name: 'French Fries', price: 8000, imageUrl: `${BLOB_BASE}/french-fries.jpg`, sortOrder: 1 },
      { name: 'Loaded Cheese Fries', price: 12000, imageUrl: `${BLOB_BASE}/loaded-cheese-fries.jpg`, sortOrder: 2 },
      { name: 'Onion Rings', price: 10000, imageUrl: `${BLOB_BASE}/onion-rings.jpg`, sortOrder: 3 },
      { name: 'Mozzarella Sticks', price: 12000, imageUrl: `${BLOB_BASE}/mozzarella-sticks.jpg`, sortOrder: 4 },
      { name: 'Coleslaw', price: 5000, imageUrl: `${BLOB_BASE}/coleslaw.jpg`, sortOrder: 5 },
      { name: 'Garden Salad', price: 8000, imageUrl: `${BLOB_BASE}/garden-salad.jpg`, sortOrder: 6 },
      { name: 'Sweet Potato Fries', price: 10000, imageUrl: `${BLOB_BASE}/sweet-potato-fries.jpg`, sortOrder: 7 },
      { name: 'Garlic Bread', price: 7000, imageUrl: `${BLOB_BASE}/garlic-bread.jpg`, sortOrder: 8 },
    ],
  },
  {
    name: 'Drinks',
    slug: 'drinks',
    sortOrder: 5,
    items: [
      { name: 'Fresh Orange Juice', price: 8000, imageUrl: `${BLOB_BASE}/fresh-orange-juice.jpg`, sortOrder: 1 },
      { name: 'Mango Smoothie', price: 10000, imageUrl: `${BLOB_BASE}/mango-smoothie.jpg`, sortOrder: 2 },
      { name: 'Iced Coffee', price: 9000, imageUrl: `${BLOB_BASE}/iced-coffee.jpg`, sortOrder: 3 },
      { name: 'Coca-Cola', price: 3000, imageUrl: `${BLOB_BASE}/coca-cola.jpg`, sortOrder: 4 },
      { name: 'Passion Fruit Juice', price: 8000, imageUrl: `${BLOB_BASE}/passion-fruit-juice.jpg`, sortOrder: 5 },
      { name: 'Milkshake (Vanilla)', price: 12000, imageUrl: `${BLOB_BASE}/milkshake-vanilla.jpg`, sortOrder: 6 },
      { name: 'Watermelon Juice', price: 7000, imageUrl: `${BLOB_BASE}/watermelon-juice.jpg`, sortOrder: 7 },
      { name: 'Bottled Water', price: 2000, imageUrl: `${BLOB_BASE}/bottled-water.jpg`, sortOrder: 8 },
    ],
  },
];

async function main() {
  console.log('Seeding menu data...\n');

  for (const cat of MENU_DATA) {
    // Upsert category
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, sortOrder: cat.sortOrder, isActive: true },
      create: { name: cat.name, slug: cat.slug, sortOrder: cat.sortOrder, isActive: true },
    });

    console.log(`✓ Category: ${category.name} (id: ${category.id})`);

    // Create items
    for (const item of cat.items) {
      await prisma.menuItem.create({
        data: {
          categoryId: category.id,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
          sortOrder: item.sortOrder,
          isActive: true,
        },
      });
      console.log(`  + ${item.name} — $${item.price.toLocaleString()}`);
    }

    console.log('');
  }

  console.log('Done! 5 categories, 40 items seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
