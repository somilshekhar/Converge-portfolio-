"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TransitionConfig {
  enabled: boolean;
  outgoingScale: [number, number];
  outgoingRotate: [number, number];
  incomingScale: [number, number];
  incomingRotate: [number, number];
}

/**
 * Scroll-driven perspective section transition (Olivier Larose pattern).
 *
 * The outgoing section is pinned (sticky, 100vh) inside a taller container.
 * Scroll progress over that container drives the outgoing section receding
 * (scale down + rotateX back) while the incoming section, rendered in normal
 * flow right after the container, slides up and takes over underneath.
 *
 * The incoming section lives OUTSIDE the scroll container, so its natural
 * height never crops, clips, or hides behind the pinned layer.
 */
interface PerspectiveSectionTransitionProps {
  from: ReactNode;
  to: ReactNode;
  /** Outgoing scale range: [start, end]. Default [1, 0.82]. */
  scale?: [number, number];
  /** Outgoing rotateX range (deg): [start, end]. Default [0, -5]. */
  rotate?: [number, number];
  /** Perspective intensity (px) applied to each animated section. */
  perspective?: number;
  /** Transition scroll distance in viewport units (100 = one screen of scroll). */
  scrollLength?: number;
  className?: string;
}

export default function PerspectiveSectionTransition({
  from,
  to,
  scale = [1, 0.82],
  rotate = [0, -5],
  perspective = 1200,
  scrollLength = 100,
  className = "",
}: PerspectiveSectionTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const configRef = useRef<TransitionConfig>({
    enabled: false,
    outgoingScale: scale,
    outgoingRotate: rotate,
    incomingScale: [scale[1], 1],
    incomingRotate: [-rotate[1], 0],
  });
  const prefersReduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const enableQuery = window.matchMedia(
      "(min-width: 1024px) and (min-height: 760px)"
    );
    const tabletQuery = window.matchMedia("(max-width: 1023px)");

    const apply = () => {
      const enable = enableQuery.matches && !prefersReduced;
      const tablet = tabletQuery.matches;
      setEnabled(enable);
      configRef.current = tablet
        ? {
            enabled: enable,
            outgoingScale: [1, 0.9],
            outgoingRotate: [0, -3],
            incomingScale: [0.92, 1],
            incomingRotate: [2, 0],
          }
        : {
            enabled: enable,
            outgoingScale: scale,
            outgoingRotate: rotate,
            incomingScale: [scale[1], 1],
            incomingRotate: [-rotate[1], 0],
          };
    };

    apply();
    const onMediaChange = () => apply();
    enableQuery.addEventListener("change", onMediaChange);
    tabletQuery.addEventListener("change", onMediaChange);
    return () => {
      enableQuery.removeEventListener("change", onMediaChange);
      tabletQuery.removeEventListener("change", onMediaChange);
    };
  }, [prefersReduced, scale, rotate]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const outgoingScale = useTransform(scrollYProgress, (p) => {
    const c = configRef.current;
    if (!c.enabled) return 1;
    return c.outgoingScale[0] + (c.outgoingScale[1] - c.outgoingScale[0]) * p;
  });

  const outgoingRotate = useTransform(scrollYProgress, (p) => {
    const c = configRef.current;
    if (!c.enabled) return 0;
    return c.outgoingRotate[0] + (c.outgoingRotate[1] - c.outgoingRotate[0]) * p;
  });

  const incomingScale = useTransform(scrollYProgress, (p) => {
    const c = configRef.current;
    if (!c.enabled) return 1;
    return c.incomingScale[0] + (c.incomingScale[1] - c.incomingScale[0]) * p;
  });

  const incomingRotate = useTransform(scrollYProgress, (p) => {
    const c = configRef.current;
    if (!c.enabled) return 0;
    return c.incomingRotate[0] + (c.incomingRotate[1] - c.incomingRotate[0]) * p;
  });

  const containerHeight = enabled ? `${100 + scrollLength}vh` : undefined;

  return (
    <div className={`relative ${className}`}>
      {/* Scroll container: 100vh pin + transition length */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: containerHeight }}
      >
        <motion.div
          style={{
            scale: enabled ? outgoingScale : 1,
            rotateX: enabled ? outgoingRotate : 0,
            transformPerspective: enabled ? perspective : undefined,
            transformOrigin: "center",
          }}
          className={
            enabled
              ? "sticky top-0 z-20 h-screen overflow-hidden bg-[#f7f8fa] dark:bg-[#050507]"
              : "relative bg-[#f7f8fa] dark:bg-[#050507]"
          }
        >
          {from}
        </motion.div>
      </div>

      {/* Incoming section slides up from underneath as the outgoing recedes */}
      <motion.div
        style={{
          scale: enabled ? incomingScale : 1,
          rotateX: enabled ? incomingRotate : 0,
          transformPerspective: enabled ? perspective : undefined,
          transformOrigin: "top",
          marginTop: enabled ? `-${scrollLength}vh` : undefined,
        }}
        className="relative z-10 bg-[#f7f8fa] dark:bg-[#050507]"
      >
        {to}
      </motion.div>
    </div>
  );
}
