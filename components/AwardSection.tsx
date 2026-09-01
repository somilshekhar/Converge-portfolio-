"use client";

import Image from "next/image";
import { Trophy, Sparkles, Award } from "lucide-react";

export default function AwardSection() {
  return (
    <section className="relative py-16 md:py-24 px-6 md:px-12 bg-[#edeef2] dark:bg-[#0a0a0f] text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-white/10 overflow-hidden transition-colors duration-300">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
        {/* Left Text Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-sans text-xs uppercase tracking-widest font-semibold">
            <Trophy className="w-3.5 h-3.5" />
            <span>GLOBAL RECOGNITION</span>
          </div>

          <h2 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-neutral-950 dark:text-white tracking-tight leading-[1.08]">
            Nominated in the <span className="text-accent">APAC Insider</span> Global Business Awards 2026
          </h2>

          <p className="font-sans text-base md:text-lg text-neutral-600 dark:text-neutral-300 font-light leading-relaxed max-w-2xl">
            Recognized for excellence in full-cycle digital growth, engineering high-performance web systems, and driving creative technology across Asia-Pacific and global markets.
          </p>

          {/* Highlights / Badges Row */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
            <div className="p-4 rounded-xl bg-white/70 dark:bg-white/5 border border-neutral-200 dark:border-white/10 backdrop-blur-md shadow-sm">
              <div className="text-accent font-mono font-semibold uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>ORGANIZATION</span>
              </div>
              <div className="font-medium text-neutral-900 dark:text-white text-sm">APAC Insider</div>
            </div>

            <div className="p-4 rounded-xl bg-white/70 dark:bg-white/5 border border-neutral-200 dark:border-white/10 backdrop-blur-md shadow-sm">
              <div className="text-accent font-mono font-semibold uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PROGRAM</span>
              </div>
              <div className="font-medium text-neutral-900 dark:text-white text-sm">Global Business Awards</div>
            </div>

            <div className="p-4 rounded-xl bg-white/70 dark:bg-white/5 border border-neutral-200 dark:border-white/10 backdrop-blur-md shadow-sm">
              <div className="text-accent font-mono font-semibold uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>EDITION</span>
              </div>
              <div className="font-medium text-neutral-900 dark:text-white text-sm">2026 Nominee</div>
            </div>
          </div>
        </div>

        {/* Right Image Showcase Card */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative group w-full max-w-md rounded-2xl overflow-hidden border border-neutral-300 dark:border-white/15 bg-white dark:bg-[#121218] p-4 sm:p-6 shadow-2xl transition-all duration-500 hover:border-accent/50 hover:shadow-accent/15">
            {/* Ambient Background Gradient Glow inside card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-accent/5 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-neutral-900 flex items-center justify-center p-2">
              <Image
                src="/images/apac-award-2026.png"
                alt="Nominated in APAC Insider Global Business Awards 2026"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-contain filter contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
            </div>

            <div className="mt-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              <span className="flex items-center space-x-1.5 text-accent font-semibold">
                <Trophy className="w-3.5 h-3.5" />
                <span>OFFICIAL NOMINEE</span>
              </span>
              <span>APAC INSIDER 2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
