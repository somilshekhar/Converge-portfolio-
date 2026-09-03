"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
  useEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";

const paths = {
  step1: {
    unfilled: "M 0 100 V 100 Q 50 100 100 100 V 100 z",
    inBetween: {
      curve1: "M 0 100 V 50 Q 50 0 100 50 V 100 z",
    },
    filled: "M 0 100 V 0 Q 50 0 100 0 V 100 z",
  },
  step2: {
    filled: "M 0 0 V 100 Q 50 100 100 100 V 0 z",
    inBetween: {
      curve1: "M 0 0 V 50 Q 50 100 100 50 V 0 z",
    },
    unfilled: "M 0 0 V 0 Q 50 0 100 0 V 0 z",
  },
};

interface PageTransitionContextType {
  triggerTransition: (onMidpoint?: () => void) => Promise<void>;
  navigateWithTransition: (href: string) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextType | null>(null);

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) {
    throw new Error("usePageTransition must be used within SvgPageTransitionProvider");
  }
  return ctx;
}

export function SvgPageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const pathRef = useRef<SVGPathElement>(null);
  const isAnimatingRef = useRef(false);
  const pendingNavigationRef = useRef<string | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Play the exit curtain reveal when pathname changes or when transition completes
  const playExitAnimation = useCallback(() => {
    const overlayPath = pathRef.current;
    if (!overlayPath) {
      isAnimatingRef.current = false;
      setIsOverlayVisible(false);
      setIsTransitioning(false);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
        setIsOverlayVisible(false);
        setIsTransitioning(false);
        pendingNavigationRef.current = null;
        document.body.style.overflow = "";
        const lenis = (window as unknown as { __lenis?: { start: () => void } }).__lenis;
        lenis?.start();
      },
    });

    tl.set(overlayPath, {
      attr: { d: paths.step2.filled },
    })
      .to(overlayPath, {
        duration: 0.14,
        ease: "sine.in",
        attr: { d: paths.step2.inBetween.curve1 },
      })
      .to(overlayPath, {
        duration: 0.38,
        ease: "power3.out",
        attr: { d: paths.step2.unfilled },
      });
  }, []);

  // When pathname changes after entrance completes, scroll to top and smoothly unveil
  useEffect(() => {
    if (pendingNavigationRef.current) {
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
        playExitAnimation();
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [pathname, playExitAnimation]);

  const triggerTransition = useCallback((onMidpoint?: () => void) => {
    return new Promise<void>((resolve) => {
      const overlayPath = pathRef.current;

      if (!overlayPath) {
        if (onMidpoint) onMidpoint();
        resolve();
        return;
      }

      isAnimatingRef.current = true;
      setIsTransitioning(true);
      setIsOverlayVisible(true);

      // Dynamically set gradient color based on current theme
      const isLight = document.documentElement.classList.contains("light");
      const gradientStop = document.getElementById("transitionGradientStop");
      if (gradientStop) {
        gradientStop.setAttribute("stop-color", isLight ? "#f7f8fa" : "#050507");
      }

      const tl = gsap.timeline({
        onComplete: () => {
          if (onMidpoint) {
            onMidpoint();
          }
          resolve();
        },
      });

      tl.set(overlayPath, {
        attr: { d: paths.step1.unfilled },
      })
        .to(
          overlayPath,
          {
            duration: 0.32,
            ease: "power3.in",
            attr: { d: paths.step1.inBetween.curve1 },
          },
          0
        )
        .to(overlayPath, {
          duration: 0.15,
          ease: "power1.out",
          attr: { d: paths.step1.filled },
        });
    });
  }, []);

  const navigateWithTransition = useCallback(
    (href: string) => {
      // If navigating to the exact same page path, no transition needed
      const targetPath = href.split("#")[0] || "/";
      const targetHash = href.includes("#") ? `#${href.split("#")[1]}` : "";

      if (targetPath === pathname) {
        if (targetHash) {
          const lenis = (window as unknown as { __lenis?: { scrollTo: (t: string) => void } }).__lenis;
          if (lenis) {
            lenis.scrollTo(targetHash);
          } else {
            const el = document.querySelector(targetHash);
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }
        } else {
          const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number) => void } }).__lenis;
          if (lenis) lenis.scrollTo(0);
          else window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      if (targetHash) {
        sessionStorage.setItem("converge_scroll_target", targetHash);
      }

      pendingNavigationRef.current = targetPath;

      // Clean sequential wipe: Liquid entrance sweeps to 100% -> calls router.push at midpoint -> unrolls on new page
      triggerTransition(() => {
        router.push(targetPath);
      });

      // Safety fallback: if route doesn't change within 1200ms, unlock
      setTimeout(() => {
        if (isAnimatingRef.current) {
          playExitAnimation();
        }
      }, 1200);
    },
    [pathname, router, triggerTransition, playExitAnimation]
  );

  return (
    <PageTransitionContext.Provider
      value={{
        triggerTransition,
        navigateWithTransition,
        isTransitioning,
      }}
    >
      {children}

      {/* SVG Vertical Path Overlay Curtain */}
      <div
        className={`fixed inset-0 z-[99998] pointer-events-none transition-opacity duration-200 ${
          isOverlayVisible ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <svg
          className="w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="transitionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ea580c" stopOpacity="0.95" />
              <stop id="transitionGradientStop" offset="100%" stopColor="#050507" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            ref={pathRef}
            vectorEffect="non-scaling-stroke"
            d={paths.step1.unfilled}
            fill="url(#transitionGradient)"
          />
        </svg>

        {/* Center Floating Brand Icon / Monogram during wipe */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center space-y-2 pointer-events-none transition-all duration-300 ${
            isOverlayVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/transition-logo.png"
            alt="Converge Logo"
            className="h-10 w-auto object-contain animate-pulse drop-shadow-2xl"
          />
          <span className="font-display font-medium text-xs tracking-widest uppercase text-white/90 drop-shadow-md">
            CONVERGE DIGITAL
          </span>
        </div>
      </div>
    </PageTransitionContext.Provider>
  );
}
