import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create all required Staff accounts (exact credentials per spec)
  const hashedPassword = await bcrypt.hash('Test@1234', 10);
  const devHashedPassword = await bcrypt.hash('Admin@123', 10);

  const staffAccounts = [
    // Required test accounts (exact credentials from spec)
    { email: 'admin@test.com', password: hashedPassword, role: 'ADMIN' as const },
    { email: 'kitchen@test.com', password: hashedPassword, role: 'KITCHEN' as const },
    { email: 'dispatch@test.com', password: hashedPassword, role: 'DISPATCH' as const },
    { email: 'driver@test.com', password: hashedPassword, role: 'DRIVER' as const },
    // Dev convenience account
    { email: 'admin@fernleaf.com', password: devHashedPassword, role: 'ADMIN' as const },
  ];

  for (const staff of staffAccounts) {
    await prisma.staff.upsert({
      where: { email: staff.email },
      update: {},
      create: staff,
    });
  }
  console.log('✅ All staff accounts created (incl. required test credentials)');

  // 2. Create Price Tiers
  const defaultTier = await prisma.priceTier.upsert({
    where: { name: 'Standard' },
    update: {},
    create: { name: 'Standard', isDefault: true },
  });
  const premiumTier = await prisma.priceTier.upsert({
    where: { name: 'Premium' },
    update: {},
    create: { name: 'Premium', isDefault: false },
  });
  console.log('✅ Price tiers created');

  // 3. Create Categories
  const cat1 = await prisma.category.upsert({
    where: { id: 'cat-mains' },
    update: {},
    create: { id: 'cat-mains', name: 'Main Course', order: 1 },
  });
  const cat2 = await prisma.category.upsert({
    where: { id: 'cat-starters' },
    update: {},
    create: { id: 'cat-starters', name: 'Starters', order: 2 },
  });
  const cat3 = await prisma.category.upsert({
    where: { id: 'cat-desserts' },
    update: {},
    create: { id: 'cat-desserts', name: 'Desserts', order: 3 },
  });
  const cat4 = await prisma.category.upsert({
    where: { id: 'cat-drinks' },
    update: {},
    create: { id: 'cat-drinks', name: 'Drinks', order: 4 },
  });
  console.log('✅ Categories created');

  // 4. Create Dishes
  const dishes = [
    {
      id: 'dish-1',
      name: 'Grilled Chicken Bowl',
      description: 'Tender grilled chicken with roasted veggies and quinoa.',
      sku: 'GCB-001',
      temperature: 'HOT' as const,
      costPrice: 7.5,
      allergens: ['Gluten'],
      dietaryTags: ['High Protein', 'Gluten Free'],
      kitchenStation: 'Grill',
      minOrderQuantity: 1,
      categoryId: cat1.id,
    },
    {
      id: 'dish-2',
      name: 'Margherita Pizza',
      description: 'Classic wood-fired pizza with fresh mozzarella and basil.',
      sku: 'MZP-002',
      temperature: 'HOT' as const,
      costPrice: 8.0,
      allergens: ['Gluten', 'Dairy'],
      dietaryTags: ['Vegetarian'],
      kitchenStation: 'Pizza',
      minOrderQuantity: 1,
      categoryId: cat1.id,
    },
    {
      id: 'dish-3',
      name: 'Caesar Salad',
      description: 'Crispy romaine lettuce with caesar dressing and croutons.',
      sku: 'CAS-003',
      temperature: 'COLD' as const,
      costPrice: 5.5,
      allergens: ['Dairy', 'Eggs'],
      dietaryTags: ['Vegetarian'],
      kitchenStation: 'Cold',
      minOrderQuantity: 1,
      categoryId: cat2.id,
    },
    {
      id: 'dish-4',
      name: 'Vegan Buddha Bowl',
      description: 'Colourful bowl with falafel, hummus, and seasonal veggies.',
      sku: 'VBB-004',
      temperature: 'COLD' as const,
      costPrice: 7.0,
      allergens: [],
      dietaryTags: ['Vegan', 'Gluten Free'],
      kitchenStation: 'Cold',
      minOrderQuantity: 1,
      categoryId: cat1.id,
    },
    {
      id: 'dish-5',
      name: 'Chocolate Brownie',
      description: 'Rich dark chocolate brownie with a gooey centre.',
      sku: 'CHB-005',
      temperature: 'COLD' as const,
      costPrice: 3.0,
      allergens: ['Gluten', 'Dairy', 'Eggs'],
      dietaryTags: ['Vegetarian'],
      kitchenStation: 'Pastry',
      minOrderQuantity: 1,
      categoryId: cat3.id,
    },
    {
      id: 'dish-6',
      name: 'Sparkling Water (500ml)',
      description: 'Chilled sparkling mineral water.',
      sku: 'SPW-006',
      temperature: 'COLD' as const,
      costPrice: 1.0,
      allergens: [],
      dietaryTags: ['Vegan', 'Gluten Free'],
      kitchenStation: 'Drinks',
      minOrderQuantity: 1,
      categoryId: cat4.id,
    },
    {
      id: 'dish-7',
      name: 'Tomato Soup',
      description: 'Creamy roasted tomato soup with a swirl of basil oil.',
      sku: 'TMS-007',
      temperature: 'HOT' as const,
      costPrice: 4.5,
      allergens: ['Dairy'],
      dietaryTags: ['Vegetarian', 'Gluten Free'],
      kitchenStation: 'Hot Line',
      minOrderQuantity: 1,
      categoryId: cat2.id,
    },
    {
      id: 'dish-8',
      name: 'Pasta Primavera',
      description: 'Penne pasta with seasonal vegetables in a light tomato sauce.',
      sku: 'PAP-008',
      temperature: 'HOT' as const,
      costPrice: 6.5,
      allergens: ['Gluten'],
      dietaryTags: ['Vegetarian'],
      kitchenStation: 'Hot Line',
      minOrderQuantity: 1,
      categoryId: cat1.id,
    },
  ];

  for (const dish of dishes) {
    await prisma.dish.upsert({
      where: { id: dish.id },
      update: {},
      create: dish,
    });

    // Set prices for each tier
    await prisma.dishPrice.upsert({
      where: { dishId_tierId: { dishId: dish.id, tierId: defaultTier.id } },
      update: {},
      create: { dishId: dish.id, tierId: defaultTier.id, price: dish.costPrice * 1.3 },
    });
    await prisma.dishPrice.upsert({
      where: { dishId_tierId: { dishId: dish.id, tierId: premiumTier.id } },
      update: {},
      create: { dishId: dish.id, tierId: premiumTier.id, price: dish.costPrice * 1.5 },
    });
  }
  console.log('✅ 8 dishes seeded with prices');

  // 5. Settings
  await prisma.settings.upsert({
    where: { id: 'default-settings' },
    update: {},
    create: {
      id: 'default-settings',
      kitchenWorkingDays: [1, 2, 3, 4, 5],
      kitchenHolidays: [],
      cutoffDays: 2,
      cutoffTime: '16:00',
    },
  });
  console.log('✅ Settings seeded');

  // 6. Create Companies
  const company1 = await prisma.company.upsert({
    where: { id: 'comp-1' },
    update: {},
    create: {
      id: 'comp-1',
      name: 'TechCorp Solutions',
      emailDomains: ['techcorp.com'],
      deliveryAddresses: ['123 Innovation Drive, Tech Park'],
      billingContact: 'billing@techcorp.com',
      priceTierId: defaultTier.id,
      defaultDeliveryTime: '12:00',
    },
  });

  const company2 = await prisma.company.upsert({
    where: { id: 'comp-2' },
    update: {},
    create: {
      id: 'comp-2',
      name: 'Global Finance Inc',
      emailDomains: ['globalfinance.com'],
      deliveryAddresses: ['45 Wall Street, Financial District'],
      billingContact: 'accounts@globalfinance.com',
      priceTierId: premiumTier.id,
      defaultDeliveryTime: '12:30',
    },
  });
  console.log('✅ Companies seeded');

  // 7. Create Employees
  const emp1 = await prisma.employee.upsert({
    where: { email: 'alice@techcorp.com' },
    update: {},
    create: {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@techcorp.com',
      companyId: company1.id,
    },
  });

  const emp2 = await prisma.employee.upsert({
    where: { email: 'bob@globalfinance.com' },
    update: {},
    create: {
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob@globalfinance.com',
      companyId: company2.id,
    },
  });
  console.log('✅ Employees seeded');

  // 8. Create Orders
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const ordersToCreate = [
    {
      employeeId: emp1.id,
      status: 'CONFIRMED' as const,
      deliveryDate: today,
      deliveryTime: '12:00',
      deliveryAddress: company1.deliveryAddresses[0],
      packaging: 'Standard',
      totalAmount: 15.0,
      lines: {
        create: [
          { 
            dishId: 'dish-1', 
            dishQuantity: 2, 
            dishPrice: 7.5,
            combinations: {
              create: [
                { quantity: 2, totalPrice: 15.0, chosenOptions: [], kitchenStation: 'Grill' }
              ]
            }
          },
        ]
      }
    },
    {
      employeeId: emp2.id,
      status: 'CONFIRMED' as const,
      deliveryDate: today,
      deliveryTime: '12:30',
      deliveryAddress: company2.deliveryAddresses[0],
      packaging: 'Eco-Friendly',
      totalAmount: 8.0,
      lines: {
        create: [
          { 
            dishId: 'dish-2', 
            dishQuantity: 1, 
            dishPrice: 8.0,
            combinations: {
              create: [
                { quantity: 1, totalPrice: 8.0, chosenOptions: [], kitchenStation: 'Pizza' }
              ]
            }
          },
        ]
      }
    },
    {
      employeeId: emp1.id,
      status: 'DELIVERED' as const,
      deliveryDate: yesterday,
      deliveryTime: '12:00',
      deliveryAddress: company1.deliveryAddresses[0],
      packaging: 'Standard',
      totalAmount: 7.5,
      lines: {
        create: [
          { dishId: 'dish-1', dishQuantity: 1, dishPrice: 7.5 },
        ]
      }
    }
  ];

  for (const order of ordersToCreate) {
    // Only create if not exists
    const existing = await prisma.order.findFirst({ where: { employeeId: order.employeeId, deliveryDate: order.deliveryDate } });
    if (!existing) {
      await prisma.order.create({ data: order });
    }
  }
  console.log('✅ Orders seeded');

  console.log('\n🚀 Database seeded successfully!');
  console.log('\n📋 Required Test Accounts:');
  console.log('  Admin    → admin@test.com    / Test@1234');
  console.log('  Kitchen  → kitchen@test.com  / Test@1234');
  console.log('  Dispatch → dispatch@test.com / Test@1234');
  console.log('  Driver   → driver@test.com   / Test@1234');
  console.log('\n🔧 Dev Account:');
  console.log('  Admin    → admin@fernleaf.com / Admin@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
