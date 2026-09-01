"use client";

export default function CompanyProfile() {
  return (
    <section
      id="company"
      className="relative py-28 md:py-36 px-6 md:px-12 bg-neutral-100 dark:bg-[#08080c] border-b border-black/10 dark:border-white/10 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Left Column Eyebrow */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center space-x-2 font-sans text-xs uppercase tracking-widest text-accent font-semibold">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span>STRATEGIC PARTNER</span>
          </div>
          <h2 className="font-display font-medium text-3xl md:text-5xl text-neutral-950 dark:text-white tracking-tight leading-tight">
            Where strategy, design, and technology come together.
          </h2>
        </div>

        {/* Right Column Statement */}
        <div className="md:col-span-8 space-y-6">
          <p className="font-sans text-lg md:text-2xl text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
            Converge Digital brings strategy, design, development, and technology together to solve real business problems. We see digital as more than visuals. It&apos;s a system of experiences designed to create clarity, improve performance, and deliver measurable impact. Every project we take on is an opportunity to transform an idea into a purposeful, scalable digital solution.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-black/10 dark:border-white/10 font-sans text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            <div>
              <span className="block text-neutral-900 dark:text-white font-bold text-sm mb-1">STRATEGY</span>
              <span>Brand & Product</span>
            </div>
            <div>
              <span className="block text-neutral-900 dark:text-white font-bold text-sm mb-1">DESIGN</span>
              <span>UI/UX & Systems</span>
            </div>
            <div>
              <span className="block text-neutral-900 dark:text-white font-bold text-sm mb-1">DEVELOPMENT</span>
              <span>Full-Stack & Web</span>
            </div>
            <div>
              <span className="block text-neutral-900 dark:text-white font-bold text-sm mb-1">TECHNOLOGY</span>
              <span>AI & Automation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
