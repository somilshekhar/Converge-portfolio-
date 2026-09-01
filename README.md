# Converge Digitals® — Frontend Audit

> **Project:** Portfolio site (App Router, Next.js 15)
> **Audit date:** August 10, 2026
> **Method:** Static source review of every route, component, hook, style file, API route, and build configuration. All findings carry `file:line` evidence. Items that require runtime measurement (Core Web Vitals, Lighthouse, network traces) are explicitly tagged **[runtime]** — they are recommendations for measurement, not measured values.
> **Status:** Audit only. No source files were modified.

---

## 1. Executive Summary

The codebase is far above the average agency-portfolio baseline: strict TypeScript, robust API validation, disciplined reduced-motion handling in seven components, real focus-trap modals, self-hosted fonts via `next/font`, and correct `next/image` usage with a properly configured `remotePatterns`. The Awwwards-style ambitions (GSAP pin-scrubbing, custom cursor mask, curtain footer, Lenis smooth scroll) are implemented with care and mostly respect `prefers-reduced-motion`.

The headline risks are **not** aesthetic. They are:

1. **No `.gitignore` — and the git repo root is the whole home folder** — build artifacts, `node_modules`, a log file, and font binaries are all at risk of being committed.
2. **The contact API is unguarded** — no rate limiting, honeypot, or abuse control on a public POST endpoint.
3. **The site is half-"ORCA", half-"Converge Digitals"** — brand strings are mixed across UI, alt text, session-storage keys, and the API default address.
4. **Portfolio/team imagery is 100% Unsplash stock** — 13 remote URLs, no original work.
5. **LCP-risk surface is real**: a fake-timing preloader overlay, two autoplaying hero videos with no `poster`, and a hero headline that starts `opacity: 0`.
6. **The lint gate is broken** — `npm run lint` and `npx eslint .` both crash on `@rushstack/eslint-patch` vs ESLint 9.39.5, so no lint verification is possible until fixed.

Fix those six and the site is launch-ready. Everything else in this audit is polish and hardening.

---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js `15.1.7`, App Router, React `19` | Single route (`app/page.tsx`), one API route |
| Language | TypeScript `5.7.3`, `strict: true`, `isolatedModules: true` | Clean — zero `any`, `@ts-ignore`, or `eslint-disable` found |
| Styling | Tailwind `3.4.17` + CSS variables in `globals.css` | Token alignment verified (`--accent`, `--bg-color`, `--border-color` → `tailwind.config.ts`) |
| Motion | GSAP `3.12.7` (ScrollTrigger), Framer Motion `13`, Lenis `1.1.20` | 8 files use motion libs |
| Carousel | Embla `8.5.2` | Lightweight, `loop: true` only |
| Fonts | `next/font` self-hosted Clash Display (local) + Manrope (Google) | `display: swap`, preloaded |
| API | Route handler, zod `4.4.3`, Resend SMTP + optional SMTP env | Node runtime, `force-dynamic` |
| Tooling | ESLint 9 (flat config), `next lint`, PostCSS/Autoprefixer | **Lint gate currently broken** (§12); no test runner, no CI |

**Dependencies note:** `clsx@2.1.1` and `tailwind-merge@3.0.1` are declared but imported nowhere in the codebase. `lucide-react` is used for icons. All other dependencies are exercised.

---

## 3. Scorecard

Legend: **PASS** / **PARTIAL** / **FAIL** — judged against evidence available statically; runtime items marked **[runtime]**.

| # | Category | Grade | Headline finding |
|---|---|---|---|
| 1 | Repository hygiene | **FAIL** | No `.gitignore`; artifacts, log, font binaries unignored |
| 2 | Accessibility | **PARTIAL** | Strong focus traps & labels; no skip link, no `aria-expanded`, marquee without pause, live count-up not hidden |
| 3 | Performance | **PARTIAL** | No poster/bitrate control on hero video, fake preloader delays LCP, font payload [runtime] |
| 4 | SEO | **PASS** | Metadata, OG/Twitter, JSON-LD present; missing viewport/theme-color, no canonical |
| 5 | Security | **PARTIAL** | Validation is excellent; no rate limiting / abuse defense on contact API |
| 6 | Design & Brand | **PARTIAL** | Distinctive design system; brand identity split ORCA/Converge, placeholder socials |
| 7 | Motion quality | **PASS** | Reduced-motion handled in 7 of 10 animated components; Process reduced-motion dim-bug, marquee & preloader unchecked |
| 8 | Code quality | **PASS** | Strict TS, clean hooks, complete listener/timer cleanup (one exception) |
| 9 | Dependencies & build | **PARTIAL** | Two unused deps; font duplication on disk; **lint gate currently broken**; no size budget |
| 10 | Testing & CI | **FAIL** | No unit/e2e tests, no CI, no Lighthouse budget |
| 11 | Content & localization | **PARTIAL** | Single-locale English; stock placeholder imagery |
| 12 | Analytics & measurement | **FAIL** | No analytics, no error tracking, no RUM |

