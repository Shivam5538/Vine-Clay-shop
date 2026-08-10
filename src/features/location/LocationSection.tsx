"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Clock, Navigation, Calendar, Phone, Mail } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function LocationSection() {
  const { openReservation } = useCartStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapMarkerRef = useRef<HTMLDivElement>(null);
  const hoursTableRef = useRef<HTMLDivElement>(null);

  const hours = [
    { day: "Monday – Thursday", time: "07:30 AM – 06:00 PM", notes: "Pourover & Studio Open" },
    { day: "Friday", time: "07:30 AM – 08:00 PM", notes: "Evening Ceramic & Wine Hour" },
    { day: "Saturday", time: "08:00 AM – 08:00 PM", notes: "Fresh Pastry Bake @ 8AM" },
    { day: "Sunday", time: "08:30 AM – 05:00 PM", notes: "Acoustic Unhurried Hours" },
  ];

  useEffect(() => {
    const container = containerRef.current;
    const marker = mapMarkerRef.current;
    const table = hoursTableRef.current;

    if (!container) return;

    let ctx = gsap.context(() => {
      // Map marker pin-drop bounce animation on first view (ease: back.out)
      if (marker) {
        gsap.fromTo(
          marker,
          { y: -60, opacity: 0, scale: 0.5 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: marker,
              start: "top 80%",
            },
          }
        );
      }

      // Mono hours table rows stagger top-to-bottom (~80ms stagger)
      if (table) {
        const rows = table.querySelectorAll(".hours-row");
        gsap.fromTo(
          rows,
          { opacity: 0, x: -16 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: table,
              start: "top 85%",
            },
          }
        );
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="location"
      ref={containerRef}
      className="py-24 px-6 md:px-12 bg-[#FBF6EF] border-b border-[#D9BFA0]/30"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C1633B]">
            Visit Our Space
          </span>
          <h2 className="text-4xl md:text-5xl font-fraunces font-light text-[#33241A] tracking-tight">
            Find us in the <span className="italic font-normal text-[#C1633B]">sunlit alley.</span>
          </h2>
          <p className="text-sm text-[#33241A]/70 font-sans">
            Tucked behind the historic cobblestone lane, where fresh espresso meets raw clay.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Visual Map Component with Pin-Drop Bounce */}
          <div className="lg:col-span-7 bg-[#33241A] text-[#FBF6EF] rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[420px] shadow-xl border border-[#D9BFA0]/20">
            {/* Stylized Abstract Map Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="120" x2="1000" y2="120" stroke="#FBF6EF" strokeWidth="12" />
                <line x1="0" y1="280" x2="1000" y2="280" stroke="#FBF6EF" strokeWidth="8" />
                <line x1="240" y1="0" x2="240" y2="800" stroke="#FBF6EF" strokeWidth="10" />
                <line x1="560" y1="0" x2="560" y2="800" stroke="#FBF6EF" strokeWidth="6" />
                <circle cx="240" cy="280" r="48" fill="#C1633B" opacity="0.3" />
              </svg>
            </div>

            {/* Map Header Info */}
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBF6EF]/10 border border-[#FBF6EF]/20 text-xs font-mono text-[#D9BFA0]">
                <MapPin className="w-3.5 h-3.5 text-[#C1633B]" />
                <span>482 Cobblestone Alley, Arts District</span>
              </div>
              <h3 className="text-2xl font-fraunces text-[#FBF6EF]">Vine & Clay Sanctuary</h3>
            </div>

            {/* Centered Map Marker Pin-Drop Animation */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-8">
              <div
                ref={mapMarkerRef}
                className="relative flex flex-col items-center justify-center cursor-pointer group"
              >
                {/* Pulse Ring */}
                <span className="absolute w-16 h-16 rounded-full bg-[#C1633B]/30 animate-ping" />
                {/* Pin Icon */}
                <div className="relative w-14 h-14 rounded-full bg-[#C1633B] text-[#FBF6EF] shadow-2xl flex items-center justify-center ring-4 ring-[#FBF6EF]/20 group-hover:scale-110 transition-transform">
                  <MapPin className="w-7 h-7" />
                </div>
                <span className="mt-3 px-3 py-1 bg-[#FBF6EF] text-[#33241A] text-xs font-mono font-bold rounded-full shadow-md">
                  We are here
                </span>
              </div>
            </div>

            {/* Map Action Buttons */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#FBF6EF]/10 text-xs font-mono">
              <div className="flex items-center gap-4 text-[#D9BFA0]">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#C1633B]" /> +1 (555) 839-2529
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#6B7548]" /> hello@vineandclay.com
                </span>
              </div>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C1633B] text-[#FBF6EF] hover:bg-[#a8522d] transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          {/* Right Column: Mono-Styled Hours Table & Booking CTA */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-[#D9BFA0]/40 shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#D9BFA0]/30">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-[#C1633B]" />
                  <h3 className="font-fraunces font-semibold text-xl text-[#33241A]">Opening Hours</h3>
                </div>
                <span className="text-[11px] font-mono text-[#6B7548] uppercase tracking-wider bg-[#6B7548]/10 px-2.5 py-1 rounded-full">
                  Open Today
                </span>
              </div>

              {/* Mono Hours Table with Staggered Scroll Entry */}
              <div ref={hoursTableRef} className="space-y-3 font-mono text-xs text-[#33241A]">
                {hours.map((item, idx) => (
                  <div
                    key={idx}
                    className="hours-row p-3.5 rounded-2xl bg-[#FBF6EF]/70 border border-[#D9BFA0]/30 flex flex-col gap-1 hover:border-[#C1633B]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-[#33241A]">{item.day}</span>
                      <span className="text-[#C1633B]">{item.time}</span>
                    </div>
                    <span className="text-[11px] text-[#33241A]/50 italic font-sans">{item.notes}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reserve Table CTA */}
            <div className="pt-6 mt-6 border-t border-[#D9BFA0]/30 text-center space-y-3">
              <p className="text-xs text-[#33241A]/70 font-sans">
                Planning a weekend visit or studio workshop seating?
              </p>
              <button
                onClick={openReservation}
                className="w-full py-3.5 rounded-full bg-[#33241A] hover:bg-[#211610] text-[#FBF6EF] font-medium text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Calendar className="w-4 h-4 text-[#C1633B]" />
                <span>Reserve a Table Online</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
