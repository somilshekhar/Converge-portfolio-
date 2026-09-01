"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import LightboxModal from "./LightboxModal";
import FilterProjectCard from "./FilterProjectCard";
import { ALL_PROJECTS, type FilterProject } from "@/data/projects";
import { usePageTransition } from "./SvgPageTransition";

interface PortfolioGridProps {
  onOpenContact?: () => void;
}

export default function PortfolioGrid({ onOpenContact }: PortfolioGridProps) {
  const { navigateWithTransition } = usePageTransition();
  const [selectedProject, setSelectedProject] = useState<FilterProject | null>(null);

  // Take the first 6 featured projects for homepage showcase
  const projects = useMemo(() => ALL_PROJECTS.slice(0, 6), []);

  return (
    <>
      <section
        id="work"
        className="relative py-16 md:py-22 px-6 md:px-12 bg-[#f7f8fa] dark:bg-[#050507] border-b border-neutral-200 dark:border-white/10 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-neutral-200 dark:border-white/10 gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center space-x-2 font-sans text-xs uppercase tracking-widest text-accent font-semibold">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span>CREATIVE DEVELOPMENT</span>
              </div>
              <h2 className="font-display font-medium text-4xl md:text-6xl text-neutral-950 dark:text-white tracking-tight">
                Featured Works
              </h2>
              <p className="font-sans text-base md:text-lg text-neutral-700 dark:text-neutral-300 font-light leading-relaxed pt-2">
                Every project is an opportunity to blend design and development — transforming bold ideas into refined digital experiences built with intent, speed, and visual clarity.
              </p>
            </div>

            <div>
              <Link
                href="/work"
                onClick={(e) => {
                  e.preventDefault();
                  navigateWithTransition("/work");
                }}
                data-cursor-text="ALL WORK"
                className="group inline-flex items-center space-x-2 border border-neutral-300 dark:border-white/20 bg-neutral-100 dark:bg-white/5 hover:border-accent hover:bg-accent text-neutral-900 dark:text-white hover:text-white dark:hover:text-white px-6 py-3 rounded-full font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm"
              >
                <span>See All Work</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Desktop & Mobile Portfolio Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project) => (
              <FilterProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>

          {/* Bottom Explore Full Archive Button */}
          <div className="mt-16 text-center">
            <Link
              href="/work"
              onClick={(e) => {
                e.preventDefault();
                navigateWithTransition("/work");
              }}
              data-cursor-text="ARCHIVE"
              className="inline-flex items-center space-x-3 px-8 py-4 rounded-full border border-neutral-300 dark:border-white/20 bg-neutral-100 dark:bg-white/5 hover:border-accent hover:bg-accent text-neutral-900 dark:text-white hover:text-white font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl shadow-accent/10 hover:shadow-accent/25 hover:-translate-y-0.5"
            >
              <span>Explore All {ALL_PROJECTS.length} Works & Case Studies</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox Detail Modal */}
      <LightboxModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenContact={onOpenContact}
      />
    </>
  );
}
