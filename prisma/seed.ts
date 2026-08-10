import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Vine & Clay database...");

  // 1. Create Flagship Location
  const location = await prisma.location.upsert({
    where: { slug: "downtown-flagship" },
    update: {},
    create: {
      name: "Vine & Clay — Flagship Ceramic Studio & Cafe",
      slug: "downtown-flagship",
      address: "412 Mercantile Way, Soho Quarter, NY 10012",
      latitude: 40.7241,
      longitude: -73.9982,
      phone: "(212) 555-0182",
      capacity: 48,
      timezone: "America/New_York",
      active: true,
      hours: {
        monday: { open: "07:00", close: "18:00" },
        tuesday: { open: "07:00", close: "18:00" },
        wednesday: { open: "07:00", close: "18:00" },
        thursday: { open: "07:00", close: "19:00" },
        friday: { open: "07:00", close: "20:00" },
        saturday: { open: "08:00", close: "20:00" },
        sunday: { open: "08:00", close: "18:00" },
      },
    },
  });

  console.log(`📍 Created location: ${location.name}`);

  // 2. Create Tables
  const tableData = [
    { number: "T-01", seatCount: 2, isOutdoor: false },
    { number: "T-02", seatCount: 2, isOutdoor: false },
    { number: "T-03", seatCount: 4, isOutdoor: false },
    { number: "T-04", seatCount: 4, isOutdoor: false },
    { number: "P-01 (Patio)", seatCount: 4, isOutdoor: true },
    { number: "B-01 (Bench)", seatCount: 2, isOutdoor: false },
  ];

  for (const t of tableData) {
    await prisma.table.upsert({
      where: {
        locationId_number: { locationId: location.id, number: t.number },
      },
      update: {},
      create: {
        locationId: location.id,
        number: t.number,
        seatCount: t.seatCount,
        isOutdoor: t.isOutdoor,
        active: true,
      },
    });
  }

  console.log(`🪑 Created ${tableData.length} tables for ${location.name}`);

  // 3. Create Categories & Menu Items
  const coffeeCat = await prisma.menuCategory.upsert({
    where: { slug: "coffee" },
    update: {},
    create: {
      name: "Craft Pourovers & Espresso",
      slug: "coffee",
      description: "Single-origin roasts extracted on stoneware drip cones.",
      orderIndex: 1,
    },
  });

  const bakeryCat = await prisma.menuCategory.upsert({
    where: { slug: "bakery" },
    update: {},
    create: {
      name: "Artisanal Bakery",
      slug: "bakery",
      description: "Slow-fermented sourdough pastries & cakes.",
      orderIndex: 2,
    },
  });

  const ceramicCat = await prisma.menuCategory.upsert({
    where: { slug: "ceramics" },
    update: {},
    create: {
      name: "Handmade Stoneware",
      slug: "ceramics",
      description: "Fired in our studio kiln, dishwasher safe.",
      orderIndex: 3,
    },
  });

  await prisma.menuItem.createMany({
    skipDuplicates: true,
    data: [
      {
        categoryId: coffeeCat.id,
        name: "Ethiopia Yirgacheffe Pourover",
        description: "Notes of jasmine blossom, bergamot tea, and meyer lemon peel.",
        basePrice: 6.5,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
        dietaryTags: ["vegan"],
        isAvailable: true,
        orderIndex: 1,
      },
      {
        categoryId: bakeryCat.id,
        name: "Cardamom & Pistachio Braid",
        description: "Slow-fermented brioche filled with green cardamom praline.",
        basePrice: 5.75,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop",
        dietaryTags: ["vegetarian"],
        isAvailable: true,
        orderIndex: 2,
      },
      {
        categoryId: ceramicCat.id,
        name: "Ribbed Terracotta Mug (350ml)",
        description: "Wheel-thrown speckled clay body with raw exterior texture.",
        basePrice: 34.0,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
        dietaryTags: [],
        isAvailable: true,
        orderIndex: 3,
      },
    ],
  });

  console.log("☕ Created menu categories and initial catalog items.");

  // 4. Create Initial Owner Staff User
  const ownerUser = await prisma.staffUser.upsert({
    where: { email: "julian@vineandclay.com" },
    update: {},
    create: {
      name: "Julian Archer",
      email: "julian@vineandclay.com",
      role: "owner",
      active: true,
      locations: {
        create: {
          locationId: location.id,
        },
      },
    },
  });

  console.log(`👤 Created owner staff user: ${ownerUser.email}`);
  console.log("✅ Database seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
