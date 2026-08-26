"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CoffeePreloaderProps {
  onComplete?: () => void;
}

const LUXURY_PHRASES = [
  "The art of the unhurried cup.",
  "Hand-thrown stoneware & single-origin beans.",
  "Slow extraction • Pure patience.",
  "Welcome to Vine & Clay.",
];

export function CoffeePreloader({ onComplete }: CoffeePreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Progress counter animation (~1.8s)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinished(true);
            document.body.style.overflow = originalOverflow;
            if (onComplete) onComplete();
          }, 400);
          return 100;
        }
        const increment = Math.floor(Math.random() * 8) + 6;
        return Math.min(prev + increment, 100);
      });
    }, 75);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = originalOverflow;
    };
  }, [onComplete]);

  const phraseIndex = Math.min(Math.floor(progress / 26), LUXURY_PHRASES.length - 1);

  return (
    <AnimatePresence mode="wait">
      {!isFinished && (
        <motion.div
          key="luxury-espresso-preloader"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: [
              "circle(100% at 50% 50%)",
              "circle(0% at 50% 50%)",
            ],
            opacity: [1, 0],
            transition: { duration: 0.85, ease: [0.77, 0, 0.175, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-between p-8 sm:p-12 bg-[#17100A] text-[#FBF6EF] overflow-hidden select-none font-sans"
        >
          {/* Subtle Ambient Golden Warmth Aura */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(193,99,59,0.18)_0%,rgba(217,191,160,0.04)_50%,transparent_75%)] pointer-events-none" />

          {/* Top Brand Minimalist Header */}
          <div className="w-full max-w-4xl flex items-center justify-between text-[11px] font-mono tracking-[0.25em] text-[#D9BFA0]/60 uppercase z-10">
            <span className="text-[#FBF6EF] font-medium tracking-[0.3em]">Vine &amp; Clay</span>
            <span className="hidden sm:inline">Ceramic Studio &amp; Specialty Bar</span>
            <span className="text-[#C1633B]">Soho, NY</span>
          </div>

          {/* Centerpiece: Minimalist Luxury Espresso Wave Vessel */}
          <div className="relative flex flex-col items-center justify-center my-auto z-10">
            {/* Ambient Golden Steam Strands */}
            <div className="relative w-36 h-48 flex items-center justify-center">
              {/* Animated Floating Steam Trails */}
              <svg
                viewBox="0 0 100 120"
                className="absolute -top-6 w-20 h-24 overflow-visible pointer-events-none"
                fill="none"
              >
                <motion.path
                  d="M42 90 C34 65 55 40 45 15 C40 5 45 0 42 -5"
                  stroke="#D9BFA0"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0.1 }}
                  animate={{
                    pathLength: [0, 0.7, 0],
                    pathOffset: [1, 0, -0.3],
                    opacity: [0.1, 0.6, 0],
                  }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.path
                  d="M58 95 C68 70 48 45 56 20 C60 10 55 0 58 -5"
                  stroke="#C1633B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0.1 }}
                  animate={{
                    pathLength: [0, 0.6, 0],
                    pathOffset: [1, 0, -0.3],
                    opacity: [0.1, 0.5, 0],
                  }}
                  transition={{ duration: 2.8, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </svg>

              {/* Minimalist Ceramic Vessel with Liquid Wave */}
              <svg
                viewBox="0 0 120 140"
                className="w-32 h-36 overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Vessel Soft Shadow Grounding */}
                <ellipse cx="60" cy="132" rx="36" ry="5" fill="#0D0805" opacity="0.8" />

                {/* Vessel Exterior Body (Stoneware Matte Finish) */}
                <path
                  d="M26 32 C26 95 38 126 60 126 C82 126 94 95 94 32 Z"
                  fill="#1C130D"
                  stroke="#D9BFA0"
                  strokeWidth="1.75"
                />

                {/* Subtle Ceramic Texture Rim Line */}
                <ellipse cx="60" cy="32" rx="34" ry="7" stroke="#D9BFA0" strokeWidth="1.5" fill="#241912" />

                {/* Liquid Wave Filling Inside Cup */}
                <g clipPath="url(#cup-interior-clip)">
                  {/* Base Coffee Liquid Fill */}
                  <motion.rect
                    x="24"
                    y="126"
                    width="72"
                    height="96"
                    fill="url(#espresso-gradient)"
                    animate={{
                      y: 126 - (progress / 100) * 88,
                    }}
                    transition={{ ease: "easeOut", duration: 0.2 }}
                  />

                  {/* Dynamic Sine Liquid Wave */}
                  <motion.path
                    fill="#C1633B"
                    animate={{
                      d: [
                        `M 24 ${126 - (progress / 100) * 88} Q 42 ${122 - (progress / 100) * 88} 60 ${126 - (progress / 100) * 88} T 96 ${126 - (progress / 100) * 88} L 96 130 L 24 130 Z`,
                        `M 24 ${126 - (progress / 100) * 88} Q 42 ${130 - (progress / 100) * 88} 60 ${126 - (progress / 100) * 88} T 96 ${126 - (progress / 100) * 88} L 96 130 L 24 130 Z`,
                        `M 24 ${126 - (progress / 100) * 88} Q 42 ${122 - (progress / 100) * 88} 60 ${126 - (progress / 100) * 88} T 96 ${126 - (progress / 100) * 88} L 96 130 L 24 130 Z`,
                      ],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Golden Crema Light Reflection */}
                  <motion.ellipse
                    cx="60"
                    cy={126 - (progress / 100) * 88}
                    rx="30"
                    ry="5"
                    fill="#E07A4F"
                    opacity="0.8"
                  />
                </g>

                {/* Minimalist Cup Handle */}
                <path
                  d="M94 48 C108 48 108 84 92 84"
                  stroke="#D9BFA0"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Clip Path conforming to cup interior */}
                <clipPath id="cup-interior-clip">
                  <path d="M27 34 C27 94 39 124 60 124 C81 124 93 94 93 34 Z" />
                </clipPath>

                {/* Liquid Color Gradient */}
                <defs>
                  <linearGradient id="espresso-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C1633B" />
                    <stop offset="60%" stopColor="#8C4423" />
                    <stop offset="100%" stopColor="#4A2210" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Editorial Serif Brand Name */}
            <div className="mt-6 text-center">
              <h1 className="text-3xl sm:text-4xl font-fraunces font-light tracking-tight text-[#FBF6EF]">
                Vine <span className="italic text-[#C1633B] font-serif">&amp;</span> Clay
              </h1>
              <p className="mt-1 text-[11px] font-mono tracking-[0.25em] text-[#D9BFA0]/70 uppercase">
                Artisanal Pourover &amp; Ceramics
              </p>
            </div>

            {/* Minimalist Precision Progress Line */}
            <div className="w-56 mt-7 space-y-2.5">
              <div className="w-full h-[2px] bg-[#33241A] rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#D9BFA0] via-[#C1633B] to-[#E07A4F]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.15 }}
                />
              </div>

              {/* Monospace Precision Counter */}
              <div className="flex items-center justify-between text-[11px] font-mono text-[#D9BFA0]/70">
                <span className="tracking-widest">EXTRACTION</span>
                <span className="tabular-nums font-semibold text-[#FBF6EF]">
                  {progress.toString().padStart(3, "0")}%
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Dynamic Poetic Phrase Indicator */}
          <div className="w-full max-w-md text-center z-10">
            <AnimatePresence mode="wait">
              <motion.p
                key={phraseIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="text-xs font-mono text-[#D9BFA0]/80 tracking-wide"
              >
                {LUXURY_PHRASES[phraseIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
