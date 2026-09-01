"use client";

import { useMemo } from "react";
import type { ComponentType } from "react";
import { ArrowUpRight, Layers, Sparkles, Cpu, TrendingUp } from "lucide-react";

export interface ServiceRowData {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  deliverables: string[];
  icon: ComponentType<{ className?: string }>;
}

interface ServicesProps {
  onOpenContact?: () => void;
}

export default function Services({ onOpenContact }: ServicesProps) {
  const services: ServiceRowData[] = useMemo(
    () => [
      {
        id: "service-1",
        number: "01",
        title: "Web & App Development",
        category: "FULLSTACK ENGINEERING // PERFORMANCE",
        description:
          "High-performance websites and web apps engineered with modern frameworks, fast load times, and built to convert — not just to look good.",
        deliverables: [
          "Custom Websites",
          "Web Applications",
          "E-Commerce & Booking Systems",
          "Edge Infrastructure",
        ],
        icon: Sparkles,
      },
      {
        id: "service-2",
        number: "02",
        title: "Branding & Identity",
        category: "BRAND STRATEGY // VISUAL SYSTEMS",
        description:
          "Distinct visual identities, logo systems, and packaging design that give a brand clarity and a lasting first impression.",
        deliverables: [
          "Brand Strategy",
          "Visual Identity",
          "Packaging & Print",
          "Brand Guidelines",
        ],
        icon: Layers,
      },
      {
        id: "service-3",
        number: "03",
        title: "Social Media & Performance Marketing",
        category: "CONTENT SYSTEMS // PAID MEDIA // SEO",
        description:
          "Full-funnel marketing — content calendars, reels, and campaigns running alongside paid ads and technical SEO — managed end-to-end so brands stay visible and keep growing after launch.",
        deliverables: [
          "Content Calendars & Reels",
          "Meta & Google Ads",
          "Technical SEO",
          "Performance Monitoring",
        ],
        icon: TrendingUp,
      },
      {
        id: "service-4",
        number: "04",
        title: "AI Automation & Creative Tech",
        category: "INTELLIGENT SYSTEMS // AUTOMATION",
        description:
          "Custom AI tools that automate content production and operations — from trend-aware content generation pipelines to AI-driven product photography — with a human approval step before anything goes live.",
        deliverables: [
          "AI Content Automation",
          "AI Product Photography",
          "Agent & LLM Pipelines",
          "Process Automation",
        ],
        icon: Cpu,
      },
    ],
    []
  );

  return (
    <section
      id="services"
      className="relative flex h-full min-h-[100svh] w-full flex-col justify-between bg-[#f7f8fa] dark:bg-[#050507] text-neutral-900 dark:text-white px-6 md:px-12 pt-24 md:pt-28 pb-6 md:pb-8 transition-colors duration-300"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-white/10">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 font-sans text-xs uppercase tracking-widest text-accent font-semibold">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span>DIGITAL CAPABILITIES</span>
          </div>
          <h2 className="font-display font-medium text-4xl md:text-6xl text-neutral-950 dark:text-white tracking-tight">
            Services & Practice
          </h2>
        </div>
        <p className="font-sans text-sm md:text-lg text-neutral-700 dark:text-neutral-300 font-light tracking-wide max-w-md">
          Four in-house disciplines, one growth engine — built for brands that need more than just a website.
        </p>
      </div>

      {/* Capability Rows */}
      <div className="flex-1 min-h-0 overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex flex-col justify-center min-h-full py-4">
          {services.map((service) => (
          <article
            key={service.id}
            data-cursor-text="INQUIRE"
            className="group grid grid-cols-1 lg:grid-cols-12 items-center gap-3 lg:gap-6 border-b border-neutral-200 dark:border-white/10 py-4 px-1 lg:px-3 transition-colors duration-300 hover:bg-neutral-100/60 dark:hover:bg-white/[0.03]"
          >
            <span className="font-mono text-xs font-bold text-accent lg:col-span-1">
              {service.number}
            </span>

            <div className="lg:col-span-4 flex items-start lg:items-center gap-3">
              <service.icon className="w-4 h-4 text-accent mt-1 lg:mt-0 flex-shrink-0" />
              <div>
                <h3 className="font-display font-medium text-lg md:text-2xl text-neutral-950 dark:text-white tracking-tight group-hover:text-accent transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="font-sans text-[10px] md:text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-semibold mt-0.5">
                  {service.category}
                </p>
              </div>
            </div>

            <p className="lg:col-span-4 font-sans text-xs text-neutral-700 dark:text-neutral-300 font-light leading-relaxed lg:line-clamp-2">
              {service.description}
            </p>

            <div className="hidden sm:flex lg:col-span-2 flex-wrap gap-1.5">
              {service.deliverables.map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-1 rounded-full border border-neutral-300 dark:border-white/10 bg-neutral-100 dark:bg-white/5 font-sans text-[10px] text-neutral-800 dark:text-neutral-300 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <button
              onClick={onOpenContact}
              aria-label={`Request capability: ${service.title}`}
              className="lg:col-span-1 justify-self-start lg:justify-self-end inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-300 group-hover:text-accent transition-colors duration-300"
            >
              <span className="hidden lg:inline">Request</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}
