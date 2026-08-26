"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SteamAnimation } from "./SteamAnimation";

interface CoffeePreloaderProps {
  onComplete?: () => void;
}

export function CoffeePreloader({ onComplete }: CoffeePreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Lock scroll during preloader
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Progress counter animation (~1.8 seconds total)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinished(true);
            document.body.style.overflow = originalOverflow;
            if (onComplete) onComplete();
          }, 350);
          return 100;
        }
        // Smooth organic increments
        const step = Math.floor(Math.random() * 8) + 6;
        return Math.min(prev + step, 100);
      });
    }, 85);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = originalOverflow;
    };
  }, [onComplete]);

  const getStatusText = (prog: number) => {
    if (prog < 25) return "Grinding single-origin beans...";
    if (prog < 55) return "Blooming artisanal roast...";
    if (prog < 85) return "Pouring slow extraction...";
    return "Ready to savor.";
  };

  return (
    <AnimatePresence mode="wait">
      {!isFinished && (
        <motion.div
          key="coffee-preloader"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.85, ease: [0.77, 0, 0.175, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#291D15] text-[#FBF6EF] overflow-hidden select-none font-sans"
        >
          {/* Subtle Warm Radial Ambient Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(193,99,59,0.22)_0%,transparent_65%)] pointer-events-none" />

          {/* Centerpiece Container */}
          <div className="relative flex flex-col items-center max-w-sm px-6 text-center z-10">
            {/* Coffee Pourover Craft Illustration */}
            <div className="relative w-36 h-40 flex flex-col items-center justify-end mb-5">
              {/* Steam rising gently */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <SteamAnimation color="#D9BFA0" />
              </div>

              {/* Handcrafted Pourover Dripper + Stoneware Mug SVG */}
              <svg
                viewBox="0 0 120 120"
                className="w-28 h-28 overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 1. Ceramic Dripper Cone (Top) */}
                <path
                  d="M25 25 L95 25 L68 62 L52 62 Z"
                  fill="#FBF6EF"
                  stroke="#D9BFA0"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Dripper Ridges */}
                <path d="M42 27 L55 58" stroke="#D9BFA0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <path d="M60 27 L60 60" stroke="#D9BFA0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <path d="M78 27 L65 58" stroke="#D9BFA0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

                {/* Dripper Base Ring */}
                <rect x="46" y="60" width="28" height="4" rx="2" fill="#C1633B" />

                {/* 2. Falling Coffee Drops (Animated) */}
                <motion.circle
                  cx="60"
                  cy="68"
                  r="2.5"
                  fill="#C1633B"
                  animate={{
                    cy: [66, 88],
                    opacity: [0, 1, 0],
                    scaleY: [1, 1.4, 0.8],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeIn",
                  }}
                />
                <motion.circle
                  cx="60"
                  cy="68"
                  r="2"
                  fill="#C1633B"
                  animate={{
                    cy: [66, 88],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.4,
                    repeat: Infinity,
                    ease: "easeIn",
                  }}
                />

                {/* 3. Stoneware Mug (Bottom) */}
                <path
                  d="M34 78 Q34 110 60 110 Q86 110 86 78 Z"
                  fill="#1C140E"
                  stroke="#D9BFA0"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Coffee Liquid Fill inside Mug */}
                <g clipPath="url(#mug-clip-path)">
                  <motion.rect
                    x="34"
                    y="110"
                    width="52"
                    height="32"
                    fill="#C1633B"
                    animate={{
                      y: 110 - (progress / 100) * 26,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                  />
                  {/* Liquid Surface */}
                  <motion.ellipse
                    cx="60"
                    cy={110 - (progress / 100) * 26}
                    rx="22"
                    ry="2.5"
                    fill="#E07A4F"
                    animate={{
                      opacity: [0.7, 1, 0.7],
                      scaleX: [0.95, 1.05, 0.95],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </g>

                {/* Mug Handle */}
                <path
                  d="M86 84 C98 84 98 102 85 102"
                  stroke="#D9BFA0"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Mug Clip Path */}
                <clipPath id="mug-clip-path">
                  <path d="M35 79 Q35 109 60 109 Q85 109 85 79 Z" />
                </clipPath>
              </svg>
            </div>

            {/* Brand Typography */}
            <h2 className="text-2xl sm:text-3xl font-fraunces font-normal tracking-tight text-[#FBF6EF] mb-1">
              Vine <span className="text-[#C1633B] italic font-serif">&amp;</span> Clay
            </h2>
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D9BFA0]/70 mb-5">
              Unhurried Coffee &amp; Ceramic Studio
            </p>

            {/* Progress Track */}
            <div className="w-52 h-1 bg-[#423124] rounded-full overflow-hidden mb-3 relative shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-[#D9BFA0] via-[#C1633B] to-[#E07A4F] rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            {/* Status & Numeric Counter */}
            <div className="flex items-center justify-between w-52 text-[10px] font-mono text-[#D9BFA0]/85">
              <span className="truncate pr-2">{getStatusText(progress)}</span>
              <span className="font-semibold tabular-nums text-[#C1633B]">{progress}%</span>
            </div>
          </div>

          {/* Bottom Artisan Tag */}
          <div className="absolute bottom-6 text-[10px] font-mono tracking-widest text-[#D9BFA0]/40 uppercase">
            Slow Brewed in Small Batches • Soho NYC
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

