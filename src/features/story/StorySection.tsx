"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function StorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const imgBox = imageContainerRef.current;

    if (!section || !imgBox) return;

    let ctx = gsap.context(() => {
      // Gentle parallax on image (0.85x scroll speed relative to text)
      gsap.to(imgBox, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      // Top-to-bottom clip-path wipe for paragraphs
      const paragraphs = section.querySelectorAll(".clip-paragraph");
      paragraphs.forEach((p) => {
        ScrollTrigger.create({
          trigger: p,
          start: "top 85%",
          onEnter: () => p.classList.add("is-visible"),
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="py-28 px-6 md:px-12 bg-[#FBF6EF] border-b border-[#D9BFA0]/30 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Image Block with Parallax */}
        <div className="lg:col-span-6 relative">
          <div
            ref={imageContainerRef}
            className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-[#D9BFA0]/30"
          >
            <Image
              src="/images/story_studio.png"
              alt="Potter's hands shaping raw clay on a spinning wheel"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#33241A]/50 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-[#D9BFA0]/40 text-[#33241A]">
              <p className="font-mono text-xs text-[#C1633B] uppercase tracking-widest mb-1">
                Studio Wheel No. 04
              </p>
              <p className="font-fraunces text-base font-medium">
                “Every piece retains the warmth of the hands that held it.”
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Body Copy with Top-to-Bottom Clip-Path Reveal */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#6B7548]">
              Established 2021 • Our Philosophy
            </span>
            <h2 className="text-4xl lg:text-5xl font-fraunces font-light text-[#33241A] tracking-tight leading-tight">
              An sanctuary born from <span className="italic text-[#C1633B]">earth, fire,</span> & water.
            </h2>
          </div>

          <div className="space-y-6 font-sans text-base text-[#33241A]/80 leading-relaxed">
            <p className="clip-paragraph">
              Vine & Clay began as a quiet conversation between a ceramicist and a coffee roaster. We believed that the ritual of morning coffee deserved more than a paper cup swallowed in a hurry on a crowded sidewalk.
            </p>

            <p className="clip-paragraph">
              In our open-plan studio, the gentle hum of the pottery wheel rhythmically pairs with the hiss of the steam wand. We source high-elevation Arabica directly from small family farms, roast in small 5kg batches, and serve every drink in stoneware thrown right here in our back workshop.
            </p>

            <p className="clip-paragraph">
              There are no digital timer screens ticking down at the counter. Here, we invite you to sit by the sunlit window, touch raw unglazed terracotta, smell caramelizing sourdough, and let time unspool naturally.
            </p>
          </div>

          {/* Founder Signature Motif */}
          <div className="pt-6 border-t border-[#D9BFA0]/40 flex items-center justify-between">
            <div>
              <p className="font-fraunces italic text-lg text-[#33241A]">Clara & Julian Vance</p>
              <p className="font-mono text-xs text-[#33241A]/60">Co-founders & Master Craftsmen</p>
            </div>

            <div className="w-12 h-12 rounded-full border border-[#C1633B] text-[#C1633B] flex items-center justify-center font-fraunces italic font-bold text-lg">
              &
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
