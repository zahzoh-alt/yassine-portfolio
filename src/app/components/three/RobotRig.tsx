"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Robot, { createDrive } from "./Robot";
import { radialTexture, beamTexture } from "./textures";
import { robotState } from "@/lib/robotBus";
import type { Tier } from "./tier";

/**
 * RobotRig — the "director".
 *
 * Every section of the page contains an empty, reserved element marked with
 * `data-robot-slot`. The robot hovers inside the slot of the active section,
 * so it never sits on top of text. When the visitor scrolls towards the next
 * section, the robot flies along a curved, scroll-synchronised path to the
 * next slot. Its real position is then damped towards that target, which
 * gives natural acceleration / deceleration and makes teleporting impossible.
 */

export const CAM_Z = 10;
const INTRO_SECONDS = 3.4;
const TRAIL_N = 22;

type Pose = { x: number; y: number; size: number; z: number };
type Slot = { el: HTMLElement; section: HTMLElement; side: "left" | "right"; key: string };

const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = THREE.MathUtils.lerp;

function readSlots(): Slot[] {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-robot-slot]"))
    .map((el) => ({
      el,
      section: (el.closest("section") as HTMLElement) ?? el,
      side: (el.dataset.side === "left" ? "left" : "right") as "left" | "right",
      key: el.dataset.robotSlot ?? "",
    }))
    .sort((a, b) => a.section.offsetTop - b.section.offsetTop);
}

/** Where the robot should hover for a given slot (screen pixels). */
function holdPose(slot: Slot, vw: number, vh: number): Pose & { off: number } {
  const r = slot.el.getBoundingClientRect();
  // When the slot scrolls out of view the robot becomes a small companion
  // docked on the side of the screen, so it stays visible but out of the way.
  const comp = Math.min(150, Math.max(64, Math.min(vw, vh) * 0.16));
  const cx = slot.side === "left" ? Math.max(vw * 0.055, comp * 0.5) : vw - Math.max(vw * 0.055, comp * 0.5);
  if (r.width === 0 && r.height === 0) {
    // Slot hidden at this breakpoint → companion mode.
    const sectionRect = slot.section.getBoundingClientRect();
    const cyHidden = Math.min(vh * 0.76, Math.max(vh * 0.24, sectionRect.top + vh * 0.2));
    return { x: cx, y: cyHidden, size: comp, z: 0, off: 1 };
  }
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const size = Math.max(40, Math.min(r.width, r.height));
  const top = vh * 0.2;
  const bottom = vh * 0.82;
  let off = 0;
  let cy = y;
  if (y < top) {
    off = smooth((top - y) / (vh * 0.35));
    cy = vh * 0.24;
  } else if (y > bottom) {
    off = smooth((y - bottom) / (vh * 0.35));
    cy = vh * 0.76;
  }
  return { x: lerp(x, cx, off), y: lerp(y, cy, off), size: lerp(size, comp, off), z: 0, off };
}

