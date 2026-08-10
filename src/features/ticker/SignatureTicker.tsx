"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SentenceWord } from "@/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SignatureTickerProps {
  id: string;
  sentence: SentenceWord[];
}

export function SignatureTicker({ id, sentence }: SignatureTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Detect prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMotionChange);
    return () => mediaQuery.removeEventListener("change", handleMotionChange);
  }, []);

  useEffect(() => {
    if (isReducedMotion) return;

    const container = containerRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;

    if (!container || !track) return;

    let ctx = gsap.context(() => {
      const calcDistance = () => {
        const trackWidth = track.scrollWidth;
        const windowWidth = window.innerWidth;
        return Math.max(0, trackWidth - windowWidth + 120);
      };

      const distance = calcDistance();

      // Main pin & horizontal scroll timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 0.6, // physical weight & lag
          start: "top top",
          end: () => `+=${calcDistance() + window.innerHeight * 0.5}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progress) {
              gsap.to(progress, {
                scaleX: self.progress,
                duration: 0.1,
                ease: "none",
              });
            }
          },
        },
      });

      tl.to(track, {
        x: () => -calcDistance(),
        ease: "none",
      });

      // Sine wave vertical drift on emphasis words (±10px)
      const emphasisElements = track.querySelectorAll(".emphasis-word");
      emphasisElements.forEach((el, index) => {
        gsap.to(el, {
          y: index % 2 === 0 ? 10 : -10,
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });
    }, container);

    // Re-measure on font load
    if (document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    return () => ctx.revert();
  }, [isReducedMotion, sentence]);

  // SVG Line Art Marks matching the visual vocabulary
  const renderSvgMark = (mark?: string, color: string = "#C1633B") => {
    switch (mark) {
      case "comma":
        return (
          <svg className="w-8 h-8 md:w-12 md:h-12 inline-block shrink-0" viewBox="0 0 36 36" fill="none">
            <path
              d="M 12,8 C 12,4 18,2 22,2 C 22,8 16,14 14,22 C 13,26 10,28 8,28"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        );
      case "cup":
        return (
          <svg className="w-10 h-10 md:w-14 md:h-14 inline-block shrink-0" viewBox="0 0 48 48" fill="none">
            <path
              d="M 10,16 L 38,16 L 35,36 C 34,39 30,42 24,42 C 18,42 14,39 13,36 Z"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 38,20 C 43,20 44,24 44,27 C 44,30 40,32 36,32"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 18,10 C 18,6 22,4 20,2"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 28,10 C 28,6 32,4 30,2"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        );
      case "squiggle":
        return (
          <svg className="w-12 h-6 md:w-16 md:h-8 inline-block shrink-0" viewBox="0 0 60 24" fill="none">
            <path
              d="M 4,12 C 12,2 20,22 30,12 C 40,2 48,22 56,12"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        );
      case "leaf":
        return (
          <svg className="w-8 h-8 md:w-12 md:h-12 inline-block shrink-0" viewBox="0 0 36 36" fill="none">
            <path
              d="M 6,30 C 6,30 10,10 28,6 C 28,6 24,26 6,30 Z"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M 6,30 C 14,22 20,16 28,6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      case "star":
        return (
          <svg className="w-8 h-8 md:w-10 md:h-10 inline-block shrink-0" viewBox="0 0 36 36" fill="none">
            <path d="M 18,2 L 18,34 M 2,18 L 34,18 M 7,7 L 29,29 M 7,29 L 29,7" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Fallback static rendering for prefers-reduced-motion
  if (isReducedMotion) {
    return (
      <section className="bg-white py-20 px-6 md:px-12 border-y border-[#D9BFA0]/30 text-center">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {sentence.map((word, idx) => (
            <span key={idx} className="inline-flex items-center gap-3">
              {word.isEmphasis ? (
                <span
                  className="font-fraunces italic text-3xl md:text-5xl"
                  style={{ color: word.color || "#C1633B" }}
                >
                  {word.text}
                </span>
              ) : (
                <span className="font-sans text-xl md:text-3xl text-[#33241A]/50">{word.text}</span>
              )}
              {word.svgMark && renderSvgMark(word.svgMark, word.color || "#C1633B")}
            </span>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      ref={containerRef}
      className="relative w-full h-screen bg-white overflow-hidden flex flex-col justify-center select-none border-y border-[#D9BFA0]/30"
    >
      {/* Pinned horizontal scrolling row */}
      <div className="w-full overflow-hidden py-12">
        <div
          ref={trackRef}
          className="flex items-center gap-6 md:gap-12 whitespace-nowrap px-12 md:px-24 will-change-transform"
        >
          {sentence.map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-4 md:gap-8 shrink-0">
              {item.isEmphasis ? (
                <span
                  className="emphasis-word font-fraunces italic text-4xl sm:text-6xl md:text-8xl tracking-tight transition-transform duration-300 hover:scale-105"
                  style={{ color: item.color || "#C1633B" }}
                >
                  {item.text}
                </span>
              ) : (
                <span className="font-sans text-2xl sm:text-4xl md:text-5xl text-[#33241A]/38 font-light tracking-wide">
                  {item.text}
                </span>
              )}

              {item.svgMark && (
                <div className="mx-2 md:mx-4 inline-flex items-center justify-center">
                  {renderSvgMark(item.svgMark, item.color || "#C1633B")}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fixed bottom progress rail */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FBF6EF]">
        <div
          ref={progressRef}
          className="h-full bg-[#C1633B] origin-left transform scale-x-0 transition-transform duration-75"
        />
      </div>
    </section>
  );
}
