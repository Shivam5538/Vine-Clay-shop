import { create } from "zustand";
import { formatTime } from "@/lib/format-date";
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
  OrderStatus,
  BookingStatus,
  UserRole,
} from "../types/admin";
import {
  SEED_LOCATIONS,
  SEED_TABLES,
  SEED_CATEGORIES,
  SEED_MENU_ITEMS,
  SEED_ORDERS,
  SEED_BOOKINGS,
  SEED_STAFF_USERS,
  SEED_ACTIVITY_LOGS,
  SEED_CUSTOMERS,
  SEED_INQUIRIES,
} from "../lib/mockData";
import { updateOrderStatusDbAction } from "@/features/admin/actions/orderActions";
import { updateBookingStatusDbAction } from "@/features/admin/actions/bookingActions";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  description?: string;
}

interface AdminState {
  // Global View Controls
  activeLocationId: string; // 'all' or locationId
  currentRole: UserRole;
  globalSearchQuery: string;
  isRealtimeEnabled: boolean;

  // Supabase hydration state
  isLoaded: boolean;

  // Selected Drawer / Modal States
  selectedOrderId: string | null;
  selectedBookingId: string | null;
  selectedCustomerId: string | null;
  isNewBookingOpen: boolean;
  isNewLocationOpen: boolean;
  isNewMenuItemOpen: boolean;
  isInviteStaffOpen: boolean;

  // Data Collections
  locations: AdminLocation[];
  tables: AdminTable[];
  categories: AdminMenuCategory[];
  menuItems: AdminMenuItem[];
  orders: AdminOrder[];
  bookings: AdminBooking[];
  staffUsers: AdminStaffUser[];
  activityLogs: AdminActivityLog[];
  customers: AdminCustomerSummary[];
  inquiries: AdminInquiry[];

  // Toast Stack
  toasts: ToastMessage[];

  // Actions
  setActiveLocationId: (id: string) => void;
  setCurrentRole: (role: UserRole) => void;
  setGlobalSearchQuery: (query: string) => void;
  toggleRealtime: () => void;
  setSelectedOrderId: (id: string | null) => void;
  setSelectedBookingId: (id: string | null) => void;
  setSelectedCustomerId: (id: string | null) => void;
  toggleVipStatus: (customerId: string) => void;
  addCustomer: (customer: Omit<AdminCustomerSummary, "id" | "totalOrders" | "totalBookings" | "totalSpent" | "lastVisit">) => void;
  setNewBookingOpen: (open: boolean) => void;
  setNewLocationOpen: (open: boolean) => void;
  setNewMenuItemOpen: (open: boolean) => void;
  setInviteStaffOpen: (open: boolean) => void;

  // Supabase Hydration
  hydrateFromSupabase: (data: {
    locations?: AdminLocation[];
    tables?: AdminTable[];
    bookings?: AdminBooking[];
    orders?: AdminOrder[];
  }) => void;
  addBookingToStore: (booking: AdminBooking) => void;

  // Data Mutators (Optimistic UI)
  updateOrderStatus: (orderId: string, nextStatus: OrderStatus) => boolean;
  createBooking: (booking: Omit<AdminBooking, "id" | "bookingRef" | "createdAt">) => { success: boolean; message: string };
  updateBookingStatus: (bookingId: string, nextStatus: BookingStatus) => boolean;
  addTable: (table: Omit<AdminTable, "id" | "positionX" | "positionY" | "width" | "height" | "shape">) => void;
  toggleTableActive: (tableId: string) => void;
  updateTableLayout: (updatedTables: Partial<AdminTable>[]) => void;
  toggleMenuItemAvailability: (itemId: string, locationId?: string) => void;
  updateMenuItemPrice: (itemId: string, basePrice: number) => void;
  saveLocation: (location: AdminLocation) => void;
  inviteStaff: (staff: Omit<AdminStaffUser, "id" | "createdAt">) => void;
  updateStaffUser: (userId: string, data: Partial<AdminStaffUser>) => void;
  markInquiryRead: (inquiryId: string) => void;
  
