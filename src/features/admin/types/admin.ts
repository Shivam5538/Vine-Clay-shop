export type UserRole = "owner" | "manager" | "staff";

export type OrderStatus = "received" | "preparing" | "ready" | "completed" | "cancelled";

export type OrderType = "dine_in" | "pickup" | "delivery";

export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

export type BookingStatus = "pending" | "confirmed" | "seated" | "completed" | "cancelled" | "no_show";

export type BookingSource = "online" | "phone" | "walk_in";

export type DietaryTag = "vegan" | "vegetarian" | "gluten_free" | "dairy_free" | "nut_free";

export interface WeekdayHours {
  open: string;
  close: string;
  closed?: boolean;
}

export interface WeeklySchedule {
  monday: WeekdayHours;
  tuesday: WeekdayHours;
  wednesday: WeekdayHours;
  thursday: WeekdayHours;
  friday: WeekdayHours;
  saturday: WeekdayHours;
  sunday: WeekdayHours;
}

export interface AdminLocation {
  id: string;
  name: string;
  slug: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  hours: WeeklySchedule;
  capacity: number;
  timezone: string;
  active: boolean;
  createdAt: string;
}

export interface AdminTable {
  id: string;
  locationId: string;
  number: string;
  seatCount: number;
  isOutdoor: boolean;
  active: boolean;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  shape: string;
}

export interface AdminMenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  orderIndex: number;
}

export interface AdminMenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  dietaryTags: DietaryTag[];
  isAvailable: boolean;
  orderIndex: number;
  overrides?: Record<string, { customPrice?: number; isAvailable?: boolean }>;
}

export interface AdminOrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  locationId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: OrderType;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: AdminOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  receivedAt: string;
  preparingAt?: string;
  readyAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}

export interface AdminBooking {
  id: string;
  bookingRef: string;
  locationId: string;
  tableId?: string;
  tableName?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  partySize: number;
  dateTime: string; // ISO string
  durationMinutes: number;
  status: BookingStatus;
  source: BookingSource;
  specialRequests?: string;
  createdAt: string;
}

export interface AdminStaffUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  assignedLocationIds: string[];
  active: boolean;
  createdAt: string;
}

export interface AdminActivityLog {
  id: string;
  userId?: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: "order" | "booking" | "location" | "menu" | "staff" | "message";
  entityId: string;
  details: string;
  timestamp: string;
}

export interface AdminInquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  subject: string;
  message: string;
  unread: boolean;
  receivedAt: string;
  locationId?: string;
}

export interface AdminCustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalBookings: number;
  totalSpent: number;
  lastVisit: string;
  vipStatus?: boolean;
}
