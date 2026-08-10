"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function IngredientMarquee() {
  const tickerRef = useRef<HTMLDivElement>(null);

  const items = [
    "single-origin direct trade",
    "stoneground uji matcha",
    "slow-fermented sourdough",
    "hand-thrown terracotta",
    "organic oat milk",
    "cold-drip botanical extract",
    "unhurried gathering",
    "artisan ceramic glazes",
  ];

  useEffect(() => {
    const el = tickerRef.current;
    if (!el) return;

    const animation = gsap.to(el, {
      xPercent: -50,
      repeat: -1,
      duration: 35,
      ease: "none",
    });

    return () => {
      animation.kill();
    };
  }, []);

  return (
    <section id="ingredient-strip" className="bg-[#33241A] text-[#FBF6EF] py-4 overflow-hidden select-none border-y border-[#33241A]">
      <div className="flex whitespace-nowrap" ref={tickerRef}>
        <div className="flex items-center gap-8 px-4 text-xs sm:text-sm font-mono tracking-wider uppercase text-[#FBF6EF]/85">
          {items.concat(items).concat(items).map((item, idx) => (
            <span key={idx} className="flex items-center gap-8">
              <span>{item}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C1633B]" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
