"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, Volume2, VolumeX, ArrowUpRight } from "lucide-react";
import type { FilterProject } from "@/data/projects";

export interface LightboxModalProps {
  project: FilterProject | null;
  initialIndex?: number;
  onClose: () => void;
  onOpenContact?: () => void;
}

export default function LightboxModal({
  project,
  initialIndex = 0,
  onClose,
}: LightboxModalProps) {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    setMounted(true);
    setCurrentIndex(initialIndex);
  }, [initialIndex, project]);

  const slides = project?.slides || (project?.video ? [project.video] : project?.image ? [project.image] : []);
  const currentSlide = slides[currentIndex] || "";
  const isVideo = currentSlide.toLowerCase().endsWith(".mp4") || currentSlide.toLowerCase().endsWith(".mov");

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const closeModal = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!project) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") closeModal();
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      lenis?.start();
      lastFocusedRef.current?.focus?.();
    };
  }, [project, handlePrev, handleNext, closeModal]);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > swipeThreshold) {
      handleNext();
    } else if (diff < -swipeThreshold) {
      handlePrev();
    }
  };

  const handleOverlayMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (!mounted || !project) return null;

  return createPortal(
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-2xl flex flex-col justify-between items-center p-4 md:p-8 animate-fade-in dark-bg-context"
      onMouseDown={handleOverlayMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        data-lenis-prevent
        className="w-full h-full flex flex-col justify-between items-center outline-none select-none max-w-7xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar Controls */}
        <div className="w-full flex items-center justify-between z-50 text-white pb-2 border-b border-white/10">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <span id={descId} className="eyebrow text-accent uppercase tracking-widest text-xs font-semibold">
                {project.category}
              </span>
              {project.service && (
                <>
                  <span className="text-neutral-600 text-xs">•</span>
                  <span className="text-neutral-400 text-xs hidden sm:inline">{project.service}</span>
                </>
              )}
            </div>
            <h3 id={titleId} className="font-display text-lg md:text-2xl uppercase tracking-tight text-white font-medium">
              {project.title}
            </h3>
          </div>

          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Live Website link if exists */}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-accent hover:bg-accent hover:text-white transition-all text-xs font-sans font-medium"
              >
                <span>Live Site</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}

            {/* Mute button for videos */}
            {isVideo && (
              <button
                type="button"
                data-cursor-text={isMuted ? "UNMUTE" : "MUTE"}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted((prev) => !prev);
                }}
                className="text-white/70 hover:text-white transition-colors p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 cursor-pointer active:scale-95"
                title={isMuted ? "Unmute" : "Mute"}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}

            {/* Close button */}
            <button
              ref={closeButtonRef}
              type="button"
              data-cursor-text="CLOSE"
              onClick={closeModal}
              className="text-white/70 hover:text-white transition-colors p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 cursor-pointer active:scale-95"
              aria-label="Close lightbox"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Slide / Video Viewer */}
        <div className="relative flex-1 w-full flex items-center justify-center py-4 my-auto">
          {isVideo ? (
            <div className="h-full aspect-[9/16] max-h-[72vh] md:max-h-[78vh] relative bg-black flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              {/* Blurred Ambient Glow Background */}
              <video
                key={`bg-${currentSlide}`}
                src={currentSlide}
                loop
                muted
                playsInline
                autoPlay
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover scale-150 blur-3xl opacity-40 pointer-events-none"
              />
              {/* Main Crisp Video */}
              <video
                ref={videoRef}
                key={`fg-${currentSlide}`}
                src={currentSlide}
                loop
                muted={isMuted}
                playsInline
                autoPlay
                className="relative z-10 h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="h-full max-h-[72vh] md:max-h-[78vh] aspect-[4/3] md:aspect-[16/10] relative bg-black flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              {/* Blurred Ambient Glow Background */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={`bg-${currentSlide}`}
                src={currentSlide}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover scale-125 blur-3xl opacity-40 pointer-events-none"
              />
              {/* Main Crisp Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={`fg-${currentSlide}`}
                src={currentSlide}
                alt={`${project.title} slide ${currentIndex + 1} of ${slides.length}`}
                className="relative z-10 h-full w-auto object-contain"
              />
            </div>
          )}

          {/* On-Screen Navigation Arrows */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                data-cursor-text="PREV"
                onClick={handlePrev}
                className="absolute left-2 md:left-6 z-50 bg-black/70 hover:bg-accent hover:scale-105 text-white rounded-full p-3 md:p-3.5 transition-all duration-300 backdrop-blur-md border border-white/15 cursor-pointer shadow-xl active:scale-95"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                type="button"
                data-cursor-text="NEXT"
                onClick={handleNext}
                className="absolute right-2 md:right-6 z-50 bg-black/70 hover:bg-accent hover:scale-105 text-white rounded-full p-3 md:p-3.5 transition-all duration-300 backdrop-blur-md border border-white/15 cursor-pointer shadow-xl active:scale-95"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </>
          )}
        </div>

        {/* Bottom Slide Counter and Indicator Dots */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 z-50 text-white pt-2 border-t border-white/10">
          <div className="text-xs text-neutral-400 font-sans truncate max-w-sm">
            {project.description || project.summary || project.service || ""}
          </div>

          {slides.length > 1 && (
            <div className="flex items-center space-x-4">
              <div className="font-mono text-xs tracking-widest text-neutral-400" aria-live="polite">
                {currentIndex + 1} / {slides.length}
              </div>

              <div className="flex space-x-1.5" role="tablist" aria-label="Slides">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    data-cursor-text={`0${idx + 1}`}
                    aria-selected={idx === currentIndex}
                    aria-label={`Go to slide ${idx + 1}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentIndex ? "bg-accent scale-125 shadow-md shadow-accent/50" : "bg-white/20 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-text="VISIT"
              className="sm:hidden inline-flex items-center space-x-1.5 text-xs text-accent font-medium hover:underline"
            >
              <span>Visit Website</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
