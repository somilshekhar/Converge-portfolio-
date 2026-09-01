"use client";

import React from "react";

export default function CollaborateCTA({ onOpenContact }: { onOpenContact?: () => void }) {
  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-[#f7f8fa] dark:bg-[#050507]">
      <div className="max-w-6xl mx-auto bg-white dark:bg-[#0a0a0c] border border-neutral-200 dark:border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-8 sm:p-14 md:p-24 flex flex-col items-center text-center shadow-lg dark:shadow-2xl">
        {/* Pill Tag */}
        <div className="mb-6 sm:mb-8 inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30">
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-accent font-semibold">
            COLLABORATE WITH US
          </span>
        </div>

        {/* Headline */}
        <h2 className="font-display font-medium text-3xl sm:text-4xl md:text-6xl text-neutral-950 dark:text-white tracking-tight leading-tight mb-4 sm:mb-6 max-w-3xl">
          Have a growth problem worth solving?
        </h2>

        {/* Subheading */}
        <p className="font-sans text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-2xl mb-8 sm:mb-12">
          We partner with select brands and founders to run their website, social presence, content, ads, and AI systems — end to end.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={onOpenContact}
            className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-accent hover:bg-accent/90 text-white rounded-full font-sans text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group shadow-md"
          >
            START A PROJECT
            <svg className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </button>
          <a
            href="mailto:hello@convergedigitals.com"
            className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-transparent border border-neutral-300 dark:border-white/20 hover:border-neutral-950 dark:hover:border-white text-neutral-950 dark:text-white rounded-full font-sans text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 flex items-center justify-center"
          >
            EMAIL US DIRECTLY
          </a>
        </div>
      </div>
    </section>
  );
}
