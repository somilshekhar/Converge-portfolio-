"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface AboutProps {
  onOpenContact?: () => void;
}

export default function About({ onOpenContact }: AboutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);
  const clientsRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const statement =
    "From early-stage startups to growing enterprises, we run the entire digital cycle in-house — website, brand identity, social content, paid ads, and AI-powered systems — so founders get one accountable team instead of five disconnected vendors.";

  const words = statement.split(" ");

  const focusAreas = [
    "Web & App Development",
    "Branding & Identity",
    "Social Media & Performance Marketing",
    "AI Automation & Creative Tech",
  ];

  const selectedClients = [
    "Kunj Infrastructure",
    "Enki",
    "OceanBlue Eductaion",
    "Ahuja Career Institute",
    "STHEER",
    "MMG",
  ];

  useEffect(() => {
    const container = containerRef.current;
    const leftCol = leftColRef.current;
    const textEl = textRef.current;
    if (!container || !leftCol || !textEl) return;

    if (prefersReduced) {
      gsap.set([leftCol, textEl.querySelectorAll(".scrub-word"), focusRef.current, clientsRef.current], {
        opacity: 1,
        y: 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Left intro column enters FIRST on scroll
      gsap.fromTo(
        leftCol,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 2. Word-by-word reveal scrub for description
      const scrubWords = textEl.querySelectorAll(".scrub-word");
      gsap.fromTo(
        scrubWords,
        { opacity: 0.25 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: textEl,
            start: "top 80%",
            end: "bottom 50%",
            scrub: 0.8,
          },
        }
      );

      // 3. Creative Direction & Clients reveal
      if (focusRef.current) {
        gsap.fromTo(
          focusRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: focusRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (clientsRef.current) {
        gsap.fromTo(
          clientsRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: clientsRef.current,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, container);

    return () => ctx.revert();
  }, [prefersReduced]);

  const handleContactClick = () => {
    if (onOpenContact) {
      onOpenContact();
    } else {
      const lenis = (window as unknown as { __lenis?: { scrollTo: (t: string) => void } }).__lenis;
      if (lenis) {
        lenis.scrollTo("#contact");
      } else {
        const el = document.querySelector("#contact");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative py-20 md:py-28 px-6 md:px-12 bg-[#f7f8fa] dark:bg-[#050507] text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-white/10 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Left Column Eyebrow & Info (Sticky & Animates in First) */}
        <div
          ref={leftColRef}
          className="md:col-span-4 space-y-6 md:sticky md:top-32 will-change-transform"
        >
          <div className="flex items-center space-x-2 font-sans text-xs uppercase tracking-widest text-accent font-semibold">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span>INTRODUCTION</span>
          </div>

          <h2 className="font-display font-medium text-3xl md:text-5xl text-neutral-950 dark:text-white tracking-tight leading-tight">
            Full-Cycle Digital Partner
          </h2>

          <div>
            <button
              onClick={handleContactClick}
              data-cursor-text="TALK"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-neutral-300 dark:border-white/20 bg-neutral-100 dark:bg-white/10 px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white backdrop-blur-md transition-all duration-300 hover:border-accent hover:bg-accent hover:text-white dark:hover:text-white shadow-sm"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>Contact</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </button>
          </div>
        </div>

        {/* Right Column Statement & Focus Areas */}
        <div className="md:col-span-8 space-y-12">
          <p
            ref={textRef}
            data-mask-target
            className="font-display font-medium text-2xl md:text-4xl lg:text-5xl leading-[1.25] tracking-tight text-neutral-950 dark:text-white"
          >
            {words.map((word, idx) => (
              <span
                key={idx}
                className="scrub-word inline-block mr-2.5 transition-colors duration-150"
              >
                {word}
              </span>
            ))}
          </p>

          {/* Subheading / Creative Direction & Focus Areas */}
          <div ref={focusRef} className="pt-8 border-t border-neutral-200 dark:border-white/10 space-y-4">
            <h3 className="font-display font-medium text-xl text-neutral-950 dark:text-white tracking-tight">
              Our Niche
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {focusAreas.map((area) => (
                <span
                  key={area}
                  className="px-3.5 py-1.5 rounded-full border border-neutral-300 dark:border-white/10 bg-neutral-100 dark:bg-white/5 font-sans text-xs text-neutral-800 dark:text-neutral-300 font-medium hover:border-accent/40 transition-colors shadow-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Selected Clients */}
          <div ref={clientsRef} className="pt-8 border-t border-neutral-200 dark:border-white/10 space-y-4">
            <h3 className="font-display font-medium text-sm uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
              Selected Clients
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-sans text-sm text-neutral-900 dark:text-white font-medium">
              {selectedClients.map((client) => (
                <div key={client} className="flex items-center space-x-2 text-neutral-800 dark:text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>{client}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

