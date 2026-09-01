"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import ContactModal from "./ContactModal";
import ThemeToggle from "./ThemeToggle";
import { usePageTransition } from "./SvgPageTransition";

interface NavbarProps {
  onOpenContact?: () => void;
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export default function Navbar({ onOpenContact }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { navigateWithTransition } = usePageTransition();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const scrollTickRef = useRef<number | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const mobileDrawerId = "mobile-nav-drawer";

  const navLinks = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: "About", href: "/#about" },
      { label: "Services", href: "/#services" },
      { label: "Work", href: "/work" },
      { label: "Contact", href: "/#contact" },
    ],
    []
  );

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTickRef.current !== null) return;
      scrollTickRef.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        scrollTickRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTickRef.current !== null) {
        cancelAnimationFrame(scrollTickRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const firstFocusable = drawerRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    firstFocusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setMobileMenuOpen(false);
        return;
      }
      if (e.key === "Tab" && drawerRef.current) {
        const focusables = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocusedRef.current?.focus?.();
    };
  }, [mobileMenuOpen]);

  const handleContactClick = useCallback(() => {
    setMobileMenuOpen(false);
    if (onOpenContact) {
      onOpenContact();
    } else {
      setContactOpen(true);
    }
  }, [onOpenContact]);

  const handleToggleMobile = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      setMobileMenuOpen(false);

      if (href === "/") {
        if (pathname !== "/") {
          e.preventDefault();
          navigateWithTransition("/");
        } else {
          e.preventDefault();
          const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number) => void } }).__lenis;
          if (lenis) lenis.scrollTo(0);
          else window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      if (href === "/work") {
        if (pathname !== "/work") {
          e.preventDefault();
          navigateWithTransition("/work");
        } else {
          e.preventDefault();
          const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number) => void } }).__lenis;
          if (lenis) lenis.scrollTo(0);
          else window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      if (href === "/#contact" || href === "#contact") {
        e.preventDefault();
        handleContactClick();
        return;
      }

      if (href.startsWith("/#") || href.startsWith("#")) {
        const hash = href.includes("#") ? `#${href.split("#")[1]}` : href;
        if (pathname === "/") {
          e.preventDefault();
          const lenis = (window as unknown as { __lenis?: { scrollTo: (t: string) => void } }).__lenis;
          if (lenis) {
            lenis.scrollTo(hash);
          } else {
            const targetEl = document.querySelector(hash);
            if (targetEl) targetEl.scrollIntoView({ behavior: "smooth" });
          }
        } else {
          e.preventDefault();
          navigateWithTransition(`/${hash}`);
        }
      }
    },
    [pathname, navigateWithTransition, handleContactClick]
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "glass-header py-4 border-b border-white/10 shadow-2xl"
            : "bg-transparent py-6 md:py-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between gap-6">
          {/* Left: Brand Name & Tagline */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            <Link
              href="/"
              onClick={(e) => handleNavClick(e, "/")}
              data-cursor-text="CONVERGE"
              className="group flex items-center space-x-3 text-neutral-950 dark:text-white focus:outline-none flex-shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-light.png"
                alt="Converge Logo"
                className="h-7 md:h-8 w-auto object-contain dark:hidden"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-dark.png"
                alt="Converge Logo"
                className="h-7 md:h-8 w-auto object-contain hidden dark:block"
              />
              <span className="font-display font-medium text-lg md:text-xl tracking-tight text-neutral-950 dark:text-white">
                Converge Digitals<span className="text-accent">®</span>
              </span>
            </Link>
          </div>

          {/* Center: Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-xs font-sans font-medium uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
            {navLinks.map((link) => {
              const isActive =
                link.href === pathname ||
                (link.href === "/work" && pathname?.startsWith("/work"));

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  onMouseEnter={() => {
                    if (link.href === "/work" || link.href === "/") {
                      router.prefetch(link.href);
                    }
                  }}
                  data-cursor-text="GOTO"
                  className={`relative py-1 transition-colors group ${isActive ? "text-neutral-950 dark:text-white font-semibold" : "text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                    }`}
                >
                  <span>{link.label}</span>
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-accent transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Compact Theme Switcher & Start a Project Button */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            <ThemeToggle variant="compact" />

            <button
              onClick={handleContactClick}
              data-cursor-text="PROJECT"
              className="relative group overflow-hidden rounded-full border border-neutral-300 dark:border-white/20 bg-neutral-100 dark:bg-white/5 px-5 py-2 text-xs font-sans font-semibold uppercase tracking-wider text-neutral-900 dark:text-white backdrop-blur-md transition-all duration-300 hover:border-accent hover:bg-accent hover:text-white dark:hover:text-white"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>Start a Project</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </button>
          </div>

          {/* Mobile Menu & Theme Toggle Actions */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle variant="button" />

            <button
              ref={toggleRef}
              onClick={handleToggleMobile}
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
              aria-controls={mobileDrawerId}
              className="p-2 text-neutral-900 dark:text-white border border-neutral-300 dark:border-white/10 rounded-lg bg-neutral-100 dark:bg-white/5 backdrop-blur-md"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div
          id={mobileDrawerId}
          ref={drawerRef}
          className="fixed inset-0 z-30 bg-white/95 dark:bg-[#050507]/95 backdrop-blur-2xl md:hidden flex flex-col justify-between p-8 pt-24 pb-24 animate-fade-in text-neutral-900 dark:text-white"
        >
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-1">
              <span className="font-display font-medium text-xl text-neutral-900 dark:text-white">
                Converge Digitals®
              </span>
            </div>

            <nav className="flex flex-col space-y-4 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="font-display text-3xl font-medium tracking-tight text-neutral-900 dark:text-white hover:text-accent dark:hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-6 pt-6 border-t border-neutral-200 dark:border-white/10 mb-4">
            <button
              onClick={handleContactClick}
              className="w-full bg-accent text-white py-3.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 font-sans gap-3">
              <a href="mailto:hello@convergedigitals.com" className="hover:text-black dark:hover:text-white transition-colors">
                hello@convergedigitals.com
              </a>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <a href="https://www.linkedin.com/company/converge-digitals/" target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white">LinkedIn</a>
                <a href="https://x.com/ConvergeDigit" target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white">X</a>
                <a href="https://www.instagram.com/convergedigitals" target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white">Instagram</a>
                <a href="https://contra.com/converge_digitals_4d28indg" target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white">Contra</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Contact Modal */}
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

