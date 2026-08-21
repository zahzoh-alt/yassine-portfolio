"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";

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

function SkillCard({ category, data, visible }: {
  category: CategoryKey;
  data: typeof skillData[CategoryKey];
  visible: boolean;
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

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-card neon-border rounded-2xl p-6 cursor-default h-full relative overflow-hidden"
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

export default function SkillsSection() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="section-padding relative z-10" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-medium text-accent tracking-widest uppercase block mb-3">
            — Expertise —
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground">
            {t("skills_title")}
          </h2>
        </div>

        {/* GRID AUDIT (6 blocs, photo au centre):
          Row 1: webdev | digital | robotics
          Row 2: programming | PHOTO (centre) | office
          Sur mobile (1 colonne) et tablette (2 colonnes), la photo reste
          insérée au milieu de l'ordre naturel du flux.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkillCard category="webdev" data={skillData.webdev} visible={visible} />
          <SkillCard category="digital" data={skillData.digital} visible={visible} />
          <SkillCard category="robotics" data={skillData.robotics} visible={visible} />

          <SkillCard category="programming" data={skillData.programming} visible={visible} />
          <ProfilePhotoCard />
          <SkillCard category="office" data={skillData.office} visible={visible} />
        </div>
      </div>
    </section>
  );
}
