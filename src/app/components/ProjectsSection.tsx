"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import SectionHeader from "./SectionHeader";
import { robotLook, robotRelease, robotUndock, robotVisit } from "@/lib/robotBus";

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
type Project = (typeof projects)[number];

const CATEGORY_LABEL: Record<string, { en: string; fr: string }> = {
  dl: { en: "Digital Learning", fr: "Digital Learning" },
  web: { en: "Web Dev", fr: "Dév. Web" },
  stem: { en: "STEM", fr: "STEM" },
};

export default function ProjectsSection() {
  const { lang, t } = useLang();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [openId, setOpenId] = useState<string | null>(null);
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

  const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: t("projects_filter_all") },
    { key: "dl", label: t("projects_filter_dl") },
    { key: "web", label: t("projects_filter_web") },
    { key: "stem", label: t("projects_filter_stem") },
  ];

  const opened = projects.find((p) => p.id === openId) ?? null;

  return (
    <section id="projects" className="section-padding relative z-10" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader kicker="Portfolio" title={t("projects_title")} slot="projects" side="right" className="mb-12">
          <div className="flex flex-wrap justify-center gap-3 mt-8" role="group" aria-label="Filter projects">
            {filters.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                aria-pressed={filter === key}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  filter === key ? "text-accent-foreground glow-cyan" : "glass-card neon-border text-muted-foreground hover:text-accent"
                }`}
                style={filter === key ? { background: "linear-gradient(135deg, #0055FF, #00FFFF)" } : {}}
                data-cursor
              >
                {label}
              </button>
            ))}
          </div>
        </SectionHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              lang={lang}
              visible={visible}
              index={i}
              onOpen={(el) => {
                setOpenId(project.id);
                // Robot flies to the selected card, then docks inside the modal.
                requestAnimationFrame(() => robotVisit(el, document.getElementById("project-modal-robot"), 700));
              }}
            />
          ))}
        </div>
      </div>

      {opened && <ProjectModal project={opened} lang={lang} onClose={() => setOpenId(null)} />}
    </section>
  );
}

function ProjectCard({
  project,
  lang,
  visible,
  index,
  onOpen,
}: {
  project: Project;
  lang: string;
  visible: boolean;
  index: number;
  onOpen: (el: HTMLElement) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const title = lang === "en" ? project.titleEn : project.titleFr;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - py) * 10}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 12}deg`);
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  };
  const reset = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      className="project-card-wrap"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(50px)",
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms`,
      }}
    >
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-label={`${title} — ${lang === "en" ? "open details" : "voir le détail"}`}
        className="project-card group relative rounded-2xl overflow-hidden cursor-pointer h-full outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        style={{
          border: `1px solid ${hovered ? project.color + "60" : "rgba(255,255,255,0.08)"}`,
          boxShadow: hovered ? `0 30px 60px -20px ${project.color}55, 0 0 40px ${project.color}25` : "0 10px 30px -15px rgba(0,0,0,0.6)",
        }}
        onMouseMove={onMove}
        onMouseEnter={(e) => {
          setHovered(true);
          robotLook(e.currentTarget, 0.3);
        }}
        onMouseLeave={(e) => {
          setHovered(false);
          reset();
          robotRelease(e.currentTarget);
        }}
        onFocus={(e) => robotLook(e.currentTarget, 0.3)}
        onBlur={(e) => robotRelease(e.currentTarget)}
        onClick={(e) => onOpen(e.currentTarget)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(e.currentTarget);
          }
        }}
        data-cursor
      >
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={project.image}
            alt={project.imageAlt}
            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(8,10,24,0.95) 0%, rgba(8,10,24,0.35) 55%, rgba(8,10,24,0.1) 100%)" }}
          />
          <div className="absolute top-4 left-4">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md"
              style={{ background: `${project.color}30`, border: `1px solid ${project.color}60`, color: "#fff" }}
            >
              {project.emoji} {CATEGORY_LABEL[project.category]?.[lang === "en" ? "en" : "fr"] ?? project.category}
            </span>
          </div>
          <span
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center border border-white/20 bg-black/40 backdrop-blur-md text-white opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
            aria-hidden="true"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H8M17 7v9" />
            </svg>
          </span>
        </div>

        {/* Content */}
        <div className="relative p-6" style={{ background: "rgba(12,14,32,0.92)" }}>
          <h3 className="font-bold text-lg text-foreground leading-tight mb-2">{title}</h3>
          <p className="text-xs font-mono mb-3" style={{ color: project.color }}>
            {lang === "en" ? project.periodEn : project.periodFr}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
            {lang === "en" ? project.descEn : project.descFr}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded font-medium"
                style={{ background: `${project.color}12`, border: `1px solid ${project.color}25`, color: project.color }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Glare */}
        <div className="project-glare absolute inset-0 pointer-events-none" aria-hidden="true" />
      </div>
    </div>
  );
}

function ProjectModal({ project, lang, onClose }: { project: Project; lang: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const en = lang === "en";

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      robotUndock();
      prevFocus?.focus({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 project-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div
        className="project-modal relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border bg-[#070a1c]/95"
        style={{ borderColor: `${project.color}55`, boxShadow: `0 0 80px ${project.color}35` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-56 sm:h-80 overflow-hidden">
          <img src={project.image} alt={project.imageAlt} className="w-full h-full object-cover project-modal-img" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #070a1c 0%, rgba(7,10,28,0.3) 60%, rgba(7,10,28,0.1) 100%)" }} />
          <div className="absolute inset-x-0 h-20 holo-scan" aria-hidden="true" />
          {/* Reserved corner where the robot lands while the project is open */}
          <div id="project-modal-robot" className="absolute right-3 bottom-2 w-28 h-28 sm:w-40 sm:h-40" aria-hidden="true" />
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-black/60 border border-white/20 text-white text-2xl flex items-center justify-center hover:bg-cyan-500/80 hover:border-cyan-400 transition-all"
          aria-label={en ? "Close project" : "Fermer le projet"}
        >
          ×
        </button>

        <div className="relative px-6 sm:px-10 pb-10 -mt-10">
          <span
            className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
            style={{ background: `${project.color}30`, border: `1px solid ${project.color}60`, color: "#fff" }}
          >
            {project.emoji} {CATEGORY_LABEL[project.category]?.[en ? "en" : "fr"] ?? project.category}
          </span>
          <h3 id="project-modal-title" className="text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-2 pr-24 sm:pr-40">
            {en ? project.titleEn : project.titleFr}
          </h3>
          <p className="font-mono text-sm mb-6" style={{ color: project.color }}>
            {en ? project.periodEn : project.periodFr}
          </p>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8">{en ? project.descEn : project.descFr}</p>

          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
            {en ? "Technologies & methods" : "Technologies & méthodes"}
          </h4>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag, i) => (
              <span
                key={tag}
                className="modal-tag text-sm px-3 py-1.5 rounded-lg font-medium"
                style={{
                  background: `${project.color}15`,
                  border: `1px solid ${project.color}35`,
                  color: project.color,
                  animationDelay: `${0.15 + i * 0.05}s`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <a
            href="#contact"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-transform hover:scale-105"
            style={{ background: "linear-gradient(135deg, #0055FF, #7B00FF)" }}
          >
            {en ? "Discuss a similar project" : "Discuter d’un projet similaire"} →
          </a>
        </div>
      </div>
    </div>
  );
}
