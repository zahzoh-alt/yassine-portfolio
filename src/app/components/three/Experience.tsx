"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import Universe from "./Universe";
import RobotRig, { CAM_Z } from "./RobotRig";
import type { Tier } from "./tier";

export default function Experience({
  tier,
  reduced,
  onFail,
}: {
  tier: Tier;
  reduced: boolean;
  onFail: () => void;
}) {
  const [dpr, setDpr] = useState<number>(tier === "high" ? 1.75 : tier === "mid" ? 1.4 : 1);
  const mouse = useRef({ x: 0, y: 0, nx: 0, ny: 0, has: false });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const m = mouse.current;
      m.x = e.clientX;
      m.y = e.clientY;
      m.nx = (e.clientX / window.innerWidth) * 2 - 1;
      m.ny = (e.clientY / window.innerHeight) * 2 - 1;
      m.has = true;
    };
    const onLeave = () => {
      mouse.current.has = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <Canvas
      dpr={[1, dpr]}
      camera={{ position: [0, 0, CAM_Z], fov: 35, near: 0.1, far: 200 }}
      gl={{ alpha: true, antialias: tier !== "low", powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      events={undefined}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onFail();
        });
      }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr((d) => Math.min(d, tier === "high" ? 1.75 : 1.4))} />

      {/* Cinematic lighting */}
      <ambientLight intensity={0.35} color="#9fb6ff" />
      <directionalLight position={[-3, 5, 6]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[4, 2, -5]} intensity={3.2} color="#38f3ff" />
      <directionalLight position={[-5, -2, -3]} intensity={1.8} color="#a36bff" />

      {/* Studio reflections, generated locally (no HDR download) */}
      <Environment resolution={tier === "low" ? 64 : 128} frames={1}>
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 5, -4]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={4} color="#38f3ff" position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={3} color="#7b2bff" position={[6, 1, -2]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="ring" intensity={2} color="#2f6bff" position={[0, -4, 4]} scale={4} />
      </Environment>

      <Universe tier={tier} reduced={reduced} mouse={mouse} />
      <RobotRig tier={tier} reduced={reduced} mouse={mouse} />
    </Canvas>
  );
}
