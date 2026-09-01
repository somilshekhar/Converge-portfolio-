"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const faqs: FAQItem[] = [
    {
      id: "faq-1",
      question: "What does Converge Digital specialise in?",
      answer:
        "We specialise in branding, web design and development, AI solutions, automation, SaaS products, SEO, and ongoing digital experiences for ambitious businesses.",
    },
    {
      id: "faq-2",
      question: "How do you approach your projects?",
      answer:
        "We begin by understanding the business, its audience, goals, and challenges. From there, we combine strategy, design, and technology to build a solution that is both visually refined and commercially useful.",
    },
    {
      id: "faq-3",
      question: "Can you support early-stage startups?",
      answer:
        "Yes. We work with early-stage startups as well as established businesses, helping turn early ideas into clear brands, functional products, and scalable digital experiences.",
    },
    {
      id: "faq-4",
      question: "How long does a typical project take?",
      answer:
        "Project timelines depend on scope, complexity, and requirements. A focused website can take several weeks, while larger applications, SaaS products, and AI solutions require a longer development cycle.",
    },
    {
      id: "faq-5",
      question: "How do I start working with Converge Digital?",
      answer:
        "Start by getting in touch with us. Tell us about your business, what you're trying to build, and what you're looking to achieve. We'll take it from there.",
    },
  ];

  return (
    <section
      id="faq"
      className="relative py-28 md:py-36 px-6 md:px-12 bg-[#f7f8fa] dark:bg-[#050507] text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-white/10 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Left Column */}
        <div className="md:col-span-4 space-y-3">
          <div className="flex items-center space-x-2 font-sans text-xs uppercase tracking-widest text-accent font-semibold">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span>COMMON QUERIES</span>
          </div>
          <h2 className="font-display font-medium text-4xl md:text-5xl text-neutral-950 dark:text-white tracking-tight">
            Frequently Asked.
          </h2>
        </div>

        {/* Right Column Accordion */}
        <div className="md:col-span-8 space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            const panelId = `faq-panel-${faq.id}`;
            const buttonId = `faq-button-${faq.id}`;

            return (
              <div
                key={faq.id}
                className="border-b border-neutral-200 dark:border-white/10 pb-6 pt-2 transition-all duration-300"
              >
                <h3 className="font-display font-medium text-xl md:text-2xl text-neutral-950 dark:text-white">
                  <button
                    id={buttonId}
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full text-left flex items-center justify-between py-2 group hover:text-accent transition-colors text-neutral-950 dark:text-white"
                  >
                    <span className="pr-6">{faq.question}</span>
                    <span className="p-2 rounded-full border border-neutral-300 dark:border-white/10 group-hover:border-accent text-neutral-800 dark:text-white group-hover:text-accent transition-colors shrink-0 shadow-sm bg-white dark:bg-transparent">
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-accent" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </span>
                  </button>
                </h3>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="mt-4 pr-12 animate-fade-in"
                  >
                    <p className="font-sans text-base text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
