export type Tier = "low" | "mid" | "high";

/** Rough device capability estimate used to scale the 3D effects. */
export function detectTier(): Tier {
  if (typeof window === "undefined") return "mid";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const mem = nav.deviceMemory ?? 4;
  const cores = nav.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 768;
  if (mem <= 2 || cores <= 2) return "low";
  if (coarse || small || mem <= 4 || cores <= 4) return "mid";
  return "high";
}

export function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
