"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SteamAnimation } from "./SteamAnimation";

interface CoffeePreloaderProps {
  onComplete?: () => void;
}

const BREW_STAGES = [
  { step: "01", label: "SINGLE-ORIGIN BEANS", detail: "Ethically Harvested • Ethiopia & Colombia" },
  { step: "02", label: "WHEEL-THROWN CLAY", detail: "High-Fire Stoneware • Soho Studio" },
  { step: "03", label: "SLOW EXTRACTION", detail: "93°C Water • 1:16 Pourover Ratio" },
  { step: "04", label: "UNHURRIED MOMENT", detail: "Crafted with endless patience." },
];

export function CoffeePreloader({ onComplete }: CoffeePreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinished(true);
            document.body.style.overflow = originalOverflow;
            if (onComplete) onComplete();
          }, 450);
          return 100;
        }
        const step = Math.floor(Math.random() * 9) + 6;
        return Math.min(prev + step, 100);
      });
    }, 75);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = originalOverflow;
    };
  }, [onComplete]);

  const currentStageIndex = Math.min(Math.floor(progress / 26), 3);
  const stage = BREW_STAGES[currentStageIndex];

  return (
    <AnimatePresence mode="wait">
      {!isFinished && (
        <div className="fixed inset-0 z-[99999] pointer-events-none select-none font-sans overflow-hidden">
          {/* 4 Staggered Architectural Slat Curtains for Exit Reveal */}
          <div className="absolute inset-0 flex">
            {[0, 1, 2, 3].map((col) => (
              <motion.div
                key={`slat-${col}`}
                initial={{ y: 0 }}
                exit={{
                  y: "-100%",
                  transition: {
                    duration: 0.9,
                    delay: col * 0.08,
                    ease: [0.76, 0, 0.24, 1],
                  },
                }}
                className={`flex-1 h-full ${
                  col % 2 === 0 ? "bg-[#1E150F]" : "bg-[#251A13]"
                } border-r border-[#33241A]/30`}
              />
            ))}
          </div>

          {/* Main Visual Content Layer */}
          <motion.div
            key="preloader-content"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 0.96,
              transition: { duration: 0.4, ease: "easeOut" },
            }}
            className="absolute inset-0 flex flex-col items-center justify-between p-6 sm:p-10 pointer-events-auto z-10 text-[#FBF6EF]"
          >
            {/* Top Brand & Coordinates Header */}
            <div className="w-full max-w-5xl flex items-center justify-between text-[10px] font-mono tracking-[0.2em] text-[#D9BFA0]/70 uppercase">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C1633B] animate-ping" />
                <span className="font-semibold text-[#FBF6EF]">Vine &amp; Clay</span>
              </div>
              <div className="hidden sm:block text-[#D9BFA0]/50">
                40.7241° N, 73.9982° W • SOHO NY
              </div>
              <div className="text-[#C1633B] font-bold">EST. 2024</div>
            </div>

            {/* Centerpiece Visuals: Modern Radial Brew Engine */}
            <div className="flex flex-col items-center justify-center my-auto relative">
              {/* Pulsing Concentric Aura Glows */}
              <div className="absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgba(193,99,59,0.25)_0%,rgba(107,117,72,0.1)_45%,transparent_70%)] blur-2xl pointer-events-none" />

              {/* Holographic Circular Extraction Ring */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Track Background */}
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#38291F"
                    strokeWidth="2.5"
                  />
                  {/* Neon Glowing Progress Arc */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="url(#gradient-ring)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 44}
                    strokeDashoffset={2 * Math.PI * 44 * (1 - progress / 100)}
                    transition={{ ease: "easeOut", duration: 0.15 }}
                  />
                  <defs>
                    <linearGradient id="gradient-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#D9BFA0" />
                      <stop offset="50%" stopColor="#C1633B" />
                      <stop offset="100%" stopColor="#E07A4F" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Inner Floating Artisan Ceramic Mug + Steam */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* Steam Rising Animation */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <SteamAnimation color="#D9BFA0" />
                  </div>

                  {/* Modern Minimalist Coffee Mug SVG */}
                  <svg
                    viewBox="0 0 80 80"
                    className="w-20 h-20 overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Coffee Droplet falling */}
                    <motion.circle
                      cx="40"
                      cy="15"
                      r="2"
                      fill="#C1633B"
                      animate={{
                        cy: [12, 45],
                        opacity: [0, 1, 0],
                        scaleY: [1, 1.6, 0.6],
                      }}
                      transition={{
                        duration: 0.75,
                        repeat: Infinity,
                        ease: "easeIn",
                      }}
                    />

                    {/* Mug Body Ceramic Form */}
                    <path
                      d="M20 30 Q20 68 40 68 Q60 68 60 30 Z"
                      fill="#150D09"
                      stroke="#D9BFA0"
                      strokeWidth="2"
                    />

                    {/* Liquid Fill */}
                    <g clipPath="url(#cup-liquid-clip)">
                      <motion.rect
                        x="20"
                        y="68"
                        width="40"
                        height="38"
                        fill="#C1633B"
                        animate={{
                          y: 68 - (progress / 100) * 32,
                        }}
                        transition={{ ease: "easeOut", duration: 0.15 }}
                      />
                      {/* Top Cream/Crema line */}
                      <motion.ellipse
                        cx="40"
                        cy={68 - (progress / 100) * 32}
                        rx="16"
                        ry="2"
                        fill="#E07A4F"
                      />
                    </g>

                    {/* Mug Ear Handle */}
                    <path
                      d="M60 35 C70 35 70 54 60 54"
                      stroke="#D9BFA0"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    <clipPath id="cup-liquid-clip">
                      <path d="M21 31 Q21 67 40 67 Q59 67 59 31 Z" />
                    </clipPath>
                  </svg>
                </div>
              </div>

              {/* Giant Modern Monospace Percentage Counter */}
              <div className="mt-6 flex items-baseline gap-1 font-mono">
                <span className="text-5xl sm:text-6xl font-bold tracking-tighter text-[#FBF6EF] tabular-nums">
                  {progress.toString().padStart(2, "0")}
                </span>
                <span className="text-lg font-medium text-[#C1633B] font-mono">%</span>
              </div>

              {/* Modern Audio Wave Equalizer Visualizer */}
              <div className="flex items-center gap-1 mt-3">
                {[4, 12, 8, 16, 10, 14, 6, 12, 18, 9, 15, 6].map((h, i) => (
                  <motion.div
                    key={`bar-${i}`}
                    className="w-1 bg-[#C1633B] rounded-full"
                    animate={{
                      height: [4, h, 4],
                      opacity: [0.3, 0.9, 0.3],
                    }}
                    transition={{
                      duration: 0.8 + (i % 3) * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Section: Dynamic Stage Card + Aesthetic Quote */}
            <div className="w-full max-w-md flex flex-col items-center text-center space-y-3">
              {/* Stage Pill */}
              <div className="px-3.5 py-1.5 rounded-full bg-[#33241A]/70 border border-[#D9BFA0]/25 backdrop-blur-md flex items-center gap-2.5 shadow-lg">
                <span className="font-mono text-[10px] font-bold text-[#C1633B]">
                  PHASE {stage.step}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#D9BFA0]/40" />
                <span className="font-mono text-[10px] tracking-wider text-[#FBF6EF] uppercase font-medium">
                  {stage.label}
                </span>
              </div>

              {/* Subtext description */}
              <p className="text-xs text-[#D9BFA0]/80 font-sans tracking-wide">
                {stage.detail}
              </p>

              {/* Micro dots indicator */}
              <div className="flex items-center gap-1.5 pt-1">
                {BREW_STAGES.map((s, idx) => (
                  <div
                    key={s.step}
                    className={`h-1 transition-all duration-300 rounded-full ${
                      idx === currentStageIndex
                        ? "w-6 bg-[#C1633B]"
                        : idx < currentStageIndex
                        ? "w-2 bg-[#D9BFA0]"
                        : "w-2 bg-[#423124]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
