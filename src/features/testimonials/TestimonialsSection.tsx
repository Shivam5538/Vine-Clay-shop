"use client";

import { motion } from "framer-motion";
import { LineQuoteMark } from "@/components/ui/LineQuoteMark";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const reviews = [
    {
      quote:
        "The moment you step into Vine & Clay, the pace of the city simply vanishes. Their Ethiopia pourover served in a heavy terracotta mug is the highlight of my week.",
      author: "Miriam Chen",
      role: "Architect & Regular Visitor",
      rating: 5,
    },
    {
      quote:
        "Watching the ceramicists throw clay while drinking stoneground matcha feels like watching living art. Truly a special corner of unhurried craftsmanship.",
      author: "David Thorne",
      role: "Design Critic",
      rating: 5,
    },
    {
      quote:
        "Their sourdough croissant is easily the best in the city — crisp shell, impossibly buttery layers, paired with coffee that tastes of wild berries.",
      author: "Sophia Al-Mansoor",
      role: "Food & Travel Editor",
      rating: 5,
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-24 px-6 md:px-12 bg-[#FBF6EF] border-b border-[#D9BFA0]/30"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#6B7548]">
            Community Echoes
          </span>
          <h2 className="text-4xl md:text-5xl font-fraunces font-light text-[#33241A] tracking-tight">
            Words from our <span className="italic font-normal text-[#C1633B]">neighbors.</span>
          </h2>
        </div>

        {/* Testimonials Grid with Framer Motion stagger reveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: "easeOut" }}
              className="testimonial-card relative bg-white p-8 rounded-3xl border border-[#D9BFA0]/40 shadow-xs flex flex-col justify-between"
            >
              {/* Thin Line-Art SVG Quote Mark Flourish */}
              <div className="mb-4">
                <LineQuoteMark color="#C1633B" type="open" className="w-10 h-10" />
              </div>

              {/* Quote Content */}
              <p className="font-sans text-sm text-[#33241A]/85 leading-relaxed mb-6 font-normal">
                &ldquo;{rev.quote}&rdquo;
              </p>

              {/* Author & Rating */}
              <div className="pt-4 border-t border-[#D9BFA0]/30 flex items-center justify-between">
                <div>
                  <h3 className="font-fraunces font-medium text-base text-[#33241A]">{rev.author}</h3>
                  <p className="font-mono text-xs text-[#33241A]/50">{rev.role}</p>
                </div>

                <div className="flex items-center gap-0.5 text-[#C1633B]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C1633B]" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

