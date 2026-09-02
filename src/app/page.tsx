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
import { SignatureTicker } from "@/features/ticker/SignatureTicker";
import { MenuSection } from "@/features/menu/MenuSection";
import { CinematicCraftAccordion } from "@/features/interludes/CinematicCraftAccordion";
import { StorySection } from "@/features/story/StorySection";
import { TestimonialsSection } from "@/features/testimonials/TestimonialsSection";
import { LocationSection } from "@/features/location/LocationSection";
import { AmbientStudioConsole } from "@/features/interludes/AmbientStudioConsole";
import { FooterSection } from "@/features/footer/FooterSection";
import { SentenceWord } from "@/types";

export default function Home() {
  // The Signature Motion Ticker Sentence (Featured Once on the Landing Page)
  const signatureTickerSentence: SentenceWord[] = [
    { text: "Slow down", isEmphasis: true, color: "#C1633B" },
    { text: "and", isEmphasis: false },
    { text: "savor", isEmphasis: true, color: "#33241A", svgMark: "cup" },
    { text: "every single drop", isEmphasis: false },
    { text: "roasted", isEmphasis: true, color: "#C1633B", svgMark: "leaf" },
    { text: "with endless", isEmphasis: false },
    { text: "patience.", isEmphasis: true, color: "#6B7548", svgMark: "comma" },
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

          {/* 2. Signature Motion Ticker: Featured Once (Hero -> Menu) */}
          <SignatureTicker id="ticker-signature" sentence={signatureTickerSentence} />

          {/* 3. Menu & Provisions Section */}
          <MenuSection />

          {/* 4. Cool & Modern: The Trinity of Craft (Expanding 3-Panel Cinematic Showcase) */}
          <CinematicCraftAccordion />

          {/* 5. Story / Philosophy Section */}
          <StorySection />

          {/* 6. Testimonials Section */}
          <TestimonialsSection />

          {/* 7. Location & Hours Section */}
          <LocationSection />

          {/* 8. Cool & Modern: The Ambient Studio Console (Audio-Visual Soundscape & Concierge Lock) */}
          <AmbientStudioConsole />

          {/* 9. CTA Band & Footer */}
          <FooterSection />
        </main>
      </div>
    </SmoothScrollProvider>
  );
}
