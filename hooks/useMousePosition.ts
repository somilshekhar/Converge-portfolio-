"use client";

import { useState, useEffect, useRef } from "react";

export interface MousePosition {
  x: number;
  y: number;
}

export function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const tickRef = useRef<number | null>(null);
  const posRef = useRef<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const isPointerFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isPointerFine) return;

    const updateMousePosition = (ev: MouseEvent) => {
      posRef.current.x = ev.clientX;
      posRef.current.y = ev.clientY;
      if (tickRef.current !== null) return;
      tickRef.current = requestAnimationFrame(() => {
        setMousePosition({ ...posRef.current });
        tickRef.current = null;
      });
    };

    window.addEventListener("mousemove", updateMousePosition, { passive: true });

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      if (tickRef.current !== null) {
        cancelAnimationFrame(tickRef.current);
      }
    };
  }, []);

  return mousePosition;
}
