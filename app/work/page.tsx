"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowLeft,
  Search,
  LayoutGrid,
  List,
  Sparkles,
  Layers,
  X,
  SlidersHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LightboxModal from "@/components/LightboxModal";
import FilterProjectCard from "@/components/FilterProjectCard";
import ContactModal from "@/components/ContactModal";
import CollaborateCTA from "@/components/CollaborateCTA";
import { ALL_PROJECTS, type FilterProject } from "@/data/projects";
import { usePageTransition } from "@/components/SvgPageTransition";

export default function WorkPage() {
  const { navigateWithTransition } = usePageTransition();
  const [selectedProject, setSelectedProject] = useState<FilterProject | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"latest" | "name">("latest");
  const [visibleCount, setVisibleCount] = useState<number>(9);

  // Video control state for the hero showreel banner
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const categories = useMemo(() => {
    const cats = Array.from(new Set(ALL_PROJECTS.map((p) => p.category)));
    return ["All", ...cats];
  }, []);

  const filteredAndSortedProjects = useMemo(() => {
    let list = ALL_PROJECTS.filter((project) => {
      const matchesCategory =
        activeCategory === "All" || project.category === activeCategory;

      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        project.title.toLowerCase().includes(query) ||
        (project.client && project.client.toLowerCase().includes(query)) ||
        project.category.toLowerCase().includes(query) ||
        (project.service && project.service.toLowerCase().includes(query)) ||
        (project.summary && project.summary.toLowerCase().includes(query)) ||
        (project.tags && project.tags.some((t) => t.toLowerCase().includes(query)));

      return matchesCategory && matchesQuery;
    });

    if (sortBy === "latest") {
      list = [...list].sort(
        (a, b) => (b.year || "").localeCompare(a.year || "") || (a.number || "").localeCompare(b.number || "")
      );
    } else if (sortBy === "name") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [activeCategory, searchQuery, sortBy]);

  const handleOpenContact = useCallback(() => setContactOpen(true), []);
  const handleCloseContact = useCallback(() => setContactOpen(false), []);

  return (
    <div className="relative min-h-screen bg-[#f7f8fa] dark:bg-[#050507] text-neutral-900 dark:text-white selection:bg-accent selection:text-white transition-colors duration-300">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[160px]" />
      </div>

      {/* Top Navbar */}
      <Navbar onOpenContact={handleOpenContact} />

      <main className="relative z-10 pt-32 md:pt-36 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Top Minimal Breadcrumb & Coordinate Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400 mb-8 border-b border-neutral-200 dark:border-white/10 pb-4">
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateWithTransition("/");
            }}
            className="inline-flex items-center space-x-2 text-neutral-700 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span className="font-sans font-medium">Return Home</span>
          </Link>

          <div className="flex items-center space-x-6 text-[11px] text-neutral-600 dark:text-neutral-500">
            <span className="text-accent flex items-center space-x-1.5 font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>2026 only</span>
            </span>
          </div>
        </div>

        {/* CONCEPT 4: TYPOGRAPHIC HEADER & INTERACTIVE VIDEO BANNER */}
        <section className="space-y-8 mb-16">
          {/* Kinetic Editorial Typography */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-200/70 dark:bg-white/5 border border-neutral-300 dark:border-white/10 text-accent font-mono text-[11px] uppercase tracking-wider font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>SELECTED REPERTORY</span>
              </div>
              <h1 className="font-display font-medium text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[0.95] text-neutral-950 dark:text-white">
                SELECTED{" "}
                <span className="text-gradient-works">
                  WORKS.
                </span>
              </h1>
            </div>

            <p className="font-sans text-sm md:text-base text-neutral-700 dark:text-neutral-400 font-normal max-w-md leading-relaxed">
              A curated catalog of digital products, immersive web systems, and brand platforms engineered for visionary companies.
            </p>
          </div>

          {/* Cinematic Interactive Video Banner */}
          <div className="relative group w-full h-64 sm:h-80 md:h-[420px] rounded-3xl overflow-hidden border border-white/15 bg-neutral-950 shadow-2xl transition-all duration-700 hover:border-accent/50 dark-bg-context">
            {/* Ambient Background Backlight */}
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-blue-600/10 to-accent/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Video Element */}
            <video
              ref={videoRef}
              src="/videos/v1.mp4"
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 720'%3E%3Crect fill='%23050507' width='1280' height='720'/%3E%3C/svg%3E"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover filter contrast-[1.08] group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
            />

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-black/40 opacity-80 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/60 via-transparent to-[#050507]/60 pointer-events-none" />

            {/* Corner Crosshairs / Cyber-Minimalist Frame Markers */}
            <div className="absolute top-4 left-4 font-mono text-[10px] text-white/70 select-none">
              + [ 001 // REEL ]
            </div>
            <div className="absolute top-4 right-4 font-mono text-[10px] text-white/70 select-none">
              [ 4K_60FPS ] +
            </div>
            <div className="absolute bottom-4 left-4 font-mono text-[10px] text-white/70 select-none hidden sm:block">
              + [ 28°38&apos;N 77°13&apos;E ]
            </div>

            {/* Top Center Live Badge */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white font-mono text-[10px] tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span>LIVE MOTION REEL</span>
            </div>

            {/* Bottom Content & Interactive Controller Strip */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex items-end justify-between gap-4 z-20">
              <div className="space-y-1">
                <div className="font-mono text-[10px] uppercase tracking-widest text-accent font-semibold flex items-center space-x-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>CONVERGE DIGITAL LABS</span>
                </div>
                <h3 className="font-display font-medium text-lg sm:text-2xl text-white tracking-tight">
                  Crafting Tomorrow&apos;s Web Standards
                </h3>
              </div>

              {/* Video Controls (Play/Pause & Mute) */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause Reel" : "Play Reel"}
                  className="p-2.5 sm:p-3 rounded-full bg-black/70 hover:bg-accent border border-white/20 hover:border-accent text-white backdrop-blur-md transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 translate-x-0.5" />
                  )}
                </button>

                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute Video" : "Mute Video"}
                  className="p-2.5 sm:p-3 rounded-full bg-black/70 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Filter, Search & View Controls Bar */}
        <div className="space-y-6 mb-12">
          {/* Top Row: Search & View Modes */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(9);
                }}
                placeholder="Search projects, client, tech stack..."
                className="w-full pl-11 pr-10 py-3 rounded-full bg-white dark:bg-white/5 border border-neutral-300 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/20 focus:border-accent text-sm text-neutral-900 dark:text-white placeholder-neutral-500 outline-none transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-black dark:hover:text-white rounded-full transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Controls: Sorting & View Switcher */}
            <div className="flex items-center justify-between md:justify-end space-x-3">
              {/* Sort Selector */}
              <div className="flex items-center space-x-2 bg-white dark:bg-white/5 border border-neutral-300 dark:border-white/10 px-3.5 py-2 rounded-full text-xs font-sans text-neutral-800 dark:text-neutral-300 shadow-sm">
                <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-neutral-600 dark:text-neutral-400 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "latest" | "name")}
                  className="bg-transparent text-neutral-900 dark:text-white font-medium outline-none cursor-pointer"
                >
                  <option value="latest" className="bg-white text-neutral-900 dark:bg-[#0c0c10] dark:text-white">Latest First</option>
                  <option value="name" className="bg-white text-neutral-900 dark:bg-[#0c0c10] dark:text-white">Project Name</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center p-1 bg-white dark:bg-white/5 border border-neutral-300 dark:border-white/10 rounded-full shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid View"
                  className={`p-2 rounded-full transition-all ${
                    viewMode === "grid"
                      ? "bg-accent text-white shadow-md shadow-accent/20"
                      : "text-neutral-500 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  aria-label="List View"
                  className={`p-2 rounded-full transition-all ${
                    viewMode === "list"
                      ? "bg-accent text-white shadow-md shadow-accent/20"
                      : "text-neutral-500 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((category) => {
              const count =
                category === "All"
                  ? ALL_PROJECTS.length
                  : ALL_PROJECTS.filter((p) => p.category === category).length;
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setVisibleCount(9);
                  }}
                  className={`flex-shrink-0 px-4 py-2 rounded-full font-sans text-xs md:text-sm font-medium tracking-wide transition-all duration-300 flex items-center space-x-2 ${
                    isActive
                      ? "bg-accent text-white shadow-lg shadow-accent/20"
                      : "bg-white dark:bg-white/5 text-neutral-700 dark:text-neutral-400 border border-neutral-300 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/25 hover:text-black dark:hover:text-white shadow-sm"
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-neutral-200 dark:bg-white/10 text-neutral-700 dark:text-neutral-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty Search / Filter State */}
        {filteredAndSortedProjects.length === 0 && (
          <div className="py-24 text-center space-y-4 bg-white/50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/10 rounded-2xl p-8 shadow-sm">
            <Layers className="w-12 h-12 text-neutral-500 mx-auto" />
            <h3 className="font-display font-medium text-2xl text-neutral-900 dark:text-white">No projects found</h3>
            <p className="font-sans text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              We couldn’t find any work matching &ldquo;{searchQuery}&rdquo;. Try adjusting your search query or filter category.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-neutral-900 dark:bg-white/10 hover:bg-neutral-800 dark:hover:bg-white/20 border border-neutral-800 dark:border-white/20 rounded-full text-xs font-semibold uppercase tracking-wider text-white transition-colors"
            >
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* GRID VIEW */}
        {viewMode === "grid" && filteredAndSortedProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredAndSortedProjects.slice(0, visibleCount).map((project) => (
              <FilterProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        )}

        {/* LIST / ARCHIVE VIEW */}
        {viewMode === "list" && filteredAndSortedProjects.length > 0 && (
          <div className="border border-neutral-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white/90 dark:bg-[#0c0c10]/80 backdrop-blur-md shadow-sm">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-neutral-200 dark:border-white/10 text-[11px] font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-500">
              <div className="col-span-1">No.</div>
              <div className="col-span-4">Project & Client</div>
              <div className="col-span-3">Category</div>
              <div className="col-span-2">Year</div>
              <div className="col-span-2 text-right">Action</div>
            </div>

            <div className="divide-y divide-neutral-200 dark:divide-white/5">
              {filteredAndSortedProjects.slice(0, visibleCount).map((project) => (
                <div
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedProject(project)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedProject(project);
                    }
                  }}
                  className="group grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-5 hover:bg-neutral-100/60 dark:hover:bg-white/[0.04] transition-colors cursor-pointer items-center focus:outline-none focus-visible:bg-neutral-100"
                >
                  <div className="col-span-1 font-mono text-xs text-accent font-semibold">
                    {project.number || "//"}
                  </div>

                  <div className="col-span-4 space-y-0.5">
                    <h3 className="font-display font-medium text-lg text-neutral-900 dark:text-white group-hover:text-accent transition-colors flex items-center space-x-2">
                      <span>{project.title}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="font-sans text-xs text-neutral-600 dark:text-neutral-400">
                      {project.client || project.service}
                    </p>
                  </div>

                  <div className="col-span-3 font-sans text-xs text-neutral-700 dark:text-neutral-300">
                    {project.category}
                  </div>

                  <div className="col-span-2 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                    {project.year || "2025"}
                  </div>

                  <div className="col-span-2 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                      className="px-4 py-1.5 rounded-full border border-neutral-300 dark:border-white/15 bg-neutral-100 dark:bg-white/5 hover:bg-accent hover:border-accent text-neutral-900 dark:text-white hover:text-white font-sans text-xs font-medium uppercase tracking-wider transition-all shadow-sm"
                    >
                      {project.video ? "View Video" : "View Post"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < filteredAndSortedProjects.length && (
          <div className="mt-14 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 9)}
              data-cursor-text="LOAD MORE"
              className="group inline-flex items-center space-x-3 px-8 py-4 rounded-full border border-neutral-300 dark:border-white/20 bg-white dark:bg-white/5 hover:border-accent hover:bg-accent text-neutral-900 dark:text-white hover:text-white font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl shadow-black/5 hover:shadow-accent/25 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Load More Projects ({filteredAndSortedProjects.length - visibleCount} Remaining)</span>
              <Sparkles className="w-4 h-4 text-accent group-hover:text-white transition-colors" />
            </button>
          </div>
        )}

        {/* UI/UX Creatives Client Reference Disclaimer (Below Load More) */}
        {activeCategory === "UI/UX Creatives" && (
          <div className="mt-12 p-5 sm:p-6 rounded-2xl bg-accent/10 border border-accent/30 dark:bg-accent/10 dark:border-accent/30 backdrop-blur-md flex items-start space-x-4 text-neutral-900 dark:text-white transition-all shadow-md max-w-4xl mx-auto">
            <div className="p-2.5 rounded-xl bg-accent/20 text-accent flex-shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
              <div className="font-mono text-accent text-[11px] uppercase tracking-wider font-bold">
                CLIENT UI/UX CONCEPT &amp; BENCHMARK NOTICE
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 font-sans">
                The projects featured under UI/UX Creatives represent interactive design concepts, structural prototypes, and visual benchmark references engineered for client visual direction &amp; conceptual exploration.
              </p>
            </div>
          </div>
        )}

      </main>

      <CollaborateCTA onOpenContact={handleOpenContact} />

      {/* Lightbox Modal from Con_Portfolio */}
      <LightboxModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenContact={handleOpenContact}
      />

      <ContactModal isOpen={contactOpen} onClose={handleCloseContact} />

      {/* Footer */}
      <Footer onOpenContact={handleOpenContact} />
    </div>
  );
}
