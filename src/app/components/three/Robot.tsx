"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { radialTexture } from "./textures";

/**
 * "Drive" values written every frame by the director (RobotRig) and read by
 * the robot to animate its own parts. Mutable object → no React re-renders.
 */
export type RobotDrive = {
  lookYaw: number; // head yaw relative to body (rad)
  lookPitch: number; // head pitch (rad)
  speed: number; // 0..1 flight intensity → thrusters, arm drag
  mood: "idle" | "curious" | "happy";
  waving: boolean;
  bob: boolean; // idle floating motion (off with reduced motion)
};

export function createDrive(): RobotDrive {
  return { lookYaw: 0, lookPitch: 0, speed: 0, mood: "idle", waving: false, bob: true };
}

const CYAN = "#38f3ff";
const BLUE = "#2f6bff";

/** Egg-shaped torso profile, revolved with a LatheGeometry. */
function torsoGeometry() {
  const pts = [
    [0, -0.36],
    [0.1, -0.352],
    [0.17, -0.315],
    [0.208, -0.245],
    [0.224, -0.165],
    [0.216, -0.085],
    [0.184, -0.03],
    [0.125, 0.0],
    [0, 0.012],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, 48);
}

export default function Robot({ drive }: { drive: React.MutableRefObject<RobotDrive> }) {
  const body = useRef<THREE.Group>(null!);
  const head = useRef<THREE.Group>(null!);
  const eyes = useRef<THREE.Group>(null!);
  const eyeL = useRef<THREE.Mesh>(null!);
  const eyeR = useRef<THREE.Mesh>(null!);
  const armL = useRef<THREE.Group>(null!);
  const armR = useRef<THREE.Group>(null!);
  const flame = useRef<THREE.Group>(null!);
  const tip = useRef<THREE.MeshBasicMaterial>(null!);
  const core = useRef<THREE.MeshBasicMaterial>(null!);
  const glow = useRef<THREE.Sprite>(null!);
  const light = useRef<THREE.PointLight>(null!);

  const blink = useRef({ next: 2.5, t: -1 });

  const mats = useMemo(
    () => ({
      shell: new THREE.MeshPhysicalMaterial({
        color: "#eef2f8",
        metalness: 0.18,
        roughness: 0.26,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
      }),
      silver: new THREE.MeshStandardMaterial({ color: "#c4ccd8", metalness: 1, roughness: 0.2 }),
      dark: new THREE.MeshPhysicalMaterial({
        color: "#04060d",
        metalness: 0.5,
        roughness: 0.06,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      }),
      glow: new THREE.MeshBasicMaterial({ color: CYAN, toneMapped: false }),
      flameOuter: new THREE.MeshBasicMaterial({
        color: CYAN,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
      flameInner: new THREE.MeshBasicMaterial({
        color: "#e8feff",
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    }),
    []
  );

  const geo = useMemo(
    () => ({
      torso: torsoGeometry(),
      visor: new THREE.SphereGeometry(0.262, 48, 32, Math.PI / 2 - 0.78, 1.56, Math.PI / 2 - 0.46, 0.92),
      eye: new THREE.CapsuleGeometry(0.03, 0.045, 4, 12),
    }),
    []
  );

  const glowTex = useMemo(() => radialTexture("rgba(80,240,255,1)", "rgba(0,60,255,0)", "robot-glow"), []);
  const eyeGlowTex = useMemo(() => radialTexture("rgba(120,250,255,1)", "rgba(0,200,255,0)", "eye-glow"), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const d = drive.current;
    const k = 1 - Math.exp(-8 * dt); // frame-rate independent smoothing

    // Idle hover
    body.current.position.y = d.bob ? Math.sin(t * 1.7) * 0.035 : 0;
    body.current.rotation.z = d.bob ? Math.sin(t * 1.1) * 0.03 : 0;

    // Head tracking
    head.current.rotation.y += (THREE.MathUtils.clamp(d.lookYaw, -0.75, 0.75) - head.current.rotation.y) * k;
    head.current.rotation.x += (THREE.MathUtils.clamp(d.lookPitch, -0.4, 0.4) - head.current.rotation.x) * k;
    eyes.current.position.x += (THREE.MathUtils.clamp(d.lookYaw, -1, 1) * 0.025 - eyes.current.position.x) * k;
    eyes.current.position.y += (THREE.MathUtils.clamp(-d.lookPitch, -1, 1) * 0.02 - eyes.current.position.y) * k;

    // Eyes: blink + mood
    const b = blink.current;
    if (t > b.next) {
      b.t = t;
      b.next = t + 2.2 + Math.random() * 3.5;
    }
    const bp = (t - b.t) / 0.16;
    const blinkScale = bp >= 0 && bp < 1 ? Math.abs(Math.cos(bp * Math.PI)) * 0.9 + 0.1 : 1;
    const moodY = d.mood === "happy" ? 0.42 : d.mood === "curious" ? 1.2 : 1;
    const moodX = d.mood === "curious" ? 1.15 : 1;
    for (const e of [eyeL.current, eyeR.current]) {
      e.scale.y += (moodY * blinkScale - e.scale.y) * Math.min(1, k * 2.5);
      e.scale.x += (moodX - e.scale.x) * k;
    }

    // Arms: drag behind when flying, wave on demand
    const drag = -d.speed * 0.7;
    armL.current.rotation.x += (drag + Math.sin(t * 1.7 + 1) * 0.08 - armL.current.rotation.x) * k;
    armL.current.rotation.z += (0.12 + d.speed * 0.25 - armL.current.rotation.z) * k;
    if (d.waving) {
      armR.current.rotation.x += (-0.2 - armR.current.rotation.x) * k;
      armR.current.rotation.z += (-2.5 + Math.sin(t * 11) * 0.38 - armR.current.rotation.z) * Math.min(1, k * 1.5);
    } else {
      armR.current.rotation.x += (drag + Math.sin(t * 1.7) * 0.08 - armR.current.rotation.x) * k;
      armR.current.rotation.z += (-0.12 - d.speed * 0.25 - armR.current.rotation.z) * k;
    }

    // Thrusters & lights
    const flick = 0.85 + Math.sin(t * 38) * 0.08 + Math.sin(t * 23.7) * 0.07;
    const power = 0.55 + d.speed * 0.9;
    flame.current.scale.set(0.9 + d.speed * 0.25, power * flick, 0.9 + d.speed * 0.25);
    glow.current.material.opacity = 0.55 + d.speed * 0.35 + Math.sin(t * 30) * 0.05;
    light.current.intensity = 1.6 + d.speed * 2.2;
    tip.current.color.setHSL(0.52, 1, 0.55 + Math.sin(t * 3) * 0.2);
    core.current.color.setHSL(0.52, 1, 0.5 + Math.sin(t * 2.2) * 0.12 + (d.mood === "happy" ? 0.15 : 0));
  });

  return (
    <group ref={body}>
      {/* ───────────── HEAD ───────────── */}
      <group ref={head} position={[0, 0.27, 0]}>
        <mesh material={mats.shell} scale={[1.18, 0.92, 1]} castShadow>
          <sphereGeometry args={[0.26, 48, 32]} />
        </mesh>
        <mesh geometry={geo.visor} material={mats.dark} scale={[1.19, 0.93, 1.02]} />

        <group ref={eyes} position={[0, 0.005, 0]}>
          <mesh ref={eyeL} geometry={geo.eye} material={mats.glow} position={[-0.085, 0, 0.262]} scale={[1, 1, 0.35]} />
          <mesh ref={eyeR} geometry={geo.eye} material={mats.glow} position={[0.085, 0, 0.262]} scale={[1, 1, 0.35]} />
          <sprite position={[0, 0, 0.27]} scale={[0.42, 0.24, 1]}>
            <spriteMaterial
              map={eyeGlowTex}
              transparent
              opacity={0.55}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </sprite>
        </group>

        {/* Ear pods */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.305, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <mesh material={mats.silver}>
              <cylinderGeometry args={[0.068, 0.075, 0.05, 32]} />
            </mesh>
            <mesh material={mats.glow} position={[0, s * 0.027, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.045, 0.008, 8, 32]} />
            </mesh>
          </group>
        ))}

        {/* Antenna */}
        <mesh material={mats.silver} position={[0, 0.29, 0]}>
          <cylinderGeometry args={[0.008, 0.012, 0.11, 12]} />
        </mesh>
        <mesh position={[0, 0.355, 0]}>
          <sphereGeometry args={[0.026, 16, 16]} />
          <meshBasicMaterial ref={tip} color={CYAN} toneMapped={false} />
        </mesh>
      </group>

      {/* Neck */}
      <mesh material={mats.dark} position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.06, 24]} />
      </mesh>

      {/* ───────────── TORSO ───────────── */}
      <mesh geometry={geo.torso} material={mats.shell} />
      <mesh material={mats.glow} position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.221, 0.0065, 8, 64]} />
      </mesh>
      {/* Chest core */}
      <group position={[0, -0.14, 0.205]} rotation={[-0.12, 0, 0]}>
        <mesh material={mats.silver}>
          <torusGeometry args={[0.058, 0.012, 12, 40]} />
        </mesh>
        <mesh>
          <circleGeometry args={[0.046, 32]} />
          <meshBasicMaterial ref={core} color={CYAN} toneMapped={false} />
        </mesh>
      </group>

      {/* ───────────── FLOATING ARMS ───────────── */}
      {[
        { ref: armL, x: 0.255, z: 0.12 },
        { ref: armR, x: -0.255, z: -0.12 },
      ].map(({ ref, x, z }) => (
        <group key={x} ref={ref} position={[x, -0.085, 0]} rotation={[0, 0, z]}>
          <mesh material={mats.shell} position={[0, -0.085, 0]}>
            <capsuleGeometry args={[0.042, 0.1, 6, 16]} />
          </mesh>
          <mesh material={mats.silver} position={[0, -0.19, 0]}>
            <sphereGeometry args={[0.048, 20, 16]} />
          </mesh>
          <mesh material={mats.glow} position={[0, -0.155, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.044, 0.006, 6, 24]} />
          </mesh>
        </group>
      ))}

      {/* ───────────── THRUSTERS ───────────── */}
      <mesh material={mats.silver} position={[0, -0.375, 0]}>
        <cylinderGeometry args={[0.07, 0.095, 0.06, 32]} />
      </mesh>
      <mesh material={mats.glow} position={[0, -0.406, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.083, 0.008, 8, 40]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} material={mats.silver} position={[s * 0.15, -0.3, -0.06]} rotation={[0.3, 0, s * -0.4]}>
          <cylinderGeometry args={[0.025, 0.035, 0.06, 16]} />
        </mesh>
      ))}

      <group ref={flame} position={[0, -0.41, 0]}>
        <mesh material={mats.flameOuter} position={[0, -0.13, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.075, 0.26, 24, 1, true]} />
        </mesh>
        <mesh material={mats.flameInner} position={[0, -0.08, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.04, 0.16, 16, 1, true]} />
        </mesh>
      </group>

      <sprite ref={glow} position={[0, -0.52, 0]} scale={[0.95, 0.95, 1]}>
        <spriteMaterial
          map={glowTex}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>
      <pointLight ref={light} position={[0, -0.55, 0.1]} color={BLUE} intensity={2} distance={2.2} decay={2} />
    </group>
  );
}
