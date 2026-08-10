"use client";

import { motion } from "framer-motion";

interface SteamAnimationProps {
  className?: string;
  color?: string;
}

export function SteamAnimation({ className = "", color = "#C1633B" }: SteamAnimationProps) {
  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      {/* Hand-drawn continuous 2px looping steam paths */}
      <svg
        className="w-12 h-14 overflow-visible mb-1"
        viewBox="0 0 48 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Steam strand 1 */}
        <motion.path
          d="M 14,48 C 8,36 20,24 12,12 C 8,6 14,2 10,0"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, pathOffset: 1, opacity: 0.3 }}
          animate={{
            pathLength: [0, 0.7, 0],
            pathOffset: [1, 0, -0.3],
            opacity: [0.2, 0.85, 0],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Steam strand 2 */}
        <motion.path
          d="M 24,52 C 30,40 18,28 26,16 C 30,10 24,4 28,0"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, pathOffset: 1, opacity: 0.2 }}
          animate={{
            pathLength: [0, 0.7, 0],
            pathOffset: [1, 0, -0.3],
            opacity: [0.2, 0.9, 0],
          }}
          transition={{
            duration: 2.8,
            delay: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Steam strand 3 */}
        <motion.path
          d="M 34,48 C 40,36 28,24 36,12 C 40,6 34,2 38,0"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, pathOffset: 1, opacity: 0.2 }}
          animate={{
            pathLength: [0, 0.6, 0],
            pathOffset: [1, 0, -0.3],
            opacity: [0.15, 0.8, 0],
          }}
          transition={{
            duration: 3.5,
            delay: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
}
