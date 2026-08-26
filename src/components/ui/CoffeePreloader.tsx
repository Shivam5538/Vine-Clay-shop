"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CoffeePreloaderProps {
  onComplete?: () => void;
}

const BREW_MILESTONES = [
  { code: "01", tag: "GRIND & BLOOM", text: "Ethiopian Yirgacheffe • 93.5°C Bloom" },
  { code: "02", tag: "SLOW EXTRACTION", text: "Golden Ratio 1:16 • Gravity Pourover" },
  { code: "03", tag: "STONEWARE VESSEL", text: "Hand-Thrown Ceramic • Soho Workshop" },
  { code: "04", tag: "UNHURRIED SIP", text: "Crafted with endless patience." },
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
          }, 420);
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

  const milestoneIndex = Math.min(Math.floor(progress / 26), BREW_MILESTONES.length - 1);
  const milestone = BREW_MILESTONES[milestoneIndex];

  // Calculate dynamic liquid Y height (124 = bottom, 38 = full)
  const liquidY = 124 - (progress / 100) * 86;

  return (
    <AnimatePresence mode="wait">
      {!isFinished && (
        <motion.div
          key="perfect-luxury-preloader"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: [
              "circle(100% at 50% 50%)",
              "circle(0% at 50% 50%)",
            ],
            opacity: [1, 0],
            scale: [1, 1.02],
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-between p-6 sm:p-12 bg-[#140E0A] text-[#FBF6EF] overflow-hidden select-none font-sans"
        >
          {/* Breathing Warm Terracotta Ambient Glow */}
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.22, 0.35, 0.22],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(193,99,59,0.3)_0%,rgba(107,117,72,0.08)_40%,transparent_75%)] pointer-events-none"
          />

          {/* Top Brand Minimalist Navigation Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#D9BFA0]/60 uppercase z-10">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C1633B] animate-ping" />
              <span className="text-[#FBF6EF] font-semibold tracking-[0.3em]">Vine &amp; Clay</span>
            </div>
            <div className="hidden sm:block text-[#D9BFA0]/40">
              Ceramic Studio &amp; Specialty Bar • Soho NY
            </div>
            <div className="text-[#C1633B] font-semibold">
              40.7241° N, 73.9982° W
            </div>
          </div>

          {/* Centerpiece: Precision Minimalist Fluid Vessel */}
          <div className="relative flex flex-col items-center justify-center my-auto z-10">
            {/* Ambient Floating Steam Trails */}
            <div className="relative w-40 h-52 flex items-center justify-center">
              <svg
                viewBox="0 0 100 120"
                className="absolute -top-8 w-24 h-28 overflow-visible pointer-events-none"
                fill="none"
              >
                <motion.path
                  d="M40 85 C32 60 55 35 44 12 C40 4 44 0 41 -6"
                  stroke="#D9BFA0"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0.1 }}
                  animate={{
                    pathLength: [0, 0.75, 0],
                    pathOffset: [1, 0, -0.3],
                    opacity: [0.1, 0.65, 0],
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.path
                  d="M60 90 C70 65 48 40 57 15 C60 6 56 0 59 -6"
                  stroke="#C1633B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0.1 }}
                  animate={{
                    pathLength: [0, 0.65, 0],
                    pathOffset: [1, 0, -0.3],
                    opacity: [0.1, 0.55, 0],
                  }}
                  transition={{ duration: 2.7, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
                />
              </svg>

              {/* Minimalist Ceramic Vessel with Dual Sine Liquid Wave */}
              <svg
                viewBox="0 0 120 140"
                className="w-32 h-40 sm:w-36 sm:h-44 overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Soft Ambient Ground Shadow */}
                <ellipse cx="60" cy="132" rx="38" ry="6" fill="#080503" opacity="0.9" />

                {/* Vessel Outer Clay Body (Matte Obsidian/Terracotta Stoneware) */}
                <path
                  d="M26 32 C26 95 38 126 60 126 C82 126 94 95 94 32 Z"
                  fill="#18110B"
                  stroke="#D9BFA0"
                  strokeWidth="1.75"
                />

                {/* Delicate Hand-Turned Rim Ring */}
                <ellipse cx="60" cy="32" rx="34" ry="7" stroke="#D9BFA0" strokeWidth="1.5" fill="#20150E" />

                {/* Liquid Interior Clip */}
                <g clipPath="url(#perfect-cup-clip)">
                  {/* Base Deep Espresso Liquid Fill */}
                  <rect
                    x="24"
                    y={liquidY}
                    width="72"
                    height="100"
                    fill="url(#deep-espresso-grad)"
                  />

                  {/* Harmonic Fluid Sine Wave 1 (Secondary Background Wave) */}
                  <motion.path
                    fill="#A84C24"
                    opacity="0.45"
                    animate={{
                      d: [
                        `M 24 ${liquidY} Q 42 ${liquidY - 3} 60 ${liquidY} T 96 ${liquidY} L 96 130 L 24 130 Z`,
                        `M 24 ${liquidY} Q 42 ${liquidY + 3} 60 ${liquidY} T 96 ${liquidY} L 96 130 L 24 130 Z`,
                        `M 24 ${liquidY} Q 42 ${liquidY - 3} 60 ${liquidY} T 96 ${liquidY} L 96 130 L 24 130 Z`,
                      ],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Harmonic Fluid Sine Wave 2 (Primary Foreground Wave) */}
                  <motion.path
                    fill="#C1633B"
                    opacity="0.95"
                    animate={{
                      d: [
                        `M 24 ${liquidY} Q 42 ${liquidY + 4} 60 ${liquidY} T 96 ${liquidY} L 96 130 L 24 130 Z`,
                        `M 24 ${liquidY} Q 42 ${liquidY - 4} 60 ${liquidY} T 96 ${liquidY} L 96 130 L 24 130 Z`,
                        `M 24 ${liquidY} Q 42 ${liquidY + 4} 60 ${liquidY} T 96 ${liquidY} L 96 130 L 24 130 Z`,
                      ],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Golden Crema Surface Specular Glow */}
                  <ellipse
                    cx="60"
                    cy={liquidY}
                    rx="30"
                    ry="4.5"
                    fill="url(#crema-specular)"
                    opacity="0.9"
                  />
                </g>

                {/* Ceramic Handle */}
                <path
                  d="M94 48 C108 48 108 84 92 84"
                  stroke="#D9BFA0"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Cup Interior Clipping Boundary */}
                <clipPath id="perfect-cup-clip">
                  <path d="M27 34 C27 94 39 124 60 124 C81 124 93 94 93 34 Z" />
                </clipPath>

                {/* Gradients */}
                <defs>
                  <linearGradient id="deep-espresso-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C1633B" />
                    <stop offset="45%" stopColor="#873F1E" />
                    <stop offset="100%" stopColor="#3D1A0A" />
                  </linearGradient>
                  <linearGradient id="crema-specular" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#E07A4F" />
                    <stop offset="50%" stopColor="#F5A87B" />
                    <stop offset="100%" stopColor="#E07A4F" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Editorial Serif Brand Title */}
            <div className="mt-5 text-center">
              <h1 className="text-3xl sm:text-4xl font-fraunces font-light tracking-tight text-[#FBF6EF]">
                Vine <span className="italic text-[#C1633B] font-serif">&amp;</span> Clay
              </h1>
              <p className="mt-1 text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#D9BFA0]/60 uppercase">
                Artisanal Pourover &amp; Hand-Thrown Ceramics
              </p>
            </div>

            {/* Precision Minimalist Extraction Meter */}
            <div className="w-60 sm:w-64 mt-6 space-y-2.5">
              <div className="w-full h-[2px] bg-[#2E2017] rounded-full overflow-hidden relative shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#D9BFA0] via-[#C1633B] to-[#E07A4F]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.15 }}
                />
              </div>

              {/* Telemetry Counter Row */}
              <div className="flex items-center justify-between text-[11px] font-mono text-[#D9BFA0]/80">
                <span className="tracking-widest flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#C1633B]" />
                  <span>EXTRACTION</span>
                </span>
                <span className="tabular-nums font-semibold text-[#FBF6EF] text-xs">
                  {progress.toString().padStart(3, "0")}%
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Interactive Milestone Banner */}
          <div className="w-full max-w-md flex flex-col items-center text-center space-y-2 z-10">
            <div className="px-3 py-1 rounded-full bg-[#20150E]/80 border border-[#D9BFA0]/20 backdrop-blur-md flex items-center gap-2">
              <span className="font-mono text-[9px] font-bold text-[#C1633B]">
                {milestone.code}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#D9BFA0]/30" />
              <span className="font-mono text-[9px] tracking-wider text-[#FBF6EF] uppercase font-medium">
                {milestone.tag}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={milestone.text}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-xs font-mono text-[#D9BFA0]/75 tracking-wide"
              >
                {milestone.text}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
