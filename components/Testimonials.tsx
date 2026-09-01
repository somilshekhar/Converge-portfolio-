"use client";

import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { Quote, Star, Sparkles } from "lucide-react";

interface TestimonialItem {
  id: string;
  client: string;
  role: string;
  quote: string;
  rating: number;
}

export default function Testimonials() {
  const testimonials: TestimonialItem[] = useMemo(
    () => [
      {
        id: "1",
        client: "Kunj Infrastructure",
        role: "Owner",
        quote:
          "Converge Digital exceeded our expectations with their creativity and execution. They delivered a polished digital experience that truly represents our brand. Their professionalism and collaborative approach made the entire process seamless.",
        rating: 5,
      },
      {
        id: "2",
        client: "Mahesh Masala Gruh Udhyog",
        role: "Owner",
        quote:
          "Working with Converge Digital was an outstanding experience. They understood the essence of our legacy and transformed it into a modern, visually engaging website. We're delighted with the final outcome.",
        rating: 5,
      },
      {
        id: "3",
        client: "Enki",
        role: "Owner",
        quote:
          "They took the time to understand our vision and built a brand identity with flawless execution. Their attention to detail and creative direction set a new benchmark for our online presence.",
        rating: 5,
      },
      {
        id: "4",
        client: "STHEER",
        role: "Founder",
        quote:
          "Working alongside Converge Digital has been effortless. Their creative thinking, reliable execution, and commitment to delivering exceptional results make them a valued partner on every project.",
        rating: 5,
      },
      {
        id: "5",
        client: "VELUNOR",
        role: "Owner",
        quote:
          "Converge Digital did an incredible job bringing our vision to life through a cinematic brand reel. Their storytelling and motion design resulted in content that truly captures our brand identity.",
        rating: 5,
      },
      {
        id: "6",
        client: "Nilgiri & Co.",
        role: "Founder",
        quote:
          "They translated our vision into an elegant, high-performing e-commerce experience. The website is refined, fast, and thoughtfully crafted. It was a pleasure working with a team that cares about quality.",
        rating: 5,
      },
      {
        id: "7",
        client: "Ganpati Computers",
        role: "Owner",
        quote:
          "Converge Digital delivered a website that perfectly reflects our business and services. They communicated clearly throughout and created a fast, professional platform that strengthened our presence.",
        rating: 5,
      },
      {
        id: "8",
        client: "Ocean Blue Education",
        role: "Director",
        quote:
          "They perfectly translated our vision into a modern, high-performing portal. Their design expertise, responsiveness, and attention to detail made the entire process effortless and impactful.",
        rating: 5,
      },
    ],
    []
  );

  // Quadruple items for seamless infinite continuous wrapping
  const cards = useMemo(
    () => [...testimonials, ...testimonials, ...testimonials, ...testimonials],
    [testimonials]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  // Drag & Motion state refs
  const posRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startPointerXRef = useRef(0);
  const startPosRef = useRef(0);
  const velocityRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    let animationFrameId: number;
    let lastTick = performance.now();
    const speed = 40; // pixels per second constant forward speed

    const loop = (now: number) => {
      const delta = Math.min((now - lastTick) / 1000, 0.05);
      lastTick = now;

      const track = trackRef.current;
      if (track) {
        const singleSetWidth = track.scrollWidth / 4;

        if (isDraggingRef.current) {
          // Handled in pointerMove
        } else {
          // If velocity from drag release exists, decay it smoothly
          if (Math.abs(velocityRef.current) > 0.5) {
            posRef.current -= velocityRef.current * delta * 40;
            velocityRef.current *= Math.pow(0.92, delta * 60);
          } else {
            velocityRef.current = 0;
            // Normal auto-advance only when not hovered
            if (!isHoveredRef.current) {
              posRef.current += speed * delta;
            }
          }

          // Seamless infinite wrapping
          if (singleSetWidth > 0) {
            if (posRef.current >= singleSetWidth * 2) {
              posRef.current -= singleSetWidth;
            } else if (posRef.current < singleSetWidth) {
              posRef.current += singleSetWidth;
            }
          }

          track.style.transform = `translate3d(${-posRef.current}px, 0, 0)`;
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Pointer Handlers for Mouse Drag & Touch Scrubbing
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    isHoveredRef.current = true;

    startPointerXRef.current = e.clientX;
    lastPointerXRef.current = e.clientX;
    startPosRef.current = posRef.current;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const currentX = e.clientX;
    const now = performance.now();
    const dt = (now - lastTimeRef.current) / 1000;

    if (dt > 0.005) {
      velocityRef.current = (currentX - lastPointerXRef.current) / (dt * 60);
      lastPointerXRef.current = currentX;
      lastTimeRef.current = now;
    }

    const dx = currentX - startPointerXRef.current;
    let newPos = startPosRef.current - dx;

    const track = trackRef.current;
    if (track) {
      const singleSetWidth = track.scrollWidth / 4;
      if (singleSetWidth > 0) {
        while (newPos >= singleSetWidth * 2) {
          newPos -= singleSetWidth;
          startPosRef.current -= singleSetWidth;
        }
        while (newPos < singleSetWidth) {
          newPos += singleSetWidth;
          startPosRef.current += singleSetWidth;
        }
      }
      posRef.current = newPos;
      track.style.transform = `translate3d(${-newPos}px, 0, 0)`;
    }
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!isDraggingRef.current) {
      isHoveredRef.current = false;
    }
  }, []);

  const renderCard = (item: TestimonialItem, idx: number) => (
    <div
      key={`${item.id}-${idx}`}
      data-cursor-text="CLIENT"
      className="w-[320px] sm:w-[380px] md:w-[420px] flex-shrink-0 bg-white dark:bg-[#0c0c10]/95 border border-neutral-200 dark:border-white/10 hover:border-accent/50 dark:hover:border-accent/50 rounded-2xl p-6 md:p-7 relative overflow-hidden flex flex-col justify-between space-y-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/5 shadow-sm select-none"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {[...Array(item.rating)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
          ))}
        </div>
        <Quote className="w-6 h-6 text-accent/30 pointer-events-none" />
      </div>

      <p className="font-sans text-xs md:text-sm text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
        “{item.quote}”
      </p>

      <div className="pt-4 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between">
        <div>
          <h4 className="font-display font-medium text-sm text-neutral-950 dark:text-white tracking-tight">
            {item.client}
          </h4>
          <p className="font-sans text-[11px] text-accent font-semibold uppercase tracking-wider mt-0.5">
            {item.role}
          </p>
        </div>
        <div className="flex items-center space-x-1 text-[10px] font-mono text-neutral-600 dark:text-neutral-400 uppercase">
          <Sparkles className="w-3 h-3 text-accent" />
          <span>VERIFIED</span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative py-16 md:py-24 bg-[#f7f8fa] dark:bg-[#08080c] border-b border-neutral-200 dark:border-white/10 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10 md:mb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-neutral-200 dark:border-white/10 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 font-sans text-xs uppercase tracking-widest text-accent font-semibold">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span>TESTIMONIALS & FEEDBACK</span>
            </div>
            <h2 className="font-display font-medium text-4xl md:text-5xl text-neutral-950 dark:text-white tracking-tight">
              What Our Clients Say
            </h2>
          </div>

          <p className="font-sans text-xs md:text-sm text-neutral-600 dark:text-neutral-400 max-w-sm font-normal">
            Real feedback from ambitious founders, directors, and brands we partner with.
          </p>
        </div>
      </div>

      {/* Interactive Draggable Moving Row Marquee */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative overflow-hidden py-4 select-none touch-pan-y ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {/* Left & Right Edge Gradient Fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#f7f8fa] dark:from-[#08080c] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#f7f8fa] dark:from-[#08080c] to-transparent z-10" />

        {/* Continuous Smooth Draggable Track */}
        <div
          ref={trackRef}
          className="flex gap-4 md:gap-6 px-4 will-change-transform"
          style={{ width: "max-content" }}
        >
          {cards.map((item, idx) => renderCard(item, idx))}
        </div>
      </div>
    </section>
  );
}

