"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";

const certifications = [
  {
    titleEn: "Moodle Administration & LMS Deployment",
    titleFr: "Administration Moodle & Déploiement LMS",
    orgEn: "Professional Practice",
    orgFr: "Pratique Professionnelle",
    year: "2026",
    icon: "🖥️",
    color: "#0055FF",
  },
  {
    titleEn: "SCORM & E-learning Standards",
    titleFr: "SCORM & Standards E-learning",
    orgEn: "Instructional Design",
    orgFr: "Ingénierie Pédagogique",
    year: "2025",
    icon: "📚",
    color: "#7B00FF",
  },
  {
    titleEn: "Articulate Storyline 360",
    titleFr: "Articulate Storyline 360",
    orgEn: "Content Authoring",
    orgFr: "Création de Contenu",
    year: "2025",
    icon: "🎯",
    color: "#00FFFF",
  },
  {
    titleEn: "LEGO Education & STEM",
    titleFr: "LEGO Education & STEM",
    orgEn: "Educational Robotics",
    orgFr: "Robotique Éducative",
    year: "2024",
    icon: "🤖",
    color: "#0055FF",
  },
  {
    titleEn: "Front-End Web Development",
    titleFr: "Développement Web Front-End",
    orgEn: "Full Stack Practice",
    orgFr: "Pratique Full Stack",
    year: "2024",
    icon: "💻",
    color: "#7B00FF",
  },
  {
    titleEn: "Digital Instructional Design",
    titleFr: "Conception Pédagogique Digitale",
    orgEn: "ESEFB Master\'s Program",
    orgFr: "Programme Master ESEFB",
    year: "2025",
    icon: "📐",
    color: "#00FFFF",
  },
];

export default function CertificationsSection() {
  const { lang, t } = useLang();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    return () => observer?.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((i) => (i + 1) % certifications?.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="certifications" className="section-padding relative z-10" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-medium text-accent tracking-widest uppercase block mb-3">
            — Achievements —
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground">
            {t("certifications_title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certifications?.map((cert, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-6 cursor-default"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms`,
                border: `1px solid ${activeIdx === i ? cert?.color + "40" : "rgba(0,255,255,0.08)"}`,
                boxShadow: activeIdx === i ? `0 0 25px ${cert?.color}15` : "none",
                transition2: "border-color 0.5s ease, box-shadow 0.5s ease",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${cert?.color}20`, border: `1px solid ${cert?.color}30` }}
                >
                  {cert?.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-foreground mb-1 leading-tight">
                    {lang === "en" ? cert?.titleEn : cert?.titleFr}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {lang === "en" ? cert?.orgEn : cert?.orgFr}
                  </p>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${cert?.color}15`, color: cert?.color }}
                  >
                    {cert?.year}
                  </span>
                </div>
              </div>
              <div
                className="mt-4 h-0.5 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${cert?.color}60, transparent)`,
                  width: activeIdx === i ? "100%" : "30%",
                  transition: "width 0.8s ease",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}