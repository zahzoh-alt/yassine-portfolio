"use client";
import { useEffect } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import CustomCursor from "./components/CustomCursor";
import SceneLayer from "./components/SceneLayer";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import QuizSection from "./components/QuizSection";
import AboutSection from "./components/AboutSection";
import SkillsSection from "./components/SkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import ServicesSection from "./components/ServicesSection";
import ExperienceSection from "./components/ExperienceSection";
import CertificationsSection from "./components/CertificationsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

function Divider({ color }: { color: string }) {
  return (
    <div
      className="section-divider w-full h-px"
      style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      aria-hidden="true"
    />
  );
}

/** Reveal elements marked with [data-reveal] when they enter the viewport. */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function HomePage() {
  useReveal();
  return (
    <LanguageProvider>
      {/* 3D universe + flying robot (WebGL, falls back to 2D canvas) */}
      <SceneLayer />
      <div className="noise-overlay" aria-hidden="true" />

      <CustomCursor />

      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-cyan-400 focus:text-black"
      >
        Skip to content
      </a>

      <div className="relative z-10 min-h-screen">
        <Navbar />

        <main>
          <HeroSection />
          <QuizSection />
          <Divider color="rgba(0,255,255,0.15)" />
          <AboutSection />
          <Divider color="rgba(0,85,255,0.12)" />
          <SkillsSection />
          <Divider color="rgba(123,0,255,0.12)" />
          <ProjectsSection />
          <Divider color="rgba(0,255,255,0.1)" />
          <ServicesSection />
          <Divider color="rgba(0,85,255,0.1)" />
          <ExperienceSection />
          <Divider color="rgba(123,0,255,0.1)" />
          <CertificationsSection />
          <Divider color="rgba(0,255,255,0.1)" />
          <ContactSection />
        </main>

        <Footer />
      </div>
    </LanguageProvider>
  );
}
