"use client";
import { useEffect, useRef, useState } from "react";
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
      className="glass-card neon-border rounded-2xl p-6 cursor-default"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: tilt.x === 0 && tilt.y === 0 ? "transform 0.5s cubic-bezier(0.16,1,0.3,1)" : "transform 0.1s linear",
        boxShadow: `0 0 30px ${data.color}15`,
      }}
    >
      <div className="flex items-center gap-3 mb-6">
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

      <div className="space-y-4">
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

  const categories = Object.keys(skillData) as CategoryKey[];

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

        {/* BENTO GRID AUDIT:
          Array has 5 cards: [webdev, digital, robotics, programming, office]
          Row 1: [col-1: webdev cs-1] [col-2: digital cs-1] [col-3: robotics cs-1]
          Row 2: [col-1: programming cs-1] [col-2: office cs-1] [col-3: EXPANDED → programming+office span to fill]
          Final: webdev cs-2, digital cs-1 on first row; programming cs-1, office cs-2 on second row; robotics cs-3 centered
          Placed 5/5 cards ✓
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* webdev — large */}
          <div className="sm:col-span-2 lg:col-span-2">
            <SkillCard category="webdev" data={skillData.webdev} visible={visible} />
          </div>
          {/* digital */}
          <div className="sm:col-span-2 lg:col-span-1">
            <SkillCard category="digital" data={skillData.digital} visible={visible} />
          </div>
          {/* programming */}
          <div className="sm:col-span-1 lg:col-span-1">
            <SkillCard category="programming" data={skillData.programming} visible={visible} />
          </div>
          {/* office */}
          <div className="sm:col-span-1 lg:col-span-1">
            <SkillCard category="office" data={skillData.office} visible={visible} />
          </div>
          {/* robotics — full width last */}
          <div className="sm:col-span-2 lg:col-span-1">
            <SkillCard category="robotics" data={skillData.robotics} visible={visible} />
          </div>
        </div>
      </div>
    </section>
  );
}