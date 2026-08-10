import {
  AdminLocation,
  AdminTable,
  AdminMenuCategory,
  AdminMenuItem,
  AdminOrder,
  AdminBooking,
  AdminStaffUser,
  AdminActivityLog,
  AdminCustomerSummary,
  AdminInquiry,
} from "../types/admin";

export const SEED_LOCATIONS: AdminLocation[] = [
  {
    id: "loc-downtown",
    name: "Vine & Clay — Flagship Ceramic Studio & Cafe",
    slug: "downtown-flagship",
    address: "412 Mercantile Way, Soho Quarter, NY 10012",
    latitude: 40.7241,
    longitude: -73.9982,
    phone: "(212) 555-0182",
    hours: {
      monday: { open: "07:00", close: "18:00" },
      tuesday: { open: "07:00", close: "18:00" },
      wednesday: { open: "07:00", close: "18:00" },
      thursday: { open: "07:00", close: "19:00" },
      friday: { open: "07:00", close: "20:00" },
      saturday: { open: "08:00", close: "20:00" },
      sunday: { open: "08:00", close: "18:00" },
    },
    capacity: 48,
    timezone: "America/New_York",
    active: true,
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "loc-brooklyn",
    name: "Vine & Clay — Brooklyn Kiln Room",
    slug: "brooklyn-kiln",
    address: "88 Wythe Avenue, Williamsburg, NY 11249",
    latitude: 40.7208,
    longitude: -73.9575,
    phone: "(718) 555-0941",
    hours: {
      monday: { open: "07:30", close: "17:30" },
      tuesday: { open: "07:30", close: "17:30" },
      wednesday: { open: "07:30", close: "17:30" },
      thursday: { open: "07:30", close: "18:30" },
      friday: { open: "07:30", close: "19:30" },
      saturday: { open: "08:30", close: "19:30" },
      sunday: { open: "08:30", close: "17:30" },
    },
    capacity: 32,
    timezone: "America/New_York",
    active: true,
    createdAt: "2024-06-01T08:00:00Z",
  },
];

export const SEED_TABLES: AdminTable[] = [
  { id: "tbl-1", locationId: "loc-downtown", number: "T-01", seatCount: 2, isOutdoor: false, active: true, positionX: 10, positionY: 20, width: 60, height: 60, shape: "circle" },
  { id: "tbl-2", locationId: "loc-downtown", number: "T-02", seatCount: 2, isOutdoor: false, active: true, positionX: 10, positionY: 45, width: 60, height: 60, shape: "circle" },
  { id: "tbl-3", locationId: "loc-downtown", number: "T-03", seatCount: 4, isOutdoor: false, active: true, positionX: 30, positionY: 20, width: 80, height: 80, shape: "rectangle" },
  { id: "tbl-4", locationId: "loc-downtown", number: "T-04", seatCount: 4, isOutdoor: false, active: true, positionX: 30, positionY: 45, width: 80, height: 80, shape: "rectangle" },
  { id: "tbl-5", locationId: "loc-downtown", number: "T-05", seatCount: 6, isOutdoor: false, active: true, positionX: 55, positionY: 30, width: 120, height: 80, shape: "rectangle" },
  { id: "tbl-p1", locationId: "loc-downtown", number: "P-01 (Patio)", seatCount: 4, isOutdoor: true, active: true, positionX: 80, positionY: 60, width: 80, height: 80, shape: "rectangle" },
  { id: "tbl-p2", locationId: "loc-downtown", number: "P-02 (Patio)", seatCount: 2, isOutdoor: true, active: true, positionX: 80, positionY: 80, width: 60, height: 60, shape: "circle" },
  { id: "tbl-b1", locationId: "loc-downtown", number: "B-01 (Bench)", seatCount: 2, isOutdoor: false, active: true, positionX: 50, positionY: 80, width: 100, height: 40, shape: "pill" },
  
  { id: "tbl-bk1", locationId: "loc-brooklyn", number: "K-01", seatCount: 2, isOutdoor: false, active: true, positionX: 20, positionY: 30, width: 60, height: 60, shape: "circle" },
  { id: "tbl-bk2", locationId: "loc-brooklyn", number: "K-02", seatCount: 4, isOutdoor: false, active: true, positionX: 40, positionY: 30, width: 80, height: 80, shape: "rectangle" },
  { id: "tbl-bk3", locationId: "loc-brooklyn", number: "K-03", seatCount: 6, isOutdoor: false, active: true, positionX: 60, positionY: 30, width: 120, height: 80, shape: "rectangle" },
];

