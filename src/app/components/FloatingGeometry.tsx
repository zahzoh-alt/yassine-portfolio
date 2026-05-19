"use client";
import { useEffect, useRef } from "react";

interface Shape {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  floatOffset: number;
  floatSpeed: number;
  type: "hex" | "diamond" | "circuit" | "ring";
  color: string;
  opacity: number;
}

export default function FloatingGeometry() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const shapes: Shape[] = [
      { x: 0.08, y: 0.15, size: 40, rotation: 0, rotSpeed: 0.003, floatOffset: 0, floatSpeed: 0.012, type: "hex", color: "#00FFFF", opacity: 0.15 },
      { x: 0.92, y: 0.2, size: 28, rotation: 0.5, rotSpeed: -0.004, floatOffset: 1, floatSpeed: 0.009, type: "diamond", color: "#0055FF", opacity: 0.2 },
      { x: 0.05, y: 0.6, size: 22, rotation: 0, rotSpeed: 0.006, floatOffset: 2, floatSpeed: 0.011, type: "ring", color: "#7B00FF", opacity: 0.18 },
      { x: 0.95, y: 0.7, size: 35, rotation: 0.2, rotSpeed: -0.003, floatOffset: 0.5, floatSpeed: 0.008, type: "hex", color: "#00FFFF", opacity: 0.12 },
      { x: 0.12, y: 0.85, size: 18, rotation: 0, rotSpeed: 0.007, floatOffset: 1.5, floatSpeed: 0.014, type: "diamond", color: "#0055FF", opacity: 0.15 },
      { x: 0.88, y: 0.45, size: 24, rotation: 1, rotSpeed: 0.005, floatOffset: 3, floatSpeed: 0.01, type: "circuit", color: "#00FFFF", opacity: 0.1 },
    ];

    const drawHex = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = x + size * Math.cos(angle);
        const py = y + size * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const drawDiamond = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size * 0.6, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size * 0.6, y);
      ctx.closePath();
    };

    const drawRing = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.arc(x, y, size * 0.7, 0, Math.PI * 2, true);
      ctx.closePath();
    };

    const drawCircuit = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.rect(x - size / 2, y - size / 2, size, size);
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(x - size / 2, y);
      ctx.lineTo(x - size, y);
      ctx.moveTo(x + size / 2, y);
      ctx.lineTo(x + size, y);
      ctx.moveTo(x, y - size / 2);
      ctx.lineTo(x, y - size);
    };

    const animate = () => {
      tRef.current += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      shapes.forEach((s) => {
        s.rotation += s.rotSpeed;
        const floatY = Math.sin(tRef.current * s.floatSpeed * 60 + s.floatOffset) * 12;
        const px = s.x * canvas.width;
        const py = s.y * canvas.height + floatY;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(s.rotation);
        ctx.globalAlpha = s.opacity;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;

        if (s.type === "hex") drawHex(ctx, 0, 0, s.size);
        else if (s.type === "diamond") drawDiamond(ctx, 0, 0, s.size);
        else if (s.type === "ring") drawRing(ctx, 0, 0, s.size);
        else if (s.type === "circuit") drawCircuit(ctx, 0, 0, s.size);

        ctx.stroke();
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}