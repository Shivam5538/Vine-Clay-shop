"use client";

import { SmoothScrollProvider } from "@/components/providers/SmoothScroll";
import { Navbar } from "@/components/navigation/Navbar";
import { CartDrawer } from "@/components/navigation/CartDrawer";
import { ReservationModal } from "@/components/navigation/ReservationModal";
import { OrderSuccessModal } from "@/components/navigation/OrderSuccessModal";
import { MobileStickyBar } from "@/components/navigation/MobileStickyBar";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { CoffeePreloader } from "@/components/ui/CoffeePreloader";

import { HeroSection } from "@/features/hero/HeroSection";
import { IngredientMarquee } from "@/features/marquee/IngredientMarquee";
import { SignatureTicker } from "@/features/ticker/SignatureTicker";
import { MenuSection } from "@/features/menu/MenuSection";
import { StorySection } from "@/features/story/StorySection";
import { TestimonialsSection } from "@/features/testimonials/TestimonialsSection";
import { LocationSection } from "@/features/location/LocationSection";
import { FooterSection } from "@/features/footer/FooterSection";
import { SentenceWord } from "@/types";

export default function Home() {
  // Signature Ticker Sentence Data
  const ticker1Sentence: SentenceWord[] = [
    { text: "Slow down", isEmphasis: true, color: "#C1633B" },
    { text: "and", isEmphasis: false },
    { text: "savor", isEmphasis: true, color: "#33241A", svgMark: "cup" },
    { text: "every single drop", isEmphasis: false },
    { text: "roasted", isEmphasis: true, color: "#C1633B", svgMark: "leaf" },
    { text: "with endless", isEmphasis: false },
    { text: "patience.", isEmphasis: true, color: "#6B7548", svgMark: "comma" },
  ];

  const ticker2Sentence: SentenceWord[] = [
    { text: "Built", isEmphasis: true, color: "#33241A" },
    { text: "by hand", isEmphasis: false, svgMark: "comma" },
    { text: "shaped", isEmphasis: true, color: "#C1633B" },
    { text: "from raw earth", isEmphasis: false, svgMark: "squiggle" },
    { text: "warmed", isEmphasis: true, color: "#6B7548" },
    { text: "by an unhurried", isEmphasis: false },
    { text: "community.", isEmphasis: true, color: "#C1633B", svgMark: "star" },
  ];

  const ticker3Sentence: SentenceWord[] = [
    { text: "Visit us today", isEmphasis: true, color: "#C1633B", svgMark: "cup" },
    { text: "take a gentle", isEmphasis: false },
    { text: "moment", isEmphasis: true, color: "#33241A", svgMark: "leaf" },
    { text: "and welcome", isEmphasis: false },
    { text: "home.", isEmphasis: true, color: "#6B7548", svgMark: "comma" },
  ];

  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-[#FBF6EF] text-[#33241A] selection:bg-[#C1633B] selection:text-[#FBF6EF]">
        {/* Artisan Coffee Preloader */}
        <CoffeePreloader />

        {/* Navigation & Modals */}
        <Navbar />
        <CartDrawer />
        <ReservationModal />
        <OrderSuccessModal />
        <MobileStickyBar />
        <ToastContainer />

        <main className="relative">
          {/* 1. Hero Section */}
          <HeroSection />

          {/* 2. Marquee Ingredient Strip */}
          <IngredientMarquee />

          {/* 3. [Signature] Ticker 1: Hero -> Menu */}
          <SignatureTicker id="ticker-1" sentence={ticker1Sentence} />

          {/* 4. Menu / Products Section */}
          <MenuSection />

          {/* 5. [Signature] Ticker 2: Menu -> Story */}
          <SignatureTicker id="ticker-2" sentence={ticker2Sentence} />

          {/* 6. Story / About Section */}
          <StorySection />

          {/* 7. Testimonials Section */}
          <TestimonialsSection />

          {/* 8. Location & Hours Section */}
          <LocationSection />

          {/* 9. [Signature] Ticker 3: Location -> Footer */}
          <SignatureTicker id="ticker-3" sentence={ticker3Sentence} />

          {/* 10. CTA Band & Footer */}
          <FooterSection />
        </main>
      </div>
    </SmoothScrollProvider>
  );
}