export const SEED_CATEGORIES: AdminMenuCategory[] = [
  { id: "cat-coffee", name: "Craft Pourovers & Espresso", slug: "coffee", description: "Single-origin roasts extracted on stoneware drip cones.", orderIndex: 1 },
  { id: "cat-tea", name: "Matcha & Botanical Teas", slug: "tea", description: "Ceremonial grade Uji matcha whisked to order.", orderIndex: 2 },
  { id: "cat-bakery", name: "Artisanal Bakery", slug: "bakery", description: "Slow-fermented sourdough pastries & cakes.", orderIndex: 3 },
  { id: "cat-ceramics", name: "Handmade Stoneware", slug: "ceramics", description: "Fired in our studio kiln, dishwasher safe.", orderIndex: 4 },
];

export const SEED_MENU_ITEMS: AdminMenuItem[] = [
  {
    id: "item-1",
    categoryId: "cat-coffee",
    name: "Ethiopia Yirgacheffe Pourover",
    description: "Notes of jasmine blossom, bergamot tea, and meyer lemon peel. Served in hand-thrown terracotta cup.",
    basePrice: 6.5,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
    dietaryTags: ["vegan"],
    isAvailable: true,
    orderIndex: 1,
  },
  {
    id: "item-2",
    categoryId: "cat-coffee",
    name: "Smoked Honey & Oat Latte",
    description: "Double espresso with artisanal smoked wildflower honey and steamed barista oat milk.",
    basePrice: 7.25,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop",
    dietaryTags: ["vegetarian", "dairy_free"],
    isAvailable: true,
    orderIndex: 2,
  },
  {
    id: "item-3",
    categoryId: "cat-tea",
    name: "Uji Ceremonial Cloud Matcha",
    description: "Stoneground Kyoto matcha whisked with filtered alkaline water and sweet oat cream foam.",
    basePrice: 8.0,
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800&auto=format&fit=crop",
    dietaryTags: ["vegan", "dairy_free"],
    isAvailable: true,
    orderIndex: 3,
  },
  {
    id: "item-4",
    categoryId: "cat-bakery",
    name: "Cardamom & Pistachio Braid",
    description: "Slow-fermented brioche dough filled with crushed green cardamom, pistachio praline, and organic cane sugar.",
    basePrice: 5.75,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop",
    dietaryTags: ["vegetarian", "nut_free"],
    isAvailable: true,
    orderIndex: 4,
  },
  {
    id: "item-5",
    categoryId: "cat-bakery",
    name: "Wild Rosemary Sourdough Tart",
    description: "Earthy thyme, caramelized red onion, and goat milk chevre on a stone-baked sourdough crust.",
    basePrice: 8.5,
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=800&auto=format&fit=crop",
    dietaryTags: ["vegetarian"],
    isAvailable: true,
    orderIndex: 5,
  },
  {
    id: "item-6",
    categoryId: "cat-ceramics",
    name: "Ribbed Terracotta Mug (350ml)",
    description: "Wheel-thrown speckled clay body with raw exterior texture and white tin glaze interior.",
    basePrice: 34.0,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
    dietaryTags: [],
    isAvailable: true,
    orderIndex: 6,
  },
];

export const SEED_ORDERS: AdminOrder[] = [];

export const SEED_BOOKINGS: AdminBooking[] = [];

export const SEED_STAFF_USERS: AdminStaffUser[] = [
  {
    id: "usr-owner",
    name: "Shivam",
    email: "shivam@vineandclay.com",
    role: "owner",
    assignedLocationIds: ["loc-downtown", "loc-brooklyn"],
    active: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "usr-mgr-soho",
    name: "Hannah Sterling",
    email: "hannah.s@vineandclay.com",
    role: "manager",
    assignedLocationIds: ["loc-downtown"],
    active: true,
    createdAt: "2024-02-15T00:00:00Z",
  },
  {
    id: "usr-staff-1",
    name: "Liam O'Connor",
    email: "liam.o@vineandclay.com",
    role: "staff",
    assignedLocationIds: ["loc-downtown"],
    active: true,
    createdAt: "2024-04-10T00:00:00Z",
  },
];

export const SEED_ACTIVITY_LOGS: AdminActivityLog[] = [];

export const SEED_CUSTOMERS: AdminCustomerSummary[] = [];

export const SEED_INQUIRIES: AdminInquiry[] = [];
