"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AppImage from "@/components/ui/AppImage";
import { useLang } from "@/context/LanguageContext";

/* =========================================================
   TYPES
========================================================= */

type Bi<T> = { en: T; fr: T };

type Question = {
  cat: Bi<string>;
  q: Bi<string>;
  options: Bi<string[]>;
  answer: number;
  explain: Bi<string>;
};

type Status = "intro" | "playing" | "result";

/* =========================================================
   QUESTIONS (10 disponibles, 8 tirées au hasard à chaque partie)
========================================================= */

const QUESTIONS: Question[] = [
  {
    cat: { en: "Instructional Design", fr: "Ingénierie pédagogique" },
    q: {
      en: "In Bloom's revised taxonomy, which level sits at the top?",
      fr: "Dans la taxonomie de Bloom révisée, quel niveau est au sommet ?",
    },
    options: {
      en: ["Remember", "Apply", "Create", "Understand"],
      fr: ["Mémoriser", "Appliquer", "Créer", "Comprendre"],
    },
    answer: 2,
    explain: {
      en: "Creating means producing something new from what was learned. It is the highest level of the revised taxonomy, above Evaluate.",
      fr: "Créer, c'est produire quelque chose de nouveau à partir de ses acquis. C'est le niveau le plus élevé de la taxonomie révisée, au-dessus d'Évaluer.",
    },
  },
  {
    cat: { en: "Instructional Design", fr: "Ingénierie pédagogique" },
    q: {
      en: "What does the first letter of the ADDIE model stand for?",
      fr: "Que signifie la première lettre du modèle ADDIE ?",
    },
    options: {
      en: ["Analysis", "Animation", "Assessment", "Adaptation"],
      fr: ["Analyse", "Animation", "Évaluation", "Adaptation"],
    },
    answer: 0,
    explain: {
      en: "ADDIE = Analysis, Design, Development, Implementation, Evaluation. Analysis comes first: audience, needs and constraints.",
      fr: "ADDIE = Analyse, Design, Développement, Implémentation, Évaluation. On commence par analyser le public, les besoins et les contraintes.",
    },
  },
  {
    cat: { en: "SCORM", fr: "SCORM" },
    q: {
      en: "What is SCORM used for?",
      fr: "À quoi sert SCORM ?",
    },
    options: {
      en: [
        "Compressing videos",
        "Letting course packages communicate with an LMS",
        "Designing slide templates",
        "Hosting websites",
      ],
      fr: [
        "Compresser des vidéos",
        "Permettre à un module de communiquer avec un LMS",
        "Créer des modèles de diapositives",
        "Héberger des sites web",
      ],
    },
    answer: 1,
    explain: {
      en: "SCORM is a standard that lets an LMS launch a module and receive results such as completion, score and time spent.",
      fr: "SCORM est un standard qui permet à un LMS de lancer un module et de récupérer les résultats : achèvement, score et temps passé.",
    },
  },
  {
    cat: { en: "Moodle LMS", fr: "Moodle LMS" },
    q: {
      en: "Which Moodle activity is built for peer assessment?",
      fr: "Quelle activité Moodle est conçue pour l'évaluation par les pairs ?",
    },
    options: {
      en: ["Glossary", "Workshop", "Choice", "Lesson"],
      fr: ["Glossaire", "Atelier", "Sondage", "Leçon"],
    },
    answer: 1,
    explain: {
      en: "Workshop lets learners submit work and assess each other's submissions using a grading rubric.",
      fr: "L'Atelier permet aux apprenants de déposer un travail et d'évaluer ceux de leurs pairs grâce à une grille de critères.",
    },
  },
  {
    cat: { en: "Moodle LMS", fr: "Moodle LMS" },
    q: {
      en: "Which Moodle feature shows learners their progress through a course?",
      fr: "Quelle fonctionnalité Moodle montre aux apprenants leur progression dans un cours ?",
    },
    options: {
      en: ["Activity completion", "Backup", "Cohorts", "Web services"],
      fr: ["Achèvement d'activité", "Sauvegarde", "Cohortes", "Services web"],
    },
    answer: 0,
    explain: {
      en: "Activity completion tracks what each learner has done and feeds the progress bar and conditional access.",
      fr: "L'achèvement d'activité suit ce que chaque apprenant a fait et alimente la barre de progression et les accès conditionnels.",
    },
  },
  {
    cat: { en: "Assessment", fr: "Évaluation" },
    q: {
      en: "A short quiz mid-course, with feedback to adjust teaching, is which type of assessment?",
      fr: "Un court quiz en cours de formation, avec feedback pour ajuster l'enseignement, est une évaluation :",
    },
    options: {
      en: ["Summative", "Certifying", "Formative", "Predictive"],
      fr: ["Sommative", "Certificative", "Formative", "Prédictive"],
    },
    answer: 2,
    explain: {
      en: "Formative assessment happens during learning and helps both learners and trainers correct course. Summative assessment happens at the end.",
      fr: "L'évaluation formative a lieu pendant l'apprentissage et aide apprenants et formateurs à corriger le tir. La sommative intervient à la fin.",
    },
  },
  {
    cat: { en: "Learning Objectives", fr: "Objectifs pédagogiques" },
    q: {
      en: "Which learning objective is best written?",
      fr: "Quel objectif pédagogique est le mieux formulé ?",
    },
    options: {
      en: [
        "Understand Moodle",
        "Learn about quizzes",
        "Be familiar with SCORM",
        "Configure a Moodle quiz with two question types",
      ],
      fr: [
        "Comprendre Moodle",
        "S'informer sur les quiz",
        "Être familier avec SCORM",
        "Configurer un quiz Moodle avec deux types de questions",
      ],
    },
    answer: 3,
    explain: {
      en: "A good objective starts with an observable action verb and describes a result you can measure. 'Understand' or 'be familiar with' cannot be observed.",
      fr: "Un bon objectif commence par un verbe d'action observable et décrit un résultat mesurable. « Comprendre » ou « être familier » ne s'observent pas.",
    },
  },
  {
    cat: { en: "Microlearning", fr: "Microlearning" },
    q: {
      en: "What best describes microlearning?",
      fr: "Qu'est-ce qui décrit le mieux le microlearning ?",
    },
    options: {
      en: [
        "Short modules focused on a single objective",
        "A full course split into weekly PDFs",
        "Learning on tiny screens only",
        "Three-hour recorded lectures",
      ],
      fr: [
        "Des modules courts centrés sur un seul objectif",
        "Un cours complet découpé en PDF hebdomadaires",
        "Apprendre uniquement sur de petits écrans",
        "Des cours enregistrés de trois heures",
      ],
    },
    answer: 0,
    explain: {
      en: "Microlearning delivers small, targeted units, usually a few minutes each, which limits cognitive load and fits busy schedules.",
      fr: "Le microlearning propose de petites unités ciblées, souvent de quelques minutes, ce qui limite la charge cognitive et s'adapte aux emplois du temps chargés.",
    },
  },
  {
    cat: { en: "STEM Robotics", fr: "Robotique STEM" },
    q: {
      en: "Which approach fits a robotics workshop best?",
      fr: "Quelle approche convient le mieux à un atelier de robotique ?",
    },
    options: {
      en: [
        "Reading the manual aloud",
        "Memorising component names",
        "Watching a demo only",
        "Project-based learning: build, test, improve",
      ],
      fr: [
        "Lire le manuel à voix haute",
        "Mémoriser le nom des composants",
        "Regarder une démonstration uniquement",
        "Apprentissage par projet : construire, tester, améliorer",
      ],
    },
    answer: 3,
    explain: {
      en: "Learners retain more when they build and iterate. Failed tests become part of the learning, not a penalty.",
      fr: "Les apprenants retiennent mieux en construisant et en itérant. Un test raté fait partie de l'apprentissage, ce n'est pas une sanction.",
    },
  },
  {
    cat: { en: "Gamification", fr: "Gamification" },
    q: {
      en: "Which Moodle tool rewards learners with visual achievements?",
      fr: "Quel outil Moodle récompense les apprenants avec des distinctions visuelles ?",
    },
    options: {
      en: ["Badges", "Groupings", "Roles", "Plagiarism plugin"],
      fr: ["Badges", "Groupements", "Rôles", "Plugin anti-plagiat"],
    },
    answer: 0,
    explain: {
      en: "Badges recognise milestones and skills. They work best when tied to real learning goals, not just to clicking through content.",
      fr: "Les badges valorisent des étapes et des compétences. Ils sont plus efficaces lorsqu'ils sont liés à de vrais objectifs d'apprentissage, pas seulement à des clics.",
    },
  },
];

