"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";

const stats = [
  { key: "about_stat1_label", value: 5, suffix: "+" },
  { key: "about_stat2_label", value: 15, suffix: "+" },
  { key: "about_stat3_label", value: 8, suffix: "+" },
  { key: "about_stat4_label", value: 20, suffix: "+" },
];

const tags = [
  "Instructional Design", "LXD", "Blended Learning", "SCORM / xAPI",
  "H5P", "Genially", "Camtasia", "Quizizz", "Kahoot",
  "Arduino", "LEGO Spike", "Tinkercad", "Google Workspace",
  "Adobe Premiere Pro", "OBS Studio", "ElevenLabs", "Logiquiz",
  "AI Pedagogical Tools", "Formative Assessment", "Curriculum Design",
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function StatItem({ statKey, value, suffix }: { statKey: string; value: number; suffix: string }) {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, 1500, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl sm:text-5xl font-extrabold text-gradient-cyan mb-2">
        {count}{suffix}
      </div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{t(statKey)}</div>
    </div>
  );
}

export default function AboutSection() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            entry.target.classList.remove("reveal-hidden");
          }
        });
      },
      { threshold: 0.1 }
    );
    const els = sectionRef.current?.querySelectorAll(".reveal-on-scroll");
    els?.forEach((el) => {
      el.classList.add("reveal-hidden");
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="section-padding relative z-10" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="reveal-on-scroll mb-16 text-center">
          <span className="text-xs font-medium text-accent tracking-widest uppercase block mb-3">
            — {t("nav_about")} —
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground">
            {t("about_title")}
          </h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-20 reveal-on-scroll">
          {stats.map((s) => (
            <StatItem key={s.key} statKey={s.key} value={s.value} suffix={s.suffix} />
          ))}
        </div>

        {/* Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start mb-20">
          <div className="lg:col-span-3 reveal-on-scroll">
            <div className="glass-card neon-border rounded-2xl p-8">
              <p className="text-foreground text-base sm:text-lg leading-relaxed">
                {t("about_bio")}
              </p>
              <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-accent">📍</span> Morocco
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-accent">✉️</span> yassinesama412@gmail.com
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-accent">📞</span> +212 7 13 38 55 51
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 reveal-on-scroll">
            <div className="glass-card neon-border-blue rounded-2xl p-8 h-full">
              <h3 className="text-sm font-bold text-accent uppercase tracking-widest mb-6">
                Languages
              </h3>
              {[
                { lang: "Arabic", level: "Native", pct: 100 },
                { lang: "French", level: "C1 Advanced", pct: 85 },
                { lang: "English", level: "B1 Intermediate", pct: 60 },
              ].map((l) => (
                <div key={l.lang} className="mb-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-foreground">{l.lang}</span>
                    <span className="text-muted-foreground text-xs">{l.level}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div
                      className="h-full rounded-full progress-bar-glow"
                      style={{
                        width: `${l.pct}%`,
                        background: "linear-gradient(90deg, #0055FF, #00FFFF)",
                        transition: "width 1.5s cubic-bezier(0.16,1,0.3,1)",
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-8 pt-6 border-t border-white/5">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                  Soft Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["Pedagogy", "Innovation", "Creativity", "Leadership", "Communication"].map((s) => (
                    <span
                      key={s}
                      className="text-xs px-3 py-1 rounded-full font-medium text-accent"
                      style={{ background: "rgba(0,255,255,0.08)", border: "1px solid rgba(0,255,255,0.15)" }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech tags */}
        <div className="reveal-on-scroll">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6 text-center">
            Tools & Technologies
          </h3>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {tags.map((tag, i) => (
              <span
                key={tag}
                className="text-xs sm:text-sm px-3 py-1.5 rounded-lg font-medium text-muted-foreground hover:text-accent transition-colors duration-300 cursor-default"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  transitionDelay: `${i * 30}ms`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}