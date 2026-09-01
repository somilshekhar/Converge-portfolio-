"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [counter, setCounter] = useState(0);
  const [shouldRender, setShouldRender] = useState(true);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReduced = useReducedMotion();

  const triggerCurtainWipe = useCallback(() => {
    const preloader = preloaderRef.current;
    const text = textRef.current;

    if (!preloader) return;

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("converge_preloader_seen", "true");
        setShouldRender(false);
        if (onComplete) onComplete();
      },
    });

    tl.to(text, {
      y: -50,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
    })
      .to(preloader, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.9,
        ease: "power4.inOut",
      });
  }, [onComplete]);

  useEffect(() => {
    // Check if preloader has already run in this session
    const hasSeenPreloader = sessionStorage.getItem("converge_preloader_seen");
    if (hasSeenPreloader) {
      setShouldRender(false);
      if (onComplete) onComplete();
      return;
    }

    if (prefersReduced) {
      sessionStorage.setItem("converge_preloader_seen", "true");
      setShouldRender(false);
      if (onComplete) onComplete();
      return;
    }

    // Count up 0 to 100
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 2;
      if (current >= 100) {
        current = 100;
        setCounter(100);
        clearInterval(interval);
        timerRef.current = setTimeout(() => {
          triggerCurtainWipe();
        }, 300);
      } else {
        setCounter(current);
      }
    }, 40);

    return () => {
      clearInterval(interval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [prefersReduced, onComplete, triggerCurtainWipe]);

  if (!shouldRender) return null;

  return (
    <div
      ref={preloaderRef}
      aria-hidden="true"
      inert
      className="fixed inset-0 z-[9999] flex flex-col justify-between !bg-[#050507] p-8 md:p-16 !text-white pointer-events-none dark-bg-context"
      style={{ clipPath: "inset(0% 0% 0% 0%)", backgroundColor: "#050507", color: "#ffffff" }}
    >
      {/* Top Brand Tag */}
      <div className="flex items-center justify-between font-sans text-xs uppercase tracking-widest text-neutral-400">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
          <span>CONVERGE DIGITAL®</span>
        </div>
        <span>INDIA</span>
      </div>

      {/* Main Counter & Typography */}
      <div ref={textRef} className="my-auto text-center md:text-left">
        <div className="overflow-hidden mb-4">
          <h1 className="font-display text-4xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white">
            CONVERGE DIGITAL<span className="text-accent">®</span>
          </h1>
        </div>
        <p className="font-sans text-xs md:text-sm tracking-wider text-neutral-400 max-w-md">
          Digital Design + Development
        </p>
      </div>

      {/* Bottom Counter Bar */}
      <div className="flex items-end justify-between font-mono">
        <div className="flex items-baseline space-x-2">
          <span className="text-6xl md:text-9xl font-extrabold font-display tracking-tight text-white">
            {counter < 10 ? `0${counter}` : counter}
          </span>
          <span className="text-xl md:text-3xl text-accent font-bold">%</span>
        </div>
        <div className="text-right text-xs uppercase tracking-widest text-neutral-500 hidden md:block">
          <div>LOADING ASSETS</div>
          <div className="w-32 bg-neutral-800 h-1 mt-2 rounded-full overflow-hidden">
            <div
              className="bg-accent h-full transition-all duration-100 ease-out"
              style={{ width: `${counter}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
