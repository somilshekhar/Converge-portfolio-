"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface HeroProps {
  onOpenContact?: () => void;
}

export default function Hero({ onOpenContact }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const scrollTickRef = useRef<number | null>(null);
  const prefersReduced = useReducedMotion();

  const services = ["Web Development", "Branding", "AI Automation", "Social & SEO"];

  useEffect(() => {
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // Headline reveal
      tl.to(headlineRef.current, {
        y: "0%",
        opacity: 1,
        duration: 1.1,
        ease: "power4.out",
      });

      // Media center preview reveal
      tl.to(
        mediaRef.current,
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
        },
        "-=0.7"
      );

      // Tags reveal
      tl.to(
        tagsRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.6"
      );

      // CTA reveal
      tl.to(
        ctaRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
        },
        "-=0.5"
      );
    }, containerRef);

    const handleScroll = () => {
      if (scrollTickRef.current !== null) return;
      scrollTickRef.current = requestAnimationFrame(() => {
        if (scrollIndicatorRef.current) {
          const opacity = Math.max(0, 1 - window.scrollY / 250);
          scrollIndicatorRef.current.style.opacity = opacity.toString();
        }
        scrollTickRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener("scroll", handleScroll);
      if (scrollTickRef.current !== null) {
        cancelAnimationFrame(scrollTickRef.current);
      }
    };
  }, [prefersReduced]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-between pt-32 pb-12 px-6 md:px-12 bg-[#050507] overflow-hidden"
    >
      {/* Background Video Layer */}
      <video
        src="/videos/v1.mp4"
        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 720'%3E%3Crect fill='%23050507' width='1280' height='720'/%3E%3C/svg%3E"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 w-full h-full object-cover dark:opacity-40 opacity-20 pointer-events-none transition-opacity duration-500"
      />

      {/* Background Readability Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f7f8fa]/92 via-[#f7f8fa]/75 to-[#f7f8fa]/95 dark:from-[#050507]/85 dark:via-[#050507]/55 dark:to-[#050507]/90 pointer-events-none transition-colors duration-500" />

      {/* Background Subtle Mesh Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.04] dark:opacity-[0.03] pointer-events-none" />

      {/* Top Studio Label */}
      <div className="relative z-10 flex items-center justify-between font-sans text-xs uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="font-semibold text-neutral-900 dark:text-white">CONVERGE DIGITAL®</span>
        </div>
        <div className="hidden md:flex items-center space-x-4 text-neutral-600 dark:text-neutral-500 font-sans text-xs">
          <span>FULL-CYCLE DIGITAL GROWTH COMPANY</span>
          <span>•</span>
          <span>INDIA</span>
        </div>
      </div>

      {/* Hero Headline Section */}
      <div className="relative z-10 my-auto py-10 max-w-6xl mx-auto text-center md:text-left">
        <div className="overflow-hidden mb-8">
          <h1
            ref={headlineRef}
            className="font-display font-medium text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.02] tracking-tight text-neutral-950 dark:text-white translate-y-[110%] opacity-0 transition-all duration-700 max-w-5xl"
          >
            One team. Every digital channel. <span className="text-accent">Real growth.</span>
          </h1>
          <p className="font-sans text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 font-light leading-relaxed max-w-3xl mt-6">
            We run the full digital growth cycle for ambitious brands — website, content, ads, and AI systems that turn attention into revenue.
          </p>
        </div>

        {/* Center Visual Artwork Frame */}
        <div
          ref={mediaRef}
          className="relative my-10 max-w-5xl mx-auto h-56 md:h-80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl scale-95 opacity-0 transition-all dark-bg-context"
        >
          <div className="absolute inset-0 z-10 bg-gradient-to-tr from-accent/20 via-neutral-900/60 to-black mix-blend-screen pointer-events-none" />
          <video
            src="/videos/v2.mp4"
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 720'%3E%3Crect fill='%2308080c' width='1280' height='720'/%3E%3C/svg%3E"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            className="absolute inset-0 w-full h-full object-cover filter contrast-110 hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent opacity-80" />
          
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between font-sans text-xs text-neutral-300">
            <span className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>WEB • BRANDING • SOCIAL • AI • SEO</span>
            </span>
            <span className="hidden md:inline text-neutral-400 font-sans">INDIA & GLOBAL</span>
          </div>
        </div>

        {/* Subheadings / Focus Tags */}
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 md:gap-4 mt-8 pt-6 border-t border-neutral-300 dark:border-white/10 w-full">
          <div
            ref={tagsRef}
            className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 translate-y-6 opacity-0 w-full md:w-auto text-center"
          >
            {services.map((service) => (
              <span
                key={service}
                className="inline-flex items-center justify-center px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-neutral-300 dark:border-white/15 bg-neutral-100 dark:bg-white/5 font-sans text-xs md:text-sm font-medium tracking-wide text-neutral-800 dark:text-neutral-200 backdrop-blur-md hover:border-accent hover:text-white dark:hover:text-white hover:bg-accent transition-all text-center shadow-sm"
              >
                {service}
              </span>
            ))}
          </div>

          <div ref={ctaRef} className="translate-y-6 opacity-0 flex justify-center w-full md:w-auto">
            <button
              onClick={onOpenContact}
              data-cursor-text="START"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-neutral-300 dark:border-white/20 bg-neutral-100 dark:bg-white/10 px-7 sm:px-8 py-3 sm:py-3.5 font-sans text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white backdrop-blur-lg transition-all duration-500 hover:border-accent hover:bg-accent hover:text-white dark:hover:text-white shadow-sm"
            >
              <span className="relative z-10 flex items-center space-x-3">
                <span>Start a Project</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer Indicator */}
      <div className="relative z-10 flex items-end justify-between border-t border-neutral-300 dark:border-white/10 pt-6 font-sans text-xs text-neutral-600 dark:text-neutral-400">
        <div className="hidden md:flex items-center space-x-3">
          <span className="w-2 h-2 bg-accent rounded-full animate-ping" />
          <span className="font-semibold text-neutral-900 dark:text-white">BASED IN INDIA</span>
        </div>

        <div
          ref={scrollIndicatorRef}
          className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-opacity duration-300 cursor-pointer"
          onClick={() => {
            const lenis = (window as unknown as { __lenis?: { scrollTo: (t: string) => void } }).__lenis;
            if (lenis) {
              lenis.scrollTo("#about");
            } else {
              const el = document.querySelector("#about");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <span className="hidden md:inline uppercase tracking-widest text-[10px]">
            SCROLL TO EXPLORE
          </span>
          <ArrowDown className="w-4 h-4 text-accent animate-bounce" />
        </div>

        <div className="text-right hidden md:block">
          <span className="uppercase text-[10px] text-neutral-600 dark:text-neutral-400 font-sans">
            CONVERGE DIGITAL® • 2026
          </span>
        </div>
      </div>
    </section>
  );
}

