"use client";

import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { robotSpin, robotWave } from "@/lib/robotBus";

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
   COMPONENT — interactive Digital Learning quiz
========================================================= */

export default function QuizSection() {
  const { lang } = useLang();
  const l = lang === "en" ? "en" : "fr";

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

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
    if (status !== "playing") return;
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
  }, [status, answered, current, index, timeLeft]);

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
      robotSpin();
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
    robotWave();
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

  return (
    <>
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
          SKILLS MARQUEE (transition hero → quiz)
      ===================================================== */}
      <div
        className="relative overflow-hidden border-y border-cyan-500/15 bg-[#070B1E]/70 backdrop-blur-md py-4"
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
      <section id="game" className="relative overflow-hidden py-24 sm:py-32">
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
          <div className="relative text-center mb-12">
            <div data-robot-slot="game" data-side="left" aria-hidden="true" className="robot-slot hidden xl:block absolute -left-64 top-1/2 -translate-y-1/2 w-44 h-44" />
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
    </>
  );
}
