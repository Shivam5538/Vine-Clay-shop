"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  strength?: number; // Magnetism intensity (px)
  variant?: "terracotta" | "umber" | "outline" | "ghost";
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  variant = "terracotta",
  onClick,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const x = (e.clientX - centerX) * strength;
    const y = (e.clientY - centerY) * strength;

    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles =
    "relative inline-flex items-center justify-center font-medium transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C1633B] focus-visible:ring-offset-2";

  const variantStyles = {
    terracotta:
      "bg-[#C1633B] text-[#FBF6EF] hover:bg-[#a8522d] shadow-sm shadow-[#C1633B]/20 rounded-full px-7 py-3.5 text-sm sm:text-base tracking-wide",
    umber:
      "bg-[#33241A] text-[#FBF6EF] hover:bg-[#211610] rounded-full px-7 py-3.5 text-sm sm:text-base tracking-wide",
    outline:
      "border-1.5 border-[#33241A] text-[#33241A] hover:bg-[#33241A] hover:text-[#FBF6EF] rounded-full px-7 py-3.5 text-sm sm:text-base tracking-wide",
    ghost:
      "text-[#33241A] hover:text-[#C1633B] px-4 py-2 text-sm font-medium",
  };

  return (
    <motion.button
      ref={ref}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
