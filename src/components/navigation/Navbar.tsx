"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import {
  ShoppingBag,
  Calendar,
  Menu as MenuIcon,
  X,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  Clock,
  Coffee,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { MagneticButton } from "../ui/MagneticButton";

export function Navbar() {
  const { getTotalItems, openCart, openReservation } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [statusHovered, setStatusHovered] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Menu", href: "#menu" },
    { name: "The Trinity", href: "#trinity-craft" },
    { name: "Our Story", href: "#story" },
    { name: "Community", href: "#testimonials" },
    { name: "Location", href: "#location" },
  ];

  return (
    <>
      <header className="fixed top-3 sm:top-4 inset-x-0 mx-auto max-w-6xl z-50 px-4 transition-all duration-500">
        <nav
          className={`relative w-full rounded-full transition-all duration-500 flex items-center justify-between border ${
            scrolled
              ? "bg-[#FBF6EF]/90 backdrop-blur-xl border-[#D9BFA0]/60 shadow-lg shadow-[#33241A]/5 py-2 px-3 sm:px-5"
              : "bg-white/80 backdrop-blur-md border-[#D9BFA0]/40 shadow-sm py-2.5 px-4 sm:px-6"
          }`}
        >
          {/* Left: Brand Logo & Live Studio Pulse Beacon */}
          <div className="flex items-center gap-3">
            <a href="#" className="group flex items-center gap-2 focus:outline-none">
              <img
                src="/logo.png"
                alt="Vine & Clay Logo"
                className="h-8 sm:h-9 w-auto group-hover:scale-105 transition-transform duration-300"
              />
            </a>

            {/* Live Studio Status Pill with Expandable Micro-Card */}
            <div
              className="relative hidden lg:block"
              onMouseEnter={() => setStatusHovered(true)}
              onMouseLeave={() => setStatusHovered(false)}
            >
              <button
                type="button"
                className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#6B7548]/10 hover:bg-[#6B7548]/15 border border-[#6B7548]/20 transition-all text-[11px] font-mono text-[#6B7548] cursor-pointer"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-medium">Open • Wheel Active</span>
              </button>

              {/* Hover Floating Micro-Card */}
              <AnimatePresence>
                {statusHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-3 w-72 p-4 rounded-2xl bg-white/95 backdrop-blur-2xl border border-[#D9BFA0]/60 shadow-xl text-[#33241A] space-y-2.5 z-50 pointer-events-none"
                  >
                    <div className="flex items-center justify-between border-b border-[#D9BFA0]/30 pb-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#C1633B]">
                        Live Studio Status
                      </span>
                      <span className="text-[10px] font-mono text-[#33241A]/50">Today &bull; 21°C</span>
                    </div>

                    <div className="space-y-1.5 text-xs font-sans">
                      <div className="flex items-center gap-2">
                        <Coffee className="w-3.5 h-3.5 text-[#C1633B] shrink-0" />
                        <span className="text-[#33241A]/80 truncate">
                          Roasting: <strong>Ethiopia Yirgacheffe G1</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#6B7548] shrink-0" />
                        <span className="text-[#33241A]/80 truncate">
                          Workshop: <strong>Wheel No. 04 In Session</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#D9BFA0] shrink-0" />
                        <span className="text-[#33241A]/80 truncate">
                          Open Today: <strong>Until 8:00 PM</strong>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Center: Desktop Navigation with Magnetic Sliding Spring Pill */}
          <div className="hidden md:flex items-center gap-1 relative px-2 py-1">
            {navLinks.map((link) => {
              const isHovered = hoveredLink === link.name;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="relative px-3.5 py-1.5 text-xs font-medium tracking-wide text-[#33241A]/85 hover:text-[#C1633B] transition-colors focus:outline-none z-10"
                >
                  {isHovered && (
                    <motion.div
                      layoutId="navbar-hover-pill"
                      className="absolute inset-0 rounded-full bg-[#33241A]/7 backdrop-blur-sm -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span>{link.name}</span>
                </a>
              );
            })}
          </div>

          {/* Right: Quick Actions (Soundscape Toggle, Admin, Reservation, Cart) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Interactive Cafe Soundscape Toggle */}
            <button
              type="button"
              onClick={() => setAudioPlaying(!audioPlaying)}
              title={audioPlaying ? "Mute Studio Ambience" : "Play Studio Ambience"}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-mono cursor-pointer ${
                audioPlaying
                  ? "bg-[#C1633B]/15 border-[#C1633B]/40 text-[#C1633B]"
                  : "bg-white/60 hover:bg-white border-[#D9BFA0]/40 text-[#33241A]/70"
              }`}
            >
              {audioPlaying ? (
                <>
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-3 bg-[#C1633B] animate-pulse" />
                    <span className="w-0.5 h-2 bg-[#C1633B] animate-bounce" />
                    <span className="w-0.5 h-3.5 bg-[#C1633B] animate-pulse" />
                  </div>
                  <span className="text-[10px] hidden md:inline">Ambience</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden md:inline">Sound</span>
                </>
              )}
            </button>

            {/* Staff Admin Link */}
            <a
              href="/admin"
              title="Staff Admin Portal"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-mono text-[#6B7548] hover:text-[#33241A] hover:bg-[#6B7548]/10 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </a>

            {/* Table Reservation Button */}
            <button
              onClick={openReservation}
              className="hidden sm:flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase px-3.5 py-1.5 rounded-full border border-[#33241A]/25 text-[#33241A] hover:border-[#C1633B] hover:text-[#C1633B] hover:bg-white/50 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C1633B]" />
              <span>Reserve</span>
            </button>

            {/* Shopping Cart Button */}
            <MagneticButton
              variant="terracotta"
              onClick={openCart}
              className="!px-3.5 !py-1.5 !text-xs !font-mono uppercase tracking-wider gap-1.5 shadow-xs hover:shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Cart</span>
              {totalItems > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[10px] bg-[#FBF6EF] text-[#C1633B] font-bold rounded-full animate-bounce">
                  {totalItems}
                </span>
              )}
            </MagneticButton>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:hidden text-[#33241A] hover:text-[#C1633B] rounded-full hover:bg-white/60 transition-colors cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Modern Fullscreen Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-[#FBF6EF]/95 backdrop-blur-2xl flex flex-col justify-between px-6 pt-24 pb-10 sm:hidden"
          >
            {/* Navigation Links */}
            <nav className="flex flex-col gap-5 pt-6">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-3xl font-fraunces font-light text-[#33241A] hover:text-[#C1633B] flex items-center justify-between group"
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-5 h-5 text-[#C1633B] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </motion.a>
              ))}
              <a
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-mono text-[#6B7548] flex items-center gap-2 pt-4 border-t border-[#D9BFA0]/30"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Staff Admin Portal</span>
              </a>
            </nav>

            {/* Mobile Actions */}
            <div className="space-y-3 pt-6 border-t border-[#D9BFA0]/40">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openReservation();
                }}
                className="w-full py-3.5 rounded-full border border-[#33241A] text-[#33241A] font-sans font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#33241A] hover:text-white transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#C1633B]" />
                <span>Reserve a Table</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCart();
                }}
                className="w-full py-3.5 rounded-full bg-[#C1633B] text-white font-sans font-medium text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-[#A8532F] transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View Cart ({totalItems})</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