  // Toast & Activity Log Actions
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
  logActivity: (action: string, entityType: AdminActivityLog["entityType"], entityId: string, details: string) => void;

  // Realtime Simulation Trigger
  simulateIncomingOrder: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  activeLocationId: "all",
  currentRole: "owner",
  globalSearchQuery: "",
  isRealtimeEnabled: true,
  isLoaded: false,

  selectedOrderId: null,
  selectedBookingId: null,
  selectedCustomerId: null,
  isNewBookingOpen: false,
  isNewLocationOpen: false,
  isNewMenuItemOpen: false,
  isInviteStaffOpen: false,

  locations: SEED_LOCATIONS,
  tables: SEED_TABLES,
  categories: SEED_CATEGORIES,
  menuItems: SEED_MENU_ITEMS,
  orders: [],
  bookings: [],
  staffUsers: SEED_STAFF_USERS,
  activityLogs: SEED_ACTIVITY_LOGS,
  customers: SEED_CUSTOMERS,
  inquiries: SEED_INQUIRIES,

  toasts: [],

  hydrateFromSupabase: ({ locations, tables, bookings, orders }) => {
    set((state) => {
      // Map of existing modified orders in state
      const existingOrdersMap = new Map(state.orders.map((o) => [o.id, o]));
      
      const mergedOrders = (orders || []).map((dbOrder) => {
        const localOrder = existingOrdersMap.get(dbOrder.id);
        if (localOrder && localOrder.status !== dbOrder.status) {
          // Keep the local status if it was modified in UI
          return { ...dbOrder, status: localOrder.status };
        }
        return dbOrder;
      });

      // Also preserve any simulated/client-only orders not in DB
      const dbOrderIds = new Set((orders || []).map((o) => o.id));
      const clientOnlyOrders = state.orders.filter((o) => !dbOrderIds.has(o.id));

      const finalOrders = clientOnlyOrders.length > 0 ? [...clientOnlyOrders, ...mergedOrders] : mergedOrders;

      // Same for bookings
      const existingBookingsMap = new Map(state.bookings.map((b) => [b.id, b]));
      const mergedBookings = (bookings || []).map((dbBooking) => {
        const localBooking = existingBookingsMap.get(dbBooking.id);
        if (localBooking && localBooking.status !== dbBooking.status) {
          return { ...dbBooking, status: localBooking.status };
        }
        return dbBooking;
      });
      const dbBookingIds = new Set((bookings || []).map((b) => b.id));
      const clientOnlyBookings = state.bookings.filter((b) => !dbBookingIds.has(b.id));

      const finalBookings = clientOnlyBookings.length > 0 ? [...clientOnlyBookings, ...mergedBookings] : mergedBookings;

      return {
        isLoaded: true,
        locations: locations && locations.length > 0 ? locations : state.locations,
        tables: tables && tables.length > 0 ? tables : state.tables,
        bookings: finalBookings.length > 0 ? finalBookings : (bookings ?? state.bookings),
        orders: finalOrders.length > 0 ? finalOrders : (orders ?? state.orders),
        activeLocationId: state.activeLocationId || "all",
      };
    });
  },

  addBookingToStore: (booking) => {
    set((state) => ({
      bookings: [booking, ...state.bookings.filter((b) => b.id !== booking.id)],
    }));
  },

