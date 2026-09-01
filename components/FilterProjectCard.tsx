"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { FilterProject } from "@/data/projects";

interface FilterProjectCardProps {
  project: FilterProject;
  onClick: () => void;
}

export default function FilterProjectCard({ project, onClick }: FilterProjectCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Slideshow cycle interval logic on desktop hover
  useEffect(() => {
    if (!project.slides || project.slides.length === 0) return;
    const hasHover = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;
    if (!hasHover || !isHovered) {
      setCurrentSlide(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % project.slides!.length);
    }, 2200);

    return () => clearInterval(interval);
  }, [project.slides, isHovered]);

  // Video playback controller (desktop hover only)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const hasHover = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

    if (hasHover && isHovered) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isHovered]);

  const activeSlide = project.slides && project.slides.length > 0 ? project.slides[currentSlide] : null;
  const isVideoSlide = activeSlide ? (activeSlide.toLowerCase().endsWith(".mp4") || activeSlide.toLowerCase().endsWith(".mov")) : false;

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      aria-label={`View ${project.title}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-[#0c0c10] aspect-[4/3] cursor-pointer transform transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent dark-bg-context"
      data-cursor-text="VIEW"
    >
      {/* Media Content */}
      {activeSlide ? (
        <div className="w-full h-full relative bg-black flex items-center justify-center overflow-hidden">
          {/* Blurred backdrop image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-150 blur-2xl opacity-30 pointer-events-none"
          />
          {isVideoSlide ? (
            <video
              src={activeSlide}
              loop
              muted
              playsInline
              autoPlay
              preload="none"
              className="relative z-10 h-full aspect-[9/16] object-contain transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={activeSlide}
              alt={`${project.title} slide ${currentSlide + 1}`}
              className="relative z-10 h-full w-auto object-contain transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          )}
        </div>
      ) : project.isReel && project.video ? (
        <div className="w-full h-full relative bg-black flex items-center justify-center overflow-hidden">
          {/* Blurred backdrop image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-150 blur-2xl opacity-30 pointer-events-none"
          />
          {/* Sharp Reel video */}
          <video
            ref={videoRef}
            src={project.video}
            poster={project.image}
            loop
            muted
            playsInline
            preload="metadata"
            className="relative z-10 h-full aspect-[9/16] object-contain transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
      ) : project.video ? (
        <video
          ref={videoRef}
          src={project.video}
          poster={project.image}
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
      )}

      {/* Dark Vignette Overlay for Crisp Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/90 via-[#050507]/30 to-transparent transition-opacity duration-300 group-hover:from-[#050507]/95 pointer-events-none z-20" />

      {/* Top Floating Badges */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-30">
        <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white shadow-lg">
          {project.category}
        </span>
        <div className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-white group-hover:bg-accent group-hover:border-accent transition-colors">
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      {/* Bottom Project Details */}
      <div className="absolute bottom-4 left-4 right-4 z-30 flex flex-col pointer-events-none">
        <h4 className="font-display font-medium text-xl sm:text-2xl uppercase text-white group-hover:text-accent tracking-tight drop-shadow-lg transition-colors duration-300">
          {project.title}
        </h4>
        <span className="font-sans text-xs text-neutral-400 mt-1 drop-shadow-md group-hover:text-white transition-colors duration-300 truncate">
          {project.service}
        </span>
      </div>
    </div>
  );
}
