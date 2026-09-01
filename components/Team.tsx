"use client";

import { useMemo } from "react";
import Image from "next/image";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  credentials: string;
  oneLiner: string;
  bio: string;
  image: string;
  imagePosition?: string;
  imageScale?: string;
}

export default function Team() {
  const team: TeamMember[] = useMemo(
    () => [
      {
        id: "somil",
        name: "Somil Shekhar",
        role: "Founder",
        credentials: "IMCA (AI/ML) — Parul University, 2026",
        oneLiner: "Technical core, creative when it counts.",
        bio: "Leads the company's technical side end-to-end — AI systems and web development — and steps into creative when a project calls for it, directing the AI-generated video work behind Converge's reels and case studies.",
        image: "/assets/TEAM/somil_photo_new.png",
        imagePosition: "object-[center_35%]",
        imageScale: "scale-[1.85]",
      },
      {
        id: "raunak",
        name: "Raunak Kalya",
        role: "Co-Founder",
        credentials: "B.Tech CSE — Parul University, 2026",
        oneLiner: "Creative and management, end to end.",
        bio: "Owns the creative side — social media posts, graphics, and posters, both for Converge's own page and client pages — alongside day-to-day management and operations.",
        image: "/assets/TEAM/raunak_photo_v2.png",
        imagePosition: "object-top",
        imageScale: "scale-100",
      },
      {
        id: "vatsal",
        name: "Vatsal Bhavsar",
        role: "Co-Founder",
        credentials: "B.Tech CSE — Parul University, 2026",
        oneLiner: "Builds the web, researches the ideas.",
        bio: "Leads web development across client projects and drives the research side of the creative process — gathering ideas and direction before they reach the team.",
        image: "/assets/TEAM/vatsal_photo_new.png",
        imagePosition: "object-top",
        imageScale: "scale-100",
      },
    ],
    []
  );

  return (
    <section
      id="team"
      className="relative py-16 md:py-24 px-6 md:px-12 bg-[#f7f8fa] dark:bg-[#050507] border-b border-neutral-200 dark:border-white/10 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-neutral-200 dark:border-white/10">
          <div>
            <div className="flex items-center space-x-2 font-mono text-xs uppercase tracking-widest text-accent mb-3">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span>THE TEAM</span>
            </div>
            <h2 className="font-display font-medium text-4xl md:text-6xl text-neutral-950 dark:text-white tracking-tight">
              THE <span className="font-display font-medium text-accent">FOUNDERS</span>
            </h2>
          </div>
          <p className="font-sans text-sm md:text-base text-neutral-600 dark:text-neutral-400 max-w-md mt-4 md:mt-0 leading-relaxed">
            Three founders, no fixed lanes — we work across tech, creative, and client relationships depending on what a project needs.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {team.map((member) => (
            <div
              key={member.id}
              role="article"
              aria-label={`${member.name}, ${member.role}`}
              data-cursor-text="FOUNDER"
              className="group relative bg-white dark:bg-[#0c0c10] border border-neutral-200 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:border-accent/40 hover:-translate-y-2 shadow-sm"
            >
              {/* Photo Frame */}
              <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                <Image
                  src={member.image}
                  alt={`${member.name}, ${member.role} at Converge Digitals`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={`object-cover ${member.imagePosition || "object-top"} ${member.imageScale || "scale-100"} filter contrast-105 transition-transform duration-700 ease-out`}
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-white dark:from-[#0c0c10] via-transparent to-transparent opacity-90 pointer-events-none" />
              </div>

              {/* Card Body */}
              <div className="p-8 relative z-10 -mt-14 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-accent font-bold">
                      {member.role}
                    </span>
                  </div>
                  <h3 className="font-display font-medium text-2xl text-neutral-950 dark:text-white tracking-tight group-hover:text-accent transition-colors">
                    {member.name}
                  </h3>
                  <p className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                    {member.credentials}
                  </p>
                </div>

                {/* One-liner Pill */}
                <div className="inline-block px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
                  <span className="font-mono text-[11px] font-semibold text-accent">
                    "{member.oneLiner}"
                  </span>
                </div>

                {/* Bio Paragraph */}
                <p className="font-sans text-xs md:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed pt-2">
                  "{member.bio}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
