"use client";


import { OrbitingCircles } from "./OrbitingCircles";

export default function CTASection() {
  const tags = ["Independent", "Full-Cycle", "In-House"];

  return (
    <section className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-neutral-50 dark:bg-[#050507] border-b border-black/10 dark:border-white/10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 md:gap-12 items-center">
        <div className="md:col-span-7 lg:col-span-8 space-y-4 sm:space-y-6">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="flex items-center space-x-2 font-sans text-xs uppercase tracking-widest text-accent font-semibold">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span>COMPANY WRAP</span>
            </div>

            <div className="flex items-center space-x-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 font-sans text-[11px] sm:text-xs text-neutral-600 dark:text-neutral-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <h2 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-neutral-900 dark:text-white tracking-tight leading-tight">
            Digital growth built with intention.
          </h2>

          <p className="font-sans text-sm sm:text-base md:text-lg lg:text-xl text-neutral-600 dark:text-neutral-300 font-light leading-relaxed max-w-3xl">
            We run the full digital growth cycle — website, brand, content, ads, and AI systems — under one in-house team, so ambitious businesses get results without managing five different vendors.
          </p>
        </div>

        <div className="md:col-span-5 lg:col-span-4 relative flex h-[310px] xs:h-[330px] sm:h-[380px] md:h-[480px] w-full items-center justify-center overflow-hidden sm:overflow-visible">
          <div className="relative flex items-center justify-center w-[440px] sm:w-[480px] md:w-[500px] h-[440px] sm:h-[480px] md:h-[500px] scale-[0.68] xs:scale-[0.74] sm:scale-[0.84] md:scale-100 origin-center">
            {/* Inner Orbit - WhatsApp, Email, Instagram */}
          <OrbitingCircles
            className="size-[50px] border-none bg-transparent"
            duration={20}
            delay={0}
            radius={90}
          >
            <a href="https://wa.me/918200935110" target="_blank" rel="noopener noreferrer" className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/20 cursor-pointer hover:scale-110 transition-transform duration-300">
              <svg className="h-6 w-6 text-[#ffffff]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.01-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>
          </OrbitingCircles>
          <OrbitingCircles
            className="size-[50px] border-none bg-transparent"
            duration={20}
            delay={7}
            radius={90}
            path={false}
          >
            <a href="mailto:hello@convergedigitals.com" className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#ea6830] shadow-lg shadow-[#ea6830]/20 cursor-pointer hover:scale-110 transition-transform duration-300">
              <svg className="h-6 w-6 text-[#ffffff]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </a>
          </OrbitingCircles>
          <OrbitingCircles
            className="size-[50px] border-none bg-transparent"
            duration={20}
            delay={14}
            radius={90}
            path={false}
          >
            <a href="https://www.instagram.com/convergedigitals" target="_blank" rel="noopener noreferrer" className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-lg shadow-[#dc2743]/20 cursor-pointer hover:scale-110 transition-transform duration-300">
              <svg className="h-6 w-6 text-[#ffffff]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </OrbitingCircles>

          {/* Outer Orbit - X/Twitter, Google, Behance, Phone */}
          <OrbitingCircles
            className="size-[50px] border-none bg-transparent"
            radius={180}
            duration={30}
            reverse
            delay={0}
          >
            <a href="https://x.com/ConvergeDigit" target="_blank" rel="noopener noreferrer" className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/20 shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300">
              <svg className="h-5 w-5 text-black dark:text-[#ffffff]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </OrbitingCircles>
          <OrbitingCircles
            className="size-[50px] border-none bg-transparent"
            radius={180}
            duration={30}
            reverse
            delay={7.5}
            path={false}
          >
            <a href="https://convergedigitals.com/" target="_blank" rel="noopener noreferrer" className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-white shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300">
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </a>
          </OrbitingCircles>
          <OrbitingCircles
            className="size-[50px] border-none bg-transparent"
            radius={180}
            duration={30}
            reverse
            delay={15}
            path={false}
          >
            <a href="https://contra.com/converge_digitals_4d28indg" target="_blank" rel="noopener noreferrer" className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#1769ff] shadow-lg shadow-[#1769ff]/20 cursor-pointer hover:scale-110 transition-transform duration-300">
              <svg className="h-5 w-5 text-[#ffffff]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-15.154h5.363c3.313 0 4.773.746 4.773 3.153 0 1.908-1.236 2.494-2.28 2.738 1.182.4 2.809 1.398 2.809 3.61 0 3.013-2.137 5.653-4.199 5.653zm-2.886-7.1h2.001c1.72 0 2.41-.89 2.41-2.014 0-1.23-1.079-1.93-2.23-1.93h-2.181v3.944zm0 4.672h2.247c1.921 0 2.766-1.031 2.766-2.43 0-1.433-1.042-2.316-2.585-2.316h-2.428v4.746z" />
              </svg>
            </a>
          </OrbitingCircles>
          <OrbitingCircles
            className="size-[50px] border-none bg-transparent"
            radius={180}
            duration={30}
            reverse
            delay={22.5}
            path={false}
          >
            <a href="tel:8200935110" className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/20 cursor-pointer hover:scale-110 transition-transform duration-300">
              <svg className="h-5 w-5 text-[#ffffff]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
              </svg>
            </a>
          </OrbitingCircles>

          {/* Central Logo */}
          <div className="absolute flex items-center justify-center pointer-events-none">
            <div className="relative flex items-center justify-center h-20 w-20 rounded-full bg-white dark:bg-[#121215] border border-neutral-200 dark:border-white/20 shadow-xl dark:shadow-2xl backdrop-blur-lg p-4 group">
              <div className="absolute inset-0 rounded-full bg-accent/20 blur-md animate-pulse" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-light.png"
                alt="Converge Logo"
                className="h-10 w-10 object-contain dark:hidden drop-shadow-sm transition-all duration-300"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-dark.png"
                alt="Converge Logo"
                className="h-10 w-10 object-contain hidden dark:block drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-300"
              />
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}

