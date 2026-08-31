"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MenuItem } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { Plus } from "lucide-react";
import { DrawUnderline } from "@/components/ui/DrawUnderline";

interface ProductCardProps {
  item: MenuItem;
}

export function ProductCard({ item }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isHovered, setIsHovered] = useState(false);
  const [printedPrice, setPrintedPrice] = useState("");
  const [hasPrinted, setHasPrinted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Typewriter receipt price tag reveal (~30ms per char) when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPrinted) {
            setHasPrinted(true);
            const targetText = item.formattedPrice;
            let current = "";
            let idx = 0;
            const interval = setInterval(() => {
              if (idx < targetText.length) {
                current += targetText[idx];
                setPrintedPrice(current);
                idx++;
              } else {
                clearInterval(interval);
              }
            }, 35);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [hasPrinted, item.formattedPrice]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-3xl p-5 border border-[#D9BFA0]/40 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
    >
      <div>
        {/* Image Container with Badge */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#FBF6EF] mb-4">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {item.badge && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-[#33241A]/90 backdrop-blur-md text-[#FBF6EF] text-[10px] font-mono uppercase tracking-wider rounded-full shadow-sm">
              {item.badge}
            </span>
          )}
        </div>

        {/* Title & Receipt Dashed Price Tag Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="relative">
            <h3 className="font-fraunces font-semibold text-lg text-[#33241A] tracking-tight group-hover:text-[#C1633B] transition-colors">
              {item.name}
            </h3>
            {/* Draw-on underline effect on hover */}
            <DrawUnderline active={isHovered} color="#C1633B" />
          </div>

          {/* Receipt-style Dashed Price Tag */}
          <div className="shrink-0 font-mono text-xs font-semibold text-[#33241A] bg-[#FBF6EF] px-2.5 py-1 rounded-md border border-dashed border-[#C1633B]/50 min-w-[64px] text-center shadow-2xs">
            {printedPrice || item.formattedPrice[0]}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#33241A]/70 leading-relaxed line-clamp-2 mb-4 font-sans">
          {item.description}
        </p>
      </div>

      {/* Footer Add Button */}
      <div className="pt-3 border-t border-[#D9BFA0]/20 flex items-center justify-between mt-auto">
        <span className="text-[11px] font-mono text-[#6B7548] uppercase tracking-wider">
          {item.category.replace("-", " ")}
        </span>

        <button
          onClick={() => addItem(item)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#33241A] text-[#FBF6EF] hover:bg-[#C1633B] text-xs font-mono transition-colors focus:outline-none"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
}
