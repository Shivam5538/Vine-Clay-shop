"use client";

import { useState, useEffect } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { DrawUnderline } from "@/components/ui/DrawUnderline";
import { useCartStore } from "@/store/useCartStore";
import { ArrowUpRight, Send, Heart } from "lucide-react";

export function FooterSection() {
  const { openReservation, addToast } = useCartStore();
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeHoverLink, setActiveHoverLink] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    addToast("Welcome to our slow living newsletter circle!", "success");
    setEmail("");
  };

  const footerNav = [
    { name: "Craft Menu", href: "#menu" },
    { name: "Our Story", href: "#story" },
    { name: "Community", href: "#testimonials" },
    { name: "Find Us", href: "#location" },
    { name: "Studio Merch", href: "#menu" },
    { name: "Gift Cards", href: "#menu" },
  ];

  return (
    <footer className="bg-[#33241A] text-[#FBF6EF] pt-20 pb-12 px-6 md:px-12 relative overflow-hidden border-t border-[#33241A]">
      {/* Decorative Warm Background Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C1633B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Top CTA Band */}
        <div className="bg-[#FBF6EF] text-[#33241A] rounded-3xl p-8 md:p-14 border border-[#D9BFA0]/40 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 text-center lg:text-left max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C1633B]">
              Your Table Awaits
            </span>
            <h2 className="text-3xl md:text-5xl font-fraunces font-light leading-tight">
              Ready for an <span className="italic font-normal text-[#C1633B]">unhurried</span> morning?
            </h2>
            <p className="text-sm text-[#33241A]/70 font-sans">
              Reserve your seat by the window or order single-origin beans directly to your home.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <MagneticButton variant="terracotta" onClick={openReservation}>
              <span>Reserve a Table</span>
            </MagneticButton>
            <a
              href="#menu"
              className="px-7 py-3.5 rounded-full border border-[#33241A]/20 text-[#33241A] hover:bg-[#33241A] hover:text-[#FBF6EF] text-sm font-medium transition-all"
            >
              Order Online
            </a>
          </div>
        </div>

        {/* Footer Navigation & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-6">
            <a href="#" className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="Vine & Clay Logo" 
                className="h-10 w-auto brightness-0 invert"
              />
            </a>
            <p className="text-sm text-[#FBF6EF]/70 leading-relaxed font-sans max-w-sm">
              An unhurried coffee bar & artisan pottery studio. Crafting slow moments, hand-brewed direct trade pourovers, and handmade stoneware in the Arts District.
            </p>

            {/* Newsletter Input with Center-Out Terracotta Underline Focus Animation */}
            <form onSubmit={handleSubscribe} className="space-y-2 max-w-sm">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#D9BFA0]">
                Join Our Slow Circle
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Enter your email address..."
                  className="w-full bg-transparent py-3 pr-10 text-sm text-[#FBF6EF] placeholder-[#FBF6EF]/40 focus:outline-none border-b border-[#FBF6EF]/20"
                />
                <button
                  type="submit"
                  className="absolute right-0 p-2 text-[#C1633B] hover:text-[#FBF6EF] transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
                {/* Center-out underline focus state */}
                <DrawUnderline active={focused} color="#C1633B" direction="center-out" />
              </div>
            </form>
          </div>

          {/* Navigation Links with Draw-On Underline Hover */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#D9BFA0]">Explore</h4>
            <div className="grid grid-cols-2 gap-4 text-sm font-medium">
              {footerNav.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onMouseEnter={() => setActiveHoverLink(link.name)}
                  onMouseLeave={() => setActiveHoverLink(null)}
                  className="relative py-1 text-[#FBF6EF]/80 hover:text-[#C1633B] transition-colors w-fit"
                >
                  {link.name}
                  <DrawUnderline active={activeHoverLink === link.name} color="#C1633B" />
                </a>
              ))}
            </div>
          </div>

          {/* Socials & Mono Hours */}
          <div className="lg:col-span-3 space-y-4 font-mono text-xs">
            <h4 className="uppercase tracking-widest text-[#D9BFA0]">Hours & Socials</h4>
            <div className="space-y-2 text-[#FBF6EF]/70">
              <p>Mon – Thu: 7:30 AM – 6:00 PM</p>
              <p>Fri – Sat: 7:30 AM – 8:00 PM</p>
              <p>Sun: 8:30 AM – 5:00 PM</p>
            </div>

            <div className="pt-4 flex items-center gap-4 text-[#FBF6EF]/80">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#C1633B] transition-colors flex items-center gap-1"
              >
                <span>Instagram</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#C1633B] transition-colors flex items-center gap-1"
              >
                <span>Pinterest</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-[#FBF6EF]/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#FBF6EF]/50">
          <p>© {currentYear} Vine & Clay Cafe & Ceramic Studio. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[#FBF6EF]/60">
            <span>Handcrafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#C1633B] fill-[#C1633B]" />
            <span>in Arts District</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
