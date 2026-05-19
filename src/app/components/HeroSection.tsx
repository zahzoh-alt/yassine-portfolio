"use client";

import { useEffect, useRef, useState } from "react";
import AppImage from "@/components/ui/AppImage";
import { useLang } from "@/context/LanguageContext";

export default function HeroSection() {
  const { lang } = useLang();

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedRole, setDisplayedRole] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [orbitRadius, setOrbitRadius] = useState(170);

  const photoRef = useRef<HTMLDivElement>(null);

  const cvFile =
    lang === "en"
      ? "/cv/CV_EZZAHI_YASSINE_Digital_Learning_EN.pdf"
      : "/cv/CV_EZZAHI_YASSINE_Digital_Learning_FR.pdf";

  /* =========================
     TYPEWRITER ROLES
  ========================= */

  const roles =
    lang === "en"
      ? [
          "Digital Learning Engineer",
          "Instructional Designer",
          "Moodle LMS Specialist",
          "STEM Robotics Trainer",
          "Web Technologies Instructor",
        ]
      : [
          "Ingénieur Digital Learning",
          "Concepteur Pédagogique",
          "Spécialiste Moodle LMS",
          "Formateur Robotique STEM",
          "Formateur Technologies Web",
        ];

  useEffect(() => {
    const current = roles[roleIndex % roles.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayedRole.length < current.length) {
      timeout = setTimeout(() => {
        setDisplayedRole(current.slice(0, displayedRole.length + 1));
      }, 80);
    } else if (!isDeleting && displayedRole.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && displayedRole.length > 0) {
      timeout = setTimeout(() => {
        setDisplayedRole(displayedRole.slice(0, -1));
      }, 40);
    } else if (isDeleting && displayedRole.length === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayedRole, isDeleting, roleIndex, roles]);

  /* =========================
     MOUSE PARALLAX
  ========================= */

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /* =========================
     RESPONSIVE ORBIT
  ========================= */

  useEffect(() => {
    setOrbitRadius(window.innerWidth < 640 ? 140 : 170);

    const handleResize = () => {
      setOrbitRadius(window.innerWidth < 640 ? 140 : 170);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050816]"
    >
      {/* =========================
          BACKGROUND EFFECTS
      ========================= */}

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.2) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(0,255,255,0.08), transparent 30%), radial-gradient(circle at 80% 30%, rgba(123,0,255,0.08), transparent 30%), radial-gradient(circle at 50% 80%, rgba(0,85,255,0.08), transparent 35%)",
        }}
      />

      {/* SCAN LINE */}

      <div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,255,255,0.5), transparent)",
          animation: "scanLine 8s linear infinite",
          top: "20%",
        }}
        aria-hidden="true"
      />

      {/* =========================
          CONTENT
      ========================= */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* =========================================================
              LEFT CONTENT
          ========================================================= */}

          <div className="flex flex-col justify-center order-2 lg:order-1">
            {/* AVAILABLE BADGE */}

            <div className="inline-flex items-center gap-3 glass-card neon-border px-4 py-2 rounded-full mb-8 w-fit backdrop-blur-xl border border-cyan-500/20">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  background: "#22c55e",
                  boxShadow: "0 0 10px #22c55e",
                }}
              />

              <span className="text-xs font-medium text-cyan-400 tracking-[0.2em] uppercase">
                {lang === "en"
                  ? "Available for Collaboration"
                  : "Disponible pour Collaboration"}
              </span>
            </div>

            {/* GREETING */}

            <p className="font-mono text-sm mb-3 text-gray-400">
              {lang === "en"
                ? "Hello World"
                : "Bonjour le monde — Je suis"}
            </p>

            {/* TITLE */}

            <h1 className="text-[clamp(3rem,8vw,6rem)] font-black leading-[0.9] tracking-tight mb-6">
              <span
                className="block"
                style={{
                  background:
                    "linear-gradient(135deg, #00FFFF 0%, #0055FF 50%, #7B00FF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                EZZAHI
              </span>

              <span className="block text-white">YASSINE</span>
            </h1>

            {/* TYPEWRITER */}

            <div className="h-10 flex items-center mb-6">
              <span
                className="font-mono text-lg sm:text-2xl font-semibold"
                style={{
                  color: "#00FFFF",
                  textShadow: "0 0 15px rgba(0,255,255,0.6)",
                }}
              >
                {displayedRole}

                <span
                  className="inline-block w-[2px] h-6 ml-1 align-middle"
                  style={{
                    background: "#00FFFF",
                    animation: "blinkDot 1s ease-in-out infinite",
                  }}
                />
              </span>
            </div>

            {/* DESCRIPTION */}

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-5 max-w-xl">
              {lang === "en"
                ? "Digital Learning Engineer specialized in Moodle LMS, instructional engineering, immersive learning experiences, educational technologies, STEM robotics, and modern web ecosystems."
                : "Ingénieur Digital Learning spécialisé en Moodle LMS, ingénierie pédagogique, expériences d’apprentissage immersives, technologies éducatives, robotique STEM et écosystèmes web modernes."}
            </p>

            <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-lg opacity-90">
              {lang === "en"
                ? "Currently leading the digitalization of online training programs, AI pedagogical chatbot integration, interactive SCORM modules, and educational innovation projects."
                : "Actuellement en charge de la digitalisation de formations en ligne, de l’intégration de chatbots pédagogiques IA, de modules SCORM interactifs et de projets d’innovation éducative."}
            </p>

            {/* CTA */}

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection("projects")}
                className="relative group px-8 py-4 rounded-2xl font-semibold text-sm tracking-wide overflow-hidden transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #0055FF, #7B00FF)",
                  boxShadow: "0 0 30px rgba(0,85,255,0.45)",
                }}
              >
                <span className="relative z-10 text-white flex items-center gap-2">
                  {lang === "en"
                    ? "Explore Projects"
                    : "Explorer les Projets"}

                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </button>

              <a
                href={cvFile}
                download
                className="group px-8 py-4 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-300 flex items-center gap-2 border border-cyan-400/20 bg-white/5 backdrop-blur-xl hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(0,255,255,0.3)]"
                style={{
                  color: "#00FFFF",
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>

                {lang === "en" ? "Download CV" : "Télécharger CV"}
              </a>
            </div>

          {/* SOCIAL */}
<div className="flex items-center gap-4 mt-10">

  {/* LINKEDIN */}
  <a
    href="https://linkedin.com/in/ezzahi-yassine-212820354"
    target="_blank"
    rel="noopener noreferrer"
    className="w-14 h-14 rounded-2xl border border-cyan-500/20 
    bg-[#0B1023]/80 backdrop-blur-xl flex items-center justify-center 
    text-cyan-400 hover:scale-110 hover:border-cyan-400 
    hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] 
    transition-all duration-300"
    aria-label="LinkedIn profile"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.48 1s2.5 1.12 2.5 2.5zM.5 8h4V24h-4V8zm7 0h3.8v2.2h.1c.5-.9 1.8-2.2 3.8-2.2 4.1 0 4.8 2.7 4.8 6.3V24h-4v-7.1c0-1.7 0-3.9-2.4-3.9s-2.8 1.8-2.8 3.8V24h-4V8z"/>
    </svg>
  </a>

  {/* EMAIL */}
  <a
    href="mailto:yassinesama412@gmail.com"
    className="w-14 h-14 rounded-2xl border border-cyan-500/20 
    bg-[#0B1023]/80 backdrop-blur-xl flex items-center justify-center 
    text-cyan-400 hover:scale-110 hover:border-cyan-400 
    hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] 
    transition-all duration-300"
    aria-label="Email"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l9 6 9-6"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
      />
    </svg>
  </a>

  {/* PHONE */}
  <a
    href="tel:+212713385551"
    className="w-14 h-14 rounded-2xl border border-cyan-500/20 
    bg-[#0B1023]/80 backdrop-blur-xl flex items-center justify-center 
    text-cyan-400 hover:scale-110 hover:border-cyan-400 
    hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] 
    transition-all duration-300"
    aria-label="Phone"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h2.5a1 1 0 01.95.68l1.2 3.6a1 1 0 01-.27 1.05l-1.6 1.6a16 16 0 006.6 6.6l1.6-1.6a1 1 0 011.05-.27l3.6 1.2a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"
      />
    </svg>
  </a>

</div>
</div>

          {/* =========================================================
              RIGHT PHOTO
          ========================================================= */}

          <div
            ref={photoRef}
            className="flex justify-center items-center order-1 lg:order-2 relative"
          >
            {/* GLOW */}

            <div
              className="absolute w-[520px] h-[520px] rounded-full blur-[120px] opacity-30"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,255,255,0.35), rgba(123,0,255,0.15), transparent 70%)",
              }}
            />

            {/* OUTER RING */}

            <div
              className="absolute w-[430px] h-[430px] rounded-full border border-cyan-400/20"
              style={{
                animation: "spinSlow 25s linear infinite",
              }}
            />

            {/* SECOND RING */}

            <div
              className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-blue-500/20"
              style={{
                animation: "spinSlow 18s linear infinite reverse",
              }}
            />

            {/* ORBIT DOTS */}

            {[0, 90, 180, 270].map((deg, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: i % 2 === 0 ? "#00FFFF" : "#7B00FF",
                  boxShadow:
                    i % 2 === 0
                      ? "0 0 20px rgba(0,255,255,1)"
                      : "0 0 20px rgba(123,0,255,1)",
                  transform: `rotate(${deg}deg) translateX(${orbitRadius}px)`,
                  animation: `spinSlow ${10 + i * 2}s linear infinite`,
                  transformOrigin: "center",
                }}
              />
            ))}

            {/* PHOTO CONTAINER */}

            <div
              className="relative z-10 overflow-hidden rounded-[32px]"
              style={{
                width: "clamp(280px, 34vw, 420px)",
                height: "clamp(360px, 48vw, 560px)",
                border: "1px solid rgba(0,255,255,0.2)",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(20px)",
                boxShadow:
                  "0 0 50px rgba(0,255,255,0.15), 0 0 120px rgba(0,85,255,0.1)",
                transform: `rotateY(${mousePos.x * 8}deg) rotateX(${-mousePos.y * 6}deg)`,
                transition:
                  "transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            >
              <AppImage
                src="/assets/images/yassine-1779107429440.png"
                alt="Ezzahi Yassine professional portrait"
                fill
                className="object-cover object-top scale-[1.02]"
                priority
                sizes="(max-width: 768px) 280px, 420px"
              />

              {/* OVERLAY */}

              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(5,8,22,0.8) 0%, transparent 45%, rgba(0,255,255,0.05) 100%)",
                }}
              />

              {/* CYAN EDGE */}

              <div
                className="absolute inset-0 rounded-[32px]"
                style={{
                  boxShadow:
                    "inset 0 0 40px rgba(0,255,255,0.08), inset 0 0 80px rgba(0,85,255,0.08)",
                }}
              />
            </div>
          </div>
        </div>

        {/* SCROLL */}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-xs text-gray-400 tracking-widest uppercase">
            Scroll
          </span>

          <div className="w-px h-12 bg-gradient-to-b from-cyan-400 to-transparent" />
        </div>
      </div>
    </section>
  );
}