"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [hoverText, setHoverText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const isVisibleRef = useRef(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    // Only enable on desktop pointer devices (width >= 1024px with fine pointer)
    const checkDesktop = () => {
      const isFinePointer = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
      const isWideEnough = window.innerWidth >= 1024;
      setIsDesktop(isFinePointer && isWideEnough);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    // Disable on touch, tablet, mobile devices or if user prefers reduced motion
    if (!isDesktop || prefersReduced) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    // Start hidden until first mouse move
    gsap.set([cursor, dot], { opacity: 0, scale: 1 });

    const xCursor = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3.out" });
    const yCursor = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3.out" });
    const xDot = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        gsap.to([cursor, dot], { opacity: 1, duration: 0.2 });
      }
      xCursor(e.clientX);
      yCursor(e.clientY);
      xDot(e.clientX);
      yDot(e.clientY);
    };

    const onMouseLeaveWindow = () => {
      isVisibleRef.current = false;
      gsap.to([cursor, dot], { opacity: 0, duration: 0.2 });
    };

    const onMouseEnterWindow = () => {
      isVisibleRef.current = true;
      gsap.to([cursor, dot], { opacity: 1, duration: 0.2 });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest<HTMLElement>(
        "[data-cursor], [data-cursor-text], a, button, [role='button'], input, select, textarea, .cursor-pointer"
      );

      if (interactive) {
        setIsHovered(true);
        const text =
          interactive.getAttribute("data-cursor-text") ||
          interactive.getAttribute("data-cursor") ||
          "";
        setHoverText(text.toUpperCase());

        gsap.to(cursor, {
          width: text ? 78 : 50,
          height: text ? 78 : 50,
          scale: 1,
          duration: prefersReduced ? 0 : 0.25,
          ease: "power2.out",
        });

        gsap.to(dot, {
          scale: text ? 0 : 0.6,
          opacity: text ? 0 : 0.7,
          duration: 0.2,
        });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest<HTMLElement>(
        "[data-cursor], [data-cursor-text], a, button, [role='button'], input, select, textarea, .cursor-pointer"
      );

      if (interactive) {
        const relatedTarget = e.relatedTarget as HTMLElement | null;
        if (
          !relatedTarget ||
          !relatedTarget.closest(
            "[data-cursor], [data-cursor-text], a, button, [role='button'], input, select, textarea, .cursor-pointer"
          )
        ) {
          setIsHovered(false);
          setHoverText("");

          gsap.to(cursor, {
            width: 22,
            height: 22,
            scale: 1,
            duration: prefersReduced ? 0 : 0.25,
            ease: "power2.out",
          });

          gsap.to(dot, {
            scale: 1,
            opacity: 1,
            duration: 0.2,
          });
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeaveWindow);
    document.addEventListener("mouseenter", onMouseEnterWindow);
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeaveWindow);
      document.removeEventListener("mouseenter", onMouseEnterWindow);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [isDesktop, prefersReduced]);

  if (!isDesktop) return null;

  return createPortal(
    <>
      {/* Primary Brand Accent Dot */}
      <div
        ref={dotRef}
        className="hidden lg:block custom-cursor-dot pointer-events-none fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EA580C] shadow-[0_0_8px_rgba(234,88,12,0.8)] z-[9999999] select-none"
        style={{
          width: 7,
          height: 7,
        }}
        aria-hidden="true"
      />

      {/* Difference Blend Follower Lens */}
      <div
        ref={cursorRef}
        className="hidden lg:flex custom-cursor pointer-events-none fixed top-0 left-0 items-center justify-center rounded-full bg-white text-black font-mono text-[9px] font-bold tracking-widest -translate-x-1/2 -translate-y-1/2 mix-blend-difference z-[999999] select-none"
        style={{
          width: 22,
          height: 22,
        }}
        aria-hidden="true"
      >
        {isHovered && hoverText && (
          <span className="font-mono font-bold tracking-widest text-[9.5px] uppercase text-black text-center px-1 animate-fade-in select-none">
            {hoverText}
          </span>
        )}
      </div>
    </>,
    document.body
  );
}
