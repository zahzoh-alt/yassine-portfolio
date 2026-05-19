"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";

type Tab = "experience" | "education";

const experiences = [
  {
    period: "March 2026 – Present",
    periodFr: "Mars 2026 – Présent",
    role: "Digital Learning Engineer & Instructional Designer",
    roleFr: "Ingénieur Digital Learning & Concepteur Pédagogique",
    org: "HEP",
    type: "PFE Internship (Current)",
    typeFr: "Stage PFE (En cours)",
    color: "#00FFFF",
    current: true,
    descEn:
      "Moodle LMS deployment, hosting & customization. Full digitalization of 100% online Client-Side Web Development training. AI pedagogical chatbot integration, SCORM modules, multimedia content production.",
    descFr:
      "Déploiement Moodle LMS, hébergement & personnalisation. Digitalisation complète de la formation Développement Web 100% en ligne. Intégration chatbot pédagogique IA, modules SCORM, production multimédia.",
    tags: ["Moodle", "SCORM", "AI Chatbot", "Articulate Storyline", "Canva"],
  },

  {
    period: "2024 – Present",
    periodFr: "2024 – Présent",
    role: "Educational Robotics & STEM Trainer",
    roleFr: "Formateur Robotique Éducative & STEM",
    org: "ROFEO",
    type: "Part-time",
    typeFr: "Temps partiel",
    color: "#0055FF",
    current: true,
    descEn:
      "Hands-on robotics training with LEGO Spike and Arduino. STEM modules, project-based learning, 21st-century skills development.",
    descFr:
      "Formation pratique en robotique avec LEGO Spike et Arduino. Modules STEM, apprentissage par projets, développement des compétences du 21e siècle.",
    tags: ["LEGO Spike", "Arduino", "STEM", "PBL"],
  },

  {
    period: "2026 – Present",
    periodFr: "2026 – Présent",
    role: "Adjunct Instructor — Computing & Digital Technologies",
    roleFr: "Chargé de Cours — Informatique & Technologies Numériques",
    org: "HEP",
    type: "Teaching",
    typeFr: "Enseignement",
    color: "#7B00FF",
    current: true,
    descEn:
      "Teaching Algorithms, Java, C, HTML5/CSS3, JavaScript, Bootstrap, Databases. Designing digital learning materials and interactive assessments.",
    descFr:
      "Enseignement Algorithmique, Java, C, HTML5/CSS3, JavaScript, Bootstrap, Bases de données. Conception de supports numériques et évaluations interactives.",
    tags: ["Java", "C", "JavaScript", "HTML5", "CSS3"],
  },

  {
    period: "Jul – Sep 2025",
    periodFr: "Juil – Sep 2025",
    role: "Instructional Designer — Robotics Modules",
    roleFr: "Concepteur Pédagogique — Modules Robotique",
    org: "ROFEO",
    type: "Internship",
    typeFr: "Stage",
    color: "#0055FF",
    current: false,
    descEn:
      "Designed comprehensive robotics educational modules for middle school students. Competency-based learning, instructional engineering.",
    descFr:
      "Conception de modules éducatifs robotique pour collégiens. Approche par compétences, ingénierie pédagogique.",
    tags: ["Instructional Design", "LEGO Spike", "Curriculum"],
  },

  /* ===========================
     NEW EXPERIENCE ADDED
  =========================== */
  {
    period: "Apr – Jun 2024",
    periodFr: "Avr – Juin 2024",
    role: "Web Developer — Final Year Internship",
    roleFr: "Développeur Web — Stage de Fin d'Études",
    org: "FST Settat",
    type: "Internship",
    typeFr: "Stage",
    color: "#00BFFF",
    current: false,
    descEn:
      "Design and development of a modern E-Commerce platform for product showcasing and online sales. Implementation of responsive interfaces, dynamic product management, and optimized user experience.",
    descFr:
      "Conception et réalisation d'une plateforme E-Commerce moderne pour l’exposition et la vente de produits. Mise en place d’interfaces responsives, gestion dynamique des produits et optimisation de l’expérience utilisateur.",
    tags: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "PHP",
      "MySQL",
      "Bootstrap",
      "E-Commerce",
    ],
  },
];