export default function RobotRig({ tier, reduced, mouse }: {
  tier: Tier;
  reduced: boolean;
  mouse: React.MutableRefObject<{ x: number; y: number; nx: number; ny: number; has: boolean }>;
}) {
  const { camera } = useThree();
  const root = useRef<THREE.Group>(null!);
  const tilt = useRef<THREE.Group>(null!);
  const trail = useRef<(THREE.Sprite | null)[]>([]);
  const holo = useRef<THREE.Group>(null!);
  const holoMat = useRef<THREE.MeshBasicMaterial>(null!);
  const holoMat2 = useRef<THREE.MeshBasicMaterial>(null!);
  const shock = useRef<THREE.Mesh>(null!);
  const shockMat = useRef<THREE.MeshBasicMaterial>(null!);
  const flash = useRef<THREE.PointLight>(null!);
  const platform = useRef<THREE.Group>(null!);
  const platformMats = useRef<THREE.Material[]>([]);
  const drive = useRef(createDrive());

  const st = useRef({
    slots: [] as Slot[],
    slotsAge: 999,
    ready: false,
    introStart: -1,
    introDone: false,
    pos: new THREE.Vector3(0, 0, -40),
    prev: new THREE.Vector3(0, 0, -40),
    vel: new THREE.Vector3(),
    scale: 0.6,
    yaw: 0,
    pitch: 0,
    roll: 0,
    shockAt: -1e9,
    happyUntil: 0,
    platformVis: 0,
    holoVis: 0,
    trail: Array.from({ length: TRAIL_N }, () => new THREE.Vector3(0, 0, -80)),
    trailInit: false,
  });

  const tmp = useMemo(
    () => ({
      target: new THREE.Vector3(),
      p0: new THREE.Vector3(),
      p1: new THREE.Vector3(),
      p2: new THREE.Vector3(),
      v: new THREE.Vector3(),
      proj: new THREE.Vector3(),
    }),
    []
  );

  const glowTex = useMemo(() => radialTexture("rgba(80,240,255,1)", "rgba(0,60,255,0)", "robot-glow"), []);
  const beamTex = useMemo(() => beamTexture(), []);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20);
    const s = st.current;
    const t = state.clock.elapsedTime;
    const now = performance.now();
    const vw = state.size.width;
    const vh = state.size.height;
    const cam = camera as THREE.PerspectiveCamera;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));

    /** screen px → world at depth z; returns world-units-per-pixel at z = 0 */
    const toWorld = (px: number, py: number, z: number, out: THREE.Vector3) => {
      const H = 2 * (CAM_Z - z) * tanHalf;
      out.set((px / vw - 0.5) * H * cam.aspect, -(py / vh - 0.5) * H, z);
    };
    const wppAt0 = (2 * CAM_Z * tanHalf) / vh;

    // Refresh the slot list twice per second (cheap, handles layout changes).
    s.slotsAge += dt;
    if (s.slotsAge > 0.5) {
      s.slots = readSlots();
      s.slotsAge = 0;
    }
    const slots = s.slots;
    if (!slots.length) {
      root.current.visible = false;
      return;
    }
    root.current.visible = true;

    /* ---------------- 1. Target pose from scroll ---------------- */
    const scrollY = window.scrollY;
    const c = scrollY + vh * 0.5;
    let i = 0;
    for (let k = 0; k < slots.length; k++) if (slots[k].section.offsetTop <= c) i = k;

    const hold = holdPose(slots[i], vw, vh);
    let pose: Pose = { ...hold };
    let flying = 0;
    if (i + 1 < slots.length) {
      const top = slots[i].section.offsetTop;
      const nextTop = slots[i + 1].section.offsetTop;
      const len = Math.min((nextTop - top) * 0.45, vh * 0.75);
      const ft = Math.min(1, Math.max(0, (c - (nextTop - len)) / len));
      if (ft > 0) {
        const e = reduced ? smooth(ft) : easeInOut(ft);
        const next = holdPose(slots[i + 1], vw, vh);
        const arc = reduced ? 0 : Math.sin(Math.PI * e);
        pose = {
          x: lerp(hold.x, next.x, e),
          y: lerp(hold.y, next.y, e) - arc * vh * 0.1,
          size: lerp(hold.size, next.size, e) * (1 + arc * 0.15),
          z: arc * 2.2,
        };
        flying = arc;
      }
    }

    // Override (e.g. project modal): robot docks in a reserved corner.
    const override = robotState.overrideEl;
    if (override && override.isConnected) {
      const r = override.getBoundingClientRect();
      pose = { x: r.left + r.width / 2, y: r.top + r.height / 2, size: Math.min(r.width, r.height), z: 0 };
    }

    // Focus (hover / visit): drift towards the element, look at it.
    const focusEl = robotState.focusEl;
    let lookPx: { x: number; y: number } | null = null;
    if (focusEl && focusEl.isConnected) {
      const r = focusEl.getBoundingClientRect();
      lookPx = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      const strength = robotState.focusStrength;
      const fx = Math.min(vw * 0.92, Math.max(vw * 0.08, r.right - pose.size * 0.3));
      const fy = Math.min(vh * 0.86, Math.max(vh * 0.14, r.top + pose.size * 0.15));
      pose = {
        x: lerp(pose.x, fx, strength),
        y: lerp(pose.y, fy, strength),
        size: lerp(pose.size, Math.min(pose.size, 170), strength),
        z: pose.z,
      };
    }

    toWorld(pose.x, pose.y, pose.z, tmp.target);
    const targetScale = pose.size * wppAt0 * 0.78;

    /* ---------------- 2. Cinematic intro ---------------- */
    if (!s.ready) {
      s.ready = true;
      if (reduced || scrollY > vh * 0.3) {
        s.introDone = true;
        s.pos.copy(tmp.target);
        s.prev.copy(tmp.target);
        s.scale = targetScale;
      } else {
        s.introStart = t;
      }
    }

    let introSpin = 0;
    let introSpeed = 0;
    if (!s.introDone) {
      const p = Math.min(1, (t - s.introStart) / INTRO_SECONDS);
      const e = easeOut(p);
      // Cubic Bézier from deep space, sweeping in front of the camera, settling on the slot.
      const P0 = tmp.p0.set(tmp.target.x - 9, tmp.target.y + 5, -60);
      const P1 = tmp.p1.set(tmp.target.x + 7, tmp.target.y - 2.5, -14);
      const P2 = tmp.p2.set(tmp.target.x - 1.5, tmp.target.y + 1.2, 3.5);
      const u = 1 - e;
      s.pos
        .copy(P0)
        .multiplyScalar(u * u * u)
        .addScaledVector(P1, 3 * u * u * e)
        .addScaledVector(P2, 3 * u * e * e)
        .addScaledVector(tmp.target, e * e * e);
      s.scale = targetScale;
      introSpin = (1 - e) * Math.PI * 4;
      introSpeed = 1 - e * 0.85;
      if (p >= 1) {
        s.introDone = true;
        s.shockAt = now;
        s.happyUntil = now + 1600;
      }
    } else {
      /* ---------------- 3. Damped follow ---------------- */
      const busy = override || (focusEl && robotState.focusStrength > 0.5);
      const lambda = reduced ? 7 : busy ? 4.2 : 3.1;
      s.pos.x = THREE.MathUtils.damp(s.pos.x, tmp.target.x, lambda, dt);
      s.pos.y = THREE.MathUtils.damp(s.pos.y, tmp.target.y, lambda, dt);
      s.pos.z = THREE.MathUtils.damp(s.pos.z, tmp.target.z, lambda * 0.8, dt);
      s.scale = THREE.MathUtils.damp(s.scale, targetScale, lambda, dt);
    }

    // Velocity (world units / s), smoothed
    tmp.v.copy(s.pos).sub(s.prev).divideScalar(Math.max(dt, 1e-3));
    s.vel.lerp(tmp.v, 1 - Math.exp(-10 * dt));
    s.prev.copy(s.pos);
    const speed = Math.min(1, s.vel.length() / 6);

    /* ---------------- 3b. Comet trail (afterglow of the thruster) ---------------- */
    const showTrail = tier !== "low" && !reduced;
    if (showTrail) {
      const hist = s.trail;
      const last = hist.pop()!;
      last.set(s.pos.x, s.pos.y - s.scale * 0.45, s.pos.z);
      hist.unshift(last);
      if (!s.trailInit) {
        hist.forEach((h) => h.copy(last));
        s.trailInit = true;
      }
      const glow = Math.min(1, Math.max(speed, s.introDone ? 0 : 1) * 1.6);
      for (let k = 0; k < TRAIL_N; k++) {
        const sp = trail.current[k];
        if (!sp) continue;
        const f = 1 - k / TRAIL_N;
        sp.position.copy(hist[k]);
        sp.scale.setScalar(s.scale * (0.15 + 0.55 * f * f));
        (sp.material as THREE.SpriteMaterial).opacity = glow * 0.55 * f;
        sp.visible = glow > 0.02;
      }
    }

    /* ---------------- 4. Orientation ---------------- */
    tmp.proj.copy(s.pos).project(camera);
    const rx = (tmp.proj.x * 0.5 + 0.5) * vw;
    const ry = (-tmp.proj.y * 0.5 + 0.5) * vh;
    const look = lookPx ?? (mouse.current.has ? { x: mouse.current.x, y: mouse.current.y } : null);
    const dx = look ? (look.x - rx) / vw : Math.sin(t * 0.45) * 0.12;
    const dy = look ? (look.y - ry) / vh : Math.sin(t * 0.31) * 0.06;

    const yawT = THREE.MathUtils.clamp(s.vel.x * 0.16, -0.9, 0.9) + (speed < 0.3 ? THREE.MathUtils.clamp(dx, -0.5, 0.5) * 0.45 : 0);
    const rollT = THREE.MathUtils.clamp(-s.vel.x * 0.07, -0.5, 0.5);
    const pitchT = THREE.MathUtils.clamp(speed * 0.25 - s.vel.y * 0.03, -0.3, 0.45);
    s.yaw = THREE.MathUtils.damp(s.yaw, yawT, 4, dt);
    s.roll = THREE.MathUtils.damp(s.roll, rollT, 4, dt);
    s.pitch = THREE.MathUtils.damp(s.pitch, pitchT, 4, dt);

    const sp = (now - robotState.spinAt) / 900;
    const gestureSpin = !reduced && sp >= 0 && sp < 1 ? easeInOut(sp) * Math.PI * 2 : 0;

    root.current.position.copy(s.pos);
    root.current.scale.setScalar(s.scale);
    tilt.current.rotation.set(s.pitch, s.yaw + introSpin + gestureSpin, s.roll + (s.introDone ? 0 : Math.sin(introSpin) * 0.4));

    /* ---------------- 5. Drive the robot's body language ---------------- */
    const d = drive.current;
    d.lookYaw = THREE.MathUtils.clamp(dx * 2.4, -0.75, 0.75) - s.yaw * 0.4;
    d.lookPitch = THREE.MathUtils.clamp(dy * 1.8, -0.4, 0.4);
    d.speed = Math.max(speed, introSpeed, flying * 0.6);
    d.bob = !reduced;
    d.waving = !reduced && now - robotState.waveAt < 2600;
    d.mood = now < s.happyUntil || d.waving ? "happy" : focusEl ? "curious" : "idle";

    /* ---------------- 6. Holographic ring (hover feedback) ---------------- */
    const holoWanted = (focusEl && robotState.focusStrength < 0.5) || now - robotState.holoAt < 900 ? 1 : 0;
    s.holoVis = THREE.MathUtils.damp(s.holoVis, holoWanted, 6, dt);
    holo.current.visible = s.holoVis > 0.01;
    holo.current.rotation.z += dt * 1.6;
    holoMat.current.opacity = s.holoVis * 0.7;
    holoMat2.current.opacity = s.holoVis * 0.4;
    holo.current.scale.setScalar(0.85 + s.holoVis * 0.15);

    /* ---------------- 7. Arrival shockwave ---------------- */
    const sh = (now - s.shockAt) / 1100;
    if (sh >= 0 && sh < 1) {
      shock.current.visible = true;
      shock.current.position.copy(s.pos);
      shock.current.scale.setScalar(s.scale * (0.4 + easeOut(sh) * 3.6));
      shockMat.current.opacity = (1 - sh) * (1 - sh) * 0.9;
      flash.current.position.copy(s.pos);
      flash.current.intensity = (1 - sh) * 30;
    } else {
      shock.current.visible = false;
      flash.current.intensity = 0;
    }

    /* ---------------- 8. Holographic platform (contact) ---------------- */
    const contact = slots.find((sl) => sl.key === "contact");
    if (contact) {
      const r = contact.el.getBoundingClientRect();
      const cy = r.top + r.height / 2;
      const vis = 1 - Math.min(1, Math.abs(cy - vh * 0.5) / (vh * 0.55));
      s.platformVis = THREE.MathUtils.damp(s.platformVis, vis, 5, dt);
      const size = Math.min(r.width, r.height);
      const scl = size * wppAt0 * 0.78;
      toWorld(r.left + r.width / 2, cy, 0, tmp.p0);
      platform.current.position.set(tmp.p0.x, tmp.p0.y - scl * 0.66, 0);
      platform.current.scale.setScalar(scl);
      platform.current.visible = s.platformVis > 0.01;
      platform.current.rotation.y += dt * 0.25;
      platformMats.current.forEach((m, k) => {
        const base = (m.userData.base as number) ?? 0.5;
        m.opacity = base * s.platformVis * (0.85 + Math.sin(t * 2 + k) * 0.15);
      });
    } else {
      platform.current.visible = false;
    }
  });

  const registerMat = (base: number) => (m: THREE.Material | null) => {
    if (m && !platformMats.current.includes(m)) {
      m.userData.base = base;
      platformMats.current.push(m);
    }
  };

  const additive = {
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  } as const;

  return (
    <>
      <group ref={root}>
        <group ref={tilt}>
          <Robot drive={drive} />
        </group>

        {/* Hover hologram rings */}
        <group ref={holo} rotation={[Math.PI / 2 - 0.25, 0, 0]} position={[0, -0.05, 0]}>
          <mesh>
            <torusGeometry args={[0.62, 0.006, 6, 96]} />
            <meshBasicMaterial ref={holoMat} color="#38f3ff" {...additive} opacity={0} />
          </mesh>
          <mesh rotation={[0, 0, 1]}>
            <ringGeometry args={[0.68, 0.7, 96, 1, 0, Math.PI * 1.3]} />
            <meshBasicMaterial ref={holoMat2} color="#a36bff" {...additive} side={THREE.DoubleSide} opacity={0} />
          </mesh>
        </group>
      </group>

      {/* Comet trail behind the thruster */}
      {tier !== "low" &&
        !reduced &&
        Array.from({ length: TRAIL_N }).map((_, k) => (
          <sprite
            key={k}
            ref={(el) => {
              trail.current[k] = el;
            }}
            visible={false}
          >
            <spriteMaterial map={glowTex} color={k < 4 ? "#bdfbff" : "#38f3ff"} {...additive} opacity={0} />
          </sprite>
        ))}

      {/* Arrival shockwave + flash */}
      <mesh ref={shock} visible={false}>
        <ringGeometry args={[0.92, 1, 96]} />
        <meshBasicMaterial ref={shockMat} color="#7cf6ff" {...additive} side={THREE.DoubleSide} opacity={0} />
      </mesh>
      <pointLight ref={flash} color="#38f3ff" intensity={0} distance={14} decay={2} />

      {/* Holographic platform for the contact section */}
      <group ref={platform} visible={false}>
        <group rotation={[-Math.PI / 2 + 0.32, 0, 0]}>
          <mesh>
            <circleGeometry args={[0.85, 64]} />
            <meshBasicMaterial ref={registerMat(0.55)} map={glowTex} color="#38f3ff" {...additive} />
          </mesh>
          {[
            { r: 0.5, c: "#38f3ff", o: 0.9 },
            { r: 0.68, c: "#5b8cff", o: 0.7 },
            { r: 0.86, c: "#a36bff", o: 0.5 },
          ].map((ring) => (
            <mesh key={ring.r}>
              <ringGeometry args={[ring.r, ring.r + 0.018, 96]} />
              <meshBasicMaterial ref={registerMat(ring.o)} color={ring.c} {...additive} side={THREE.DoubleSide} />
            </mesh>
          ))}
          {Array.from({ length: 12 }).map((_, k) => (
            <mesh key={k} rotation={[0, 0, (k / 12) * Math.PI * 2]} position={[0, 0, 0.001]}>
              <ringGeometry args={[0.92, 0.98, 4, 1, 0, 0.18]} />
              <meshBasicMaterial ref={registerMat(0.6)} color="#38f3ff" {...additive} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.32, 0.5, 1.1, 48, 1, true]} />
          <meshBasicMaterial ref={registerMat(0.28)} map={beamTex} color="#38f3ff" {...additive} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </>
  );
}
