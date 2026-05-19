"use client";

import emailjs from "@emailjs/browser";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";

export default function ContactSection() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // 🚀 EMAILJS FUNCTIONAL
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    emailjs
      .send(
        "service_k4hmo29",   // 🔴 SERVICE ID
        "template_q0s94np",  // 🔴 TEMPLATE ID
        {
          name: formState.name,
          email: formState.email,
          subject: formState.subject,
          message: formState.message,
        },
        "lsoacLyOyPPtenb3S" // 🔴 PUBLIC KEY
      )
      .then(() => {
        setSubmitted(true);

        setFormState({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      })
      .catch((error) => {
        console.log("EmailJS error:", error);
      });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section
      id="contact"
      className="section-padding relative z-10"
      ref={sectionRef}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-medium text-accent tracking-widest uppercase block mb-3">
            — Let&apos;s Connect —
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground">
            {t("contact_title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* INFO SECTION (UNCHANGED) */}
          <div
            className="lg:col-span-2 space-y-6"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-30px)",
              transition:
                "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s",
            }}
          >
            {/* ton code info reste identique */}
          </div>

          {/* FORM */}
          <div className="lg:col-span-3">
            <div className="glass-card neon-border rounded-2xl p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-3xl mb-4">✅</div>
                  <h3 className="text-xl font-bold">Message Sent!</h3>
                  <p className="text-muted-foreground text-sm">
                    Thank you for reaching out.
                  </p>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-xs text-accent border-b"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <InputField
                      label={t("contact_name")}
                      name="name"
                      type="text"
                      value={formState.name}
                      onChange={handleChange}
                      required
                    />
                    <InputField
                      label={t("contact_email")}
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <InputField
                    label={t("contact_subject")}
                    name="subject"
                    type="text"
                    value={formState.subject}
                    onChange={handleChange}
                    required
                  />

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                      {t("contact_message")}
                    </label>

                    <textarea
                      name="message"
                      rows={5}
                      value={formState.message}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl px-4 py-3 text-sm text-foreground outline-none resize-none"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(0,255,255,0.15)",
                      }}
                      placeholder={t("contact_message")}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl font-bold text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #0055FF, #7B00FF)",
                      boxShadow: "0 0 20px rgba(0,85,255,0.3)",
                    }}
                  >
                    {t("contact_send")} →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* INPUT COMPONENT (UNCHANGED DESIGN) */
function InputField({
  label,
  name,
  type,
  value,
  onChange,
  required,
}: {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl px-4 py-3 text-sm text-foreground outline-none"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(0,255,255,0.15)",
        }}
      />
    </div>
  );
}