"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SteamAnimation } from "./SteamAnimation";

export function CoffeePreloader() {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Check if user already saw preloader in this session
    const hasSeenPreloader = sessionStorage.getItem("vc_preloader_seen");
    if (hasSeenPreloader) {
      setShouldRender(false);
      return;
    }

    // Progress counter animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDone(true);
            sessionStorage.setItem("vc_preloader_seen", "true");
            setTimeout(() => setShouldRender(false), 900);
          }, 300);
          return 100;
        }
        // Organic progress increments
        const increment = Math.floor(Math.random() * 12) + 6;
        return Math.min(prev + increment, 100);
      });
    }, 110);

    return () => clearInterval(interval);
  }, []);

  if (!shouldRender) return null;

  const getStatusText = (prog: number) => {
    if (prog < 30) return "Selecting single-origin beans...";
    if (prog < 65) return "Blooming freshly ground coffee...";
    if (prog < 90) return "Pouring slow extraction...";
    return "Ready to savor.";
  };

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#33241A] text-[#FBF6EF] overflow-hidden select-none font-sans"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(193,99,59,0.18)_0%,transparent_70%)] pointer-events-none" />

          {/* Main Visual Container */}
          <div className="relative flex flex-col items-center max-w-sm px-6 text-center z-10">
            {/* Coffee Craft Animation */}
            <div className="relative w-36 h-40 flex flex-col items-center justify-end mb-6">
              {/* Steam rising */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <SteamAnimation color="#D9BFA0" />
              </div>

              {/* Handcrafted Pourover Dripper + Cup SVG */}
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
                    duration: 0.9,
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
                    duration: 0.9,
                    delay: 0.45,
                    repeat: Infinity,
                    ease: "easeIn",
                  }}
                />

                {/* 3. Stoneware Mug (Bottom) */}
                {/* Mug Body Outline */}
                <path
                  d="M34 78 Q34 110 60 110 Q86 110 86 78 Z"
                  fill="#241912"
                  stroke="#D9BFA0"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Coffee Liquid Fill inside Mug */}
                <g clipPath="url(#mug-clip)">
                  <motion.rect
                    x="34"
                    y="110"
                    width="52"
                    height="32"
                    fill="#C1633B"
                    animate={{
                      y: [110, 88 - (progress / 100) * 10],
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                  />
                  {/* Liquid Surface Ripple */}
                  <motion.ellipse
                    cx="60"
                    cy="86"
                    rx="22"
                    ry="2.5"
                    fill="#E07A4F"
                    animate={{
                      opacity: [0.6, 1, 0.6],
                      scaleX: [0.95, 1.05, 0.95],
                    }}
                    transition={{
                      duration: 1.5,
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
                <clipPath id="mug-clip">
                  <path d="M35 79 Q35 109 60 109 Q85 109 85 79 Z" />
                </clipPath>
              </svg>
            </div>

            {/* Brand Title */}
            <h2 className="text-2xl font-fraunces font-normal tracking-tight text-[#FBF6EF] mb-1">
              Vine <span className="text-[#C1633B] italic">&amp;</span> Clay
            </h2>
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D9BFA0]/70 mb-5">
              Unhurried Coffee &amp; Ceramic Studio
            </p>

            {/* Progress Bar */}
            <div className="w-48 h-1 bg-[#4A382A] rounded-full overflow-hidden mb-3 relative">
              <motion.div
                className="h-full bg-gradient-to-r from-[#D9BFA0] via-[#C1633B] to-[#E07A4F] rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            {/* Percentage & Dynamic Status Text */}
            <div className="flex items-center justify-between w-48 text-[10px] font-mono text-[#D9BFA0]/80">
              <span className="truncate pr-2">{getStatusText(progress)}</span>
              <span className="font-semibold tabular-nums text-[#C1633B]">{progress}%</span>
            </div>
          </div>

          {/* Bottom Ceramic Texture Tag */}
          <div className="absolute bottom-6 text-[10px] font-mono tracking-widest text-[#D9BFA0]/40 uppercase">
            Slow Brewed in Small Batches
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
