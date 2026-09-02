"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Compass, Flame, ArrowUpRight, CheckCircle2 } from "lucide-react";

interface Pillar {
  id: string;
  num: string;
  tag: string;
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  accent: string;
  specs: { label: string; val: string }[];
  highlight: string;
}

export function CinematicCraftAccordion() {
  const [activeId, setActiveId] = useState<string>("bean");

  const pillars: Pillar[] = [
    {
      id: "bean",
      num: "01",
      tag: "Specialty Terroir",
      title: "The Rare Harvest",
      subtitle: "Direct-Trade Arabica",
      desc: "Harvested at 1,950m elevation in Ethiopia's misty highlands. Roasted in small 5kg drum batches to preserve wild jasmine and white peach top-notes.",
      image: "/images/artisanal_coffee.png",
      accent: "#C1633B",
      specs: [
        { label: "Altitude", val: "1,950m" },
        { label: "Extraction", val: "92°C Pourover" },
        { label: "Ratio", val: "1:16 Ratio" },
      ],
      highlight: "Notes of Bergamot & Candied Peach",
    },
    {
      id: "clay",
      num: "02",
      tag: "Earth & Wheel",
      title: "Raw Terracotta",
      subtitle: "Studio Wheel No. 04",
      desc: "Every vessel is thrown right here in our back workshop. Left raw and unglazed at the base for tactile grip, then kiln-fired to 1,280°C for exceptional heat retention.",
      image: "/images/story_studio.png",
      accent: "#D9BFA0",
      specs: [
        { label: "Kiln Firing", val: "Cone 10 (1,280°C)" },
        { label: "Clay Origin", val: "River Valley Clay" },
        { label: "Capacity", val: "350ml Thermal Mug" },
      ],
      highlight: "Retains warmth of the hands that held it",
    },
    {
      id: "ritual",
      num: "03",
      tag: "Slow Living",
      title: "The Gathering",
      subtitle: "Unhurried Mornings",
      desc: "We removed the digital screens and rush. Sunlight washes across oak communal tables, pairing freshly cracked sourdough with the gentle whirr of the pottery wheel.",
      image: "/images/hero_cafe.png",
      accent: "#6B7548",
      specs: [
        { label: "Sourdough", val: "72h Fermentation" },
        { label: "Music", val: "Acoustic Vinyl" },
        { label: "Atmosphere", val: "Digital-Free Haven" },
      ],
      highlight: "Crafted for slow, intentional presence",
    },
  ];

  return (
    <section
      id="trinity-craft"
      className="relative w-full py-24 sm:py-32 px-6 md:px-12 bg-[#22160F] text-[#FBF6EF] overflow-hidden select-none"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[#C1633B]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[300px] bg-[#6B7548]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest uppercase text-[#D9BFA0]">
              <Sparkles className="w-3.5 h-3.5 text-[#C1633B]" />
              <span>Interactive Cinematic Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-fraunces font-light tracking-tight text-white">
              The Trinity of <span className="italic font-normal text-[#C1633B]">Craft.</span>
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-[#D9BFA0]/70 max-w-md font-light">
            Hover or tap any pillar to expand the visual chronicle. Three elements fused into one harmonious morning experience.
          </p>
        </div>

        {/* 3 Expanding Panels */}
        <div className="flex flex-col lg:flex-row gap-5 h-auto lg:h-[580px] w-full">
          {pillars.map((item) => {
            const isActive = activeId === item.id;

            return (
              <motion.div
                key={item.id}
                layout
                onClick={() => setActiveId(item.id)}
                onMouseEnter={() => setActiveId(item.id)}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 border ${
                  isActive
                    ? "lg:flex-[3] border-[#C1633B]/80 shadow-2xl shadow-black/60 ring-1 ring-[#C1633B]/40"
                    : "lg:flex-[1] border-white/10 opacity-70 hover:opacity-95"
                } min-h-[380px] lg:min-h-0 flex flex-col justify-between p-6 sm:p-8`}
              >
                {/* Background Image with Zoom & Dark Gradient */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className={`object-cover transition-transform duration-1000 ease-out ${
                      isActive ? "scale-105" : "scale-100 filter brightness-50"
                    }`}
                  />
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      isActive
                        ? "bg-gradient-to-t from-[#160F0A] via-[#160F0A]/55 to-transparent"
                        : "bg-[#160F0A]/75"
                    }`}
                  />
                </div>

                {/* Top Bar: Number & Tag */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="font-fraunces text-2xl sm:text-3xl font-light text-white/80">
                    {item.num}
                  </span>
                  <span className="text-[11px] font-mono tracking-widest uppercase px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[#D9BFA0]">
                    {item.tag}
                  </span>
                </div>

                {/* Bottom Content Area */}
                <div className="relative z-10 space-y-4">
                  <div>
                    <p className="text-xs font-mono tracking-wider uppercase text-[#D9BFA0]/80">
                      {item.subtitle}
                    </p>
                    <h3 className="font-fraunces text-2xl sm:text-4xl font-light text-white tracking-tight mt-1">
                      {item.title}
                    </h3>
                  </div>

                  {/* Expanded Content Only */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="space-y-4 pt-2"
                      >
                        <p className="font-sans text-sm text-[#FBF6EF]/85 leading-relaxed max-w-xl font-light">
                          {item.desc}
                        </p>

                        {/* Specs Glass HUD */}
                        <div className="grid grid-cols-3 gap-2.5 pt-2">
                          {item.specs.map((spec, i) => (
                            <div
                              key={i}
                              className="p-2.5 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10"
                            >
                              <p className="text-[10px] font-mono uppercase text-[#D9BFA0]/60">
                                {spec.label}
                              </p>
                              <p className="font-fraunces text-xs sm:text-sm font-medium text-white truncate">
                                {spec.val}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Highlight Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono text-[#FBF6EF]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C1633B]" />
                          <span>{item.highlight}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
