"use client";
import { useLang } from "@/context/LanguageContext";
import AppLogo from "@/components/ui/AppLogo";

export default function Footer() {
  const { t } = useLang();
  const year = 2026;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 border-t py-10 px-4 sm:px-6" style={{ borderColor: "rgba(0,255,255,0.08)" }}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo + name */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 group"
          aria-label="Back to top"
        >
          <AppLogo size={28} />
          <span className="font-bold text-sm text-muted-foreground group-hover:text-accent transition-colors">
            Ezzahi Yassine
          </span>
        </button>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[
            { key: "nav_about", id: "about" },
            { key: "nav_skills", id: "skills" },
            { key: "nav_projects", id: "projects" },
            { key: "nav_contact", id: "contact" },
          ].map(({ key, id }) => (
            <button
              key={key}
              onClick={() => scrollTo(id)}
              className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors duration-300 min-h-[44px] flex items-center"
            >
              {t(key)}
            </button>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-sm text-muted-foreground">
          © {year} Ezzahi Yassine · {t("footer_rights")}
        </p>
      </div>
    </footer>
  );
}