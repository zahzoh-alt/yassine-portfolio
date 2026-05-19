"use client";
import { LanguageProvider } from "@/context/LanguageContext";
import CustomCursor from "./components/CustomCursor";
import ParticleField from "./components/ParticleField";
import FloatingGeometry from "./components/FloatingGeometry";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import SkillsSection from "./components/SkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import ServicesSection from "./components/ServicesSection";
import ExperienceSection from "./components/ExperienceSection";
import CertificationsSection from "./components/CertificationsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <LanguageProvider>
      {/* Background layers */}
      <div className="noise-overlay" aria-hidden="true" />
      <ParticleField />
      <FloatingGeometry />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Main layout */}
      <div className="relative z-10 min-h-screen">
        <Navbar />

        <main>
          <HeroSection />

          {/* Divider */}
          <div
            className="w-full h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(0,255,255,0.15), transparent)" }}
            aria-hidden="true"
          />

          <AboutSection />

          <div
            className="w-full h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(0,85,255,0.12), transparent)" }}
            aria-hidden="true"
          />

          <SkillsSection />

          <div
            className="w-full h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(123,0,255,0.12), transparent)" }}
            aria-hidden="true"
          />

          <ProjectsSection />

          <div
            className="w-full h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(0,255,255,0.1), transparent)" }}
            aria-hidden="true"
          />

          <ServicesSection />

          <div
            className="w-full h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(0,85,255,0.1), transparent)" }}
            aria-hidden="true"
          />

          <ExperienceSection />

          <div
            className="w-full h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(123,0,255,0.1), transparent)" }}
            aria-hidden="true"
          />

          <CertificationsSection />

          <div
            className="w-full h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(0,255,255,0.1), transparent)" }}
            aria-hidden="true"
          />

          <ContactSection />
        </main>

        <Footer />
      </div>
    </LanguageProvider>
  );
}