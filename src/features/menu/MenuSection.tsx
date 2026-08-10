"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MenuItem, MenuCategory } from "@/types";
import { ProductCard } from "./ProductCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const menuItems: MenuItem[] = [
    {
      id: "c1",
      name: "Ethiopia Yirgacheffe Pourover",
      category: "coffee",
      price: 6.5,
      formattedPrice: "$6.50",
      description: "Notes of wild jasmine, bergamot, and peach tea. Hand-brewed at 92°C.",
      badge: "Single Origin",
      image: "/images/hero_cafe.png",
    },
    {
      id: "c2",
      name: "Clay House Espresso",
      category: "coffee",
      price: 4.5,
      formattedPrice: "$4.50",
      description: "Full-bodied Guatemala & Colombia blend with dark chocolate and toasted hazelnut.",
      badge: "Signature",
      image: "/images/artisanal_coffee.png",
    },
    {
      id: "c3",
      name: "Botanical Cold Drip",
      category: "coffee",
      price: 7.0,
      formattedPrice: "$7.00",
      description: "12-hour slow extraction over ice with hints of citrus blossom & vanilla bean.",
      image: "/images/hero_cafe.png",
    },
    {
      id: "t1",
      name: "Stoneground Uji Matcha Latte",
      category: "tea",
      price: 6.75,
      formattedPrice: "$6.75",
      description: "First-harvest ceremonial matcha whisked with oat milk and blossom honey.",
      badge: "Popular",
      image: "/images/hero_cafe.png",
    },
    {
      id: "t2",
      name: "Smoked Lapsang & Wild Thyme",
      category: "tea",
      price: 5.5,
      formattedPrice: "$5.50",
      description: "Pine-smoked black tea leaves blended with mountain thyme and lemon verbena.",
      image: "/images/artisanal_coffee.png",
    },
    {
      id: "b1",
      name: "Slow-Fermented Sourdough Croissant",
      category: "bakery",
      price: 5.25,
      formattedPrice: "$5.25",
      description: "72-hour fermented pastry baked daily with cultured French butter.",
      badge: "Baked Fresh",
      image: "/images/hero_cafe.png",
    },
    {
      id: "b2",
      name: "Cardamom & Brown Butter Bun",
      category: "bakery",
      price: 5.75,
      formattedPrice: "$5.75",
      description: "Swedish style twisted bun laced with crushed green cardamom and raw sugar.",
      image: "/images/artisanal_coffee.png",
    },
    {
      id: "cm1",
      name: "Hand-Thrown Terracotta Mug",
      category: "ceramics",
      price: 34.0,
      formattedPrice: "$34.00",
      description: "Studio signature 12oz mug crafted with raw local clay and satin glaze.",
      badge: "Handmade",
      image: "/images/ceramic_mug.png",
    },
    {
      id: "cm2",
      name: "Pour-Over Dripper & Server",
      category: "ceramics",
      price: 68.0,
      formattedPrice: "$68.00",
      description: "Coordinated stoneware cone dripper and 500ml glass carafe for slow brewing.",
      badge: "Studio Pack",
      image: "/images/ceramic_mug.png",
    },
    {
      id: "cm3",
      name: "Single-Origin Whole Bean (250g)",
      category: "coffee",
      price: 22.0,
      formattedPrice: "$22.00",
      description: "Direct-trade roasted whole beans packaged in unbleached kraft paper.",
      badge: "Fresh Roast",
      image: "/images/artisanal_coffee.png",
    },
    {
      id: "g1",
      name: "Vine & Clay Physical Gift Card",
      category: "gift-cards",
      price: 50.0,
      formattedPrice: "$50.00",
      description: "Textured linen gift card valid for cafe items, coffee subscriptions, or ceramic workshops.",
      badge: "Giftable",
      image: "/images/ceramic_mug.png",
    },
  ];

  const categories: { id: MenuCategory; label: string }[] = [
    { id: "all", label: "All Offerings" },
    { id: "coffee", label: "Craft Coffee" },
    { id: "tea", label: "Artisanal Tea" },
    { id: "bakery", label: "Daily Bakery" },
    { id: "ceramics", label: "Studio Ceramics" },
    { id: "gift-cards", label: "Gift Cards" },
  ];

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  // Stagger reveal on scroll into view
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = grid.children;
    if (!cards || cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 85%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, [activeCategory]);

  return (
    <section id="menu" className="py-24 px-6 md:px-12 bg-[#FBF6EF] border-b border-[#D9BFA0]/30">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C1633B]">
            Daily Provisions & Studio Goods
          </span>
          <h2 className="text-4xl md:text-5xl font-fraunces font-light text-[#33241A] tracking-tight">
            Crafted for <span className="italic font-normal text-[#C1633B]">unhurried</span> moments.
          </h2>
          <p className="text-sm text-[#33241A]/70 leading-relaxed font-sans">
            Every pour-over is weighed to the gram, every pastry fermented for three sunrises, and every mug thrown by hand in our sunlit back studio.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-mono transition-all duration-300 whitespace-nowrap focus:outline-none ${
                activeCategory === cat.id
                  ? "bg-[#33241A] text-[#FBF6EF] shadow-md"
                  : "bg-white text-[#33241A]/70 border border-[#D9BFA0]/40 hover:border-[#C1633B] hover:text-[#C1633B]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {filteredItems.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
