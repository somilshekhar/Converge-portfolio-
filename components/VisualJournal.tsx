"use client";

import { ArrowUpRight } from "lucide-react";

interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
}

export default function VisualJournal() {
  const articles: Article[] = [
    {
      id: "article-1",
      title: "Ocean Blue Education — Web Design",
      category: "Web Design",
      date: "June 25, 2026",
      excerpt:
        "Minimal design isn't emptiness. It's clarity, intention, and the reduction of noise to amplify what truly matters.",
    },
    {
      id: "article-2",
      title: "The Nilgiri Co. — Brand Identity",
      category: "Brand Identity",
      date: "May 5, 2026",
      excerpt:
        "A strong brand is more than a logo. It's the connection between identity, visual language, and every digital touchpoint that represents the business.",
    },
    {
      id: "article-3",
      title: "Mahesh Masala — Web Design",
      category: "Web Design",
      date: "July 2, 2026",
      excerpt:
        "A website should carry the perception of a brand beyond the physical world — translating its character, quality, and story into a digital experience.",
    },
  ];

  return (
    <section
      id="journal"
      className="relative py-28 md:py-36 px-6 md:px-12 bg-[#f7f8fa] dark:bg-[#050507] text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-white/10 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 pb-8 border-b border-neutral-200 dark:border-white/10 space-y-3">
          <div className="flex items-center space-x-2 font-sans text-xs uppercase tracking-widest text-accent font-semibold">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span>CREATIVE NOTES</span>
          </div>
          <h2 className="font-display font-medium text-4xl md:text-6xl text-neutral-950 dark:text-white tracking-tight">
            Featured Articles
          </h2>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div
              key={article.id}
              className="group relative rounded-2xl bg-white dark:bg-[#0c0c10] border border-neutral-200 dark:border-white/10 p-8 flex flex-col justify-between hover:border-accent/50 transition-all duration-300 shadow-sm"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between font-sans text-xs text-neutral-600 dark:text-neutral-400">
                  <span className="text-accent font-semibold">{article.date}</span>
                  <span>{article.category}</span>
                </div>

                <h3 className="font-display font-medium text-2xl text-neutral-950 dark:text-white tracking-tight leading-snug group-hover:text-accent transition-colors">
                  {article.title}
                </h3>

                <p className="font-sans text-sm text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-8 mt-6 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    const targetEl = document.querySelector("#contact");
                    if (targetEl) {
                      const lenis = (window as unknown as { __lenis?: { scrollTo: (t: string | Element) => void } }).__lenis;
                      if (lenis) lenis.scrollTo("#contact");
                      else targetEl.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  data-cursor-text="READ"
                  className="font-sans text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white group-hover:text-accent flex items-center space-x-2 transition-colors"
                >
                  <span>Discuss Similar</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
