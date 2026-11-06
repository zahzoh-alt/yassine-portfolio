"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { robotHoverProps, robotSpin } from "@/lib/robotBus";

const GRADIENT_BTN = "linear-gradient(135deg, #0055FF, #7B00FF)";
const GRADIENT_TEXT = "linear-gradient(135deg, #00FFFF 0%, #0055FF 50%, #7B00FF 100%)";

/** Interpolated neon colours for the per-letter gradient of the family name. */
const LETTER_COLORS = ["#00FFFF", "#00C8FF", "#0094FF", "#0055FF", "#3A2BFF", "#7B00FF", "#9B3BFF"];

function AnimatedWord({ word, base, gradient }: { word: string; base: number; gradient?: boolean }) {
  return (
    <span className="hero-word" aria-hidden="true">
      {word.split("").map((ch, i) => (
        <span
          key={i}
          className="hero-letter"
          style={{
            animationDelay: `${base + i * 0.065}s`,
            ...(gradient
              ? {
                  backgroundImage: `linear-gradient(160deg, ${LETTER_COLORS[i % LETTER_COLORS.length]}, ${
                    LETTER_COLORS[(i + 1) % LETTER_COLORS.length]
                  })`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }
              : {}),
          }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function HeroSection() {
  const { lang, t } = useLang();
  const l = lang === "en" ? "en" : "fr";

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedRole, setDisplayedRole] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const cvFile =
    lang === "en"
      ? "/cv/CV_EZZAHI_YASSINE_Digital_Learning_EN.pdf"
      : "/cv/CV_EZZAHI_YASSINE_Digital_Learning_FR.pdf";

  const roles = useMemo(
    () =>
      lang === "en"
        ? [
            "Digital Learning Engineer",
            "Instructional Designer",
            "Moodle LMS Specialist",
            "STEM Robotics Trainer",
            "Web Technologies Instructor",
            "Content Creator",
          ]
        : [
            "Ingénieur Digital Learning",
            "Concepteur Pédagogique",
            "Spécialiste Moodle LMS",
            "Formateur Robotique STEM",
            "Formateur Technologies Web",
            "Créateur de Contenu",
          ],
    [lang]
  );

  // Typewriter
  useEffect(() => {
    const currentRole = roles[roleIndex % roles.length];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting && displayedRole.length < currentRole.length) {
      timeout = setTimeout(() => setDisplayedRole(currentRole.slice(0, displayedRole.length + 1)), 80);
    } else if (!isDeleting && displayedRole.length === currentRole.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && displayedRole.length > 0) {
      timeout = setTimeout(() => setDisplayedRole(displayedRole.slice(0, -1)), 40);
    } else if (isDeleting && displayedRole.length === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }
    return () => clearTimeout(timeout);
  }, [displayedRole, isDeleting, roleIndex, roles]);

  // Auto-open the introduction video once per session — after the robot's arrival.
  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem("introSeen");
    } catch {}
    if (seen) return;
    const id = setTimeout(() => {
      if (window.scrollY < window.innerHeight * 0.5) setShowVideo(true);
    }, 4600);
    return () => clearTimeout(id);
  }, []);

  // Autoplay (with sound, otherwise muted)
  useEffect(() => {
    if (!showVideo) return;
    const v = modalVideoRef.current;
    if (!v) return;
    v.muted = false;
    v.play()
      .then(() => setIsMuted(false))
      .catch(() => {
        v.muted = true;
        setIsMuted(true);
        v.play().catch(() => {});
      });
  }, [showVideo]);

  // Close video with Escape
  useEffect(() => {
    if (!showVideo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeVideo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showVideo]);

  const closeVideo = () => {
    setShowVideo(false);
    try {
      sessionStorage.setItem("introSeen", "1");
    } catch {}
  };

  const unmuteVideo = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const stats = [
    { value: "Moodle", label: l === "en" ? "LMS expertise" : "Expertise LMS" },
    { value: "SCORM", label: l === "en" ? "Interactive modules" : "Modules interactifs" },
    { value: "STEM", label: l === "en" ? "Robotics training" : "Formation robotique" },
    { value: "AI", label: l === "en" ? "Pedagogical chatbots" : "Chatbots pédagogiques" },
    { value: "Reels", label: l === "en" ? "Educational content" : "Contenu éducatif" },
  ];

  const floatingChips = [
    { label: "Moodle", pos: "top-[6%] left-0 sm:-left-4", delay: "0s" },
    { label: "SCORM", pos: "top-[42%] -right-2 sm:-right-8", delay: "1.2s" },
    { label: "STEM", pos: "bottom-[10%] left-0 sm:-left-6", delay: "2.4s" },
  ];

  const socialClass =
    "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border border-cyan-500/20 bg-[#0B1023]/70 backdrop-blur-xl flex items-center justify-center text-cyan-400 hover:scale-110 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all duration-300";

  return (
    <>
      <section id="hero" className="relative min-h-[100svh] flex items-center overflow-hidden" aria-label="Introduction">
        {/* Perspective grid floor */}
        <div className="hero-grid absolute inset-x-0 bottom-0 h-[45%] pointer-events-none" aria-hidden="true" />
        <div
          className="absolute left-0 right-0 h-px pointer-events-none hero-scanline"
          style={{ background: "linear-gradient(90deg, transparent, rgba(0,255,255,0.5), transparent)" }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-24 sm:pt-28 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-4 lg:gap-8 items-center lg:min-h-[76vh]">
            {/* ---------- ROBOT STAGE ---------- */}
            <div className="order-1 lg:order-2 relative flex flex-col items-center justify-center">
              <div className="robot-stage relative w-[min(64vw,250px)] h-[min(64vw,250px)] lg:w-[min(34vw,440px)] lg:h-[min(34vw,440px)]">
                {/* HUD rings around the robot */}
                <div className="absolute inset-[-6%] rounded-full border border-cyan-400/15 hud-spin" aria-hidden="true" />
                <div className="absolute inset-[4%] rounded-full border border-dashed border-blue-500/20 hud-spin-rev" aria-hidden="true" />
                <div className="absolute inset-[-14%] rounded-full hud-arc" aria-hidden="true" />
                <div className="absolute inset-0 rounded-full stage-glow" aria-hidden="true" />

                {/* The reserved space where the 3D robot lands */}
                <div data-robot-slot="hero" data-side="right" className="robot-slot absolute inset-[12%]" aria-hidden="true">
                  {/* Static fallback when WebGL is unavailable */}
                  <svg viewBox="0 0 120 120" className="robot-fallback w-full h-full">
                    <defs>
                      <linearGradient id="rb" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0" stopColor="#f4f7fb" />
                        <stop offset="1" stopColor="#aeb8c8" />
                      </linearGradient>
                    </defs>
                    <ellipse cx="60" cy="42" rx="30" ry="24" fill="url(#rb)" />
                    <ellipse cx="60" cy="44" rx="23" ry="15" fill="#05070f" />
                    <rect x="48" y="38" width="7" height="11" rx="3.5" fill="#38f3ff" />
                    <rect x="65" y="38" width="7" height="11" rx="3.5" fill="#38f3ff" />
                    <path d="M40 70 Q60 64 80 70 L76 92 Q60 100 44 92 Z" fill="url(#rb)" />
                    <circle cx="60" cy="80" r="5" fill="#38f3ff" />
                    <path d="M54 100 L60 116 L66 100 Z" fill="#38f3ff" opacity=".6" />
                  </svg>
                </div>

                {floatingChips.map((c) => (
                  <div
                    key={c.label}
                    className={`hg-float absolute z-20 ${c.pos} px-3 py-1.5 rounded-full border border-cyan-400/30 bg-[#0B1023]/80 backdrop-blur-xl text-[11px] sm:text-xs font-semibold text-cyan-300 shadow-[0_0_20px_rgba(0,255,255,0.2)]`}
                    style={{ animationDelay: c.delay }}
                    aria-hidden="true"
                  >
                    {c.label}
                  </div>
                ))}
              </div>

              {/* Introduction video */}
              <button
                type="button"
                onClick={() => setShowVideo(true)}
                {...robotHoverProps(0.35)}
                className="mt-4 lg:mt-8 group relative flex items-center gap-3 rounded-2xl border border-cyan-400/30 bg-[#0B1023]/70 backdrop-blur-xl pl-2 pr-5 py-2 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,255,255,0.25)] transition-all duration-300"
                aria-label={l === "en" ? "Watch my introduction video" : "Voir ma vidéo de présentation"}
              >
                <span className="relative w-20 h-12 rounded-xl overflow-hidden bg-black/60">
                  <video
                    src="/videos/presentation-yassine.mp4"
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity"
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-5 h-5 text-cyan-300 drop-shadow-[0_0_6px_rgba(0,255,255,0.9)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
                <span className="text-xs font-semibold text-white tracking-wider uppercase">
                  {l === "en" ? "My Introduction" : "Ma présentation"}
                </span>
              </button>
            </div>

            {/* ---------- TEXT ---------- */}
            <div className="order-2 lg:order-1 flex flex-col justify-center">
              <div className="hero-fade inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 sm:mb-8 w-fit backdrop-blur-xl border border-cyan-500/20 bg-white/[0.03]" style={{ animationDelay: "0.1s" }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#22c55e", boxShadow: "0 0 10px #22c55e" }} />
                <span className="text-[11px] sm:text-xs font-medium text-cyan-400 tracking-[0.2em] uppercase">
                  {l === "en" ? "Available for Collaboration" : "Disponible pour Collaboration"}
                </span>
              </div>

              <p className="hero-fade font-mono text-sm mb-3 text-gray-400" style={{ animationDelay: "0.25s" }}>
                {l === "en" ? "Hello World — I'm" : "Bonjour le monde — Je suis"}
              </p>

              <h1 className="hero-title relative font-black leading-[0.86] tracking-[-0.03em] mb-6" aria-label="Ezzahi Yassine">
                <span className="block">
                  <AnimatedWord word="EZZAHI" base={0.35} gradient />
                </span>
                <span className="block text-white">
                  <AnimatedWord word="YASSINE" base={0.75} />
                </span>
              </h1>

              <div className="hero-fade h-10 flex items-center mb-6" style={{ animationDelay: "1.3s" }}>
                <span className="font-mono text-lg sm:text-2xl font-semibold" style={{ color: "#00FFFF", textShadow: "0 0 15px rgba(0,255,255,0.6)" }}>
                  {displayedRole}
                  <span className="inline-block w-[2px] h-6 ml-1 align-middle caret-blink" style={{ background: "#00FFFF" }} />
                </span>
              </div>

              <p className="hero-fade text-gray-300 text-base sm:text-lg leading-relaxed mb-4 max-w-xl" style={{ animationDelay: "1.45s" }}>
                {l === "en"
                  ? "Digital Learning Engineer specialized in Moodle LMS, instructional engineering, immersive learning experiences, educational technologies, STEM robotics, and modern web ecosystems."
                  : "Ingénieur Digital Learning spécialisé en Moodle LMS, ingénierie pédagogique, expériences d’apprentissage immersives, technologies éducatives, robotique STEM et écosystèmes web modernes."}
              </p>

              <p className="hero-fade text-gray-400 text-sm leading-relaxed mb-9 max-w-lg" style={{ animationDelay: "1.55s" }}>
                {l === "en"
                  ? "Currently leading the digitalization of online training programs, AI pedagogical chatbot integration, interactive SCORM modules, and educational innovation projects. I also create educational and tech content on Instagram."
                  : "Actuellement en charge de la digitalisation de formations en ligne, de l’intégration de chatbots pédagogiques IA, de modules SCORM interactifs et de projets d’innovation éducative. Je crée aussi du contenu éducatif et tech sur Instagram."}
              </p>

              {/* CTA */}
              <div className="hero-fade flex flex-wrap gap-3 sm:gap-4" style={{ animationDelay: "1.7s" }}>
                <button
                  type="button"
                  onClick={() => {
                    robotSpin();
                    scrollToSection("about");
                  }}
                  {...robotHoverProps(0.3)}
                  className="cta-primary relative group px-7 sm:px-8 py-4 rounded-2xl font-semibold text-sm tracking-wide overflow-hidden transition-all duration-300 hover:scale-105"
                  style={{ background: GRADIENT_BTN }}
                >
                  <span className="relative z-10 text-white flex items-center gap-2">
                    {t("hero_discover")}
                    <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("projects")}
                  {...robotHoverProps(0.3)}
                  className="px-7 sm:px-8 py-4 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-300 flex items-center gap-2 border border-cyan-400/20 bg-white/5 backdrop-blur-xl hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(0,255,255,0.3)] text-white"
                >
                  {l === "en" ? "Explore Projects" : "Explorer les Projets"}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>

                <a
                  href={cvFile}
                  download
                  {...robotHoverProps(0.3)}
                  className="px-7 sm:px-8 py-4 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-300 flex items-center gap-2 border border-cyan-400/20 bg-white/5 backdrop-blur-xl hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(0,255,255,0.3)]"
                  style={{ color: "#00FFFF" }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {l === "en" ? "Download CV" : "Télécharger CV"}
                </a>
              </div>

              {/* INSTAGRAM CREATOR */}
              <a
                href="https://instagram.com/m.ezzahi_yassine"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-fade mt-7 inline-flex w-fit items-center gap-3 rounded-2xl border border-purple-400/30 bg-purple-500/10 px-5 py-3 text-sm text-purple-200 backdrop-blur-xl transition-all duration-300 hover:border-purple-300 hover:shadow-[0_0_25px_rgba(123,0,255,0.35)]"
                style={{ animationDelay: "1.85s" }}
              >
                <span aria-hidden="true">📱</span>
                <span>
                  {l === "en" ? "Content creator on Instagram" : "Créateur de contenu sur Instagram"}
                  <span className="ml-2 font-mono font-semibold text-white">@m.ezzahi_yassine</span>
                </span>
              </a>

              {/* SOCIAL */}
              <div className="hero-fade flex items-center gap-3 sm:gap-4 mt-6" style={{ animationDelay: "2s" }}>
                <a href="https://linkedin.com/in/ezzahi-yassine-212820354" target="_blank" rel="noopener noreferrer" className={socialClass} aria-label="LinkedIn profile">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.48 1s2.5 1.12 2.5 2.5zM.5 8h4V24h-4V8zm7 0h3.8v2.2h.1c.5-.9 1.8-2.2 3.8-2.2 4.1 0 4.8 2.7 4.8 6.3V24h-4v-7.1c0-1.7 0-3.9-2.4-3.9s-2.8 1.8-2.8 3.8V24h-4V8z" />
                  </svg>
                </a>
                <a href="https://instagram.com/m.ezzahi_yassine" target="_blank" rel="noopener noreferrer" className={socialClass} aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href="mailto:yassinesama412@gmail.com" className={socialClass} aria-label="Email">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  </svg>
                </a>
                <a href="tel:+212713385551" className={socialClass} aria-label="Phone">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.5a1 1 0 01.95.68l1.2 3.6a1 1 0 01-.27 1.05l-1.6 1.6a16 16 0 006.6 6.6l1.6-1.6a1 1 0 011.05-.27l3.6 1.2a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* STATS STRIP */}
          <div className="hero-fade mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-5 gap-3" style={{ animationDelay: "2.2s" }}>
            {stats.map((s) => (
              <div
                key={s.value}
                {...robotHoverProps(0.2)}
                className="rounded-2xl border border-cyan-500/15 bg-white/[0.03] backdrop-blur-xl px-5 py-4 text-center transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(0,255,255,0.15)]"
              >
                <p className="text-xl sm:text-2xl font-black" style={{ background: GRADIENT_TEXT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {s.value}
                </p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SCROLL CUE → QUIZ */}
        <button
          type="button"
          onClick={() => scrollToSection("game")}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-gray-400 hover:text-cyan-300 transition-colors"
        >
          <span className="text-[11px] tracking-widest uppercase">{l === "en" ? "Try the challenge" : "Tenter le défi"}</span>
          <span className="scroll-bounce" aria-hidden="true">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
      </section>

      {/* VIDEO MODAL */}
      {showVideo && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-6"
          onClick={closeVideo}
          role="dialog"
          aria-modal="true"
          aria-label={l === "en" ? "Introduction video" : "Vidéo de présentation"}
        >
          <div
            className="relative w-[96vw] max-w-6xl rounded-3xl overflow-hidden border border-cyan-400/30 bg-[#050816] shadow-[0_0_100px_rgba(0,255,255,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeVideo}
              autoFocus
              className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-black/70 border border-white/20 text-white text-2xl flex items-center justify-center hover:bg-cyan-500/80 hover:border-cyan-400 transition-all"
              aria-label={l === "en" ? "Close video" : "Fermer la vidéo"}
            >
              ×
            </button>
            {isMuted && (
              <button
                type="button"
                onClick={unmuteVideo}
                className="absolute top-4 left-4 z-20 px-4 py-2 rounded-full bg-cyan-500/90 text-black text-sm font-semibold shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:scale-105 transition-transform animate-pulse"
              >
                🔊 {l === "en" ? "Enable sound" : "Activer le son"}
              </button>
            )}
            <video
              ref={modalVideoRef}
              src="/videos/presentation-yassine.mp4"
              controls
              autoPlay
              playsInline
              onEnded={closeVideo}
              className="w-full max-h-[85vh] object-contain bg-black"
            />
          </div>
        </div>
      )}
    </>
  );
}
