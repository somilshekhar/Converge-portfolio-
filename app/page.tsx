"use client";

import { useState, Suspense, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ClientMarquee from "@/components/ClientMarquee";
import About from "@/components/About";
import AwardSection from "@/components/AwardSection";
import Services from "@/components/Services";
import PortfolioGrid from "@/components/PortfolioGrid";
import PerspectiveSectionTransition from "@/components/PerspectiveSectionTransition";

import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Team from "@/components/Team";
import CTASection from "@/components/CTASection";
import CollaborateCTA from "@/components/CollaborateCTA";
import Footer from "@/components/Footer";

const ContactModal = dynamic(
  () => import("@/components/ContactModal").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);

  const handleOpenContact = useCallback(() => setContactOpen(true), []);
  const handleCloseContact = useCallback(() => setContactOpen(false), []);

  useEffect(() => {
    const targetHash = sessionStorage.getItem("converge_scroll_target");
    if (targetHash) {
      sessionStorage.removeItem("converge_scroll_target");
      const timer = setTimeout(() => {
        const lenis = (window as unknown as { __lenis?: { scrollTo: (t: string) => void } }).__lenis;
        if (lenis) {
          lenis.scrollTo(targetHash);
        } else {
          const el = document.querySelector(targetHash);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <Preloader />

      <div className="relative min-h-screen bg-[#f7f8fa] dark:bg-[#050507] text-neutral-900 dark:text-white transition-colors duration-300">
        <Navbar onOpenContact={handleOpenContact} />

        {/* Main Content Wrapper for Footer Curtain Reveal */}
        <main className="main-content-wrap relative z-10 bg-[#f7f8fa] dark:bg-[#050507]">
          <Hero onOpenContact={handleOpenContact} />
          <ClientMarquee />
          <About onOpenContact={handleOpenContact} />
          <AwardSection />
          <PerspectiveSectionTransition
            from={<Services onOpenContact={handleOpenContact} />}
            to={<PortfolioGrid onOpenContact={handleOpenContact} />}
          />
          <Process />
          <Testimonials />
          <Team />
          <CTASection />
          <CollaborateCTA onOpenContact={handleOpenContact} />
        </main>

        <Footer onOpenContact={handleOpenContact} />

        <Suspense fallback={null}>
          <ContactModal isOpen={contactOpen} onClose={handleCloseContact} />
        </Suspense>
      </div>
    </>
  );
}
