import {
  ClipboardList,
  CalendarDays,
  UtensilsCrossed,
  MapPin,
  MessageSquare,
  Settings,
  Users,
  LucideIcon,
} from "lucide-react";

export type AdminModuleType =
  | "orders"
  | "bookings"
  | "menu"
  | "locations"
  | "messages"
  | "settings"
  | "customers";

export interface ModuleColorConfig {
  name: string;
  module: AdminModuleType;
  primaryHex: string; // Used for inline styling or custom badges if needed
  bgSolid: string; // Tailwind class for solid background on icon badges
  bgLight: string; // Tailwind class for light wash backgrounds
  borderLight: string; // Tailwind class for light borders
  text: string; // Tailwind class for colored text
  icon: LucideIcon;
}

export const MODULE_COLORS: Record<AdminModuleType, ModuleColorConfig> = {
  orders: {
    name: "Orders",
    module: "orders",
    primaryHex: "#2563EB",
    bgSolid: "bg-blue-600",
    bgLight: "bg-blue-50/80",
    borderLight: "border-blue-100",
    text: "text-blue-600",
    icon: ClipboardList,
  },
  bookings: {
    name: "Bookings",
    module: "bookings",
    primaryHex: "#9333EA",
    bgSolid: "bg-purple-600",
    bgLight: "bg-purple-50/80",
    borderLight: "border-purple-100",
    text: "text-purple-600",
    icon: CalendarDays,
  },
  menu: {
    name: "Menu",
    module: "menu",
    primaryHex: "#F97316",
    bgSolid: "bg-orange-500",
    bgLight: "bg-orange-50/80",
    borderLight: "border-orange-100",
    text: "text-orange-500",
    icon: UtensilsCrossed,
  },
  locations: {
    name: "Locations",
    module: "locations",
    primaryHex: "#0D9488",
    bgSolid: "bg-teal-600",
    bgLight: "bg-teal-50/80",
    borderLight: "border-teal-100",
    text: "text-teal-600",
    icon: MapPin,
  },
  messages: {
    name: "Messages",
    module: "messages",
    primaryHex: "#10B981",
    bgSolid: "bg-emerald-500",
    bgLight: "bg-emerald-50/80",
    borderLight: "border-emerald-100",
    text: "text-emerald-600",
    icon: MessageSquare,
  },
  customers: {
    name: "Customers",
    module: "customers",
    primaryHex: "#0284C7",
    bgSolid: "bg-sky-600",
    bgLight: "bg-sky-50/80",
    borderLight: "border-sky-100",
    text: "text-sky-600",
    icon: Users,
  },
  settings: {
    name: "Settings",
    module: "settings",
    primaryHex: "#475569",
    bgSolid: "bg-slate-600",
    bgLight: "bg-slate-100/80",
    borderLight: "border-slate-200",
    text: "text-slate-600",
    icon: Settings,
  },
};

export function getModuleColor(module: AdminModuleType): ModuleColorConfig {
  return MODULE_COLORS[module] || MODULE_COLORS.settings;
}
