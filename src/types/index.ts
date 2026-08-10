export type MenuCategory = "all" | "coffee" | "tea" | "bakery" | "ceramics" | "gift-cards";

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  formattedPrice: string;
  description: string;
  badge?: string;
  image: string;
  notes?: string;
  inStock?: boolean;
}

export interface CartItem {
  product: MenuItem;
  quantity: number;
  selectedOption?: string;
}

export interface ReservationData {
  name: string;
  email: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  seatingPreference: "main-hall" | "sunlit-patio" | "ceramic-bench";
  specialRequests?: string;
}

export interface SentenceWord {
  text: string;
  isEmphasis?: boolean;
  color?: string; // e.g. '#C1633B' or '#33241A'
  svgMark?: "comma" | "cup" | "squiggle" | "leaf" | "star";
}
