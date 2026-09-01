"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme, ThemeMode } from "./ThemeProvider";

interface ThemeToggleProps {
  variant?: "compact" | "segmented" | "button";
  className?: string;
}

export default function ThemeToggle({
  variant = "compact",
  className = "",
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [rippleEffect, setRippleEffect] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`h-8 w-20 rounded-full bg-white/5 border border-white/10 animate-pulse ${className}`} />
    );
  }

  const modes: { id: ThemeMode; label: string; icon: typeof Sun }[] = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Laptop },
  ];

  const handleSelect = (mode: ThemeMode) => {
    if (mode === theme) return;
    setRippleEffect(true);
    setTheme(mode);
    setTimeout(() => setRippleEffect(false), 400);
  };

  if (variant === "button") {
    return (
      <button
        onClick={() => handleSelect(resolvedTheme === "dark" ? "light" : "dark")}
        aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
        data-cursor-text="THEME"
        className={`relative p-2 rounded-full border border-neutral-300 dark:border-white/15 bg-neutral-100 dark:bg-white/5 hover:border-accent/50 text-neutral-900 dark:text-white transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${className}`}
      >
        <span className="relative z-10 block">
          {resolvedTheme === "dark" ? (
            <Moon className="w-4 h-4 text-accent transition-transform duration-300 hover:rotate-12" />
          ) : (
            <Sun className="w-4 h-4 text-accent transition-transform duration-300 hover:rotate-45" />
          )}
        </span>
      </button>
    );
  }

  // Compact icon-only pill for the Header Navbar
  if (variant === "compact") {
    return (
      <div
        role="radiogroup"
        aria-label="Theme mode switcher"
        className={`relative inline-flex items-center p-0.5 rounded-full bg-neutral-200/60 dark:bg-white/5 border border-neutral-300 dark:border-white/10 backdrop-blur-md transition-all duration-300 ${className}`}
      >
        {rippleEffect && (
          <span
            className="absolute inset-0 rounded-full bg-accent/20 animate-ping pointer-events-none"
            style={{ animationDuration: "500ms", animationIterationCount: 1 }}
          />
        )}

        {modes.map(({ id, label, icon: Icon }) => {
          const isActive = theme === id;
          return (
            <button
              key={id}
              role="radio"
              aria-checked={isActive}
              onClick={() => handleSelect(id)}
              title={`Switch to ${label} mode`}
              aria-label={`Switch to ${label} mode`}
              data-cursor-text={label.toUpperCase()}
              className={`relative flex items-center justify-center p-1.5 rounded-full text-xs transition-all duration-300 focus:outline-none ${
                isActive
                  ? "bg-accent text-white shadow-md shadow-accent/25 scale-105"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  isActive ? "rotate-0 scale-110" : "opacity-70 group-hover:opacity-100"
                }`}
              />
            </button>
          );
        })}
      </div>
    );
  }

  // Full segmented control with labels (for Footer and Mobile Drawer)
  return (
    <div
      role="radiogroup"
      aria-label="Theme mode switcher"
      className={`relative inline-flex items-center p-1 rounded-full bg-neutral-200/60 dark:bg-white/5 border border-neutral-300 dark:border-white/10 backdrop-blur-md transition-all duration-300 shadow-inner ${className}`}
    >
      {rippleEffect && (
        <span
          className="absolute inset-0 rounded-full bg-accent/20 animate-ping pointer-events-none"
          style={{ animationDuration: "500ms", animationIterationCount: 1 }}
        />
      )}

      {modes.map(({ id, label, icon: Icon }) => {
        const isActive = theme === id;
        return (
          <button
            key={id}
            role="radio"
            aria-checked={isActive}
            onClick={() => handleSelect(id)}
            title={`Set theme to ${label}`}
            aria-label={`Set theme to ${label}`}
            data-cursor-text={label.toUpperCase()}
            className={`relative flex items-center justify-center space-x-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium transition-all duration-300 focus:outline-none ${
              isActive
                ? "bg-accent text-white shadow-md shadow-accent/25 scale-[1.02]"
                : "text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/5"
            }`}
          >
            <Icon
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                isActive ? "rotate-0 scale-110" : "opacity-70 group-hover:opacity-100"
              }`}
            />
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
