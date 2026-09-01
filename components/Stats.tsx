"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface StatItem {
  number: number;
  suffix: string;
  label: string;
  subtext: string;
}

export default function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);
  const prefersReduced = useReducedMotion();

  const stats: StatItem[] = useMemo(
    () => [
      {
        number: 48,
        suffix: "+",
        label: "AWWWARDS & FWA HONORS",
        subtext: "Site of the Day, Developer & Innovation trophies",
      },
      {
        number: 99,
        suffix: ".9%",
        label: "SIMULATION ACCURACY",
        subtext: "Zero-day threat emulation fidelity metric",
      },
      {
        number: 140,
        suffix: "M+",
        label: "GLOBAL USER IMPRESSIONS",
        subtext: "Across active client digital platforms",
      },
      {
        number: 12,
        suffix: "ms",
        label: "AVERAGE TIME TO INTERACTIVE",
        subtext: "Sub-50ms render budget strictly enforced",
      },
    ],
    []
  );

  useEffect(() => {
    if (prefersReduced) {
      setCounts(stats.map((s) => s.number));
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 75%",
        onEnter: () => {
          stats.forEach((stat, idx) => {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: stat.number,
              duration: 2,
              ease: "power3.out",
              onUpdate: () => {
                setCounts((prev) => {
                  const updated = [...prev];
                  updated[idx] = Math.floor(obj.val);
                  return updated;
                });
              },
            });
          });
        },
        once: true,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReduced, stats]);

  return (
    <section
      ref={containerRef}
      className="relative py-28 md:py-36 px-6 md:px-12 bg-[#f7f8fa] dark:bg-[#050507] border-b border-neutral-200 dark:border-white/10 overflow-hidden transition-colors duration-300"
    >
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center space-x-2 font-mono text-xs uppercase tracking-widest text-accent mb-12">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span>07 / QUANTIFIABLE SUPREMACY</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-[#0c0c10] border border-neutral-200 dark:border-white/10 rounded-2xl p-8 flex flex-col justify-between space-y-4 hover:border-accent/40 transition-colors shadow-sm"
            >
              <div
                aria-label={`${stat.number}${stat.suffix} ${stat.label}`}
              >
                <div className="font-display text-5xl md:text-6xl font-extrabold text-neutral-950 dark:text-white tracking-tight flex items-baseline">
                  <span aria-hidden="true">{counts[i]}</span>
                  <span aria-hidden="true" className="text-accent ml-1 font-sans">{stat.suffix}</span>
                </div>
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mt-4">
                  {stat.label}
                </h3>
              </div>

              {/* Animated Progress Bar */}
              <div>
                <div className="w-full bg-neutral-200 dark:bg-white/10 h-1 rounded-full overflow-hidden mb-2">
                  <div
                    className="bg-accent h-full transition-all duration-1000 ease-out"
                    style={{ width: `${(counts[i] / stat.number) * 100}%` }}
                  />
                </div>
                <p className="font-sans text-[11px] text-neutral-600 dark:text-neutral-400">
                  {stat.subtext}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
