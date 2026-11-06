"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import SectionHeader from "./SectionHeader";
import { robotHoverProps, robotLook, robotRelease } from "@/lib/robotBus";

const skillData = {
  webdev: {
    icon: "💻",
    color: "#0055FF",
    skills: [
      { name: "HTML5", pct: 100 },
      { name: "CSS3", pct: 100 },
      { name: "JavaScript", pct: 90 },
      { name: "Bootstrap", pct: 100 },
      { name: "PHP / MySQL", pct: 95 },
    ],
  },
digital: {
  icon: "🎓",
  color: "#7B00FF",
  skills: [
    { name: "Moodle LMS", pct: 100 },
    { name: "Canva", pct: 100 },
    { name: "H5P Interactive Content", pct: 95 },
    { name: "SCORM Packages", pct: 95 },
    { name: "Articulate Storyline", pct: 90 },

    { name: "Instructional Design", pct: 95 },
    { name: "Pedagogical Engineering", pct: 95 },
    { name: "Storyboard Design", pct: 90 },
    { name: "Learning Scenarios", pct: 90 },

    { name: "Kahoot", pct: 90 },
    { name: "Quizizz", pct: 90 },
    { name: "Wooclap", pct: 85 },
    { name: "Google Forms", pct: 92 },
     { name: "MIZOU", pct: 90 },

    { name: "Assessment Design", pct: 88 },
    { name: "Interactive Learning", pct: 92 },
    { name: "Microlearning", pct: 85 },
    { name: "Gamification", pct: 88 },

    { name: "Blended Learning", pct: 90 },
    { name: "Learning Experience Design", pct: 88 },
    { name: "Training Digitalization", pct: 92 },

    { name: "AI Pedagogical Chatbots", pct: 88 },
    { name: "Educational Innovation", pct: 90 },
  ],
},
  robotics: {
    icon: "🤖",
    color: "#00FFFF",
    skills: [
      { name: "LEGO Education", pct: 100 },
    ],
  },
  programming: {
    icon: "⚡",
    color: "#0055FF",
    skills: [
      { name: "Java", pct: 85 },
      { name: "C", pct: 90 },
      { name: "Python", pct: 85 },
    ],
  },
  office: {
    icon: "📊",
    color: "#7B00FF",
    skills: [
      { name: "Microsoft Word", pct: 100 },
      { name: "Excel", pct: 90 },
      { name: "PowerPoint", pct: 100 },
    ],
  },
};

type CategoryKey = keyof typeof skillData;

/**
 * Motifs décoratifs en arrière-plan de certaines cartes.
 * Purement en SVG/CSS (pas de photo) pour rester léger et cohérent
 * avec le thème néon du site.
 */
