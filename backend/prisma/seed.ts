import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Mass Seeding database with 15+ variants...');

  // 1. Create all required Staff accounts
  const hashedPassword = await bcrypt.hash('Test@1234', 10);
  const devHashedPassword = await bcrypt.hash('Admin@123', 10);

  const staffAccounts = [
    { email: 'admin@test.com', password: hashedPassword, role: 'ADMIN' as const },
    { email: 'kitchen@test.com', password: hashedPassword, role: 'KITCHEN' as const },
    { email: 'dispatch@test.com', password: hashedPassword, role: 'DISPATCH' as const },
    { email: 'driver@test.com', password: hashedPassword, role: 'DRIVER' as const },
    { email: 'admin@fernleaf.com', password: devHashedPassword, role: 'ADMIN' as const },
    // Extra drivers for dispatch testing
    { email: 'driver2@test.com', password: hashedPassword, role: 'DRIVER' as const },
    { email: 'driver3@test.com', password: hashedPassword, role: 'DRIVER' as const },
  ];

  for (const staff of staffAccounts) {
    await prisma.staff.upsert({
      where: { email: staff.email },
      update: {},
      create: staff,
    });
  }

  // 2. Price Tiers (15 variants)
  const tiers: any[] = [];
  for (let i = 1; i <= 15; i++) {
    const tier = await prisma.priceTier.upsert({
      where: { name: i === 1 ? 'Standard' : `Tier ${i}` },
      update: {},
      create: { name: i === 1 ? 'Standard' : `Tier ${i}`, isDefault: i === 1 },
    });
    tiers.push(tier);
  }

  // 3. Categories (15 variants)
  const categories: any[] = [];
  for (let i = 1; i <= 15; i++) {
    const cat = await prisma.category.upsert({
      where: { id: `cat-${i}` },
      update: {},
      create: { id: `cat-${i}`, name: `Category ${i}`, order: i },
    });
    categories.push(cat);
  }

  // 4. Dishes (15 real variants)
  const kitchenStations = ['Grill', 'Pizza', 'Cold', 'Pastry', 'Drinks', 'Hot Line', 'Fryer', 'Prep'];
  const realFoods = [
    { name: "Grilled Atlantic Salmon", desc: "Served with roasted asparagus and lemon butter sauce.", img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80" },
    { name: "Truffle Mushroom Risotto", desc: "Creamy arborio rice with wild mushrooms and truffle oil.", img: "https://images.unsplash.com/photo-1633436374961-09b92742047b?auto=format&fit=crop&w=800&q=80" },
    { name: "Classic Beef Wellington", desc: "Tender beef wrapped in mushroom duxelles and puff pastry.", img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80" },
    { name: "Margherita Wood-Fired Pizza", desc: "Fresh mozzarella, San Marzano tomatoes, and basil.", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80" },
    { name: "Caesar Salad with Herb Croutons", desc: "Crisp romaine, parmesan, and house-made dressing.", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80" },
    { name: "Spicy Tuna Poke Bowl", desc: "Fresh ahi tuna, edamame, seaweed salad over sushi rice.", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" },
    { name: "Artisan Cheese Platter", desc: "Selection of fine cheeses, honey, and assorted crackers.", img: "https://images.unsplash.com/photo-1622973536968-3ead9e780960?auto=format&fit=crop&w=800&q=80" },
    { name: "Slow-Cooked BBQ Brisket", desc: "Smoked for 14 hours, served with sweet potato mash.", img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80" },
    { name: "Vegan Quinoa & Roasted Veggies", desc: "Healthy bowl of protein-rich quinoa and seasonal greens.", img: "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=800&q=80" },
    { name: "Lemon Butter Asparagus", desc: "Fresh asparagus lightly sautéed in garlic and butter.", img: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=800&q=80" },
    { name: "Decadent Chocolate Lava Cake", desc: "Warm chocolate cake with a molten fudge center.", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80" },
    { name: "Matcha Green Tea Tiramisu", desc: "A Japanese twist on the classic Italian dessert.", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80" },
    { name: "Fresh Berry Acai Bowl", desc: "Topped with granola, coconut flakes, and fresh fruit.", img: "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&w=800&q=80" },
    { name: "Garlic Herb Butter Steak", desc: "Perfectly seared ribeye with herb compound butter.", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80" },
    { name: "Crispy Calamari with Aioli", desc: "Lightly breaded and fried, served with garlic aioli.", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80" }
  ];

  const dishes: any[] = [];
  for (let i = 1; i <= 15; i++) {
    const food = realFoods[i - 1];
    const dish = await prisma.dish.upsert({
      where: { id: `dish-${i}` },
      update: {},
      create: {
        id: `dish-${i}`,
        name: food.name,
        description: food.desc,
        image: food.img,
        sku: `DSH-00${i}`,
        temperature: i % 2 === 0 ? 'HOT' : 'COLD',
        costPrice: 5.0 + (i * 0.5),
        kitchenStation: kitchenStations[i % kitchenStations.length],
        categoryId: categories[i % categories.length].id,
      },
    });
    dishes.push(dish);

    // Set prices for the first 3 tiers
    for (let t = 0; t < 3; t++) {
      await prisma.dishPrice.upsert({
        where: { dishId_tierId: { dishId: dish.id, tierId: tiers[t].id } },
        update: {},
        create: { dishId: dish.id, tierId: tiers[t].id, price: dish.costPrice * (1.2 + (t * 0.1)) },
      });
    }
  }

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

  // 6. Companies (16 variants)
  const realCompanies = [
    { name: 'Acme Corporation', domain: 'acme.com', address: '100 Looney Blvd' },
    { name: 'Globex Inc', domain: 'globex.com', address: '42 Springfield Way' },
    { name: 'Initech', domain: 'initech.com', address: '4120 Freidrich Ln' },
    { name: 'Stark Industries', domain: 'stark.com', address: '200 Park Avenue' },
    { name: 'Wayne Enterprises', domain: 'wayne.com', address: '1007 Mountain Drive' },
    { name: 'Cyberdyne Systems', domain: 'cyberdyne.com', address: '1814 Terminator Rd' },
    { name: 'Massive Dynamic', domain: 'massive.com', address: '655 11th Ave' },
    { name: 'Aperture Science', domain: 'aperture.com', address: '1 Enrichment Center' },
    { name: 'Hooli', domain: 'hooli.com', address: '1000 Hooli Way' },
    { name: 'Pied Piper', domain: 'piedpiper.com', address: '5230 Newell Road' },
    { name: 'Dunder Mifflin', domain: 'dunder.com', address: '1725 Slough Avenue' },
    { name: 'Bluth Company', domain: 'bluth.com', address: '2501 Balboa Blvd' },
    { name: 'Umbrella Corp', domain: 'umbrella.com', address: 'Raccoon City Plaza' },
    { name: 'Weyland-Yutani', domain: 'weyland.com', address: 'Space Station 42' },
    { name: 'E-Corp', domain: 'ecorp.com', address: '135 E 57th Street' },
    { name: 'Heizen', domain: 'heizen.com', address: '308 Negra Arroyo Lane' },
  ];

  const companies: any[] = [];
  for (let i = 0; i < 16; i++) {
    const compData = realCompanies[i];
    const company = await prisma.company.upsert({
      where: { id: `comp-${i + 1}` },
      update: {},
      create: {
        id: `comp-${i + 1}`,
        name: compData.name,
        emailDomains: [compData.domain],
        deliveryAddresses: [compData.address],
        billingContact: `billing@${compData.domain}`,
        priceTierId: tiers[i % 3].id,
        defaultDeliveryTime: `12:${(i * 5) % 60 < 10 ? '0' : ''}${(i * 5) % 60}`,
      },
    });
    companies.push(company);
  }

  // 7. Employees (19 variants)
  const realEmployees = [
    { first: 'Alice', last: 'Smith' },
    { first: 'Bob', last: 'Johnson' },
    { first: 'Charlie', last: 'Williams' },
    { first: 'Diana', last: 'Brown' },
    { first: 'Evan', last: 'Jones' },
    { first: 'Fiona', last: 'Garcia' },
    { first: 'George', last: 'Miller' },
    { first: 'Hannah', last: 'Davis' },
    { first: 'Ian', last: 'Rodriguez' },
    { first: 'Julia', last: 'Martinez' },
    { first: 'Kevin', last: 'Hernandez' },
    { first: 'Laura', last: 'Lopez' },
    { first: 'Michael', last: 'Gonzalez' },
    { first: 'Nina', last: 'Wilson' },
    { first: 'Oscar', last: 'Anderson' },
    // Heizen Employees
    { first: 'Walter', last: 'White' },
    { first: 'Jesse', last: 'Pinkman' },
    { first: 'Skyler', last: 'White' },
    { first: 'Saul', last: 'Goodman' },
  ];

  const employees: any[] = [];
  for (let i = 0; i < 19; i++) {
    const empData = realEmployees[i];
    // Map the first 15 employees to the first 15 companies. Map the last 4 employees to Heizen (index 15).
    const compIndex = i < 15 ? i : 15;
    const compData = realCompanies[compIndex];
    const email = `${empData.first.toLowerCase()}.${empData.last.toLowerCase()}@${compData.domain}`;
    const emp = await prisma.employee.upsert({
      where: { email },
      update: {},
      create: {
        firstName: empData.first,
        lastName: empData.last,
        email: email,
        companyId: companies[compIndex].id,
      },
    });
    employees.push(emp);
  }

  // 8. Orders (15 variants - mixed statuses and dates)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const statuses = ['DRAFT', 'PLACED', 'CONFIRMED', 'DELIVERED'];
  const dates = [yesterday, today, today, today, tomorrow];

  for (let i = 1; i <= 15; i++) {
    const emp = employees[i - 1];
    const comp = companies[i - 1];
    const status = statuses[i % statuses.length];
    const delDate = dates[i % dates.length];

    const existing = await prisma.order.findFirst({ where: { employeeId: emp.id, deliveryDate: delDate } });
    if (!existing) {
      const dish = dishes[i - 1];
      await prisma.order.create({
        data: {
          employeeId: emp.id,
          status: status as any,
          deliveryDate: delDate,
          deliveryTime: comp.defaultDeliveryTime,
          deliveryAddress: comp.deliveryAddresses[0],
          packaging: i % 2 === 0 ? 'Premium' : 'Standard',
          totalAmount: 12.0,
          lines: {
            create: [
              { 
                dishId: dish.id, 
                dishQuantity: (i % 3) + 1, 
                dishPrice: 12.0,
                combinations: {
                  create: [
                    { quantity: (i % 3) + 1, totalPrice: 12.0, chosenOptions: [], kitchenStation: dish.kitchenStation }
                  ]
                }
              }
            ]
          }
        }
      });
    }
  }

  console.log('✅ Mass Seeding complete: 15 companies, 15 employees, 15 dishes, 15 tiers, 15 orders.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
