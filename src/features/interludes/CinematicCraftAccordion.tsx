"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Compass, Flame, ArrowUpRight, CheckCircle2, ChevronDown } from "lucide-react";

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
      className="relative w-full py-20 sm:py-32 px-5 sm:px-8 md:px-12 bg-gradient-to-b from-[#2A1810] via-[#1E120B] to-[#160D08] text-[#FBF6EF] overflow-hidden select-none"
    >
      {/* Dynamic Animated Ambient Glow-Up Background (Lights up when in view) */}
      <motion.div
        initial={{ opacity: 0.2, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1.1 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] sm:w-[1100px] h-[500px] sm:h-[650px] bg-radial from-[#C1633B]/30 via-[#E58253]/15 to-transparent rounded-full blur-[110px] sm:blur-[160px] pointer-events-none"
      />

      {/* Secondary Warm Olive/Clay Glow */}
      <motion.div
        initial={{ opacity: 0.1 }}
        whileInView={{ opacity: 0.8 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 1.6, delay: 0.2, ease: "easeOut" }}
        className="absolute bottom-6 right-0 w-[400px] sm:w-[600px] h-[350px] bg-radial from-[#D9BFA0]/20 via-[#6B7548]/15 to-transparent rounded-full blur-[100px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12 relative z-10">
        {/* Header with Automatic Glow-up Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/15 pb-6 sm:pb-8"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C1633B]/20 border border-[#C1633B]/40 text-xs font-mono tracking-widest uppercase text-[#FBF6EF] shadow-sm shadow-[#C1633B]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#C1633B] animate-pulse" />
              <span>Interactive Cinematic Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-fraunces font-light tracking-tight text-white leading-tight">
              The Trinity of <span className="italic font-normal text-[#E07A4F] drop-shadow-[0_0_20px_rgba(224,122,79,0.5)]">Craft.</span>
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-[#D9BFA0]/90 max-w-md font-light leading-relaxed">
            Three core elements fused into one harmonious morning ritual. Tap any pillar to illuminate its story and artisan specs.
          </p>
        </motion.div>

        {/* 3 Expanding Panels with Warm Mobile Glow */}
        <div className="flex flex-col lg:flex-row gap-5 h-auto lg:h-[580px] w-full">
          {pillars.map((item) => {
            const isActive = activeId === item.id;

            return (
              <motion.div
                key={item.id}
                layout
                onClick={() => setActiveId(item.id)}
                onMouseEnter={() => setActiveId(item.id)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 border ${
                  isActive
                    ? "lg:flex-[3] border-[#C1633B] shadow-2xl shadow-[#C1633B]/25 ring-2 ring-[#C1633B]/60"
                    : "lg:flex-[1] border-white/20 hover:border-[#C1633B]/50 shadow-md"
                } min-h-[300px] sm:min-h-[360px] lg:min-h-0 flex flex-col justify-between p-6 sm:p-8 bg-[#1A1009]`}
              >
                {/* Background Image: Vivid, Rich & Warmly Lit */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className={`object-cover transition-all duration-700 ease-out ${
                      isActive
                        ? "scale-105 filter brightness-100 contrast-105"
                        : "scale-100 filter brightness-90 sm:brightness-75 contrast-100"
                    }`}
                  />
                  {/* Warm Gradient Sheen (Not Pitch Black) */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      isActive
                        ? "bg-gradient-to-t from-[#160D08]/95 via-[#160D08]/50 to-black/20"
                        : "bg-gradient-to-t from-[#160D08]/90 via-[#160D08]/60 to-black/30"
                    }`}
                  />

                  {/* Warm Glowing Edge Highlight on Active */}
                  {isActive && (
                    <div className="absolute inset-0 bg-radial from-transparent via-[#C1633B]/10 to-transparent pointer-events-none" />
                  )}
                </div>

                {/* Top Bar: Number & Tag with Vibrant Glass Pills */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="font-fraunces text-2xl sm:text-3xl font-light text-white drop-shadow-md">
                    {item.num}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono tracking-widest uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#FBF6EF] shadow-sm">
                      {item.tag}
                    </span>
                    {!isActive && (
                      <span className="lg:hidden w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-white">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Content Area */}
                <div className="relative z-10 space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-xs font-mono tracking-wider uppercase text-[#E58253] font-medium">
                      {item.subtitle}
                    </p>
                    <h3 className="font-fraunces text-2xl sm:text-4xl font-light text-white tracking-tight mt-1 drop-shadow-sm">
                      {item.title}
                    </h3>
                  </div>

                  {/* Expanded Content View */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="space-y-4 pt-1 sm:pt-2 overflow-hidden"
                      >
                        <p className="font-sans text-xs sm:text-sm text-[#FBF6EF]/90 leading-relaxed max-w-xl font-light">
                          {item.desc}
                        </p>

                        {/* Specs Glass HUD with Warm Glowing Borders */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-1">
                          {item.specs.map((spec, i) => (
                            <div
                              key={i}
                              className="p-2 sm:p-2.5 rounded-2xl bg-black/65 backdrop-blur-xl border border-white/20 shadow-sm"
                            >
                              <p className="text-[10px] font-mono uppercase text-[#D9BFA0]">
                                {spec.label}
                              </p>
                              <p className="font-fraunces text-xs sm:text-sm font-medium text-white truncate mt-0.5">
                                {spec.val}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Highlight Pill with Warm Accent */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C1633B]/25 backdrop-blur-md border border-[#C1633B]/50 text-xs font-mono text-[#FBF6EF] shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#E58253]" />
                          <span>{item.highlight}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Mobile Tap Hint for Inactive Cards */}
                  {!isActive && (
                    <div className="lg:hidden pt-1 flex items-center gap-1.5 text-xs font-mono text-[#D9BFA0]/80">
                      <span>Tap to reveal chronicle</span>
                      <ArrowUpRight className="w-3 h-3 text-[#C1633B]" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