const education = [
  {
    period: "2024 – 2026",
    degree: "Master's — Training Engineering & Digital Learning",
    degreeFr: "Master — Ingénierie de la Formation & Digital Learning",
    school:
      "ESEFB — École Supérieure d'Éducation et de Formation, Berrechid, Morocco",
    color: "#00FFFF",
  },
  {
    period: "2023 – 2024",
    degree: "Bachelor's — Science & Technology, Computer Engineering",
    degreeFr: "Licence — Sciences & Techniques, Génie Informatique",
    school:
      "FST — Faculty of Sciences and Technology, Settat, Morocco",
    color: "#0055FF",
  },
  {
    period: "2021 – 2023",
    degree:
      "DEUST — Mathematics, Computer Science & Physics (MIP)",
    degreeFr:
      "DEUST — Mathématiques, Informatique & Physique (MIP)",
    school:
      "FST — Faculty of Sciences and Technology, Settat, Morocco",
    color: "#7B00FF",
  },
  {
    period: "2020 – 2021",
    degree:
      "High School Diploma — Experimental Sciences, Physics",
    degreeFr:
      "Baccalauréat — Sciences Expérimentales, Physique",
    school: "Lycée Oulad Hriz, Berrechid, Morocco",
    color: "#0055FF",
  },
];

export default function ExperienceSection() {
  const { lang, t } = useLang();
  const [tab, setTab] = useState<Tab>("experience");
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

  return (
    <section
      id="experience"
      className="section-padding relative z-10"
      ref={sectionRef}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-medium text-accent tracking-widest uppercase block mb-3">
            — Journey —
          </span>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-8">
            {t("experience_title")}
          </h2>

          {/* Tab switcher */}
          <div className="inline-flex glass-card neon-border rounded-xl p-1 gap-1">
            {(["experience", "education"] as Tab[]).map(
              (tabKey) => (
                <button
                  key={tabKey}
                  onClick={() => setTab(tabKey)}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    tab === tabKey
                      ? "text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={
                    tab === tabKey
                      ? {
                          background:
                            "linear-gradient(135deg, #0055FF, #7B00FF)",
                        }
                      : {}
                  }
                  data-cursor
                >
                  {t(
                    tabKey === "experience"
                      ? "experience_label"
                      : "education_label"
                  )}
                </button>
              )
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-6 sm:left-8 top-0 bottom-0 w-px"
            style={{
              background:
                "linear-gradient(to bottom, #0055FF, #7B00FF, #00FFFF, transparent)",
            }}
          />

          <div className="space-y-8 pl-16 sm:pl-20">
            {tab === "experience"
              ? experiences.map((exp, i) => (
                  <ExperienceItem
                    key={i}
                    item={exp}
                    lang={lang}
                    t={t}
                    visible={visible}
                    index={i}
                  />
                ))
              : education.map((edu, i) => (
                  <EducationItem
                    key={i}
                    item={edu}
                    lang={lang}
                    visible={visible}
                    index={i}
                  />
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceItem({
  item,
  lang,
  t,
  visible,
  index,
}: {
  item: typeof experiences[0];
  lang: string;
  t: (k: string) => string;
  visible: boolean;
  index: number;
}) {
  return (
    <div
      className="relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(0)"
          : "translateX(-30px)",
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${
          index * 150
        }ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${
          index * 150
        }ms`,
      }}
    >
      {/* Timeline dot */}
      <div
        className="absolute -left-14 sm:-left-16 top-4 w-4 h-4 rounded-full border-2 border-background"
        style={{
          background: item.color,
          boxShadow: `0 0 10px ${item.color}80`,
        }}
      />

      <div className="glass-card neon-border rounded-2xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-bold text-base text-foreground">
              {lang === "en" ? item.role : item.roleFr}
            </h3>

            <p
              className="text-sm font-semibold"
              style={{ color: item.color }}
            >
              {item.org}
            </p>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-xs text-muted-foreground">
              {lang === "en"
                ? item.period
                : item.periodFr}
            </div>

            {item.current && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: `${item.color}20`,
                  color: item.color,
                }}
              >
                {t("current_badge")}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {lang === "en"
            ? item.descEn
            : item.descFr}
        </p>

        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded font-medium"
              style={{
                background: `${item.color}10`,
                border: `1px solid ${item.color}20`,
                color: item.color,
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

function EducationItem({
  item,
  lang,
  visible,
  index,
}: {
  item: typeof education[0];
  lang: string;
  visible: boolean;
  index: number;
}) {
  return (
    <div
      className="relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(0)"
          : "translateX(-30px)",
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${
          index * 150
        }ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${
          index * 150
        }ms`,
      }}
    >
      <div
        className="absolute -left-14 sm:-left-16 top-4 w-4 h-4 rounded-full border-2 border-background"
        style={{
          background: item.color,
          boxShadow: `0 0 10px ${item.color}80`,
        }}
      />

      <div className="glass-card neon-border rounded-2xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-foreground mb-1">
              {lang === "en"
                ? item.degree
                : item.degreeFr}
            </h3>

            <p className="text-sm text-muted-foreground">
              {item.school}
            </p>
          </div>

          <span
            className="text-xs font-bold px-3 py-1 rounded-full flex-shrink-0"
            style={{
              background: `${item.color}15`,
              color: item.color,
              border: `1px solid ${item.color}30`,
            }}
          >
            {item.period}
          </span>
        </div>
      </div>
    </div>
  );
}