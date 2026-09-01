"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, Eye, Layers, Cpu, Rocket, TrendingUp } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface Step {
  id: string;
  num: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const steps: Step[] = useMemo(
    () => [
      {
        id: "discover",
        num: "01",
        title: "DISCOVER",
        desc: "We learn your business, your users, and what 'done well' actually means for you.",
        icon: <Search className="w-4 h-4 text-accent" />,
      },
      {
        id: "strategy",
        num: "02",
        title: "STRATEGY",
        desc: "We map the site or campaign to a goal, not a template.",
        icon: <Eye className="w-4 h-4 text-accent" />,
      },
      {
        id: "design",
        num: "03",
        title: "DESIGN",
        desc: "Every screen is designed with intent — nothing dropped in from a kit.",
        icon: <Layers className="w-4 h-4 text-accent" />,
      },
      {
        id: "develop",
        num: "04",
        title: "DEVELOP",
        desc: "Built clean, fast, and built to last past launch day.",
        icon: <Cpu className="w-4 h-4 text-accent" />,
      },
      {
        id: "launch",
        num: "05",
        title: "LAUNCH",
        desc: "Shipped, tested, and handed off without loose ends.",
        icon: <Rocket className="w-4 h-4 text-accent" />,
      },
      {
        id: "grow",
        num: "06",
        title: "GROW",
        desc: "Ongoing content, ads, and AI-driven automation once it's live — growth doesn't stop at launch day.",
        icon: <TrendingUp className="w-4 h-4 text-accent" />,
      },
    ],
    []
  );

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    if (prefersReduced) {
      steps.forEach((_, idx) => {
        gsap.set(`.process-step-card-${idx}`, { opacity: 1, yPercent: 0 });
      });
      return;
    }

    const mm = gsap.matchMedia();

    // DESKTOP PINNED STAGE (min-width: 1024px)
    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: "top top",
          end: "+=500%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: [0, 0.16, 0.33, 0.5, 0.66, 0.83, 1],
            duration: { min: 0.2, max: 0.4 },
            delay: 0.05,
            ease: "power1.inOut",
          },
        },
      });

      // Initial state: cards positioned below mask
      steps.forEach((_, idx) => {
        gsap.set(`.process-step-card-${idx}`, {
          yPercent: 120,
          opacity: 0,
        });
      });

      // Discrete step-by-step slide-up with hold buffers between each card
      steps.forEach((_, idx) => {
        // Slide up current card
        tl.to(`.process-step-card-${idx}`, {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        });

        // Dedicated hold pause before the next card can begin
        if (idx < steps.length - 1) {
          tl.to({}, { duration: 0.6 });
        }
      });

      // Final settled hold buffer when all 6 cards are assembled
      tl.to({}, { duration: 1.2 });
    });

    // MOBILE & TABLET (max-width: 1023px)
    mm.add("(max-width: 1023px)", () => {
      steps.forEach((_, idx) => {
        gsap.fromTo(
          `.process-step-card-${idx}`,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: `.process-step-wrap-${idx}`,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });

    return () => mm.revert();
  }, [prefersReduced, steps]);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative z-20 bg-[#f7f8fa] dark:bg-[#0A0A0C] border-t border-neutral-200 dark:border-white/10 transition-colors duration-300"
    >
      <div
        ref={triggerRef}
        className="w-full lg:min-h-screen max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 lg:py-0 lg:flex lg:flex-col lg:justify-center"
      >
        {/* Section Headline */}
        <div className="mb-12 md:mb-16 lg:mb-20">
          <h2 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl text-neutral-950 dark:text-white tracking-tight uppercase">
            HOW WE <span className="text-accent">WORK</span>
          </h2>
        </div>

        {/* 6-Column Grid Layout with Masked Slide-Up Wrappers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6 xl:gap-8 items-start">
          {steps.map((step, idx) => {
            const isDimmed = hoveredIdx !== null && hoveredIdx !== idx;

            return (
              <div
                key={step.id}
                className={`process-step-wrap-${idx} overflow-hidden pt-2 pb-4`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div
                  className={`process-step-card-${idx} flex flex-col space-y-4 group will-change-transform ${
                    isDimmed ? "opacity-30" : "opacity-100"
                  }`}
                >
                  {/* Giant Orange Step Number */}
                  <div className="select-none">
                    <span className="font-display font-extrabold text-5xl sm:text-6xl xl:text-7xl leading-none text-accent tracking-tight block">
                      {step.num}
                    </span>
                  </div>

                  {/* Icon + Step Title Badge */}
                  <div className="flex items-center space-x-2.5 pt-1">
                    <div className="p-1.5 rounded-lg bg-neutral-200/80 dark:bg-white/10 border border-neutral-300 dark:border-white/10 flex items-center justify-center transition-colors group-hover:border-accent/40">
                      {step.icon}
                    </div>
                    <h3 className="font-display font-bold text-sm tracking-wider uppercase text-neutral-950 dark:text-white group-hover:text-accent transition-colors">
                      {step.title}
                    </h3>
                  </div>

                  {/* Step Description */}
                  <p className="font-sans text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
