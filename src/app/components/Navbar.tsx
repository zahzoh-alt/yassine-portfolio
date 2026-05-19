"use client";
import { useState, useEffect, useRef } from "react";
import AppLogo from "@/components/ui/AppLogo";
import { useLang } from "@/context/LanguageContext";

const navKeys = [
  { key: "nav_about", href: "#about" },
  { key: "nav_skills", href: "#skills" },
  { key: "nav_projects", href: "#projects" },
  { key: "nav_services", href: "#services" },
  { key: "nav_experience", href: "#experience" },
  { key: "nav_certifications", href: "#certifications" },
  { key: "nav_contact", href: "#contact" },
];

export default function Navbar() {
  const { lang, toggleLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = navKeys.map((n) => n.href.slice(1));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const cvFile =
    lang === "en" ?"/cv/CV_EZZAHI_YASSINE_Digital_Learning_EN.pdf" :"/cv/CV_EZZAHI_YASSINE_Digital_Learning_FR.pdf";

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-card border-b py-3" :"bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 group"
            aria-label="Back to top"
          >
            <AppLogo size={32} />
            <span className="font-display font-bold text-base tracking-tight hidden sm:block text-foreground group-hover:text-accent transition-colors duration-300">
              Ezzahi Yassine
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-6">
            {navKeys.map(({ key, href }) => (
              <button
                key={key}
                onClick={() => scrollTo(href)}
                className={`text-xs font-medium tracking-wide uppercase transition-all duration-300 relative group ${
                  activeSection === href.slice(1)
                    ? "text-accent" :"text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(key)}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-accent transition-all duration-300 ${
                    activeSection === href.slice(1) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="neon-border text-xs font-bold tracking-widest px-3 py-1.5 rounded text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300"
              aria-label="Toggle language"
            >
              {lang === "en" ? "FR" : "EN"}
            </button>

            <a
              href={cvFile}
              download
              className="hidden md:flex items-center gap-2 glass-card neon-border text-xs font-semibold tracking-wide px-4 py-2 rounded-lg text-accent hover:glow-cyan transition-all duration-300"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t("cta_download_cv")}
            </a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex flex-col gap-1.5 p-2 group"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`fixed inset-0 z-40 flex flex-col justify-center items-center transition-all duration-500 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(10,10,10,0.97)", backdropFilter: "blur(20px)" }}
        aria-hidden={!menuOpen}
      >
        <div className="flex flex-col items-center gap-8">
          {navKeys.map(({ key, href }, i) => (
            <button
              key={key}
              onClick={() => scrollTo(href)}
              className="text-3xl font-bold uppercase tracking-wider text-foreground hover:text-accent transition-colors duration-300"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {t(key)}
            </button>
          ))}
          <a
            href={cvFile}
            download
            onClick={() => setMenuOpen(false)}
            className="mt-4 neon-border text-accent text-sm font-semibold px-6 py-3 rounded-lg hover:glow-cyan transition-all"
          >
            {t("cta_download_cv")}
          </a>
        </div>
      </div>
    </>
  );
}