---

## 4. Repository Hygiene (FAIL)

Verified by inspection of the repo root.

| Finding | Evidence | Severity |
|---|---|---|
| **The git repository root is `C:\Users\Satyam` — the entire user home folder** — not the portfolio directory. The portfolio lives inside that repo as a fully untracked folder (`git ls-files .` in `portfolio/` matches nothing). | `git rev-parse --show-toplevel` → `C:/Users/Satyam` | **High** |
| **No `.gitignore` exists in the portfolio.** A `git add .` run at the home level would stage `portfolio/node_modules/`, `.next/`, `tsconfig.tsbuildinfo`, `dev-server.log`, and `ClashDisplay_Complete/` (OTF/TTF font binaries + license) along with everything else. (A `.gitignore` exists at the home root but is itself untracked and does not cover the portfolio.) | `Test-Path .gitignore` (in portfolio) → false; `git status` lists home-root `.gitignore` as `??` untracked | **High** |
| Stray log file `dev-server.log` in the project root | dir listing | Low |
| Full font set duplicated: `ClashDisplay_Complete/Fonts/{OTF,TTF,WEB}` vs the `.woff2` already in `public/fonts/` | dir listing | Low |

**Action:** initialize a proper repo inside `portfolio/` (or add a project `.gitignore` and keep the home-level repo's scope explicit), with `.gitignore` covering `node_modules`, `.next`, `*.tsbuildinfo`, `*.log`, `.env*` (except `.env.example`), and `ClashDisplay_Complete/`. Never `git add .` from the home directory.

---

## 5. Architecture & Code Quality (PASS)

### Strengths
- `app/layout.tsx` is a thin shell: fonts, metadata, JSON-LD, `CursorMask`, `SmoothScroll`. Good separation.
- Everything is `"use client"` — appropriate for this kind of heavily animated one-pager; no hydration-mismatch risk was found.
- Hooks are clean: `useReducedMotion` (`hooks/useReducedMotion.ts:5-20`) and `useMousePosition` (`hooks/useMousePosition.ts:25-39`, rAF-throttled, gated on `(hover: hover) and (pointer: fine)`) both have complete cleanup.
- Scroll listeners are rAF-throttled and removed (e.g. `Navbar.tsx:27-43`, `CursorMask.tsx:68-72, 96-107`).
- GSAP contexts are reverted on unmount (`About.tsx:71`, `Process.tsx:111`, `Stats.tsx:80`).
- No `dangerouslySetInnerHTML`, no `target=_blank` without `rel`, no hardcoded secrets.
- `tsconfig` uses `strict`, `isolatedModules`, moduleResolution `bundler`, `@/*` alias.

### Issues

| Finding | Evidence | Severity |
|---|---|---|
| **Dead interactive element:** "View Article" in the journal is a `<button>` with no `onClick` handler and no `href` — clicking does nothing | `VisualJournal.tsx:81-87` | Medium |
| **Dead links:** Team social links point to `"#"` | `Team.tsx:25,33,41` (socials), rendered `Team.tsx:110,117` | Medium |
| **Uncleaned timer:** `Preloader` `setTimeout(..., 300)` is not stored/cleared in the effect cleanup; it can fire after unmount | `Preloader.tsx:32-34` vs cleanup `:40` | Low |
| **Anchor scrolling bypasses Lenis:** Navbar, Footer, About, PortfolioGrid, CTASection all use native `scrollIntoView({ behavior: "smooth" })`, which can fight Lenis' wheel hijacking and produce double-smoothing or jumps | `Navbar.tsx:54-61`, `Footer.tsx:27-31`, `About.tsx:100-101`, `PortfolioGrid.tsx:136-139`, `CTASection.tsx:10-12` | Medium |
| `SmoothScroll` does not route anchor navigation (`SmoothScroll.tsx` has no `lenis.scrollTo`), so the pattern is inconsistent | `SmoothScroll.tsx:19-43` | Medium |
| No `scroll-margin-top` on anchored sections; the header is `fixed top-0` — anchor targets may land under the translucent header **[runtime check]** | `Navbar.tsx:66`, zero `scroll-margin` matches | Low |

---

## 6. Performance (PARTIAL)

All static observations; CWV numbers require runtime measurement **[runtime]**.

### Verified concerns

| Finding | Evidence | Severity |
|---|---|---|
| **Preloader blocks first paint**: full-screen fixed overlay at `z-[9999]` runs a fake 0→100 count-up (`setInterval` 40ms) before a GSAP curtain wipe. It does not wait for real assets ("LOADING ASSETS" label is decorative). While visible it sits above everything with no `pointer-events` pass-through and no reduced-motion short-circuit. The overlay is re-shown each session that lacks `orca_preloader_seen` (sessionStorage). **LCP impact:** the hero `<h1>` renders underneath the overlay. | `Preloader.tsx:25-69, 74-78, 109` | **High** |
| **Two autoplaying hero videos, no poster**: `v1.mp4` (1.26 MB) as full-bleed background (`preload="metadata"`), `v2.mp4` (77 KB) in the hero frame (`preload="auto"`). No `poster` attribute → dark flash before frames decode; no `.webm` fallback; no `preload="none"`/`loading="lazy"` for the below-fold frame. | `Hero.tsx:104-114, 152-162`; video sizes verified on disk | **High** |
| **Hero headline starts hidden**: `translate-y-[110%] opacity-0` with a JS-driven transition — the LCP text is invisible until the reveal effect runs. | `Hero.tsx:138-141` | Medium |
| **Manrope loads 6 weights** (300–800) via `next/font/google`. Manrope is variable; verify only used weights are emitted. **[runtime: measure font payload]** | `app/layout.tsx:15-20` | Medium |
| **`--font-clash` ships a single weight (Medium)** via `localFont`, yet the UI sets multiple font weights (e.g. `font-semibold`, `font-medium` headings) that rely on `--font-clash`; unloaded weights will synthesize/fall back, flattening the display-type hierarchy. | `app/layout.tsx:8-13`; weight usage in Hero/Navbar/FAQ | Medium |
| **`will-change` applied permanently** to `.mask-cursor` (mask-position/size) and `.line-mask-inner` (`transform`) — these live in CSS, not scoped to active animation, keeping GPU layers alive indefinitely. | `globals.css:77-82, 99-108` | Low/Medium |
| **Count-up re-renders**: Stats updates React state every GSAP `onUpdate` frame across 4 counters. | `Stats.tsx:59-74` | Low |

### Strengths
- `next/image` everywhere (no raw `<img>`): `fill` + `sizes` + descriptive `alt`; `priority` on the case-study hero. `remotePatterns` correctly allows `images.unsplash.com` (`next.config.ts:5-12`).
- Fonts self-hosted via `next/font` with `display: swap` — no layout shift from late font loads.
- All event listeners passive and removed; GSAP ticker removed on unmount (`SmoothScroll.tsx:40-43`).

### Recommendations (priority order)
1. Rebuild the preloader to either (a) wait on actual fonts/hero video `canplay` with a hard cap (~1.5 s), (b) respect `prefers-reduced-motion` by skipping it entirely, and (c) add `aria-hidden`/`inert` so it is not in the accessibility tree.
2. Add `poster` images to both videos; compress/re-encode `v1.mp4` (1.26 MB → target ≤ 500 KB); set `preload="none"` on the background layer and let the hero frame's `preload="auto"` be lowered to `metadata` until it scrolls near the viewport.
3. Load the full Clash Display variable font (`ClashDisplay-Variable.woff2` is already in `public/fonts/`) instead of a single Medium cut, or constrain headings to the loaded weight.
4. Remove permanent `will-change`; apply only during animation.

**Performance budget proposal** (verify with Lighthouse CI): LCP ≤ 2.0 s (mobile 4G), INP ≤ 200 ms, CLS ≤ 0.1, total JS ≤ 350 KB gzip, video assets ≤ 1.2 MB combined, font payload ≤ 250 KB.

---

## 7. Accessibility (PARTIAL)

Global: `globals.css:145-153` focus-visible rings; `globals.css:156-167` universal reduced-motion override. Language set (`app/layout.tsx:93`). No `viewport`/`theme-color` export (`app/layout.tsx` — only `metadata` is exported).

### WCAG 2.2 AA checklist (static)

| Guideline | Status | Evidence |
|---|---|---|
| 1.1.1 Non-text content | **PARTIAL** | All images have `alt`. But alt text leaks stale branding: `Team.tsx:83` `"...at ORCA Digital Lab"`. Decorative elements are `aria-hidden` where present (`ContactModal.tsx:224`, Hero videos `Hero.tsx:111,159`, cursor overlay `CursorMask.tsx:117`) — good. |
| 1.3.1 Info & relationships | **PARTIAL** | Semantic landmarks used (`header/nav/main/footer/section`). Section headings lack `aria-labelledby` wiring except modals. Cards are `div role="button"` with no accessible name (`PortfolioGrid.tsx:180-188`). |
| 1.4.1 Use of color | **PARTIAL** | Team portraits rely on `grayscale`→color hover (`Team.tsx:86`); hover-only de-emphasis in Process cards is a color+opacity-only cue (`Process.tsx:159`). |
| 1.4.3 Contrast | **[runtime]** | Dark-on-dark aesthetic; verify all `neutral-*` text on `#050507` (e.g. `text-neutral-500` labels in Hero `:128`) |
| 2.1.1 Keyboard | **PARTIAL** | Modals trap focus correctly. Mobile menu: **no focus trap, no Escape, focus not restored to toggle**. |
| 2.2.2 Pause/Stop/Hide | **FAIL** | CSS marquee animates indefinitely with no pause mechanism (only `group-hover` pause) and **no reduced-motion check** (`ClientMarquee.tsx:31`). Preloader has no reduced-motion skip (§11). |
| 2.4.1 Bypass blocks | **FAIL** | **No skip link** anywhere (`rg "skip"` → zero matches). Keyboard users must tab through the fixed header each load. |
| 2.4.3 Focus order | **PARTIAL** | Modal focus traps good; mobile drawer order exists but no focus management. |
| 2.4.7 Focus visible | **PASS** | Global focus-visible rings + `!important` (though `focus:outline-none` on FAQ button `FAQ.tsx:77` suppresses its ring). |
| 3.2.2 On input | **PASS** | No surprise auto-submits/redirects. |
| 4.1.2 Name/Role/Value | **PARTIAL** | `aria-expanded`/`aria-controls` **absent everywhere** (FAQ accordion `FAQ.tsx:75-89`, mobile menu toggle `Navbar.tsx:124-130`). Success feedback uses `role="status" aria-live="polite"` (`ContactModal.tsx:223`) — good. |
| Form validation | **PARTIAL** | Strong client + server validation; error messages are rendered but not wired to inputs via `aria-describedby` (verify in `ContactModal`). |

### Key component findings

| Component | Finding | Evidence |
|---|---|---|
| Navbar mobile menu | Toggle has `aria-label` but **no `aria-expanded`/`aria-controls`**; drawer has no focus trap, no Escape handling, no focus restore, no body scroll lock while open | `Navbar.tsx:124-130, 135-182` |
| FAQ | Toggle `<button>` wraps an `<h3>` and has **no `aria-expanded`/`aria-controls`**; open state is invisible to AT. `<h3>` inside `<button>` is a semantic anti-pattern. `focus:outline-none` removes the visible ring on that control | `FAQ.tsx:75-89, 77` |
| PortfolioGrid | Cards are `div role="button" tabIndex={0}` with Enter/Space — good pattern — but no accessible name and no `aria-expanded`/`aria-controls` to the modal | `PortfolioGrid.tsx:180-188` |
| CaseStudyModal | `createPortal` to `document.body`, `role="dialog"`, `aria-modal`, `aria-labelledby`, focus save/restore, Tab trap, Escape, body scroll lock — **exemplary** | `CaseStudyModal.tsx:29-78, 85-89, 109` |
| ContactModal | Same focus discipline; inline render (`return null` when closed); `role="status" aria-live="polite"` on success | `ContactModal.tsx:17-88, 223` |
| Stats count-up | Numbers are live-updating `<span>` with **no `aria-live` and no `aria-hidden`** — AT may read every intermediate value | `Stats.tsx:105` |
| Testimonials | Embla `loop: true`; prev/next have `aria-label`. No autoplay (ok). Slide drag is not keyboard-controllable, no `aria-roledescription` | `Testimonials.tsx:15, 104-119` |
| Custom cursor | `cursor: none` applied to all interactive elements on `pointer:fine` devices (`globals.css:89-96`); focus rings mitigate but some users lose the pointer entirely. Consider keeping system cursor on inputs or offering a cursor toggle | `globals.css:89-96` |
| Team | Card `role="article" aria-label` — good; grayscale hover cue noted | `Team.tsx:74-75` |

### Accessibility must-fix list
1. Add a skip link (`#main` target).
2. Add `aria-expanded` (+ `aria-controls`) to FAQ toggle and mobile-menu toggle.
3. Give PortfolioGrid cards accessible names (`aria-label={project.title}`) and wire `aria-haspopup="dialog"`/`aria-expanded`.
4. Pause the marquee for `prefers-reduced-motion` (or add a pause button per 2.2.2).
5. Hide/collapse the count-up text from AT (`aria-hidden` + static value in `aria-label`) — `Stats.tsx:105`.
6. Add `inert`/`aria-hidden` to the preloader overlay.

---

## 8. SEO (PASS)

### Present (verified)
- Title, description, keywords, authors/creator (`app/layout.tsx:22-35`).
- OpenGraph + Twitter cards with image, `siteName`, locale (`app/layout.tsx:37-62`).
- JSON-LD `ProfessionalService` with name/url/description/sameAs (`app/layout.tsx:69-85`).
- `robots: index,follow` (`app/layout.tsx:63-66`).

### Gaps

| Finding | Evidence | Severity |
|---|---|---|
| **No `viewport` metadata export** — no `themeColor`, no explicit `viewport` (`app/layout.tsx` exports only `metadata`) | `app/layout.tsx:22-67` | Medium |
| **No `metadataBase`/canonical** — relative canonical not emitted; OG URL is hardcoded `https://convergedigitals.com` | `app/layout.tsx:41` | Medium |
| **`sameAs` uses placeholder root domains** (`https://linkedin.com`, `https://x.com`, `https://instagram.com`) — real profile URLs required | `app/layout.tsx:80-84` | Medium |
| **OG image is a remote Unsplash URL** — social preview depends on an external CDN; self-host an on-brand 1200×630 | `app/layout.tsx:45-52` | Low |
| All portfolio/team imagery is Unsplash stock, so no `alt` describes real project artifacts | `PortfolioGrid.tsx:24-129`, `Team.tsx:24-40` | Medium |

---

## 9. Security & Abuse Resistance (PARTIAL)

### What is done well
- Server-side validation with zod (`ContactSchema`), including Unicode-safe name regex, lengths, and `.email()` (`app/api/contact/route.ts:4-28`).
- Content-type check (415), JSON parse guard (400), field-error mapping (422) (`route.ts:50-84`).
- Input sanitization strips control characters, `<script>...</script>`, `javascript:` (`route.ts:33-38`).
- Abort-signal handling on the request (499) (`route.ts:41-48, 128-135`).
- `Cache-Control: no-store` on the response (`route.ts:156-158`).
- `runtime = "nodejs"` + `dynamic = "force-dynamic"` — correct for a fetch-based mailer (`route.ts:30-31`).

### Gaps

| Finding | Evidence | Severity |
|---|---|---|
| **No rate limiting** on the public POST endpoint. Any client can POST unlimited requests → Resend quota drain, inbox flooding. Client-side "validation" is trivially bypassed. Recommend an IP/keyed token bucket (e.g. Upstash Redis) plus a honeypot field and/or Turnstile. | `app/api/contact/route.ts:40-160` (no limiter) | **High** |
| **`providerError` is returned to the client**, disclosing provider status/SMTP presence to any caller | `route.ts:146` | Low |
| **Default `from` uses the Resend sandbox domain** (`portfolio@resend.dev`) and the fallback `to` is `studio@orca.studio` — both must be replaced with the verified brand domain | `route.ts:95, 112` | Medium |
| **SMTP branch is a stub** — if only SMTP envs are set, it returns 202 with `delivered: false` and a "configure" message | `route.ts:138-140` | Low |
| ContactModal performs client-side validation only (no honeypot field) | `ContactModal.tsx:92-120` | Medium |

---

## 10. Design, Brand & UX (PARTIAL)

### Identity inconsistency (High)

The site is a mid-rebrand from **ORCA** to **Converge Digitals**, and the migration is incomplete:

| Where | Says "ORCA" | Evidence |
|---|---|---|
| Case-study modal eyebrow | "ORCA CASE ARCHIVE #2026" | `CaseStudyModal.tsx:236` |
| Process section eyebrow | "ORCA METHODOLOGY SPRINT" | `Process.tsx:198` |
| Team alt text | "...at ORCA Digital Lab" | `Team.tsx:83` |
| Team card footer | "ORCA PARTNER" | `Team.tsx:124` |
| Preloader session key | `orca_preloader_seen` | `Preloader.tsx:17, 51` |
| API fallback address | `studio@orca.studio` | `app/api/contact/route.ts:95` |

While the primary UI (Navbar, Hero, Footer, Preloader) says "Converge Digitals®". **Decision needed:** complete the Converge migration or revert to ORCA. No "mixed" state should ship.

### Other design findings

| Finding | Evidence | Severity |
|---|---|---|
| Social links are placeholder root domains in both Footer (`https://linkedin.com`, `x.com`, `instagram.com`, `contra.com`) and Navbar; Team socials are `"#"` | `Footer.tsx:21-24`, `Navbar.tsx:175-177`, `Team.tsx:25-41` | Medium |
| **All portfolio (10) + team (3) images are Unsplash stock** — no real project/team photography | `PortfolioGrid.tsx:24-129`, `Team.tsx:24-40` | Medium |
| Hero top label reads "CONVERGE DIGITALS®" while the design's original voice ("ORCA") remains in microcopy — tonal mismatch | `Hero.tsx:126` | Low |
| Process cards carry a default dimmed state (`lg:opacity-30 ...`) that is only lifted by the GSAP pin animation. Under `prefers-reduced-motion` the effect bails and **cards stay dimmed forever** — a real reduced-motion readability bug | `Process.tsx:65, 159` | Medium |
| "View Article" button has no action; journal cards are text-only | `VisualJournal.tsx:81-87` | Medium |

### What works
- Coherent dark system (`#050507` + accent) with a single accent token; glass panels and noise are restrained.
- Typography direction (Clash Display display + Manrope body) is strong; fix the single-weight Clash issue above.
- Microcopy and section rhythm (kicker dot + uppercase label + display heading) are consistent.
- Motion is purposeful and honors reduced motion in most places (see §11).

---

## 11. Motion & Animation Review

Reviewed against a high craft bar (Emil Kowalski-style): every animation must justify itself, respect input, and degrade gracefully.

| Component | Effect | Reduced-motion handled? | Notes |
|---|---|---|---|
| About | GSAP scrub + IO text reveal | Yes (`About.tsx:26` bails) | `ctx.revert()` on unmount — clean |
| Process | ScrollTrigger pin + SVG path draw + card stagger | **Bug** | On reduced motion cards remain `opacity-30` (`Process.tsx:65,159`) |
| Stats | Count-up + progress bars | Yes — jumps to final values (`Stats.tsx:50-53`) | No AT protection on count text (§7) |
| Hero | Split-word headline reveal + media frame | Yes (`Hero.tsx:95` effect gated) | Headline starts `opacity-0`; frame uses `scale-95 opacity-0` |
| PerspectiveSectionTransition | Framer Motion 3D scroll pin | Yes (`PerspectiveSectionTransition.tsx:69` gates with `!prefersReduced`) | Media-query driven enable; identity fallback — excellent |
| CursorMask | Custom cursor + text-reveal mask clone | Partial — zeroes tween duration (`:42`) but **mask system still runs** (clone, mouse tracking) | `will-change` permanently in CSS |
| Preloader | GSAP curtain wipe + fake counter | **No** | No `useReducedMotion` import |
| ClientMarquee | Infinite CSS marquee | **No** | Also fails 2.2.2 pause |
| Testimonials | Embla drag carousel | No (carousel itself is not "motion-heavy") | Buttons only; drag has no keyboard path |
| SmoothScroll | Lenis smooth wheel | Yes (`SmoothScroll.tsx:19` skips init) | Anchor scrolls bypass Lenis (§5) |

### Verdict
**Pass with exceptions.** The GSAP/Framer/Lenis discipline is above average. Fix: (1) Process reduced-motion dim bug, (2) preloader reduced-motion skip, (3) marquee pause, (4) scope `will-change` to active animation only.

---

## 12. Dependencies & Build (PARTIAL)

| Finding | Evidence | Severity |
|---|---|---|
| `clsx` and `tailwind-merge` imported nowhere — remove or start using | `package.json`; zero `import` matches | Low |
| **The lint gate is currently broken.** `npm run lint` (`next lint`) and `npx eslint .` both fail at load: `Failed to patch ESLint because the calling module was not recognized` from `@rushstack/eslint-patch` (`node_modules/@rushstack/eslint-patch/lib-cjs/_patch-base.js:244`). Cause: `eslint.config.mjs` imports `eslint-config-next` (`eslint.config.mjs:1`), which applies `@rushstack/eslint-patch` — and that patch cannot recognize the installed ESLint `9.39.5`. This blocks any lint verification and will fail CI the moment CI exists. Fix: upgrade `eslint-config-next` to a version compatible with ESLint 9.39+ (or replace the flat-config patch), then re-run `npm run lint`. | `npm run lint` → error (reproduced); `eslint.config.mjs:1`; ESLint `9.39.5` | **Medium** |
| `ClashDisplay_Complete/` (OTF/TTF/WEB) duplicates `public/fonts/*.woff2` and ships license files into the repo — prune | dir listing | Low |
| No `engines` field, no `packageManager` pin | `package.json` | Low |
| Build config is minimal and correct (`reactStrictMode`, image `remotePatterns`) | `next.config.ts` | — |

---

## 13. Testing & CI (FAIL)

- No test runner configured (`package.json` scripts: `dev`, `build`, `start`, `lint` only).
- No unit/integration tests for the API route or validation logic.
- No E2E (Playwright/Cypress) coverage of the modal flows, form submission, or reduced-motion paths.
- No CI workflow (no `.github/workflows`), no Lighthouse CI, no performance budget.

**Minimum viable baseline:** zod schema unit tests, one API route test (valid/invalid/unsupported content-type), one Playwright smoke (load → open contact → submit-fail → submit-ok), Lighthouse CI with the §6 budget.

---

## 14. Content & Localization (PARTIAL)

- Single locale (`lang="en"`, `locale: "en_US"`); no i18n needed for v1.
- Portfolio case studies are fabricated (5 projects) with stock imagery — replace with real work before public launch.
- Testimonials quote "Converge Digitals" 8 times in third-person — reads as self-authored; verify sourcing.
- Journal (VisualJournal) is text-only with dead "View Article" buttons; no article URLs exist.

---

## 15. Analytics & Measurement (FAIL)

- No analytics provider, no `app/` instrumentation, no error tracking (Sentry), no RUM. For a lead-generation portfolio this is the biggest blind spot: **there is no way to know what converts.**
- Recommendation: privacy-respecting analytics (Plausible/GA4) with conversion events on `POST /api/contact` success, plus error tracking before launch.

---

## 16. Validation Evidence (reproducible checks)

Every finding above can be re-verified with:

```bash
# Repo hygiene
Test-Path .gitignore          # -> False (finding confirmed)

# Brand inconsistency sweep
rg -n -i "orca|converge" --glob "*.tsx" --glob "*.ts" .

# Dead controls / placeholders
rg -n 'href="#"' components/Team.tsx
rg -n "onClick" components/VisualJournal.tsx

# Missing a11y attributes
rg -n "aria-expanded|aria-controls" --glob "*.tsx" .   # -> no matches
rg -n "skip" --glob "*.tsx" --glob "*.css" .           # -> no matches

# Unused deps
rg -n "clsx|tailwind-merge" --glob "*.ts" --glob "*.tsx" .  # -> no matches

# Reduced-motion gaps
rg -n "useReducedMotion" --glob "*.tsx" components/ | Select-String -Pattern "ClientMarquee|Preloader|Testimonials|PortfolioGrid"   # -> no matches

# Lint/build gate (currently failing — see §12)
npm run lint
npx --no-install eslint .   # both fail: "@rushstack/eslint-patch ... module was not recognized"
npm run build
```

**Runtime checks required before launch** (cannot be done statically): Lighthouse CWV on mobile 4G throttling; contrast spot-checks (§7); video decode/bandwidth trace; anchor-offset check under the fixed header.

---

## 17. Sitemap & Information Architecture

Single route `/` composed in order: Preloader → Hero (`#hero`) → ClientMarquee → About (`#about`) → Services (`#services`) → Process (`#process`) → Stats → CompanyProfile (`#company`) → PortfolioGrid (`#work`) → CaseStudyModal (overlay) → Team (`#team`) → Testimonials → VisualJournal (`#journal`) → FAQ (`#faq`) → CTASection → Footer (`#contact`) → ContactModal (overlay). Anchor targets used in UI: `#hero`, `#about`, `#work`, `#contact` (`Navbar.tsx:17-25`, `Footer.tsx:6-11`). All targets exist. IA is coherent for a one-pager; no separate pages needed at this scale.

---

## 18. Risk Register

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Commit of `.next`/`node_modules`/log/font binaries | High (no `.gitignore`) | Repo bloat + binary churn + licensing confusion | Add `.gitignore` immediately |
| R2 | Contact API abuse (spam/resend drain) | Medium | Cost + inbox flood | Rate limit + honeypot + CAPTCHA |
| R3 | Rebrand ships in mixed ORCA/Converge state | Certain (code evidence) | Brand confusion on a marketing site | Pick one identity; sweep `rg -i orca` |
| R4 | LCP misses budget from preloader + video + hidden h1 | High | SEO + user perception | §6 recommendations |
| R5 | Stock imagery presented as client work | Certain | Credibility damage | Replace before launch |
| R6 | Lint gate is **broken today** (eslint-patch vs ESLint 9.39.5) — no lint verification possible; fails CI once added | Certain (reproduced) | Unverified code enters repo | Upgrade `eslint-config-next` / patch config, re-run `npm run lint` |
| R7 | Reduced-motion users see dimmed Process cards | Certain (code evidence) | Readability | Fix `Process.tsx:65/159` |
| R8 | `git add .` at home-level repo root stages the entire portfolio including `node_modules`/`.next` | Certain (repo topology) | Repo bloat, binary churn | Project `.gitignore` + repo boundary (§4) |

---

## 19. Priority-Ranked Issue List

| # | Sev | Issue | Evidence | Effort |
|---|---|---|---|---|
| 1 | High | Add `.gitignore`; prune `ClashDisplay_Complete/`, `dev-server.log` | repo root | S |
| 2 | High | Pick one brand identity and sweep all ORCA/Converge strings | §10 | S |
| 3 | High | Rate limit + honeypot on `POST /api/contact` | route.ts | M |
| 4 | High | Preloader: respect reduced motion, cap timing, `inert`/`aria-hidden` | Preloader.tsx | M |
| 5 | High | Hero video `poster` + bitrate/size reduction | Hero.tsx:104-162 | M |
| 6 | Medium | Skip link + `aria-expanded`/`aria-controls` (FAQ, mobile menu) | Navbar/FAQ | S |
| 7 | Medium | Portfolio card accessible names + dialog wiring | PortfolioGrid.tsx:180 | S |
| 8 | Medium | Fix Process reduced-motion dim bug | Process.tsx:65/159 | S |
| 9 | Medium | Marquee pause (2.2.2 + reduced motion) | ClientMarquee.tsx:31 | S |
| 10 | Medium | Stats count AT hiding | Stats.tsx:105 | S |
| 11 | Medium | Real project/team assets; self-host OG image | PortfolioGrid/Team/layout | M |
| 12 | Medium | Route anchor scrolling through `lenis.scrollTo` | 5 call sites | M |
| 13 | Medium | Replace dead controls: journal "View Article", team `#` links | VisualJournal/Team | S |
| 14 | Medium | `viewport`/`themeColor` metadata, `metadataBase`/canonical | layout.tsx | S |
| 15 | Medium | Load Clash variable font; trim Manrope weights | layout.tsx:8-20 | S |
| 16 | Low | Remove `clsx`/`tailwind-merge` or start using them | package.json | S |
| 17 | Low | Scope `will-change` to active animation | globals.css | S |
| 18 | Low | Clear preloader 300 ms timeout; harden `providerError`/sandbox sender | Preloader/route.ts | S |
| 19 | Low | Fix FAQ `<h3>`-in-button + focus ring | FAQ.tsx:77-79 | S |
| 20 | Medium | Fix broken lint gate: `eslint-config-next`/`@rushstack/eslint-patch` vs ESLint 9.39 | eslint.config.mjs:1, §12 | S |

Effort: S ≤ 1 h · M 1–4 h · L ≥ 1 day.

---

## 20. Fix Schedule

### Now (before anyone touches the repo again)
- `.gitignore`, prune stray artifacts (P1).
- Brand decision + string sweep (P2).

### 30 days
- P3–P5 (API hardening, preloader, hero video).
- P6–P10 (a11y must-fixes).
- P11 (real imagery) and P14–P15 (metadata/fonts).

### 60 days
- P12–P13 (scroll routing, dead controls).
- Test suite + CI + Lighthouse budget (§13).
- Analytics + conversion events (§15).

### 90 days
- P16–P20 hardening.
- Runtime baseline: publish LCP/INP/CLS from Lighthouse CI and revisit budgets.

---

## 21. Post-Launch Baselines & Monitoring

| Metric | Budget | Tool |
|---|---|---|
| LCP (mobile 4G) | ≤ 2.0 s | Lighthouse CI / CrUX |
| INP | ≤ 200 ms | CrUX / RUM |
| CLS | ≤ 0.1 | Lighthouse CI |
| Total JS (gzip) | ≤ 350 KB | `next build` trace / BundleBuddy |
| Video assets | ≤ 1.2 MB combined | build artifact check |
| Font payload | ≤ 250 KB | network trace |
| Contact API failure rate | < 1% | server logs / RUM |
| Conversion event (`POST` 200) | tracked | analytics |

---

## 22. Appendix — Evidence Index

Key evidence by theme:
- **Reduced motion handled:** `About.tsx:26`, `CursorMask.tsx:42`, `Hero.tsx:95`, `PerspectiveSectionTransition.tsx:69`, `Process.tsx:65`, `SmoothScroll.tsx:19`, `Stats.tsx:50-53`; **missing:** `ClientMarquee.tsx:31`, `Preloader.tsx` (no import), `Testimonials.tsx`, `PortfolioGrid.tsx`, `Team.tsx`, `VisualJournal.tsx`.
- **Focus traps:** `CaseStudyModal.tsx:29-78`, `ContactModal.tsx:46-88`; **absent:** `Navbar.tsx:124-182`.
- **`aria-expanded`:** zero occurrences project-wide (verified by `rg`).
- **Skip link:** zero occurrences (verified by `rg`).
- **Dead controls:** `VisualJournal.tsx:81-87` (no onClick), `Team.tsx:25,33,41` (`href="#"`).
- **Placeholder socials:** `Footer.tsx:21-24`, `Navbar.tsx:175-177`.
- **Uncleaned timer:** `Preloader.tsx:32-34`.
- **Count-up AT gap:** `Stats.tsx:105`.
- **Process reduced-motion dim bug:** `Process.tsx:65` (early return) + `:159` (default dim classes).
- **Brand leftovers (ORCA):** `CaseStudyModal.tsx:236`, `Process.tsx:198`, `Team.tsx:83,124`, `Preloader.tsx:17,51`, `route.ts:95`.
- **Images:** all 10 portfolio + 3 team = `images.unsplash.com` (`PortfolioGrid.tsx:24-129`, `Team.tsx:24-40`).
- **No `.gitignore`:** `Test-Path .gitignore` → False.

---

*Audit is informational. Runtime measurements and any fixes are separate follow-ups.*