function CardDecoration({ category }: { category: CategoryKey }) {
  if (category === "robotics") {
    return (
      <>
        {/* Rangée de "studs" Lego en haut de la carte */}
        <div className="absolute top-0 left-0 right-0 flex justify-center gap-3 pt-3 opacity-20 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="w-3 h-3 rounded-full"
              style={{ background: "#00FFFF", boxShadow: "0 0 6px #00FFFF" }}
            />
          ))}
        </div>

        {/* Robot stylisé en filigrane, bas-droite */}
        <svg
          viewBox="0 0 120 120"
          className="absolute -bottom-4 -right-4 w-28 h-28 opacity-15 pointer-events-none"
        >
          <rect x="30" y="45" width="60" height="45" rx="10" fill="none" stroke="#00FFFF" strokeWidth="3" />
          <rect x="42" y="15" width="36" height="30" rx="8" fill="none" stroke="#00FFFF" strokeWidth="3" />
          <circle cx="54" cy="30" r="4" fill="#00FFFF" />
          <circle cx="66" cy="30" r="4" fill="#00FFFF" />
          <line x1="60" y1="15" x2="60" y2="4" stroke="#00FFFF" strokeWidth="3" />
          <circle cx="60" cy="4" r="4" fill="#00FFFF" />
          <line x1="30" y1="60" x2="14" y2="60" stroke="#00FFFF" strokeWidth="3" />
          <line x1="90" y1="60" x2="106" y2="60" stroke="#00FFFF" strokeWidth="3" />
          <rect x="42" y="60" width="14" height="14" rx="3" fill="#00FFFF" />
          <rect x="64" y="60" width="14" height="14" rx="3" fill="#00FFFF" />
          <line x1="42" y1="90" x2="38" y2="108" stroke="#00FFFF" strokeWidth="3" />
          <line x1="78" y1="90" x2="82" y2="108" stroke="#00FFFF" strokeWidth="3" />
        </svg>
      </>
    );
  }

  if (category === "webdev") {
    const badges = [
      { label: "5", name: "HTML5", color: "#E34F26", rotate: -8 },
      { label: "3", name: "CSS3", color: "#1572B6", rotate: 6 },
      { label: "JS", name: "JavaScript", color: "#F7DF1E", rotate: -4 },
    ];
    return (
      <div className="absolute -top-3 -right-3 flex gap-2 opacity-25 pointer-events-none">
        {badges.map((b) => (
          <div
            key={b.name}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-extrabold"
            style={{
              background: b.color,
              color: b.color === "#F7DF1E" ? "#111" : "#fff",
              transform: `rotate(${b.rotate}deg)`,
              boxShadow: `0 0 12px ${b.color}80`,
            }}
          >
            {b.label}
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function SkillCard({ category, data, visible, highlight = false }: {
  category: CategoryKey;
  data: typeof skillData[CategoryKey];
  visible: boolean;
  highlight?: boolean;
}) {
  const { t } = useLang();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const labelKey = `skills_${category}` as string;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setTilt({ x, y });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setTilt({ x: 0, y: 0 });
    robotRelease(e.currentTarget);
  };

  return (
    <div
      ref={cardRef}
      id={`skill-card-${category}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={(e) => robotLook(e.currentTarget, 0.25)}
      onMouseLeave={handleMouseLeave}
      className={`glass-card neon-border rounded-2xl p-6 cursor-default h-full relative overflow-hidden transition-[outline-color] duration-500 outline outline-2 outline-offset-4 ${
        highlight ? "outline-cyan-400/70" : "outline-transparent"
      }`}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: tilt.x === 0 && tilt.y === 0 ? "transform 0.5s cubic-bezier(0.16,1,0.3,1)" : "transform 0.1s linear",
        boxShadow: `0 0 30px ${data.color}15`,
      }}
    >
      <CardDecoration category={category} />

      <div className="relative z-10 flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: `${data.color}20`, border: `1px solid ${data.color}30` }}
        >
          {data.icon}
        </div>
        <h3 className="font-bold text-sm text-foreground uppercase tracking-wide">
          {t(labelKey)}
        </h3>
      </div>

      <div className="relative z-10 space-y-4">
        {data.skills.map((skill, i) => (
          <div key={skill.name}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-foreground">{skill.name}</span>
              <span className="font-bold" style={{ color: data.color }}>{skill.pct}%</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: visible ? `${skill.pct}%` : "0%",
                  background: `linear-gradient(90deg, ${data.color}, ${data.color === "#00FFFF" ? "#0055FF" : "#00FFFF"})`,
                  transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms`,
                  boxShadow: `0 0 6px ${data.color}60`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Carte photo centrale — remplace le fichier `/public/profile.jpg`
 * (ou change le chemin `src` ci-dessous) par ta propre photo.
 */
function ProfilePhotoCard() {
  return (
    <div
      className="glass-card neon-border rounded-2xl p-6 h-full flex flex-col items-center justify-center gap-4"
      style={{ boxShadow: "0 0 40px #0055FF25" }}
    >
      <div
        className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden"
        style={{
          border: "2px solid #00FFFF",
          boxShadow: "0 0 25px #00FFFF50, 0 0 50px #0055FF30",
        }}
      >
        <Image
          src="/assets/images/profile.jpeg"
          alt="Ezzahi Yassine"
          fill
          className="object-cover"
          sizes="160px"
        />
      </div>
      <div className="text-center">
        <p className="font-bold text-sm text-foreground uppercase tracking-wide">
          Ezzahi Yassine
        </p>
        <p className="text-xs text-accent mt-1">Digital Learning Engineer</p>
      </div>
    </div>
  );
}

/* =========================================================
   SKILL ORBIT — orbital system built only from skillData
========================================================= */

const CATEGORY_ORDER: CategoryKey[] = ["digital", "webdev", "programming", "robotics", "office"];
const ORBIT_PICK: Record<CategoryKey, number> = { digital: 6, webdev: 3, programming: 3, robotics: 1, office: 1 };

function SkillOrbit({ active, onSelect }: { active: CategoryKey | null; onSelect: (c: CategoryKey) => void }) {
  const { t } = useLang();
  const outer = CATEGORY_ORDER.flatMap((cat) =>
    skillData[cat].skills.slice(0, ORBIT_PICK[cat]).map((sk) => ({ name: sk.name, cat, color: skillData[cat].color }))
  );

  return (
    <div className="skill-orbit relative mx-auto aspect-square my-8 sm:my-12" data-reveal>
      {/* depth rings */}
      <div className="absolute inset-[4%] rounded-full border border-cyan-400/10" aria-hidden="true" />
      <div className="absolute inset-[21%] rounded-full border border-dashed border-blue-500/15" aria-hidden="true" />
      <div className="absolute inset-[36%] rounded-full orbit-core-glow" aria-hidden="true" />

      {/* Core */}
      <div className="absolute inset-[38%] rounded-full flex flex-col items-center justify-center text-center orbit-core">
        <span className="text-[9px] sm:text-xs font-mono tracking-[0.25em] text-cyan-300/80 uppercase">Core</span>
        <span className="text-xs sm:text-lg font-extrabold text-white leading-tight">
          Digital
          <br />
          Learning
        </span>
      </div>

      {/* Outer ring — individual skills */}
      <ul className="orbit-ring orbit-ring--outer absolute inset-0" aria-label="Skills">
        {outer.map((sk, i) => {
          const a = (i / outer.length) * 360;
          const dim = active && active !== sk.cat;
          return (
            <li
              key={sk.name}
              className="orbit-node absolute left-1/2 top-1/2"
              style={{ transform: `rotate(${a}deg) translateX(calc(var(--orbit) * 0.44)) rotate(${-a}deg)` }}
            >
              <span className="orbit-counter relative block w-0 h-0">
                <span
                  className={`absolute left-0 top-0 w-max -translate-x-1/2 -translate-y-1/2 whitespace-nowrap max-w-[84px] sm:max-w-none truncate rounded-full px-2 sm:px-2.5 py-1 text-[9px] sm:text-xs font-medium border backdrop-blur-md transition-all duration-500 ${
                    dim ? "opacity-30" : "opacity-100"
                  }`}
                  style={{
                    borderColor: `${sk.color}55`,
                    color: "#e6f7ff",
                    background: `${sk.color}1f`,
                    boxShadow: active === sk.cat ? `0 0 18px ${sk.color}90` : "none",
                  }}
                >
                  {sk.name}
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      {/* Inner ring — categories (interactive) + light connections to the core */}
      <div className="orbit-ring orbit-ring--inner absolute inset-0">
        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="-50 -50 100 100" aria-hidden="true">
          {CATEGORY_ORDER.map((cat, i) => {
            const a = (i / CATEGORY_ORDER.length) * Math.PI * 2;
            const b = ((i + 1) / CATEGORY_ORDER.length) * Math.PI * 2;
            const on = active === cat;
            return (
              <g key={cat}>
                <line
                  x1={0}
                  y1={0}
                  x2={Math.cos(a) * 28}
                  y2={Math.sin(a) * 28}
                  stroke={skillData[cat].color}
                  strokeOpacity={on ? 0.95 : 0.3}
                  strokeWidth={on ? 0.7 : 0.3}
                  className="orbit-beam"
                />
                <line
                  x1={Math.cos(a) * 28}
                  y1={Math.sin(a) * 28}
                  x2={Math.cos(b) * 28}
                  y2={Math.sin(b) * 28}
                  stroke="#00FFFF"
                  strokeOpacity={0.15}
                  strokeWidth={0.25}
                />
              </g>
            );
          })}
        </svg>
        {CATEGORY_ORDER.map((cat, i) => {
          const a = (i / CATEGORY_ORDER.length) * 360;
          const data = skillData[cat];
          const on = active === cat;
          return (
            <div
              key={cat}
              className="orbit-node absolute left-1/2 top-1/2"
              style={{ transform: `rotate(${a}deg) translateX(calc(var(--orbit) * 0.28)) rotate(${-a}deg)` }}
            >
              <span className="orbit-counter relative block w-0 h-0">
                <button
                  type="button"
                  onClick={() => onSelect(cat)}
                  {...robotHoverProps(0.3)}
                  aria-pressed={on}
                  className="absolute left-0 top-0 w-max -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 rounded-2xl px-2 py-1.5 sm:px-3 sm:py-2 border backdrop-blur-xl transition-all duration-300 hover:scale-110 focus-visible:scale-110"
                  style={{
                    borderColor: on ? data.color : `${data.color}66`,
                    background: on ? `${data.color}40` : "rgba(11,16,35,0.8)",
                    boxShadow: on ? `0 0 28px ${data.color}` : `0 0 14px ${data.color}40`,
                  }}
                >
                  <span className="text-base sm:text-2xl" aria-hidden="true">
                    {data.icon}
                  </span>
                  <span className="text-[8px] sm:text-[11px] font-bold uppercase tracking-wide text-white whitespace-nowrap">
                    {t(`skills_${cat}`)}
                  </span>
                </button>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<CategoryKey | null>(null);

  const select = (c: CategoryKey) => {
    setActive((prev) => (prev === c ? null : c));
    const card = document.getElementById(`skill-card-${c}`);
    if (card && active !== c) setTimeout(() => card.scrollIntoView({ behavior: "smooth", block: "center" }), 250);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="section-padding relative z-10 overflow-x-clip" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader kicker="Expertise" title={t("skills_title")} slot="skills" side="left" className="mb-4" />

        <SkillOrbit active={active} onSelect={select} />

        {/* GRID AUDIT (6 blocs, photo au centre):
          Row 1: webdev | digital | robotics
          Row 2: programming | PHOTO (centre) | office
          Sur mobile (1 colonne) et tablette (2 colonnes), la photo reste
          insérée au milieu de l'ordre naturel du flux.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkillCard category="webdev" data={skillData.webdev} visible={visible} highlight={active === "webdev"} />
          <SkillCard category="digital" data={skillData.digital} visible={visible} highlight={active === "digital"} />
          <SkillCard category="robotics" data={skillData.robotics} visible={visible} highlight={active === "robotics"} />

          <SkillCard category="programming" data={skillData.programming} visible={visible} highlight={active === "programming"} />
          <ProfilePhotoCard />
          <SkillCard category="office" data={skillData.office} visible={visible} highlight={active === "office"} />
        </div>
      </div>
    </section>
  );
}
