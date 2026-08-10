"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SteamAnimation } from "@/components/ui/SteamAnimation";
import { useCartStore } from "@/store/useCartStore";
import { ArrowDown, Coffee } from "lucide-react";

export function HeroSection() {
  const { openReservation } = useCartStore();
  const headlineRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Masked line-by-line reveal for headline (~120ms stagger)
    const ctx = gsap.context(() => {
      const lines = headlineRef.current?.querySelectorAll(".line-mask");
      if (lines && lines.length > 0) {
        gsap.fromTo(
          lines,
          { y: "110%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 1.1,
            stagger: 0.12,
            ease: "power3.out",
            delay: 0.2,
          }
        );
      }

      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.08, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.4, ease: "power2.out", delay: 0.4 }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-screen bg-[#FBF6EF] pt-28 pb-16 px-6 md:px-12 flex flex-col justify-between overflow-hidden">
      {/* Background Subtle Clay Texture Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0,200 Q 400,100 800,300 T 1600,200" fill="none" stroke="#D9BFA0" strokeWidth="1" />
          <path d="M 0,600 Q 600,500 1200,700 T 2400,600" fill="none" stroke="#D9BFA0" strokeWidth="1" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center my-auto">
        {/* Left Column: Headline & CTAs */}
        <div className="lg:col-span-7 space-y-8 z-10">
          {/* Subheading Badge with Looping Steam SVG */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#33241A]/5 border border-[#33241A]/10 text-xs font-mono text-[#33241A]">
            <SteamAnimation color="#C1633B" className="scale-75" />
            <span className="uppercase tracking-widest text-[#33241A]/80 font-medium">
              Unhurried Cafe & Studio
            </span>
          </div>

          {/* Masked Line-by-Line Headline */}
          <div ref={headlineRef} className="space-y-1 font-fraunces text-4xl sm:text-6xl lg:text-7xl font-light text-[#33241A] tracking-tight leading-[1.08]">
            <div className="overflow-hidden py-1">
              <div className="line-mask">Where time slows down,</div>
            </div>
            <div className="overflow-hidden py-1">
              <div className="line-mask flex items-center flex-wrap gap-x-3">
                <span>and coffee is</span>
                <span className="italic text-[#C1633B] font-normal">shaped by clay.</span>
              </div>
            </div>
            <div className="overflow-hidden py-1">
              <div className="line-mask text-2xl sm:text-4xl text-[#33241A]/60 font-sans font-light mt-2">
                Single-origin roasts & handcrafted stoneware for unhurried souls.
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            {/* Magnetic CTA Button */}
            <MagneticButton variant="terracotta" onClick={openReservation} className="shadow-lg">
              <span className="flex items-center gap-2">
                <span>Book a Table</span>
                <Coffee className="w-4 h-4" />
              </span>
            </MagneticButton>

            <a
              href="#menu"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#33241A]/20 text-[#33241A] hover:bg-[#33241A] hover:text-[#FBF6EF] text-sm font-medium transition-all duration-300"
            >
              Explore Menu
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="pt-8 border-t border-[#D9BFA0]/40 grid grid-cols-3 gap-6 font-mono text-xs text-[#33241A]/70">
            <div>
              <p className="text-xl md:text-2xl font-fraunces text-[#33241A] font-semibold">100%</p>
              <p className="mt-0.5 text-[#33241A]/60">Ethical Direct Trade</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-fraunces text-[#C1633B] font-semibold">Slow</p>
              <p className="mt-0.5 text-[#33241A]/60">Fermented Pastries</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-fraunces text-[#6B7548] font-semibold">Studio</p>
              <p className="mt-0.5 text-[#33241A]/60">Hand-Thrown Pottery</p>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Warm Photography */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div
            ref={imageRef}
            className="relative w-full aspect-[4/5] max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FBF6EF] ring-1 ring-[#D9BFA0]/40 group"
          >
            <Image
              src="/images/hero_cafe.png"
              alt="Pour-over coffee in handmade terracotta ceramic mug"
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle Overlay & Floating Ceramic Stamp */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#33241A]/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#FBF6EF]/90 backdrop-blur-md border border-[#D9BFA0]/50 flex items-center justify-between text-xs">
              <div>
                <p className="font-fraunces font-medium text-[#33241A] text-sm">Morning Pourover Ritual</p>
                <p className="font-mono text-[#C1633B]">Ethiopia Yirgacheffe • 92°C</p>
              </div>
              <span className="w-8 h-8 rounded-full bg-[#C1633B] text-[#FBF6EF] flex items-center justify-center font-mono font-bold text-xs">
                VC
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="flex justify-center pt-8">
        <a
          href="#ingredient-strip"
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#33241A]/50 hover:text-[#C1633B] transition-colors"
        >
          <span>Scroll to Savor</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#C1633B]" />
        </a>
      </div>
    </section>
  );
}
