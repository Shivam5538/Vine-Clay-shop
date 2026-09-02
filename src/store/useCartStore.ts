import { create } from "zustand";
import { CartItem, MenuItem, ReservationData, PlacedOrderSummary } from "../types";

interface Toast {
  id: string;
  message: string;
  type?: "success" | "info";
}

interface CartStore {
  // Cart state
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: MenuItem, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;

  // Reservation state
  isReservationOpen: boolean;
  openReservation: () => void;
  closeReservation: () => void;
  lastReservation: ReservationData | null;
  setLastReservation: (data: ReservationData) => void;

  // Order Success Popup state
  lastPlacedOrder: PlacedOrderSummary | null;
  isOrderSuccessOpen: boolean;
  openOrderSuccess: (order: PlacedOrderSummary) => void;
  closeOrderSuccess: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: "success" | "info") => void;
  removeToast: (id: string) => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existingIndex = state.items.findIndex((i) => i.product.id === product.id);
      let updatedItems: CartItem[];

      if (existingIndex > -1) {
        updatedItems = [...state.items];
        updatedItems[existingIndex].quantity += quantity;
      } else {
        updatedItems = [...state.items, { product, quantity }];
      }

      return { items: updatedItems };
    });

    get().addToast(`Added "${product.name}" to your order.`, "success");
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) => (i.product.id === productId ? { ...i, quantity } : i)),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotalItems: () => {
    return get().items.reduce((acc, item) => acc + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  },

  // Reservation
  isReservationOpen: false,
  openReservation: () => set({ isReservationOpen: true }),
  closeReservation: () => set({ isReservationOpen: false }),
  lastReservation: null,
  setLastReservation: (data) => set({ lastReservation: data }),

  // Order Success Modal
  lastPlacedOrder: null,
  isOrderSuccessOpen: false,
  openOrderSuccess: (order) => set({ lastPlacedOrder: order, isOrderSuccessOpen: true }),
  closeOrderSuccess: () => set({ isOrderSuccessOpen: false }),

  // Toasts
  toasts: [],
  addToast: (message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
