import * as THREE from "three";

const cache = new Map<string, THREE.Texture>();

/** Soft radial gradient generated on a canvas — used for glows, halos, nebulae. */
export function radialTexture(inner = "rgba(255,255,255,1)", outer = "rgba(255,255,255,0)", key = "default") {
  const id = `${key}|${inner}|${outer}`;
  const hit = cache.get(id);
  if (hit) return hit;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, inner);
  g.addColorStop(0.35, inner.replace(/[\d.]+\)$/, "0.45)"));
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(id, tex);
  return tex;
}

/** Vertical fade (opaque bottom → transparent top) for light beams and flames. */
export function beamTexture() {
  const id = "beam";
  const hit = cache.get(id);
  if (hit) return hit;
  const canvas = document.createElement("canvas");
  canvas.width = 4;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 128, 0, 0);
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(0.4, "rgba(255,255,255,0.25)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(id, tex);
  return tex;
}
