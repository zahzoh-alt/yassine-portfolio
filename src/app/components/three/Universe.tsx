"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { radialTexture } from "./textures";
import type { Tier } from "./tier";

/* ------------------------------------------------------------------ */
/* Star / dust points with a tiny custom shader (twinkle + soft disc) */
/* ------------------------------------------------------------------ */

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  attribute float aScale;
  attribute float aPhase;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * uPixelRatio * (12.0 / -mv.z);
    vColor = aColor;
    vAlpha = 0.55 + 0.45 * sin(uTime * 1.2 + aPhase);
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * a * vAlpha);
  }
`;

const PALETTE = ["#ffffff", "#9befff", "#38f3ff", "#5b8cff", "#a36bff"].map((c) => new THREE.Color(c));

function Points({
  count,
  box,
  size,
  reduced,
}: {
  count: number;
  box: [number, number, number, number, number, number]; // xMin xMax yMin yMax zMin zMax
  size: number;
  reduced: boolean;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const geometry = useMemo(() => {
    const [x0, x1, y0, y1, z0, z1] = box;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const scale = new Float32Array(count);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = x0 + Math.random() * (x1 - x0);
      pos[i * 3 + 1] = y0 + Math.random() * (y1 - y0);
      pos[i * 3 + 2] = z0 + Math.random() * (z1 - z0);
      const c = PALETTE[Math.random() < 0.55 ? 0 : 1 + Math.floor(Math.random() * 4)];
      col.set([c.r, c.g, c.b], i * 3);
      scale[i] = Math.random() < 0.06 ? 2 + Math.random() * 1.5 : 0.4 + Math.random() * 1.1;
      phase[i] = Math.random() * Math.PI * 2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    return g;
  }, [count, box]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uSize: { value: size },
    }),
    [size]
  );

  useFrame((state) => {
    uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    if (!reduced) uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Holographic wireframe objects floating at different depths         */
/* ------------------------------------------------------------------ */

const SHAPES: { kind: "ico" | "torus" | "oct" | "dodeca" | "box"; pos: [number, number, number]; s: number; color: string }[] = [
  { kind: "ico", pos: [9, 4.5, -14], s: 1.0, color: "#38f3ff" },
  { kind: "torus", pos: [7.2, -3.5, -10], s: 1.3, color: "#a36bff" },
  { kind: "oct", pos: [-7.5, -9.5, -12], s: 1.5, color: "#5b8cff" },
  { kind: "dodeca", pos: [6.5, -14, -8], s: 1.0, color: "#38f3ff" },
  { kind: "box", pos: [-6, -19.5, -9], s: 1.1, color: "#a36bff" },
  { kind: "ico", pos: [7.8, -24, -13], s: 1.6, color: "#5b8cff" },
  { kind: "torus", pos: [-7, -29, -10], s: 1.2, color: "#38f3ff" },
  { kind: "oct", pos: [6, -33, -7], s: 0.9, color: "#a36bff" },
];

function HoloShape({ kind, pos, s, color, i, reduced }: (typeof SHAPES)[number] & { i: number; reduced: boolean }) {
  const ref = useRef<THREE.Group>(null!);
  const halo = useMemo(() => radialTexture("rgba(120,200,255,1)", "rgba(40,80,255,0)", "shape-halo"), []);
  useFrame((state, dt) => {
    if (reduced) return;
    ref.current.rotation.x += dt * 0.12 * (i % 2 ? 1 : -1);
    ref.current.rotation.y += dt * 0.18;
    ref.current.position.y = pos[1] + Math.sin(state.clock.elapsedTime * 0.6 + i) * 0.25;
  });
  const geometry = useMemo(() => {
    switch (kind) {
      case "torus":
        return new THREE.TorusGeometry(0.8, 0.25, 10, 28);
      case "oct":
        return new THREE.OctahedronGeometry(1, 0);
      case "dodeca":
        return new THREE.DodecahedronGeometry(0.9, 0);
      case "box":
        return new THREE.BoxGeometry(1.2, 1.2, 1.2, 2, 2, 2);
      default:
        return new THREE.IcosahedronGeometry(1, 1);
    }
  }, [kind]);
  return (
    <group position={pos} scale={s}>
      <group ref={ref}>
        <mesh geometry={geometry}>
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={0.22}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh geometry={geometry} scale={0.98}>
          <meshBasicMaterial color={color} transparent opacity={0.035} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>
      <sprite scale={[4, 4, 1]}>
        <spriteMaterial
          map={halo}
          color={color}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* The universe: everything in the background, moved by scroll+mouse  */
/* ------------------------------------------------------------------ */

export const UNIVERSE_TRAVEL = 34; // world units travelled from top to bottom of the page
const STAR_BOX: [number, number, number, number, number, number] = [-60, 60, -70, 25, -70, -18];
const DUST_BOX: [number, number, number, number, number, number] = [-14, 14, -45, 8, -6, 3];

export default function Universe({
  tier,
  reduced,
  mouse,
}: {
  tier: Tier;
  reduced: boolean;
  mouse: React.MutableRefObject<{ nx: number; ny: number }>;
}) {
  const group = useRef<THREE.Group>(null!);
  const nebula = useMemo(() => radialTexture("rgba(255,255,255,1)", "rgba(255,255,255,0)", "nebula"), []);

  const starCount = tier === "high" ? 2200 : tier === "mid" ? 1200 : 600;
  const dustCount = tier === "high" ? 260 : tier === "mid" ? 140 : 60;

  useFrame((_, dt) => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const p = window.scrollY / max;
    const g = group.current;
    g.position.y = THREE.MathUtils.damp(g.position.y, p * UNIVERSE_TRAVEL, 4, dt);
    if (!reduced) {
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, mouse.current.nx * 0.035, 2, dt);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, mouse.current.ny * 0.025, 2, dt);
    }
  });

  return (
    <group ref={group}>
      {/* Deep nebula clouds */}
      {[
        { p: [-14, 2, -55], s: 46, c: "#1d3cff", o: 0.22 },
        { p: [16, -12, -60], s: 52, c: "#6a1bff", o: 0.16 },
        { p: [-10, -26, -55], s: 44, c: "#00b7ff", o: 0.14 },
        { p: [12, -38, -58], s: 50, c: "#3b1bff", o: 0.18 },
      ].map((n, i) => (
        <sprite key={i} position={n.p as [number, number, number]} scale={[n.s, n.s, 1]}>
          <spriteMaterial map={nebula} color={n.c} transparent opacity={n.o} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      ))}

      <Points count={starCount} box={STAR_BOX} size={9} reduced={reduced} />
      <Points count={dustCount} box={DUST_BOX} size={2.2} reduced={reduced} />

      {SHAPES.slice(0, tier === "low" ? 4 : SHAPES.length).map((s, i) => (
        <HoloShape key={i} {...s} i={i} reduced={reduced} />
      ))}
    </group>
  );
}
