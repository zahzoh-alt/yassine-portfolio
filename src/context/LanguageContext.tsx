"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

type Lang = "en" | "fr";

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<Lang, Record<string, string>> = {
  en: {
    nav_about: "About",
    nav_skills: "Skills",
    nav_projects: "Projects",
    nav_services: "Services",
    nav_experience: "Experience",
    nav_certifications: "Certifications",
    nav_contact: "Contact",
    hero_tagline: "Crafting the Future of Digital Learning",
    hero_subtitle: "Digital Learning Engineer · LMS & Moodle Specialist · Front-End Creative Developer",
    hero_availability: "Available to collaborate on innovative projects in Digital Learning, educational technologies and immersive digital experiences.",
    cta_explore: "Explore My Work",
    cta_download_cv: "Download CV",
    about_title: "About Me",
    about_bio: "I am a Digital Learning Engineer and Instructional Designer driven by a deep passion for reshaping the future of education through technology. At the crossroads of pedagogy and innovation, I design immersive, learner-centred digital experiences that transform the way knowledge is acquired. From Moodle LMS architecture and SCORM content engineering to AI-powered pedagogical tools and interactive e-learning modules — I bring a hybrid expertise that bridges creative technology with meaningful learning outcomes. My mission: to make education smarter, more engaging, and profoundly human.",
    about_stat1_label: "Years in EdTech",
    about_stat2_label: "Skills Mastered",
    about_stat3_label: "Projects Completed",
    about_stat4_label: "Technologies",
    skills_title: "Skills & Expertise",
    skills_webdev: "Web Development",
    skills_digital: "Digital Learning",
    skills_robotics: "Robotics & STEM",
    skills_programming: "Programming",
    skills_office: "Productivity",
    projects_title: "Featured Projects",
    projects_filter_all: "All",
    projects_filter_dl: "Digital Learning",
    projects_filter_web: "Web Dev",
    projects_filter_stem: "STEM",
    services_title: "Services",
    experience_title: "Experience & Education",
    experience_label: "Experience",
    education_label: "Education",
    certifications_title: "Certifications",
    contact_title: "Get In Touch",
    contact_name: "Your Name",
    contact_email: "Email Address",
    contact_subject: "Subject",
    contact_message: "Message",
    contact_send: "Send Message",
    contact_available: "Available for collaborations",
    footer_rights: "All rights reserved.",
    current_badge: "Current",
  },
  fr: {
    nav_about: "À Propos",
    nav_skills: "Compétences",
    nav_projects: "Projets",
    nav_services: "Services",
    nav_experience: "Expérience",
    nav_certifications: "Certifications",
    nav_contact: "Contact",
    hero_tagline: "Façonner l'Avenir de l'Apprentissage Digital",
    hero_subtitle: "Ingénieur Digital Learning · Spécialiste LMS & Moodle · Développeur Front-End Créatif",
    hero_availability: "Disponible pour collaborer sur des projets innovants en Digital Learning, technologies éducatives et expériences numériques immersives.",
    cta_explore: "Découvrir Mon Travail",
    cta_download_cv: "Télécharger CV",
    about_title: "À Propos",
    about_bio: "Ingénieur Digital Learning et Concepteur Pédagogique, je suis animé par une passion profonde pour la transformation de l'éducation par la technologie. À l'intersection de la pédagogie et de l'innovation numérique, je conçois des expériences d'apprentissage immersives et centrées sur l'apprenant, qui révolutionnent la façon dont le savoir est transmis. De l'architecture Moodle LMS à l'ingénierie SCORM, des outils pédagogiques propulsés par l'IA aux modules e-learning interactifs — mon expertise hybride relie la créativité technologique aux résultats pédagogiques. Ma mission : rendre l'éducation plus intelligente, plus engageante et profondément humaine.",
    about_stat1_label: "Ans en EdTech",
    about_stat2_label: "Compétences",
    about_stat3_label: "Projets Réalisés",
    about_stat4_label: "Technologies",
    skills_title: "Compétences & Expertise",
    skills_webdev: "Développement Web",
    skills_digital: "Digital Learning",
    skills_robotics: "Robotique & STEM",
    skills_programming: "Programmation",
    skills_office: "Bureautique",
    projects_title: "Projets Phares",
    projects_filter_all: "Tous",
    projects_filter_dl: "Digital Learning",
    projects_filter_web: "Dév. Web",
    projects_filter_stem: "STEM",
    services_title: "Services",
    experience_title: "Expérience & Formation",
    experience_label: "Expérience",
    education_label: "Formation",
    certifications_title: "Certifications",
    contact_title: "Me Contacter",
    contact_name: "Votre Nom",
    contact_email: "Adresse Email",
    contact_subject: "Sujet",
    contact_message: "Message",
    contact_send: "Envoyer",
    contact_available: "Disponible pour collaborations",
    footer_rights: "Tous droits réservés.",
    current_badge: "En cours",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggleLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const toggleLang = useCallback(() => setLang((l) => (l === "en" ? "fr" : "en")), []);
  const t = useCallback((key: string) => translations[lang][key] ?? key, [lang]);
  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);