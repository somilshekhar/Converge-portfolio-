"use client";

import { useState, useEffect, useRef } from "react";
import { X, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    company_website: "",
  });

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();

    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    firstFocusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        if (!loading) {
          onClose();
        }
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
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
      lenis?.start();
      previouslyFocusedRef.current?.focus?.();
      abortRef.current?.abort();
    };
  }, [isOpen, onClose, loading]);

  if (!isOpen) return null;

  const validateField = (field: keyof FormErrors, value: string): string | undefined => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Please enter your name or company";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return undefined;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!emailRegex.test(value.trim())) return "Please enter a valid email address";
        return undefined;
      case "message":
        if (!value.trim()) return "Please describe your project";
        if (value.trim().length < 10) return "Please provide at least 10 characters";
        return undefined;
      default:
        return undefined;
    }
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
    };
    setErrors(newErrors);
    setTouched({ name: true, email: true, message: true });
    return !Object.values(newErrors).some(Boolean);
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field as keyof FormErrors, value),
      }));
    }
  };

  const handleBlur = (field: keyof typeof formData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field as keyof FormErrors, formData[field]),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || submitted) return;
    if (!validateAll()) return;

    setError(null);
    setLoading(true);

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("subject", "New Contact Form Submission - Converge Digitals");
      formDataToSend.append("message", formData.message);
      formDataToSend.append("_captcha", "false");
      formDataToSend.append("_subject", "New Contact Form Submission - Converge Digitals");

      const res = await fetch("https://formsubmit.co/ajax/hello@convergedigitals.com", {
        method: "POST",
        body: formDataToSend,
        signal: abortRef.current.signal,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        throw new Error(data.message || `Submission failed (${res.status})`);
      }

      setSuccessMessage("Thank you! Your message has been sent directly to hello@convergedigitals.com.");
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", message: "", company_website: "" });
        setTouched({});
        setErrors({});
        onClose();
      }, 3500);
    } catch (err) {
      const name = (err as { name?: string }).name;
      if (name !== "AbortError") {
        const message = err instanceof Error ? err.message : "Transmission failed. Please try again.";
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      data-lenis-prevent
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl transition-all duration-300 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        ref={dialogRef}
        data-lenis-prevent
        className="relative w-full max-w-xl bg-white dark:bg-[#0c0c10]/95 text-neutral-900 dark:text-white border border-neutral-200 dark:border-white/15 rounded-2xl md:rounded-3xl shadow-2xl p-6 sm:p-7 md:p-8 flex flex-col space-y-5 animate-scale-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-4">
          <div className="flex items-center space-x-2.5">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
              INITIATE PROJECT // INQUIRY
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close contact modal"
            disabled={loading}
            data-cursor-text="CLOSE"
            className="p-1.5 rounded-full border border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/30 text-neutral-800 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent hover:bg-neutral-100 dark:hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="my-auto text-center py-8 space-y-3" role="status" aria-live="polite">
            <CheckCircle2 className="w-12 h-12 text-accent mx-auto animate-bounce" aria-hidden="true" />
            <h3 className="font-display text-2xl font-bold uppercase text-neutral-950 dark:text-white">TRANSMISSION RECEIVED</h3>
            <p className="font-sans text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm max-w-xs mx-auto">
              {successMessage || "Our partner directors will analyze your inquiry and respond within 12 hours."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <h2
                id="contact-modal-title"
                className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-neutral-950 dark:text-white tracking-tight"
              >
                LET’S BUILD SOMETHING <span className="text-accent">EXTRAORDINARY</span>
              </h2>
              <p className="font-sans text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                Tell us about your brand, your growth goals, and your timeline — website, social, ads, or AI, we&apos;ll tell you exactly how we&apos;d approach it.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start space-x-2 bg-red-50 dark:bg-red-900/30 border border-red-500/40 text-red-700 dark:text-red-200 rounded-lg px-3.5 py-2.5 font-sans text-xs"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3.5">
              {/* Row 1: Name & Email side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block font-mono text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1"
                  >
                    YOUR NAME / COMPANY
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Rohan Mehta, Mehta & Co."
                    value={formData.name}
                    onChange={handleChange("name")}
                    onBlur={handleBlur("name")}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    autoComplete="name"
                    className={`w-full bg-neutral-50 dark:bg-white/5 rounded-lg px-3.5 py-2.5 text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none transition-colors font-sans text-xs sm:text-sm ${
                      errors.name && touched.name
                        ? "border-red-500/60 focus:border-red-500"
                        : "border-neutral-300 dark:border-white/10 focus:border-accent"
                    } border`}
                  />
                  {errors.name && touched.name && (
                    <p id="contact-name-error" className="mt-1 font-sans text-[10px] text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-2.5 h-2.5" aria-hidden="true" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-mono text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1"
                  >
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="alex@vance.io"
                    value={formData.email}
                    onChange={handleChange("email")}
                    onBlur={handleBlur("email")}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    autoComplete="email"
                    className={`w-full bg-neutral-50 dark:bg-white/5 rounded-lg px-3.5 py-2.5 text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none transition-colors font-sans text-xs sm:text-sm ${
                      errors.email && touched.email
                        ? "border-red-500/60 focus:border-red-500"
                        : "border-neutral-300 dark:border-white/10 focus:border-accent"
                    } border`}
                  />
                  {errors.email && touched.email && (
                    <p id="contact-email-error" className="mt-1 font-sans text-[10px] text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-2.5 h-2.5" aria-hidden="true" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Project Outline */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="block font-mono text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1"
                >
                  PROJECT OUTLINE
                </label>
                <textarea
                  id="contact-message"
                  rows={3}
                  placeholder="Briefly describe your objectives, deliverables, and timeline..."
                  value={formData.message}
                  onChange={handleChange("message")}
                  onBlur={handleBlur("message")}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                  className={`w-full bg-neutral-50 dark:bg-white/5 rounded-lg px-3.5 py-2.5 text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none transition-colors font-sans text-xs sm:text-sm resize-none ${
                    errors.message && touched.message
                      ? "border-red-500/60 focus:border-red-500"
                      : "border-neutral-300 dark:border-white/10 focus:border-accent"
                  } border`}
                />
                {errors.message && touched.message && (
                  <p id="contact-message-error" className="mt-1 font-sans text-[10px] text-red-500 flex items-center space-x-1">
                    <AlertCircle className="w-2.5 h-2.5" aria-hidden="true" />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              <div
                aria-hidden="true"
                className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden"
                style={{ position: "absolute", left: "-9999px", height: 0, width: 0, overflow: "hidden" }}
                tabIndex={-1}
              >
                <input
                  type="text"
                  id="contact-company-website"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.company_website}
                  onChange={handleChange("company_website")}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || submitted}
              data-cursor-text="SEND"
              aria-busy={loading}
              className="w-full relative group overflow-hidden rounded-lg bg-accent py-3 text-white font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center space-x-2 transition-all duration-300 hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  <span>TRANSMITTING…</span>
                </>
              ) : (
                <>
                  <span>SEND TRANSMISSION</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="pt-3 border-t border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between font-sans text-[11px] text-neutral-600 dark:text-neutral-400 gap-1.5">
          <span>Converge Digitals® • India</span>
          <span>
            DIRECT:{" "}
            <a
              href="mailto:hello@convergedigitals.com"
              className="hover:underline transition-colors text-accent font-medium"
            >
              hello@convergedigitals.com
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