const TOTAL_QUESTIONS = 8;
const TIME_PER_QUESTION = 20;
const POINTS_BASE = 100;
const POINTS_PER_SECOND = 3;

const SKILLS = [
  "Moodle LMS",
  "SCORM",
  "Instructional Design",
  "ADDIE",
  "Microlearning",
  "STEM Robotics",
  "Gamification",
  "AI Chatbots",
  "Web Technologies",
  "H5P",
  "Content Creation",
];

/* =========================================================
   HELPERS
========================================================= */

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const GRADIENT_TEXT = "linear-gradient(135deg, #00FFFF 0%, #0055FF 50%, #7B00FF 100%)";
const GRADIENT_BTN = "linear-gradient(135deg, #0055FF, #7B00FF)";

/* =========================================================
   COMPONENT
========================================================= */

export default function HeroGameSection() {
  const { lang } = useLang();
  const l = lang === "en" ? "en" : "fr";

  /* ---------------- HERO STATE ---------------- */

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedRole, setDisplayedRole] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [orbitRadius, setOrbitRadius] = useState(170);

  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  /* ---------------- QUIZ STATE ---------------- */

  const [status, setStatus] = useState<Status>("intro");
  const [deck, setDeck] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gain, setGain] = useState<number | null>(null);
  const [history, setHistory] = useState<boolean[]>([]);

  const current = deck[index];
  const answered = selected !== null;
  const maxScore = TOTAL_QUESTIONS * (POINTS_BASE + TIME_PER_QUESTION * POINTS_PER_SECOND);

  const cvFile =
    lang === "en"
      ? "/cv/CV_EZZAHI_YASSINE_Digital_Learning_EN.pdf"
      : "/cv/CV_EZZAHI_YASSINE_Digital_Learning_FR.pdf";

  /* =========================================================
     HERO EFFECTS
  ========================================================= */

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
      timeout = setTimeout(() => {
        setDisplayedRole(currentRole.slice(0, displayedRole.length + 1));
      }, 80);
    } else if (!isDeleting && displayedRole.length === currentRole.length) {
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

  // Mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Responsive orbit
  useEffect(() => {
    const update = () => setOrbitRadius(window.innerWidth < 640 ? 140 : 215);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Auto-open video once per session
  useEffect(() => {
    try {
      if (!sessionStorage.getItem("introSeen")) setShowVideo(true);
    } catch {
      setShowVideo(true);
    }
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

  /* =========================================================
     QUIZ EFFECTS
  ========================================================= */

  // Best score (local)
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem("quizBestScore") || 0);
      if (saved) setBestScore(saved);
    } catch {}
  }, []);

  // Timer
  useEffect(() => {
    if (status !== "playing" || answered) return;

    if (timeLeft <= 0) {
      setSelected(-1);
      setStreak(0);
      setGain(null);
      setHistory((h) => [...h, false]);
      return;
    }

    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [status, answered, timeLeft]);

  // Keyboard: A-D / 1-4 to answer, Enter to continue
  useEffect(() => {
    if (status !== "playing" || showVideo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && answered) {
        e.preventDefault();
        next();
        return;
      }
      if (answered || !current) return;
      const map: Record<string, number> = {
        a: 0, b: 1, c: 2, d: 3, "1": 0, "2": 1, "3": 2, "4": 3,
      };
      const i = map[e.key.toLowerCase()];
      if (i !== undefined && i < current.options[l].length) choose(i);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, answered, current, index, timeLeft, showVideo]);

  /* =========================================================
     QUIZ ACTIONS
  ========================================================= */

  const startGame = () => {
    setDeck(shuffle(QUESTIONS).slice(0, TOTAL_QUESTIONS));
    setIndex(0);
    setSelected(null);
    setTimeLeft(TIME_PER_QUESTION);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setBestStreak(0);
    setGain(null);
    setHistory([]);
    setStatus("playing");
  };

  const choose = (i: number) => {
    if (answered || !current) return;
    setSelected(i);

    if (i === current.answer) {
      const points = POINTS_BASE + timeLeft * POINTS_PER_SECOND;
      const nextStreak = streak + 1;
      setScore((s) => s + points);
      setGain(points);
      setCorrectCount((c) => c + 1);
      setStreak(nextStreak);
      setBestStreak((b) => Math.max(b, nextStreak));
      setHistory((h) => [...h, true]);
    } else {
      setStreak(0);
      setGain(null);
      setHistory((h) => [...h, false]);
    }
  };

  const finish = () => {
    setStatus("result");
    try {
      if (score > bestScore) {
        setBestScore(score);
        localStorage.setItem("quizBestScore", String(score));
      }
    } catch {}
  };

  const next = () => {
    if (index + 1 >= deck.length) {
      finish();
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setGain(null);
    setTimeLeft(TIME_PER_QUESTION);
  };

  /* =========================================================
     DERIVED
  ========================================================= */

  const percent = deck.length ? Math.round((correctCount / deck.length) * 100) : 0;

  const level =
    percent >= 90
      ? { en: "Learning Architect", fr: "Architecte pédagogique", emoji: "🏆" }
      : percent >= 70
      ? { en: "Advanced Designer", fr: "Concepteur avancé", emoji: "🚀" }
      : percent >= 50
      ? { en: "Rising Facilitator", fr: "Facilitateur en progression", emoji: "⚡" }
      : { en: "Curious Learner", fr: "Apprenant curieux", emoji: "🌱" };

  const confetti = useMemo(
    () =>
      status === "result" && percent >= 70
        ? Array.from({ length: 34 }, (_, i) => ({
            left: Math.random() * 100,
            delay: Math.random() * 1.2,
            dur: 2.4 + Math.random() * 2,
            size: 6 + Math.random() * 6,
            color: ["#00FFFF", "#0055FF", "#7B00FF", "#22c55e", "#f59e0b"][i % 5],
          }))
        : [],
    [status, percent]
  );

  const t = {
    kicker: l === "en" ? "Learning by playing" : "Apprendre en jouant",
    title: l === "en" ? "Digital Learning Challenge" : "Défi Digital Learning",
    subtitle:
      l === "en"
        ? "A short quiz built like one of my e-learning modules: timed questions, instant feedback and an explanation after every answer."
        : "Un quiz court conçu comme l'un de mes modules e-learning : questions chronométrées, feedback immédiat et explication après chaque réponse.",
    rules: [
      { icon: "📝", label: `${TOTAL_QUESTIONS} questions` },
      {
        icon: "⏱️",
        label: l === "en" ? `${TIME_PER_QUESTION} seconds each` : `${TIME_PER_QUESTION} secondes chacune`,
      },
      {
        icon: "⚡",
        label: l === "en" ? "Faster answers earn more points" : "Plus vous répondez vite, plus vous gagnez",
      },
    ],
    start: l === "en" ? "Start the challenge" : "Commencer le défi",
    best: l === "en" ? "Best score" : "Meilleur score",
    question: "Question",
    score: "Score",
    streak: l === "en" ? "Streak" : "Série",
    correct: l === "en" ? "Correct!" : "Bonne réponse !",
    wrong: l === "en" ? "Not quite." : "Pas tout à fait.",
    timeout: l === "en" ? "Time's up." : "Temps écoulé.",
    nextQ: l === "en" ? "Next question" : "Question suivante",
    seeResult: l === "en" ? "See my result" : "Voir mon résultat",
    finished: l === "en" ? "Challenge complete" : "Défi terminé",
    answersRight: l === "en" ? "correct answers" : "bonnes réponses",
    longest: l === "en" ? "Longest streak" : "Meilleure série",
    replay: l === "en" ? "Play again" : "Rejouer",
    cta: l === "en" ? "Let's build your course together" : "Construisons votre formation ensemble",
    hint: l === "en" ? "Tip: use keys A–D and Enter" : "Astuce : touches A–D et Entrée",
    tryQuiz: l === "en" ? "Try the challenge" : "Tenter le défi",
    newBest: l === "en" ? "New best score!" : "Nouveau record !",
  };

  const timerPercent = (timeLeft / TIME_PER_QUESTION) * 100;
  const timerColor = timeLeft <= 5 ? "#ef4444" : timeLeft <= 10 ? "#f59e0b" : "#00FFFF";
  const isNewBest = status === "result" && score > 0 && score >= bestScore;

  const stats = [
    { value: "Moodle", label: l === "en" ? "LMS expertise" : "Expertise LMS" },
    { value: "SCORM", label: l === "en" ? "Interactive modules" : "Modules interactifs" },
    { value: "STEM", label: l === "en" ? "Robotics training" : "Formation robotique" },
    { value: "AI", label: l === "en" ? "Pedagogical chatbots" : "Chatbots pédagogiques" },
    { value: "Reels", label: l === "en" ? "Educational content" : "Contenu éducatif" },
  ];

  const floatingChips = [
    { label: "Moodle", pos: "top-[8%] -left-2 sm:-left-10", delay: "0s" },
    { label: "SCORM", pos: "top-[38%] -right-2 sm:-right-14", delay: "1.2s" },
    { label: "STEM", pos: "bottom-[30%] -left-2 sm:-left-14", delay: "2.4s" },
  ];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* Animations (auto-suffisant : pas besoin de modifier globals.css) */}
      <style>{`
        @keyframes scanLine { 0% { top: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        @keyframes spinSlow { to { transform: rotate(360deg); } }
        @keyframes blinkDot { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes floatY { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes marquee { to { transform: translateX(-50%); } }
        @keyframes popIn { 0% { opacity: 0; transform: scale(.9) translateY(8px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes gainUp { 0% { opacity: 0; transform: translateY(8px); } 20% { opacity: 1; } 100% { opacity: 0; transform: translateY(-22px); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        @keyframes confettiFall { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(520px) rotate(720deg); opacity: 0; } }
        @keyframes bounceY { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
        .hg-float { animation: floatY 5s ease-in-out infinite; }
        .hg-marquee { animation: marquee 32s linear infinite; }
        .hg-pop { animation: popIn .35s ease-out both; }
        .hg-shake { animation: shake .35s ease-in-out; }
        @media (prefers-reduced-motion: reduce) {
          .hg-float, .hg-marquee, .hg-pop, .hg-shake { animation: none !important; }
        }
      `}</style>

      {/* =====================================================
          HERO
      ===================================================== */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050816]"
      >
        {/* BACKGROUND */}
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
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(0,255,255,0.08), transparent 30%), radial-gradient(circle at 80% 30%, rgba(123,0,255,0.08), transparent 30%), radial-gradient(circle at 50% 80%, rgba(0,85,255,0.08), transparent 35%)",
          }}
        />
        <div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(0,255,255,0.5), transparent)",
            animation: "scanLine 8s linear infinite",
          }}
          aria-hidden="true"
        />

        {/* CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-24 pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* ---------- LEFT ---------- */}
            <div className="flex flex-col justify-center order-2 lg:order-1">
              {/* AVAILABLE BADGE */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-8 w-fit backdrop-blur-xl border border-cyan-500/20 bg-white/[0.03]">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "#22c55e", boxShadow: "0 0 10px #22c55e" }}
                />
                <span className="text-xs font-medium text-cyan-400 tracking-[0.2em] uppercase">
                  {l === "en" ? "Available for Collaboration" : "Disponible pour Collaboration"}
                </span>
              </div>

              <p className="font-mono text-sm mb-3 text-gray-400">
                {l === "en" ? "Hello World — I'm" : "Bonjour le monde — Je suis"}
              </p>

              {/* TITLE */}
              <h1 className="text-[clamp(3rem,8vw,6rem)] font-black leading-[0.9] tracking-tight mb-6">
                <span
                  className="block"
                  style={{
                    background: GRADIENT_TEXT,
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
                  style={{ color: "#00FFFF", textShadow: "0 0 15px rgba(0,255,255,0.6)" }}
                >
                  {displayedRole}
                  <span
                    className="inline-block w-[2px] h-6 ml-1 align-middle"
                    style={{ background: "#00FFFF", animation: "blinkDot 1s ease-in-out infinite" }}
                  />
                </span>
              </div>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-5 max-w-xl">
                {l === "en"
                  ? "Digital Learning Engineer specialized in Moodle LMS, instructional engineering, immersive learning experiences, educational technologies, STEM robotics, and modern web ecosystems."
                  : "Ingénieur Digital Learning spécialisé en Moodle LMS, ingénierie pédagogique, expériences d’apprentissage immersives, technologies éducatives, robotique STEM et écosystèmes web modernes."}
              </p>

              <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-lg opacity-90">
                {l === "en"
                  ? "Currently leading the digitalization of online training programs, AI pedagogical chatbot integration, interactive SCORM modules, and educational innovation projects. I also create educational and tech content on Instagram."
                  : "Actuellement en charge de la digitalisation de formations en ligne, de l’intégration de chatbots pédagogiques IA, de modules SCORM interactifs et de projets d’innovation éducative. Je crée aussi du contenu éducatif et tech sur Instagram."}
              </p>

              {/* CTA */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => scrollToSection("projects")}
                  className="relative group px-8 py-4 rounded-2xl font-semibold text-sm tracking-wide overflow-hidden transition-all duration-300 hover:scale-105"
                  style={{ background: GRADIENT_BTN, boxShadow: "0 0 30px rgba(0,85,255,0.45)" }}
                >
                  <span className="relative z-10 text-white flex items-center gap-2">
                    {l === "en" ? "Explore Projects" : "Explorer les Projets"}
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>

                <a
                  href={cvFile}
                  download
                  className="group px-8 py-4 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-300 flex items-center gap-2 border border-cyan-400/20 bg-white/5 backdrop-blur-xl hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(0,255,255,0.3)]"
                  style={{ color: "#00FFFF" }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  {l === "en" ? "Download CV" : "Télécharger CV"}
                </a>
              </div>

              {/* INSTAGRAM CREATOR */}
              <a
                href="https://instagram.com/m.ezzahi_yassine"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-fit items-center gap-3 rounded-2xl border border-purple-400/30 bg-purple-500/10 px-5 py-3 text-sm text-purple-200 backdrop-blur-xl transition-all duration-300 hover:border-purple-300 hover:shadow-[0_0_25px_rgba(123,0,255,0.35)]"
              >
                <span aria-hidden="true">📱</span>
                <span>
                  {l === "en" ? "Content creator on Instagram" : "Créateur de contenu sur Instagram"}
                  <span className="ml-2 font-mono font-semibold text-white">@m.ezzahi_yassine</span>
                </span>
              </a>

              {/* SOCIAL */}
              <div className="flex items-center gap-4 mt-6">
                <a
                  href="https://linkedin.com/in/ezzahi-yassine-212820354"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-2xl border border-cyan-500/20 bg-[#0B1023]/80 backdrop-blur-xl flex items-center justify-center text-cyan-400 hover:scale-110 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all duration-300"
                  aria-label="LinkedIn profile"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.48 1s2.5 1.12 2.5 2.5zM.5 8h4V24h-4V8zm7 0h3.8v2.2h.1c.5-.9 1.8-2.2 3.8-2.2 4.1 0 4.8 2.7 4.8 6.3V24h-4v-7.1c0-1.7 0-3.9-2.4-3.9s-2.8 1.8-2.8 3.8V24h-4V8z" />
                  </svg>
                </a>

                <a
                  href="https://instagram.com/m.ezzahi_yassine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-2xl border border-cyan-500/20 bg-[#0B1023]/80 backdrop-blur-xl flex items-center justify-center text-cyan-400 hover:scale-110 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all duration-300"
                  aria-label="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>

                <a
                  href="mailto:yassinesama412@gmail.com"
                  className="w-14 h-14 rounded-2xl border border-cyan-500/20 bg-[#0B1023]/80 backdrop-blur-xl flex items-center justify-center text-cyan-400 hover:scale-110 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all duration-300"
                  aria-label="Email"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  </svg>
                </a>

                <a
                  href="tel:+212713385551"
                  className="w-14 h-14 rounded-2xl border border-cyan-500/20 bg-[#0B1023]/80 backdrop-blur-xl flex items-center justify-center text-cyan-400 hover:scale-110 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all duration-300"
                  aria-label="Phone"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h2.5a1 1 0 01.95.68l1.2 3.6a1 1 0 01-.27 1.05l-1.6 1.6a16 16 0 006.6 6.6l1.6-1.6a1 1 0 011.05-.27l3.6 1.2a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* ---------- RIGHT : PHOTO + VIDEO ---------- */}
            <div ref={photoRef} className="flex justify-center items-center order-1 lg:order-2 relative py-10">
              {/* GLOW */}
              <div
                className="absolute w-[520px] h-[520px] max-w-full rounded-full blur-[120px] opacity-30"
                style={{
                  background:
                    "radial-gradient(circle, rgba(0,255,255,0.35), rgba(123,0,255,0.15), transparent 70%)",
                }}
              />

              {/* RINGS */}
              <div
                className="absolute w-[430px] h-[430px] max-w-[95vw] rounded-full border border-cyan-400/20"
                style={{ animation: "spinSlow 25s linear infinite" }}
              />
              <div
                className="absolute w-[360px] h-[360px] max-w-[85vw] rounded-full border border-dashed border-blue-500/20"
                style={{ animation: "spinSlow 18s linear infinite reverse" }}
              />

              {/* ORBIT DOTS (conteneur qui tourne + point décalé) */}
              {[0, 90, 180, 270].map((deg, i) => (
                <div
                  key={i}
                  className="absolute w-0 h-0"
                  style={{
                    transform: `rotate(${deg}deg)`,
                  }}
                >
                  <div
                    className="w-0 h-0"
                    style={{ animation: `spinSlow ${14 + i * 3}s linear infinite` }}
                  >
                    <div
                      className="absolute w-3 h-3 -mt-1.5 -ml-1.5 rounded-full"
                      style={{
                        background: i % 2 === 0 ? "#00FFFF" : "#7B00FF",
                        boxShadow:
                          i % 2 === 0
                            ? "0 0 20px rgba(0,255,255,1)"
                            : "0 0 20px rgba(123,0,255,1)",
                        transform: `translateX(${orbitRadius}px)`,
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* PHOTO */}
              <div
                className="relative z-10 overflow-visible rounded-[32px]"
                style={{
                  width: "clamp(280px, 34vw, 420px)",
                  height: "clamp(360px, 48vw, 560px)",
                }}
              >
                <div
                  className="relative overflow-hidden rounded-[32px] w-full h-full"
                  style={{
                    border: "1px solid rgba(0,255,255,0.2)",
                    background: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 0 50px rgba(0,255,255,0.15), 0 0 120px rgba(0,85,255,0.1)",
                    transform: `perspective(1000px) rotateY(${mousePos.x * 8}deg) rotateX(${-mousePos.y * 6}deg)`,
                    transition: "transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)",
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
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(5,8,22,0.8) 0%, transparent 45%, rgba(0,255,255,0.05) 100%)",
                    }}
                  />
                  <div
                    className="absolute inset-0 rounded-[32px]"
                    style={{
                      boxShadow: "inset 0 0 40px rgba(0,255,255,0.08), inset 0 0 80px rgba(0,85,255,0.08)",
                    }}
                  />
                </div>

                {/* FLOATING CHIPS */}
                {floatingChips.map((c) => (
                  <div
                    key={c.label}
                    className={`hg-float absolute z-20 ${c.pos} px-3 py-1.5 rounded-full border border-cyan-400/30 bg-[#0B1023]/85 backdrop-blur-xl text-xs font-semibold text-cyan-300 shadow-[0_0_20px_rgba(0,255,255,0.2)]`}
                    style={{ animationDelay: c.delay }}
                  >
                    {c.label}
                  </div>
                ))}

                {/* VIDEO PREVIEW */}
                <button
                  type="button"
                  onClick={() => setShowVideo(true)}
                  className="absolute -bottom-7 -right-2 sm:-right-7 z-30 w-[200px] h-[120px] sm:w-[260px] sm:h-[150px] rounded-2xl overflow-hidden border border-cyan-400/40 bg-[#0B1023]/95 backdrop-blur-xl shadow-[0_0_30px_rgba(0,255,255,0.25)] group hover:scale-105 hover:border-cyan-400 transition-all duration-300"
                  aria-label={l === "en" ? "Watch my introduction" : "Voir ma présentation"}
                >
                  <video
                    src="/videos/presentation-yassine.mp4"
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/45 group-hover:bg-black/20 transition-all" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,255,255,0.5)]">
                      <svg className="w-5 h-5 ml-1 text-cyan-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="mt-2 text-[10px] font-semibold text-white tracking-wider uppercase">
                      {l === "en" ? "My Introduction" : "Ma présentation"}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* STATS STRIP */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-5 gap-3">
            {stats.map((s) => (
              <div
                key={s.value}
                className="rounded-2xl border border-cyan-500/15 bg-white/[0.03] backdrop-blur-xl px-5 py-4 text-center transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(0,255,255,0.15)]"
              >
                <p
                  className="text-xl sm:text-2xl font-black"
                  style={{
                    background: GRADIENT_TEXT,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {s.value}
                </p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SCROLL → QUIZ */}
        <button
          type="button"
          onClick={() => scrollToSection("game")}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-gray-400 hover:text-cyan-300 transition-colors"
          aria-label={t.tryQuiz}
        >
          <span className="text-xs tracking-widest uppercase">{t.tryQuiz}</span>
          <span style={{ animation: "bounceY 1.6s ease-in-out infinite" }} aria-hidden="true">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
      </section>

      {/* =====================================================
          SKILLS MARQUEE (transition hero → quiz)
      ===================================================== */}
      <div
        className="relative overflow-hidden border-y border-cyan-500/15 bg-[#070B1E] py-4"
        aria-hidden="true"
      >
        <div className="hg-marquee flex w-max gap-10 whitespace-nowrap">
          {[...SKILLS, ...SKILLS].map((s, i) => (
            <span key={i} className="flex items-center gap-10 font-mono text-sm text-gray-400">
              {s}
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
            </span>
          ))}
        </div>
      </div>

      {/* =====================================================
          QUIZ
      ===================================================== */}
      <section id="game" className="relative overflow-hidden bg-[#050816] py-24 sm:py-32">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,255,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.2) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 15% 25%, rgba(0,255,255,0.08), transparent 35%), radial-gradient(circle at 85% 70%, rgba(123,0,255,0.10), transparent 35%)",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
          {/* HEADER */}
          <div className="text-center mb-12">
            <p className="font-mono text-sm text-cyan-400 mb-3">{t.kicker}</p>
            <h2
              className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-tight tracking-tight"
              style={{
                background: GRADIENT_TEXT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t.title}
            </h2>
          </div>

          {/* CARD */}
          <div
            className="relative rounded-[28px] border border-cyan-400/20 bg-white/[0.03] backdrop-blur-xl overflow-hidden"
            style={{ boxShadow: "0 0 50px rgba(0,255,255,0.10), 0 0 120px rgba(0,85,255,0.08)" }}
          >
            {/* WINDOW BAR */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#0B1023]/70">
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
              </div>
              <span className="font-mono text-xs text-gray-500">learning-challenge.scorm</span>
              <span className="font-mono text-xs text-cyan-400/80">
                {bestScore > 0 ? `★ ${bestScore}` : "★ 0"}
              </span>
            </div>

            <div className="p-5 sm:p-8">
              {/* ================= INTRO ================= */}
              {status === "intro" && (
                <div className="text-center hg-pop">
                  <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8">
                    {t.subtitle}
                  </p>

                  <ul className="flex flex-wrap justify-center gap-3 mb-10">
                    {t.rules.map((r) => (
                      <li
                        key={r.label}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-[#0B1023]/80 text-sm text-cyan-300"
                      >
                        <span aria-hidden="true">{r.icon}</span>
                        {r.label}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={startGame}
                    className="px-8 py-4 rounded-2xl font-semibold text-sm tracking-wide text-white transition-all duration-300 hover:scale-105"
                    style={{ background: GRADIENT_BTN, boxShadow: "0 0 30px rgba(0,85,255,0.45)" }}
                  >
                    {t.start}
                  </button>

                  <p className="mt-5 text-xs text-gray-500">{t.hint}</p>

                  {bestScore > 0 && (
                    <p className="mt-4 text-sm text-gray-400">
                      {t.best} : <span className="text-cyan-400 font-semibold">{bestScore}</span>
                    </p>
                  )}
                </div>
              )}

              {/* ================= PLAYING ================= */}
              {status === "playing" && current && (
                <div key={index} className="hg-pop">
                  {/* STATS */}
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-400">
                      {t.question}{" "}
                      <span className="text-white font-semibold">
                        {index + 1}/{deck.length}
                      </span>
                    </span>

                    <div className="flex items-center gap-5">
                      <span className="text-gray-400">
                        {t.streak} <span className="text-white font-semibold">{streak}🔥</span>
                      </span>
                      <span className="relative text-gray-400">
                        {t.score} <span className="text-cyan-400 font-semibold">{score}</span>
                        {gain !== null && (
                          <span
                            className="absolute -top-1 right-0 text-xs font-bold text-green-400 pointer-events-none"
                            style={{ animation: "gainUp 1.2s ease-out forwards" }}
                          >
                            +{gain}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* PROGRESS (une pastille par question) */}
                  <div
                    className="flex gap-1.5 mb-3"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={deck.length}
                    aria-valuenow={index + 1}
                  >
                    {deck.map((_, i) => {
                      const done = i < history.length;
                      const ok = history[i];
                      return (
                        <div
                          key={i}
                          className="h-1.5 flex-1 rounded-full transition-all duration-500"
                          style={{
                            background: done
                              ? ok
                                ? "#4ade80"
                                : "#f87171"
                              : i === index
                              ? "linear-gradient(90deg, #0055FF, #7B00FF)"
                              : "rgba(255,255,255,0.1)",
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* TIMER */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-linear"
                        style={{ width: `${timerPercent}%`, background: timerColor }}
                      />
                    </div>
                    <span
                      className="font-mono text-sm w-10 text-right"
                      style={{ color: timerColor }}
                      aria-live="off"
                    >
                      {timeLeft}s
                    </span>
                  </div>

                  {/* CATEGORY + QUESTION */}
                  <p className="inline-block px-3 py-1 rounded-full border border-purple-400/30 bg-purple-500/10 text-xs font-medium text-purple-300 mb-3">
                    {current.cat[l]}
                  </p>

                  <h3 className="text-white text-xl sm:text-2xl font-bold leading-snug mb-6">
                    {current.q[l]}
                  </h3>

                  {/* OPTIONS */}
                  <div className="grid gap-3">
                    {current.options[l].map((opt, i) => {
                      const isRight = i === current.answer;
                      const isPicked = i === selected;

                      let style =
                        "border-cyan-500/20 bg-[#0B1023]/80 text-gray-200 hover:border-cyan-400 hover:translate-x-1 hover:shadow-[0_0_20px_rgba(0,255,255,0.25)]";

                      if (answered) {
                        if (isRight) style = "border-green-400 bg-green-500/15 text-green-200";
                        else if (isPicked) style = "border-red-400 bg-red-500/15 text-red-200 hg-shake";
                        else style = "border-white/10 bg-white/[0.02] text-gray-500";
                      }

                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={answered}
                          onClick={() => choose(i)}
                          className={`w-full text-left px-5 py-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 flex items-center gap-4 disabled:cursor-default ${style}`}
                        >
                          <span className="w-8 h-8 shrink-0 rounded-full border border-current flex items-center justify-center text-xs font-semibold">
                            {answered && isRight ? "✓" : answered && isPicked ? "✕" : String.fromCharCode(65 + i)}
                          </span>
                          <span className="text-sm sm:text-base">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* FEEDBACK */}
                  {answered && (
                    <div
                      className="hg-pop mt-6 rounded-2xl border p-5"
                      style={{
                        borderColor:
                          selected === current.answer ? "rgba(74,222,128,0.4)" : "rgba(248,113,113,0.4)",
                        background:
                          selected === current.answer ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                      }}
                      role="status"
                    >
                      <p
                        className="font-semibold mb-1"
                        style={{ color: selected === current.answer ? "#4ade80" : "#f87171" }}
                      >
                        {selected === current.answer ? t.correct : selected === -1 ? t.timeout : t.wrong}
                      </p>
                      <p className="text-gray-300 text-sm leading-relaxed">{current.explain[l]}</p>
                    </div>
                  )}

                  {answered && (
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={next}
                        className="px-7 py-3 rounded-2xl font-semibold text-sm text-white transition-all duration-300 hover:scale-105"
                        style={{ background: GRADIENT_BTN, boxShadow: "0 0 25px rgba(0,85,255,0.4)" }}
                      >
                        {index + 1 >= deck.length ? t.seeResult : t.nextQ}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ================= RESULT ================= */}
              {status === "result" && (
                <div className="relative text-center hg-pop">
                  {/* CONFETTI */}
                  {confetti.length > 0 && (
                    <div className="absolute inset-x-0 -top-8 h-0 pointer-events-none" aria-hidden="true">
                      {confetti.map((c, i) => (
                        <span
                          key={i}
                          className="absolute rounded-sm"
                          style={{
                            left: `${c.left}%`,
                            width: c.size,
                            height: c.size * 0.6,
                            background: c.color,
                            animation: `confettiFall ${c.dur}s ${c.delay}s ease-in forwards`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <p className="text-5xl mb-4" aria-hidden="true">
                    {level.emoji}
                  </p>

                  <p className="font-mono text-sm text-gray-400 mb-2">{t.finished}</p>

                  <h3
                    className="text-3xl sm:text-4xl font-black mb-6"
                    style={{
                      background: "linear-gradient(135deg, #00FFFF, #7B00FF)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {level[l]}
                  </h3>

                  {isNewBest && (
                    <p className="inline-block mb-6 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-xs font-semibold text-amber-300">
                      ★ {t.newBest}
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-6">
                    <div className="rounded-2xl border border-cyan-500/20 bg-[#0B1023]/80 p-4">
                      <p className="text-2xl font-bold text-cyan-400">{score}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {t.score} / {maxScore}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-cyan-500/20 bg-[#0B1023]/80 p-4">
                      <p className="text-2xl font-bold text-white">
                        {correctCount}/{deck.length}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{t.answersRight}</p>
                    </div>
                    <div className="rounded-2xl border border-cyan-500/20 bg-[#0B1023]/80 p-4">
                      <p className="text-2xl font-bold text-white">{bestStreak}🔥</p>
                      <p className="text-xs text-gray-400 mt-1">{t.longest}</p>
                    </div>
                  </div>

                  {/* RECAP PASTILLES */}
                  <div className="flex justify-center gap-1.5 mb-8" aria-hidden="true">
                    {history.map((ok, i) => (
                      <span
                        key={i}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
                        style={{
                          background: ok ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)",
                          color: ok ? "#4ade80" : "#f87171",
                          border: `1px solid ${ok ? "rgba(74,222,128,0.4)" : "rgba(248,113,113,0.4)"}`,
                        }}
                      >
                        {ok ? "✓" : "✕"}
                      </span>
                    ))}
                  </div>

                  {bestScore > 0 && (
                    <p className="mb-8 text-sm text-gray-400">
                      {t.best} : <span className="text-cyan-400 font-semibold">{bestScore}</span>
                    </p>
                  )}

                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      type="button"
                      onClick={startGame}
                      className="px-8 py-4 rounded-2xl font-semibold text-sm text-white transition-all duration-300 hover:scale-105"
                      style={{ background: GRADIENT_BTN, boxShadow: "0 0 30px rgba(0,85,255,0.45)" }}
                    >
                      {t.replay}
                    </button>

                    <button
                      type="button"
                      onClick={() => scrollToSection("contact")}
                      className="px-8 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 border border-cyan-400/20 bg-white/5 backdrop-blur-xl hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(0,255,255,0.3)]"
                      style={{ color: "#00FFFF" }}
                    >
                      {t.cta}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          VIDEO MODAL
      ===================================================== */}
      {showVideo && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-6"
          onClick={closeVideo}
        >
          <div
            className="relative w-[96vw] max-w-6xl rounded-3xl overflow-hidden border border-cyan-400/30 bg-[#050816] shadow-[0_0_100px_rgba(0,255,255,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeVideo}
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