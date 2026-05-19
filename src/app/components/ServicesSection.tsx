"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";

const services = [
  {
    icon: "🎓",
    color: "#0055FF",
    titleEn: "Digital Learning & E-learning",
    titleFr: "Digital Learning & E-learning",
    descEn: "Designing engaging online learning experiences, SCORM modules, H5P interactive content, and full e-learning production pipelines.",
    descFr: "Conception d'expériences d'apprentissage en ligne engageantes, modules SCORM, contenu interactif H5P et production e-learning complète.",
  },
  {
    icon: "🖥️",
    color: "#7B00FF",
    titleEn: "Moodle LMS",
    titleFr: "Moodle LMS",
    descEn: "Full LMS deployment, server administration, security hardening, visual theming, course structuring, and learner management.",
    descFr: "Déploiement LMS complet, administration serveur, sécurisation, thématisation visuelle, structuration de cours et gestion des apprenants.",
  },
  {
    icon: "💻",
    color: "#00FFFF",
    titleEn: "Front-End Development",
    titleFr: "Développement Front-End",
    descEn: "HTML5, CSS3, JavaScript, Bootstrap — building responsive, accessible, and visually rich web interfaces from scratch.",
    descFr: "HTML5, CSS3, JavaScript, Bootstrap — création d'interfaces web responsives, accessibles et visuellement riches.",
  },
  {
    icon: "🎨",
    color: "#0055FF",
    titleEn: "UI/UX Design",
    titleFr: "Design UI/UX",
    descEn: "User experience design for learning platforms and web applications. UX Learning optimization, learner journey mapping.",
    descFr: "Design UX pour plateformes d'apprentissage et applications web. Optimisation UX Learning, cartographie du parcours apprenant.",
  },
  {
    icon: "📐",
    color: "#7B00FF",
    titleEn: "Instructional Design",
    titleFr: "Ingénierie Pédagogique",
    descEn: "Curriculum scripting, learning pathway design, competency-based frameworks, and full pedagogical engineering cycles.",
    descFr: "Scénarisation pédagogique, design de parcours d'apprentissage, référentiels de compétences et ingénierie pédagogique complète.",
  },
  {
    icon: "🤖",
    color: "#00FFFF",
    titleEn: "Educational Technologies",
    titleFr: "Technologies Éducatives",
    descEn: "STEM education, Arduino, LEGO Spike robotics, interactive learning tools, Tinkercad simulations, and 21st-century skills training.",
    descFr: "Éducation STEM, Arduino, robotique LEGO Spike, outils d'apprentissage interactifs, simulations Tinkercad et compétences 21e siècle.",
  },
  {
    icon: "🎬",
    color: "#0055FF",
    titleEn: "Multimedia Production",
    titleFr: "Production Multimédia",
    descEn: "Video production with Adobe Premiere Pro & Camtasia, AI voice synthesis with ElevenLabs, interactive slides with Genially & Canva.",
    descFr: "Production vidéo avec Adobe Premiere Pro & Camtasia, synthèse vocale IA avec ElevenLabs, diapositives interactives avec Genially & Canva.",
  },
];

export default function ServicesSection() {
  const { lang, t } = useLang();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className="section-padding relative z-10" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-medium text-accent tracking-widest uppercase block mb-3">
            — What I Do —
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground">
            {t("services_title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <ServiceCard
              key={i}
              service={s}
              lang={lang}
              visible={visible}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  lang,
  visible,
  index,
}: {
  service: typeof services[0];
  lang: string;
  visible: boolean;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="glass-card rounded-2xl p-6 cursor-default group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${index * 80}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${index * 80}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
        border: `1px solid ${hovered ? service.color + "40" : "rgba(0,255,255,0.08)"}`,
        boxShadow: hovered ? `0 0 30px ${service.color}15` : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${service.color}20`, border: `1px solid ${service.color}30` }}
      >
        {service.icon}
      </div>
      <h3 className="font-bold text-base text-foreground mb-3">
        {lang === "en" ? service.titleEn : service.titleFr}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {lang === "en" ? service.descEn : service.descFr}
      </p>
      <div
        className="mt-5 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
        style={{ background: `linear-gradient(90deg, ${service.color}, transparent)` }}
      />
    </div>
  );
}