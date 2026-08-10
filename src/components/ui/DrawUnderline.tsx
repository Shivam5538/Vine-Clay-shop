"use client";

import { motion } from "framer-motion";

interface DrawUnderlineProps {
  active?: boolean;
  color?: string;
  className?: string;
  direction?: "left-to-right" | "center-out";
}

export function DrawUnderline({
  active = false,
  color = "#C1633B",
  className = "",
  direction = "left-to-right",
}: DrawUnderlineProps) {
  if (direction === "center-out") {
    return (
      <span className={`absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none overflow-hidden ${className}`}>
        <motion.span
          className="block h-full mx-auto"
          style={{ backgroundColor: color }}
          initial={{ width: "0%" }}
          animate={{ width: active ? "100%" : "0%" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </span>
    );
  }

  return (
    <svg
      className={`absolute bottom-0 left-0 w-full h-[4px] pointer-events-none overflow-visible ${className}`}
      viewBox="0 0 100 4"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M 0,2 Q 25,0.5 50,2 T 100,2"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}
