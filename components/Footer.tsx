"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { usePageTransition } from "./SvgPageTransition";

interface FooterProps {
  onOpenContact?: () => void;
}

export default function Footer({ onOpenContact }: FooterProps) {
  const pathname = usePathname();
  const { navigateWithTransition } = usePageTransition();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "Work", href: "/work" },
    { label: "Contact", href: "/#contact" },
  ];

  const servicesLinks = [
    "Web & App Development",
    "Branding & Identity",
    "Social Media & Performance Marketing",
    "AI Automation & Creative Tech",
  ];

  const socialLinks = [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/converge-digitals/" },
    { label: "X", href: "https://x.com/ConvergeDigit" },
    { label: "Instagram", href: "https://www.instagram.com/convergedigitals" },
    { label: "Contra", href: "https://contra.com/converge_digitals_4d28indg" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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
      if (onOpenContact) {
        e.preventDefault();
        onOpenContact();
        return;
      }
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
  };

  return (
    <footer id="contact" className="curtain-footer bg-[#edeef2] dark:bg-[#050507] text-neutral-900 dark:text-white pt-16 md:pt-20 pb-24 sm:pb-12 px-6 md:px-12 border-t border-neutral-300 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-light.png"
                alt="Converge Logo"
                className="h-8 w-auto object-contain dark:hidden"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-dark.png"
                alt="Converge Logo"
                className="h-8 w-auto object-contain hidden dark:block"
              />
              <span className="font-display font-medium text-2xl tracking-tight text-neutral-950 dark:text-white">
                Converge Digitals<span className="text-accent">®</span>
              </span>
            </div>
            <p className="font-sans text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm">
              We run the full digital growth cycle — website, brand, content, ads, and AI — for ambitious businesses.
            </p>
            <div className="font-sans text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              Based in India
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-display font-medium text-sm text-neutral-950 dark:text-white tracking-wider uppercase">
              Navigation
            </h3>
            <ul className="space-y-2.5 font-sans text-sm text-neutral-600 dark:text-neutral-400">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="hover:text-black dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="font-display font-medium text-sm text-neutral-950 dark:text-white tracking-wider uppercase">
              Services
            </h3>
            <ul className="space-y-2.5 font-sans text-sm text-neutral-600 dark:text-neutral-400">
              {servicesLinks.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="font-display font-medium text-sm text-neutral-950 dark:text-white tracking-wider uppercase">
              Get in Touch
            </h3>
            <div className="space-y-4 font-sans text-sm">
              <a
                href="mailto:hello@convergedigitals.com"
                className="text-accent hover:underline font-semibold block"
              >
                hello@convergedigitals.com
              </a>

              <div className="flex flex-wrap gap-3 pt-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-xs text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white px-3 py-1.5 rounded-full border border-neutral-300 dark:border-white/10 bg-white dark:bg-white/5 transition-colors shadow-sm"
                  >
                    <span>{social.label}</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Signature Banner Section */}
        <div className="pt-8 space-y-4">
          {/* Top Meta Row */}
          <div className="flex items-center justify-between font-sans text-xs text-neutral-600 dark:text-neutral-400">
            <span>© 2026 Converge Digitals. All rights reserved.</span>
            <span className="font-mono text-xs uppercase tracking-wider">INDIA</span>
          </div>

          {/* Giant Orange Stacked CONVERGE / DIGITALS® Display */}
          <div className="overflow-hidden py-2 sm:py-4 text-center select-none">
            <h2 className="font-display font-normal !font-normal text-[10.3vw] sm:text-[11.2vw] md:text-[11.7vw] leading-[0.84] tracking-tight text-accent uppercase hover:scale-[1.01] transition-transform duration-500 flex flex-col items-center" style={{ fontWeight: 400 }}>
              <span>CONVERGE</span>
              <span className="flex items-center justify-center">
                DIGITALS<span className="text-[0.38em] align-super ml-2 sm:ml-3">®</span>
              </span>
            </h2>
          </div>

          {/* Bottom Sub-bar */}
          <div className="flex items-center justify-between font-mono text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-medium uppercase tracking-wider sm:tracking-[0.2em] md:tracking-[0.25em] text-accent pt-2">
            <span className="hidden sm:inline">FULL-CYCLE DIGITAL COMPANY</span>
            <span className="sm:hidden">GROWTH COMPANY</span>
            <span>2026</span>
            <span>PROUDLY INDIAN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

