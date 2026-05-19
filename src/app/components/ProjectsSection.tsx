"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";

const projects = [
{
  id: "moodle",
  category: "dl",
  emoji: "🎓",
  color: "#0055FF",
  titleEn: "Moodle LMS Platform — HEP",
  titleFr: "Plateforme Moodle LMS — HEP",
  periodEn: "2026 · PFE (Current)",
  periodFr: "2026 · PFE (En cours)",
  descEn: "Full Moodle LMS deployment with 100% online Web Development training, intelligent pedagogical chatbot, SCORM modules, and synchronous/asynchronous delivery modes.",
  descFr: "Déploiement complet Moodle LMS avec formation 100% en ligne Développement Web, chatbot pédagogique intelligent, modules SCORM et modes synchrone/asynchrone.",
  tags: ["Moodle", "SCORM", "Articulate Storyline", "H5P", "AI Chatbot", "LMS"],
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_12b6878be-1772224365676.png",
  imageAlt: "Dark computer screen showing LMS dashboard interface with course modules and analytics in low-lit room"
},
{
  id: "recruitment",
  category: "web",
  emoji: "💻",
  color: "#7B00FF",
  titleEn: "Online Recruitment Platform",
  titleFr: "Plateforme de Recrutement En Ligne",
  periodEn: "Feb–Apr 2024 · FST Settat",
  periodFr: "Fév–Avr 2024 · FST Settat",
  descEn: "Full-stack web platform connecting employers and candidates, streamlining the recruitment process with modern UI/UX and efficient matching algorithms.",
  descFr: "Plateforme web full-stack reliant employeurs et candidats, optimisant le processus de recrutement avec une UI/UX moderne.",
  tags: ["HTML5", "CSS3", "JavaScript", "PHP", "MySQL", "Bootstrap"],
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_17f77c3a9-1772898291354.png",
  imageAlt: "Bright modern office workspace with multiple screens showing recruitment interface, clean white environment"
},
{
  id: "research",
  category: "web",
  emoji: "📊",
  color: "#00FFFF",
  titleEn: "Research Study — Vocational Training",
  titleFr: "Étude de Recherche — Formation Professionnelle",
  periodEn: "Feb–Jun 2025 · ESEFB",
  periodFr: "Fév–Juin 2025 · ESEFB",
  descEn: "Analysis of professional continuing education frameworks and funding mechanisms for special vocational training contracts in Morocco.",
  descFr: "Analyse des cadres de formation professionnelle continue et des mécanismes de financement pour les contrats de formation spéciaux au Maroc.",
  tags: ["Instructional Design", "Research", "Curriculum", "EdTech", "Morocco"],
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_187f85c94-1772782290418.png",
  imageAlt: "Bright open library with books and research documents on white desk, well-lit academic environment"
},
{
  id: "stem",
  category: "stem",
  emoji: "🤖",
  color: "#0055FF",
  titleEn: "STEM Robotics Educational Modules",
  titleFr: "Modules Éducatifs STEM Robotique",
  periodEn: "Jul–Sep 2025 · ROFEO",
  periodFr: "Juil–Sep 2025 · ROFEO",
  descEn: "Comprehensive robotics educational modules for middle school students using LEGO Spike and Arduino, based on competency-driven and project-based learning.",
  descFr: "Modules éducatifs robotique complets pour collégiens avec LEGO Spike et Arduino, approche par compétences et apprentissage par projets.",
  tags: ["LEGO Spike", "Arduino", "STEM", "PBL", "Robotics", "Tinkercad"],
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ebeaf21e-1772732146515.png",
  imageAlt: "Bright classroom with colorful LEGO robotics kits on white tables, students working in well-lit STEM lab"
},

/* ===========================
   NEW PROJECT ADDED
=========================== */
{
  id: "ecommerce",
  category: "web",
  emoji: "🛒",
  color: "#00BFFF",
  titleEn: "E-Commerce Platform Development",
  titleFr: "Développement d'une Plateforme E-Commerce",
  periodEn: "Apr–Jun 2024 · FST Settat",
  periodFr: "Avr–Juin 2024 · FST Settat",
  descEn: "Design and development of a modern E-Commerce web platform for product showcasing and online sales, including responsive UI, product management, and dynamic shopping experience.",
  descFr: "Conception et réalisation d'une plateforme web E-Commerce moderne pour l’exposition et la vente de produits avec interface responsive et expérience utilisateur dynamique.",
  tags: ["HTML5", "CSS3", "JavaScript", "PHP", "MySQL", "Bootstrap", "E-Commerce"],
  image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
  imageAlt: "Modern e-commerce dashboard with online shopping interface and product management system"
}

];

type FilterKey = "all" | "dl" | "web" | "stem";

export default function ProjectsSection() {
  const { lang, t } = useLang();
  const [filter, setFilter] = useState<FilterKey>("all");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const filtered =
    filter === "all"
      ? projects
      : projects.filter((p) => p.category === filter);

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: t("projects_filter_all") },
    { key: "dl", label: t("projects_filter_dl") },
    { key: "web", label: t("projects_filter_web") },
    { key: "stem", label: t("projects_filter_stem") }
  ];

  return (
    <section
      id="projects"
      className="section-padding relative z-10"
      ref={sectionRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-medium text-accent tracking-widest uppercase block mb-3">
            — Portfolio —
          </span>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-8">
            {t("projects_title")}
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  filter === key
                    ? "text-accent-foreground glow-cyan"
                    : "glass-card neon-border text-muted-foreground hover:text-accent"
                }`}
                style={
                  filter === key
                    ? {
                        background:
                          "linear-gradient(135deg, #0055FF, #00FFFF)"
                      }
                    : {}
                }
                data-cursor
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* PROJECT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
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

function ProjectCard({
  project,
  lang,
  visible,
  index
}: {
  project: typeof projects[0];
  lang: string;
  visible: boolean;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative rounded-2xl overflow-hidden cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${
          index * 120
        }ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${
          index * 120
        }ms`,
        border: `1px solid ${
          hovered
            ? project.color + "40"
            : "rgba(255,255,255,0.06)"
        }`,
        boxShadow: hovered
          ? `0 0 30px ${project.color}20`
          : "none"
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={project.image}
          alt={project.imageAlt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Dark scrim */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.2) 100%)"
          }}
        />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{
              background: `${project.color}30`,
              border: `1px solid ${project.color}50`,
              color: project.color
            }}
          >
            {project.emoji} {project.category.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className="p-6"
        style={{ background: "rgba(17,17,32,0.9)" }}
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-lg text-foreground leading-tight">
            {lang === "en"
              ? project.titleEn
              : project.titleFr}
          </h3>
        </div>

        <p className="text-xs text-muted-foreground mb-1">
          {lang === "en"
            ? project.periodEn
            : project.periodFr}
        </p>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {lang === "en"
            ? project.descEn
            : project.descFr}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded font-medium"
              style={{
                background: `${project.color}10`,
                border: `1px solid ${project.color}20`,
                color: project.color
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}