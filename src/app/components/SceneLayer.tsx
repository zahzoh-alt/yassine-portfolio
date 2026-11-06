"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import ParticleField from "./ParticleField";
import FloatingGeometry from "./FloatingGeometry";
import { detectTier, hasWebGL, prefersReducedMotion, type Tier } from "./three/tier";
import { robotState, subscribeRobot } from "@/lib/robotBus";

// three.js is only downloaded in the browser, after the page content is visible.
const Experience = dynamic(() => import("./three/Experience"), { ssr: false, loading: () => null });

class GLBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Fixed full-screen WebGL layer (universe + robot) rendered *behind* the page
 * content. Falls back to the original 2D canvas background when WebGL is not
 * available or crashes.
 */
export default function SceneLayer() {
  const [mode, setMode] = useState<"pending" | "webgl" | "fallback">("pending");
  const [cfg, setCfg] = useState<{ tier: Tier; reduced: boolean }>({ tier: "mid", reduced: false });
  const [front, setFront] = useState(false);

  useEffect(() => {
    const ok = hasWebGL();
    setCfg({ tier: detectTier(), reduced: prefersReducedMotion() });
    setMode(ok ? "webgl" : "fallback");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("no-webgl", mode === "fallback");
  }, [mode]);

  useEffect(() => subscribeRobot(() => setFront(robotState.front)), []);

  if (mode === "fallback") {
    return (
      <>
        <ParticleField />
        <FloatingGeometry />
      </>
    );
  }
  if (mode === "pending") return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none scene-layer"
      style={{ zIndex: front ? 130 : 0 }}
      aria-hidden="true"
    >
      <GLBoundary onError={() => setMode("fallback")}>
        <Experience tier={cfg.tier} reduced={cfg.reduced} onFail={() => setMode("fallback")} />
      </GLBoundary>
    </div>
  );
}
