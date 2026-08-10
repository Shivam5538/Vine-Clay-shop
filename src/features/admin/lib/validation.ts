import { z } from "zod";

export const OrderStatusSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  status: z.enum(["received", "preparing", "ready", "completed", "cancelled"]),
  reason: z.string().optional(),
});

export const BookingFormSchema = z.object({
  locationId: z.string().min(1, "Location is required"),
  customerName: z.string().min(2, "Customer name must be at least 2 characters"),
  customerEmail: z.string().email("Valid email required"),
  customerPhone: z.string().min(7, "Valid phone number required"),
  partySize: z.number().int().min(1, "Party size must be at least 1").max(20, "Party size cannot exceed 20"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  tableId: z.string().optional(),
  source: z.enum(["online", "phone", "walk_in"]).default("online"),
  specialRequests: z.string().max(300, "Requests must be under 300 characters").optional(),
});

export const TableFormSchema = z.object({
  locationId: z.string().min(1, "Location is required"),
  number: z.string().min(1, "Table number is required"),
  seatCount: z.number().int().min(1, "Seats must be at least 1"),
  isOutdoor: z.boolean().default(false),
  active: z.boolean().default(true),
});

export const WeekdayHoursSchema = z.object({
  open: z.string().min(1, "Open time required"),
  close: z.string().min(1, "Close time required"),
  closed: z.boolean().optional(),
});

export const LocationFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(2, "Slug is required"),
  address: z.string().min(5, "Full address is required"),
  phone: z.string().min(7, "Phone is required"),
  capacity: z.number().int().min(1, "Capacity required"),
  latitude: z.number(),
  longitude: z.number(),
  active: z.boolean().default(true),
  hours: z.object({
    monday: WeekdayHoursSchema,
    tuesday: WeekdayHoursSchema,
    wednesday: WeekdayHoursSchema,
    thursday: WeekdayHoursSchema,
    friday: WeekdayHoursSchema,
    saturday: WeekdayHoursSchema,
    sunday: WeekdayHoursSchema,
  }),
});

export const MenuItemFormSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description is required"),
  basePrice: z.number().positive("Price must be greater than 0"),
  image: z.string().url("Valid image URL required"),
  dietaryTags: z.array(z.enum(["vegan", "vegetarian", "gluten_free", "dairy_free", "nut_free"])),
  isAvailable: z.boolean().default(true),
});

export const StaffUserFormSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  role: z.enum(["owner", "manager", "staff"]),
  assignedLocationIds: z.array(z.string()).min(1, "Assign at least one location"),
});

export type BookingFormValues = z.infer<typeof BookingFormSchema>;
export type LocationFormValues = z.infer<typeof LocationFormSchema>;
export type MenuItemFormValues = z.infer<typeof MenuItemFormSchema>;
export type StaffUserFormValues = z.infer<typeof StaffUserFormSchema>;
