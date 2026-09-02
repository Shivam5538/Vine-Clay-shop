"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import {
  Volume2,
  VolumeX,
  Radio,
  Play,
  Pause,
  Coffee,
  Sparkles,
  Flame,
  Calendar,
  ArrowRight,
  Sun,
  Thermometer,
} from "lucide-react";

interface AmbienceTrack {
  id: string;
  name: string;
  category: string;
  bpm: string;
  description: string;
  icon: typeof Coffee;
}

export function AmbientStudioConsole() {
  const { openReservation } = useCartStore();
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeTrack, setActiveTrack] = useState<string>("steam");
  const [selectedParty, setSelectedParty] = useState<string>("2");

  const tracks: AmbienceTrack[] = [
    {
      id: "steam",
      name: "01. Morning Steam & Crema",
      category: "Espresso Bar",
      bpm: "Unhurried Pace",
      description: "Gentle 9-bar pump extraction, rhythmic portafilter knocks, and silky steam wand milk swirl.",
      icon: Coffee,
    },
    {
      id: "wheel",
      name: "02. Studio Wheel Resonance",
      category: "Ceramic Workshop",
      bpm: "Centering Flow",
      description: "Low hum of Studio Wheel No. 04, water sponges smoothing wet clay rims, terracotta scraping.",
      icon: Sparkles,
    },
    {
      id: "hearth",
      name: "03. Dusk Hearth & Vinyl",
      category: "Evening Lounge",
      bpm: "Mellow Dusk",
      description: "Warm needle crackle on analog vinyl jazz, cedar wood warmth, and muted evening conversation.",
      icon: Flame,
    },
  ];

  const currentTrack = tracks.find((t) => t.id === activeTrack) || tracks[0];
  const CurrentIcon = currentTrack.icon;

  return (
    <section
      id="ambient-console"
      className="relative w-full py-24 sm:py-32 px-6 md:px-12 bg-[#140D09] text-[#FBF6EF] overflow-hidden select-none border-t border-white/5"
    >
      {/* Background Terracotta Glowing Aurora */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(193,99,59,0.22)_0%,rgba(107,117,72,0.12)_40%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C1633B]/10 border border-[#C1633B]/30 text-xs font-mono tracking-widest uppercase text-[#C1633B]">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Interactive Studio Soundscape & Reservation Terminal</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-fraunces font-light tracking-tight text-white">
              The Ambient <span className="italic font-normal text-[#C1633B]">Console.</span>
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-[#D9BFA0]/70 max-w-md font-light">
            Tune into the live frequencies of our studio workshop or secure your window corner before you arrive.
          </p>
        </div>

        {/* 2-Column Split: Interactive Soundscape Player + Table Lock */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Interactive Soundscape Visualizer (7 cols) */}
          <div className="lg:col-span-7 bg-[#1C130D]/80 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl flex flex-col justify-between space-y-8">
            {/* Top Bar: Live Player Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full bg-[#C1633B] hover:bg-[#D9764E] text-white flex items-center justify-center transition-all duration-300 shadow-lg shadow-[#C1633B]/25 hover:scale-105 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <p className="font-mono text-xs uppercase tracking-widest text-[#D9BFA0]">
                      {isPlaying ? "Live Ambience Synthesizer" : "Paused"}
                    </p>
                  </div>
                  <h4 className="font-fraunces text-lg text-white font-medium">
                    {currentTrack.name}
                  </h4>
                </div>
              </div>

              {/* Sound Equalizer Visualizer Bars */}
              <div className="flex items-end gap-1 h-8 px-3 py-1 rounded-xl bg-black/40 border border-white/10">
                {[14, 28, 20, 32, 18, 26, 12, 30, 22].map((height, i) => (
                  <motion.div
                    key={i}
                    animate={
                      isPlaying
                        ? {
                            height: [
                              `${height * 0.4}px`,
                              `${height}px`,
                              `${height * 0.7}px`,
                              `${height * 1.1}px`,
                              `${height * 0.5}px`,
                            ],
                          }
                        : { height: "4px" }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: 0.8 + (i % 4) * 0.25,
                      ease: "easeInOut",
                    }}
                    className="w-1 bg-[#C1633B] rounded-full"
                  />
                ))}
              </div>
            </div>

            {/* Track Description */}
            <p className="font-sans text-sm text-[#FBF6EF]/75 font-light leading-relaxed">
              {currentTrack.description}
            </p>

            {/* Track Selector Tabs */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#D9BFA0]/60">
                Select Audio Frequency:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {tracks.map((track) => {
                  const Icon = track.icon;
                  const isSelected = activeTrack === track.id;

                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => {
                        setActiveTrack(track.id);
                        setIsPlaying(true);
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "bg-[#C1633B]/20 border-[#C1633B] text-white shadow-lg ring-1 ring-[#C1633B]/50"
                          : "bg-white/5 border-white/10 text-[#D9BFA0] hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="w-4 h-4 text-[#C1633B]" />
                        <span className="text-[10px] font-mono uppercase text-[#D9BFA0]/60">
                          {track.category}
                        </span>
                      </div>
                      <p className="font-fraunces text-sm font-medium truncate">{track.name.split(". ")[1]}</p>
                      <p className="text-[11px] font-mono text-[#D9BFA0]/50 mt-0.5">{track.bpm}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Realtime Telemetry Strip */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-4 text-xs font-mono text-[#D9BFA0]/70">
              <div className="flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 text-[#C1633B]" />
                <span>Sunlit Bay: 3,400 Lux</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-3.5 h-3.5 text-[#6B7548]" />
                <span>Water: 92°C Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D9BFA0]" />
                <span>Wheel No. 04 Active</span>
              </div>
            </div>
          </div>

          {/* Right Column: Modern Table Lock Console (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#241811] to-[#1A110B] rounded-3xl p-8 sm:p-10 border border-white/15 shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono uppercase tracking-widest text-[#D9BFA0]">
                <span>Concierge Desk</span>
              </div>

              <div>
                <h3 className="font-fraunces text-2xl sm:text-3xl font-light text-white leading-snug">
                  Claim your sunlit corner.
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#D9BFA0]/70 mt-1 font-light">
                  Reserve a quiet window seat for single-origin tasting or studio wheel viewing.
                </p>
              </div>

              {/* Party Size Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#D9BFA0]/80">
                  Party Preference:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { val: "1", label: "Solo", sub: "Reading" },
                    { val: "2", label: "Pair", sub: "Corner" },
                    { val: "4", label: "Group", sub: "Booth" },
                  ].map((p) => {
                    const isSelected = selectedParty === p.val;
                    return (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => setSelectedParty(p.val)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#C1633B] border-[#C1633B] text-white shadow-md"
                            : "bg-white/5 border-white/10 text-[#D9BFA0] hover:bg-white/10"
                        }`}
                      >
                        <p className="font-fraunces text-base font-medium">{p.label}</p>
                        <p className="text-[10px] font-mono opacity-70">{p.sub}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Instant Reserve Button */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={openReservation}
                className="w-full py-4 px-6 rounded-full bg-[#C1633B] hover:bg-[#D9764E] text-white font-sans text-sm font-medium transition-all duration-300 shadow-xl shadow-[#C1633B]/25 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve This Corner</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
              <p className="text-center font-mono text-[11px] text-[#D9BFA0]/50">
                Live booking system • Instant table confirmation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
