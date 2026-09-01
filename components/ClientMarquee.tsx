"use client";

import { useMemo } from "react";

export default function ClientMarquee() {
  const clients = useMemo(
    () => [
      "OCEAN BLUE EDUCATION",
      "VELUNOR",
      "ENKI",
      "THE NILGIRI CO.",
      "KUNJ INFRASTRUCTURE",
      "GANPATI COMPUTERS",
      "STHEER",
      "MAHESH MASALA",
      "SCOOPE",
      "VNS HOSTEL",
      "AHUJA CAREER INSTITUTE",
      "HARIKRUSHNA EYE HOSPITAL",
      "ESTORA",
      "GELATO ITALIANO",
      "CLICKIN PIXELS",
      "KRUNIX GRAPHICS",
    ],
    []
  );

  return (
    <section className="relative py-12 md:py-16 bg-[#f1f3f6] dark:bg-[#141418] border-y border-neutral-200 dark:border-white/10 overflow-hidden transition-colors duration-300">
      {/* Top Section Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-6 flex items-center justify-between font-sans text-xs uppercase tracking-widest text-neutral-600 dark:text-neutral-400 font-semibold select-none">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span className="text-neutral-900 dark:text-white">TRUSTED RELATIONSHIPS</span>
        </div>
        <span className="hidden md:inline text-neutral-600 dark:text-neutral-400 font-normal">CLIENT ROSTER</span>
      </div>

      {/* Gradient Edge Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-[#f1f3f6] dark:from-[#141418] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-[#f1f3f6] dark:from-[#141418] to-transparent z-10 pointer-events-none" />

      {/* Marquee Track */}
      <div className="relative flex overflow-x-hidden marquee-pause-on-hover select-none">
        <div className="flex shrink-0 whitespace-nowrap will-change-transform animate-marquee-track">
          {clients.map((client, index) => (
            <div
              key={`${client}-${index}`}
              data-cursor-text="CLIENT"
              className="mx-6 md:mx-10 flex items-center space-x-4 opacity-75 hover:opacity-100 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <div className="h-2 w-2 bg-accent rounded-full flex-shrink-0" />
              <span className="font-display text-xl sm:text-2xl md:text-3xl font-medium tracking-wide text-neutral-950 dark:text-white hover:text-accent dark:hover:text-accent transition-colors">
                {client}
              </span>
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="flex shrink-0 whitespace-nowrap will-change-transform animate-marquee-track">
          {clients.map((client, index) => (
            <div
              key={`${client}-dup-${index}`}
              data-cursor-text="CLIENT"
              className="mx-6 md:mx-10 flex items-center space-x-4 opacity-75 hover:opacity-100 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <div className="h-2 w-2 bg-accent rounded-full flex-shrink-0" />
              <span className="font-display text-xl sm:text-2xl md:text-3xl font-medium tracking-wide text-neutral-950 dark:text-white hover:text-accent dark:hover:text-accent transition-colors">
                {client}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