  setActiveLocationId: (id) => set({ activeLocationId: id }),
  setCurrentRole: (role) => {
    set({ currentRole: role });
    get().addToast({
      type: "info",
      title: `Switched Role to ${role.toUpperCase()}`,
      description: `UI permissions now updated for ${role} view.`,
    });
  },
  setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),
  toggleRealtime: () => {
    const nextState = !get().isRealtimeEnabled;
    set({ isRealtimeEnabled: nextState });
    get().addToast({
      type: "info",
      title: nextState ? "Supabase Realtime Sync Enabled" : "Realtime Paused",
      description: nextState ? "Order board listening to channel order_updates." : "Manual refresh required.",
    });
  },

  setSelectedOrderId: (id) => set({ selectedOrderId: id }),
  setSelectedBookingId: (id) => set({ selectedBookingId: id }),
  setSelectedCustomerId: (id) => set({ selectedCustomerId: id }),

  toggleVipStatus: (customerId) => {
    const { customers, logActivity, addToast } = get();
    const updated = customers.map((c) =>
      c.id === customerId ? { ...c, vipStatus: !c.vipStatus } : c
    );
    set({ customers: updated });
    const target = customers.find((c) => c.id === customerId);
    if (target) {
      const nextVip = !target.vipStatus;
      logActivity(
        "Customer VIP Status Changed",
        "staff",
        customerId,
        `${target.name} set to ${nextVip ? "VIP Patron" : "Standard Guest"}`
      );
      addToast({
        type: "success",
        title: target.name,
        description: nextVip ? "Upgraded to VIP Patron Status" : "Demoted to Standard Guest Status",
      });
    }
  },

  addCustomer: (customerData) => {
    const { customers, addToast, logActivity } = get();
    const newCustomer: AdminCustomerSummary = {
      ...customerData,
      id: `cust-${Date.now()}`,
      totalOrders: 0,
      totalBookings: 0,
      totalSpent: 0,
      lastVisit: "Just Now",
      vipStatus: customerData.vipStatus || false,
    };
    set({ customers: [newCustomer, ...customers] });
    logActivity("New Customer Profile Created", "staff", newCustomer.id, `Added guest profile for ${newCustomer.name}`);
    addToast({
      type: "success",
      title: "Guest Profile Created",
      description: `${newCustomer.name} (${newCustomer.email})`,
    });
  },
  setNewBookingOpen: (open) => set({ isNewBookingOpen: open }),
  setNewLocationOpen: (open) => set({ isNewLocationOpen: open }),
  setNewMenuItemOpen: (open) => set({ isNewMenuItemOpen: open }),
  setInviteStaffOpen: (open) => set({ isInviteStaffOpen: open }),

  // Order Status Update with Optimistic UI & Activity Trail
  updateOrderStatus: (orderId, nextStatus) => {
    const { orders, currentRole, logActivity, addToast } = get();
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return false;

    const previousStatus = targetOrder.status;

    // Optimistic Update
    const updatedOrders = orders.map((ord) => {
      if (ord.id !== orderId) return ord;
      const nowIso = new Date().toISOString();
      const updated: AdminOrder = { ...ord, status: nextStatus };
      if (nextStatus === "preparing") updated.preparingAt = nowIso;
      if (nextStatus === "ready") updated.readyAt = nowIso;
      if (nextStatus === "completed") updated.completedAt = nowIso;
      if (nextStatus === "cancelled") updated.cancelledAt = nowIso;
      return updated;
    });

    set({ orders: updatedOrders });

    // Persist to database asynchronously
    updateOrderStatusDbAction(orderId, nextStatus);

    logActivity(
      `Order Status Changed (${previousStatus} → ${nextStatus})`,
      "order",
      orderId,
      `Order ${targetOrder.orderNumber} status changed to ${nextStatus.toUpperCase()}`
    );

    addToast({
      type: "success",
      title: `Order ${targetOrder.orderNumber} ${nextStatus.toUpperCase()}`,
      description: `Customer: ${targetOrder.customerName}`,
    });

    return true;
  },

  createBooking: (newBookingData) => {
    const { bookings, tables, logActivity, addToast } = get();

    // Double Booking Collision Check
    const targetTime = new Date(newBookingData.dateTime).getTime();
    const existingCollision = bookings.find((b) => {
      if (b.status === "cancelled" || b.status === "no_show") return false;
      if (b.locationId !== newBookingData.locationId) return false;
      if (newBookingData.tableId && b.tableId === newBookingData.tableId) {
        const bTime = new Date(b.dateTime).getTime();
        // 90 min window collision
        return Math.abs(bTime - targetTime) < 90 * 60 * 1000;
      }
      return false;
    });

    if (existingCollision) {
      addToast({
        type: "error",
        title: "Table Collision Error",
        description: `Selected table is reserved by ${existingCollision.customerName} for this time slot.`,
      });
      return { success: false, message: "Table collision detected." };
    }

    const assignedTable = tables.find((t) => t.id === newBookingData.tableId);
    const newBooking: AdminBooking = {
      ...newBookingData,
      id: `bk-${Date.now()}`,
      bookingRef: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      tableName: assignedTable ? assignedTable.number : "Auto-Assigned",
      createdAt: new Date().toISOString(),
    };

    set({ bookings: [newBooking, ...bookings], isNewBookingOpen: false });

    logActivity(
      "New Booking Created",
      "booking",
      newBooking.id,
      `Reservation ${newBooking.bookingRef} for ${newBooking.customerName} (${newBooking.partySize} guests)`
    );

    addToast({
      type: "success",
      title: `Booking Confirmed #${newBooking.bookingRef}`,
      description: `${newBooking.customerName} on ${formatTime(newBooking.dateTime)}`,
    });

    return { success: true, message: "Booking confirmed successfully." };
  },

  updateBookingStatus: (bookingId, nextStatus) => {
    const { bookings, logActivity, addToast } = get();
    const updatedBookings = bookings.map((b) => (b.id === bookingId ? { ...b, status: nextStatus } : b));
    set({ bookings: updatedBookings });

    // Persist to database asynchronously
    updateBookingStatusDbAction(bookingId, nextStatus);

    const target = bookings.find((b) => b.id === bookingId);
    if (target) {
      logActivity(
        `Booking Status Updated to ${nextStatus}`,
        "booking",
        bookingId,
        `Booking ${target.bookingRef} set to ${nextStatus}`
      );
      addToast({
        type: "info",
        title: `Booking ${target.bookingRef}`,
        description: `Status changed to ${nextStatus.toUpperCase()}`,
      });
    }
  },

  toggleTableActive: (tableId) => {
    const { tables, addToast } = get();
    const updated = tables.map((t) => (t.id === tableId ? { ...t, active: !t.active } : t));
    set({ tables: updated });
    const target = tables.find((t) => t.id === tableId);
    if (target) {
      addToast({
        type: "warning",
        title: `Table ${target.number}`,
        description: target.active ? "Marked Out of Service" : "Restored to Service",
      });
    }
  },

  updateTableLayout: (updatedTables) => {
    const { tables } = get();
    const tableMap = new Map(updatedTables.map((t) => [t.id, t]));
    const newTables = tables.map((t) => {
      const update = tableMap.get(t.id);
      if (update) {
        return { ...t, ...update };
      }
      return t;
    });
    set({ tables: newTables });
  },

  addTable: (newTableData) => {
    const { tables, addToast } = get();
    const newTable: AdminTable = {
      ...newTableData,
      id: `tbl-${Date.now()}`,
      positionX: 50, // Default to center
      positionY: 50,
      width: 80,
      height: 80,
      shape: "rectangle",
    };
    set({ tables: [...tables, newTable] });
    addToast({
      type: "success",
      title: `Table ${newTable.number} Created`,
      description: `Seats: ${newTable.seatCount} (${newTable.isOutdoor ? "Outdoor" : "Indoor"})`,
    });
  },

  toggleMenuItemAvailability: (itemId) => {
    const { menuItems, addToast, logActivity } = get();
    const updated = menuItems.map((item) =>
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    );
    set({ menuItems: updated });
    const target = menuItems.find((i) => i.id === itemId);
    if (target) {
      logActivity(
        "Menu Availability Toggled",
        "menu",
        itemId,
        `${target.name} set to ${!target.isAvailable ? "Available" : "Sold Out"}`
      );
      addToast({
        type: "info",
        title: target.name,
        description: !target.isAvailable ? "Item Marked Available" : "Item Marked Sold Out",
      });
    }
  },

  updateMenuItemPrice: (itemId, newPrice) => {
    const { menuItems, addToast, logActivity } = get();
    const updated = menuItems.map((item) =>
      item.id === itemId ? { ...item, basePrice: newPrice } : item
    );
    set({ menuItems: updated });
    const target = menuItems.find((i) => i.id === itemId);
    if (target) {
      logActivity(
        "Menu Price Updated",
        "menu",
        itemId,
        `${target.name} price updated to $${newPrice.toFixed(2)}`
      );
      addToast({
        type: "success",
        title: `Price Updated: ${target.name}`,
        description: `New price: $${newPrice.toFixed(2)}`,
      });
    }
  },

  saveLocation: (locationData) => {
    const { locations, addToast, logActivity } = get();
    const exists = locations.find((l) => l.id === locationData.id);
    let updatedLocations: AdminLocation[];
    if (exists) {
      updatedLocations = locations.map((l) => (l.id === locationData.id ? locationData : l));
    } else {
      updatedLocations = [...locations, locationData];
    }
    set({ locations: updatedLocations, isNewLocationOpen: false });
    logActivity(
      exists ? "Location Updated" : "New Location Added",
      "location",
      locationData.id,
      `${locationData.name} saved`
    );
    addToast({
      type: "success",
      title: "Location Saved",
      description: locationData.name,
    });
  },

  inviteStaff: (staffData) => {
    const { staffUsers, addToast, logActivity } = get();
    const newStaff: AdminStaffUser = {
      ...staffData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set({ staffUsers: [...staffUsers, newStaff], isInviteStaffOpen: false });
    logActivity("Staff Invited", "staff", newStaff.id, `Invited ${newStaff.email} as ${newStaff.role}`);
    addToast({
      type: "success",
      title: `Invitation Sent`,
      description: `Sent to ${newStaff.email} (${newStaff.role.toUpperCase()})`,
    });
  },

  markInquiryRead: (inquiryId) => {
    const { inquiries } = get();
    set({
      inquiries: inquiries.map((inq) => (inq.id === inquiryId ? { ...inq, unread: false } : inq)),
    });
  },

  addToast: (toastData) => {
    const toast: ToastMessage = { ...toastData, id: `toast-${Date.now()}-${Math.random()}` };
    set((state) => ({ toasts: [...state.toasts, toast] }));
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      get().removeToast(toast.id);
    }, 4000);
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  logActivity: (action, entityType, entityId, details) => {
    const { currentRole, activityLogs } = get();
    const newLog: AdminActivityLog = {
      id: `log-${Date.now()}`,
      userName: currentRole === "owner" ? "Julian Archer" : currentRole === "manager" ? "Hannah Sterling" : "Liam O'Connor",
      userRole: currentRole,
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString(),
    };
    set({ activityLogs: [newLog, ...activityLogs] });
  },

  simulateIncomingOrder: () => {
    const { orders, activeLocationId, menuItems, addToast, logActivity } = get();
    const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)];
    const names = ["Claire Dupont", "Noah Bennett", "Amara Patel", "Jackson Reed", "Hanna Lindqvist"];
    const name = names[Math.floor(Math.random() * names.length)];
    const orderNum = `VC-${Math.floor(9400 + Math.random() * 500)}`;

    const newOrder: AdminOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      locationId: activeLocationId === "all" ? "loc-downtown" : activeLocationId,
      customerName: name,
      customerPhone: "(555) 019-9941",
      customerEmail: `${name.toLowerCase().replace(" ", ".")}@example.com`,
      orderType: Math.random() > 0.5 ? "pickup" : "dine_in",
      status: "received",
      paymentStatus: "paid",
      subtotal: randomItem.basePrice,
      tax: randomItem.basePrice * 0.08875,
      total: randomItem.basePrice * 1.08875,
      notes: "Realtime dispatch test.",
      receivedAt: new Date().toISOString(),
      items: [
        {
          id: `oi-${Date.now()}`,
          menuItemId: randomItem.id,
          name: randomItem.name,
          quantity: 1,
          unitPrice: randomItem.basePrice,
          totalPrice: randomItem.basePrice,
        },
      ],
    };

    set({ orders: [newOrder, ...orders] });

    logActivity(
      "Incoming Order Received (Supabase Realtime)",
      "order",
      newOrder.id,
      `New live order ${orderNum} received from ${name}`
    );

    addToast({
      type: "info",
      title: `⚡ Live Order Received: ${orderNum}`,
      description: `${name} ordered ${randomItem.name}`,
    });
  },
}));
