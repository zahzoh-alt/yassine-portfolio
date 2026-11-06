"use client";

import type { ReactNode } from "react";

/**
 * Section title + the reserved "robot slot". The 3D robot flies to this slot
 * when the section becomes active, so it always hovers in empty space next to
 * the title instead of over the content.
 */
export default function SectionHeader({
  kicker,
  title,
  slot,
  side = "right",
  large = false,
  className = "mb-16",
  slotClass = "",
  children,
}: {
  kicker: ReactNode;
  title: ReactNode;
  slot: string;
  side?: "left" | "right";
  large?: boolean;
  className?: string;
  /** Extra classes to push the slot further aside (long titles). */
  slotClass?: string;
  children?: ReactNode;
}) {
  const sideClass = side === "right" ? "lg:right-[1%]" : "lg:left-[1%]";
  const size = large
    ? "h-36 w-36 sm:h-40 sm:w-40 lg:h-48 lg:w-48 xl:h-60 xl:w-60"
    : "h-24 w-24 sm:h-28 sm:w-28 lg:h-36 lg:w-36 xl:h-48 xl:w-48";
  return (
    <div className={`relative text-center ${className}`}>
      <div
        data-robot-slot={slot}
        data-side={side}
        aria-hidden="true"
        className={`robot-slot relative mx-auto mb-2 ${size} lg:mb-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 ${sideClass} ${slotClass}`}
      />
      <div data-reveal>
        <span className="section-kicker text-xs font-medium text-accent tracking-[0.3em] uppercase inline-flex items-center gap-3 mb-4">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-400/70" aria-hidden="true" />
          {kicker}
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-400/70" aria-hidden="true" />
        </span>
        <h2 className="section-title text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight">{title}</h2>
        {children}
      </div>
    </div>
  );
}
