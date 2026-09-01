import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ContactSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(120, { message: "Name cannot exceed 120 characters" })
    .regex(/^[\p{L}\p{M}\p{N}\p{Zs}'\-.,&/()#+]+$/u, {
      message: "Name contains invalid characters",
    }),
  email: z
    .string({ message: "Email is required" })
    .trim()
    .email({ message: "Must be a valid email address" })
    .max(254, { message: "Email cannot exceed 254 characters" }),
  budget: z
    .string()
    .trim()
    .max(64, { message: "Budget cannot exceed 64 characters" })
    .optional()
    .default("Flexible / Custom"),
  message: z
    .string({ message: "Message is required" })
    .trim()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(4000, { message: "Message cannot exceed 4000 characters" }),
  company_website: z
    .string()
    .trim()
    .max(0, { message: "Invalid submission" })
    .optional()
    .or(z.literal("")),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sanitize(s: string): string {
  return s
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/javascript:/gi, "");
}

export async function POST(req: NextRequest) {
  const abortSignal = req.signal;

  if (abortSignal.aborted) {
    return NextResponse.json(
      { ok: false, error: "Request cancelled" },
      { status: 499 }
    );
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json(
      { ok: false, error: "Unsupported content type; expected application/json" },
      { status: 415 }
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const [key, issues] of Object.entries(parsed.error.flatten().fieldErrors)) {
      if (issues && issues.length > 0) {
        fieldErrors[key] = issues[0];
      }
    }
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed",
        fieldErrors,
      },
      { status: 422 }
    );
  }

  const { name, email, budget, message, company_website } = parsed.data;
  if (company_website && company_website.length > 0) {
    return NextResponse.json(
      { ok: true, delivered: true, ticket: `CVD-${Date.now().toString(36).toUpperCase()}` },
      { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }

  const clean = {
    name: sanitize(name),
    email: sanitize(email),
    budget: sanitize(budget),
    message: sanitize(message),
  };

  let delivered = false;

  try {
    const formDataToSend = new FormData();
    formDataToSend.append("name", clean.name);
    formDataToSend.append("email", clean.email);
    formDataToSend.append("subject", `New Inquiry from ${clean.name}`);
    formDataToSend.append("message", clean.message);
    formDataToSend.append("_captcha", "false");
    formDataToSend.append("_subject", "New Contact Form Submission - Converge Digitals");

    const res = await fetch("https://formsubmit.co/ajax/hello@convergedigitals.com", {
      method: "POST",
      body: formDataToSend,
      signal: abortSignal,
    });
    delivered = res.ok;
  } catch (err) {
    const name = (err as { name?: string }).name;
    if (name === "AbortError") {
      return NextResponse.json(
        { ok: false, error: "Request cancelled" },
        { status: 499 }
      );
    }
  }

  return NextResponse.json(
    {
      ok: true,
      delivered,
      ticket: `CVD-${Date.now().toString(36).toUpperCase()}`,
      next: "We will respond within 12 hours.",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
