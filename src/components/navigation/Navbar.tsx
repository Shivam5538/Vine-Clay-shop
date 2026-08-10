"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, Calendar, Menu as MenuIcon, X } from "lucide-react";
import { MagneticButton } from "../ui/MagneticButton";
import { DrawUnderline } from "../ui/DrawUnderline";

export function Navbar() {
  const { getTotalItems, openCart, openReservation } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Menu", href: "#menu" },
    { name: "Our Story", href: "#story" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Location & Hours", href: "#location" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-[#FBF6EF]/90 backdrop-blur-md border-b border-[#D9BFA0]/30 py-3.5 shadow-sm"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#"
            className="group flex items-center gap-2.5 focus:outline-none"
          >
            <img 
              src="/logo.png" 
              alt="Vine & Clay Logo" 
              className="h-10 w-auto group-hover:scale-105 transition-transform duration-300"
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#33241A]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative py-1 text-[#33241A]/90 hover:text-[#C1633B] transition-colors focus:outline-none"
                onMouseEnter={() => setActiveHover(link.name)}
                onMouseLeave={() => setActiveHover(null)}
              >
                {link.name}
                <DrawUnderline active={activeHover === link.name} color="#C1633B" />
              </a>
            ))}
            <a
              href="/admin"
              className="py-1 text-[11px] font-mono uppercase tracking-wider text-[#6B7548] hover:text-[#33241A] bg-[#6B7548]/10 border border-[#6B7548]/30 px-2.5 py-1 rounded transition-colors"
            >
              🔒 Staff Admin
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Table Reservation Button */}
            <button
              onClick={openReservation}
              className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase px-4 py-2.5 rounded-full border border-[#33241A]/20 text-[#33241A] hover:border-[#C1633B] hover:text-[#C1633B] transition-all focus:outline-none"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C1633B]" />
              Reserve Table
            </button>

            {/* Cart Button */}
            <MagneticButton
              variant="terracotta"
              onClick={openCart}
              className="!px-4 !py-2.5 !text-xs !font-mono uppercase tracking-wider gap-2 shadow-none"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-[#FBF6EF] text-[#C1633B] font-bold rounded-full">
                  {totalItems}
                </span>
              )}
            </MagneticButton>
          </div>

          {/* Mobile Menu & Cart Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={openCart}
              className="relative p-2 text-[#33241A] hover:text-[#C1633B] transition-colors"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] bg-[#C1633B] text-[#FBF6EF] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#33241A] hover:text-[#C1633B] transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#FBF6EF] flex flex-col justify-between px-6 pt-28 pb-12 sm:hidden">
          <nav className="flex flex-col gap-6 text-2xl font-fraunces">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#33241A] hover:text-[#C1633B] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openReservation();
              }}
              className="w-full py-3.5 rounded-full border border-[#33241A] text-[#33241A] font-medium text-sm flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#C1633B]" />
              Reserve a Table
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openCart();
              }}
              className="w-full py-3.5 rounded-full bg-[#C1633B] text-[#FBF6EF] font-medium text-sm flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Order Online ({totalItems})
            </button>
          </div>
        </div>
      )}
    </>
  );
}
