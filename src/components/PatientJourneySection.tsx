"use client";

import React, { useState, useEffect, useRef } from "react";

export interface JourneyStep {
  id?: string;
  stepNumber: string;
  title: string;
  desc: string;
  badge?: string;
  icon?: string;
}

export interface PatientJourneyData {
  label?: string;
  title?: string;
  subtitle?: string;
  steps?: JourneyStep[];
}

interface Props {
  data?: PatientJourneyData;
}

const defaultSteps: JourneyStep[] = [
  {
    id: "step-1",
    stepNumber: "01",
    title: "Consultation",
    desc: "Detailed discussion of your symptoms, clinical history, and initial ENT examination.",
    badge: "Clinical Assessment",
    icon: "stethoscope"
  },
  {
    id: "step-2",
    stepNumber: "02",
    title: "Diagnosis",
    desc: "Advanced endoscopic, microscopic, and audiometric diagnostic evaluations.",
    badge: "High-Definition Imaging",
    icon: "microscope"
  },
  {
    id: "step-3",
    stepNumber: "03",
    title: "Treatment Plan",
    desc: "Customised medical therapy or precision surgical intervention strategy.",
    badge: "Personalised Care",
    icon: "clipboard"
  },
  {
    id: "step-4",
    stepNumber: "04",
    title: "Follow-up Care",
    desc: "Post-treatment monitoring, healing verification, and long-term recovery support.",
    badge: "Continuous Support",
    icon: "shield"
  }
];

function renderStepIcon(type?: string) {
  switch (type) {
    case "microscope":
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 18h8" />
          <path d="M3 22h18" />
          <path d="M14 22a7 7 0 1 0 0-14h-1" />
          <path d="M9 14h2" />
          <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
          <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
        </svg>
      );
    case "clipboard":
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M12 11h4" />
          <path d="M12 16h4" />
          <path d="M8 11h.01" />
          <path d="M8 16h.01" />
        </svg>
      );
    case "shield":
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "stethoscope":
    default:
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
          <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
          <circle cx="20" cy="10" r="2" />
        </svg>
      );
  }
}

export default function PatientJourneySection({ data }: Props) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const label = data?.label || "THE PROCESS";
  const title = data?.title || "Your Patient Journey";
  const subtitle =
    data?.subtitle ||
    "A structured four-step clinical pathway ensuring precise diagnosis, personalised care, and lasting recovery.";
  const steps = data?.steps && data.steps.length > 0 ? data.steps : defaultSteps;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="patient-journey"
      aria-label="Patient Journey Timeline"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #fbfaf8 100%)",
        padding: "6rem 2rem",
        borderBottom: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative ambient subtle background circles */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          left: "5%",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,162,74,0.06), transparent 70%)",
          pointerEvents: "none"
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          right: "5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(18,54,83,0.04), transparent 70%)",
          pointerEvents: "none"
        }}
      />

      <div style={{ maxWidth: "1240px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        {/* Section Header */}
        <div
          style={{
            textAlign: "center",
            maxWidth: "760px",
            margin: "0 auto 4rem",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease"
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "var(--gold)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "0.75rem"
            }}
          >
            <span style={{ display: "inline-block", width: "24px", height: "1.5px", background: "var(--gold)" }} />
            {label}
            <span style={{ display: "inline-block", width: "24px", height: "1.5px", background: "var(--gold)" }} />
          </div>

          <h2
            style={{
              fontFamily: "var(--serif), Georgia, serif",
              fontSize: "clamp(28px, 3.6vw, 42px)",
              color: "var(--navy)",
              lineHeight: 1.2,
              marginBottom: "1rem"
            }}
          >
            {title}
          </h2>

          <p
            style={{
              fontSize: "15.5px",
              color: "var(--muted)",
              lineHeight: 1.7,
              margin: "0 auto"
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* ========================================================
            DESKTOP TIMELINE (Shown on > 860px)
           ======================================================== */}
        <div className="pj-desktop-wrap" style={{ position: "relative" }}>
          {/* Continuous Gold Connecting Line */}
          <div
            style={{
              position: "absolute",
              top: "42px",
              left: "12.5%",
              right: "12.5%",
              height: "3px",
              background: "rgba(18,54,83,0.1)",
              zIndex: 1
            }}
          >
            <div
              style={{
                height: "100%",
                width: isVisible ? "100%" : "0%",
                background: "linear-gradient(90deg, #C9A24A 0%, #d4b06a 50%, #C9A24A 100%)",
                boxShadow: "0 0 10px rgba(201,162,74,0.4)",
                transition: "width 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s"
              }}
            />
          </div>

          {/* 4 Connected Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "24px",
              position: "relative",
              zIndex: 2
            }}
          >
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={step.id || idx}
                  onClick={() => setActiveStep(idx)}
                  onMouseEnter={() => setActiveStep(idx)}
                  className={`pj-card ${isActive ? "pj-active" : ""}`}
                  style={{
                    background: "#ffffff",
                    borderRadius: "18px",
                    padding: "32px 24px 28px",
                    border: isActive
                      ? "1.5px solid #C9A24A"
                      : "1px solid rgba(18,54,83,0.09)",
                    boxShadow: isActive
                      ? "0 18px 40px rgba(18,54,83,0.11), 0 0 20px rgba(201,162,74,0.18)"
                      : "0 6px 20px rgba(18,54,83,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    cursor: "pointer",
                    transform: isVisible
                      ? isActive
                        ? "translateY(-8px)"
                        : "translateY(0)"
                      : "translateY(30px)",
                    opacity: isVisible ? 1 : 0,
                    transition: `transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease, opacity 0.5s ease ${idx * 120}ms`,
                    position: "relative"
                  }}
                >
                  {/* Step Marker Node (Sitting over the timeline line) */}
                  <div
                    style={{
                      width: "68px",
                      height: "68px",
                      borderRadius: "50%",
                      background: isActive
                        ? "linear-gradient(135deg, #123653 0%, #0d283f 100%)"
                        : "#ffffff",
                      border: isActive ? "2.5px solid #C9A24A" : "2px solid rgba(201,162,74,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isActive ? "#C9A24A" : "var(--navy)",
                      boxShadow: isActive
                        ? "0 8px 20px rgba(201,162,74,0.35)"
                        : "0 4px 12px rgba(18,54,83,0.06)",
                      marginBottom: "20px",
                      transition: "all 0.3s ease",
                      position: "relative"
                    }}
                  >
                    {renderStepIcon(step.icon)}

                    {/* Step Number Mini-Badge */}
                    <span
                      style={{
                        position: "absolute",
                        top: "-6px",
                        right: "-6px",
                        background: isActive ? "#C9A24A" : "var(--navy)",
                        color: isActive ? "var(--navy)" : "#ffffff",
                        fontSize: "10.5px",
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                        letterSpacing: "0.5px"
                      }}
                    >
                      {step.stepNumber}
                    </span>
                  </div>

                  {/* Badge */}
                  {step.badge && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        color: isActive ? "var(--gold)" : "var(--muted)",
                        background: isActive ? "rgba(201,162,74,0.12)" : "rgba(18,54,83,0.04)",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        marginBottom: "12px",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {step.badge}
                    </span>
                  )}

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "var(--serif), Georgia, serif",
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "var(--navy)",
                      marginBottom: "10px",
                      lineHeight: 1.3
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--muted)",
                      lineHeight: 1.65,
                      margin: 0
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            MOBILE & TABLET TIMELINE (Shown on <= 860px)
           ======================================================== */}
        <div className="pj-mobile-wrap" style={{ position: "relative" }}>
          {/* Vertical Connecting Line */}
          <div
            style={{
              position: "absolute",
              top: "28px",
              bottom: "28px",
              left: "28px",
              width: "3px",
              background: "rgba(18,54,83,0.1)",
              zIndex: 1
            }}
          >
            <div
              style={{
                width: "100%",
                height: isVisible ? "100%" : "0%",
                background: "linear-gradient(180deg, #C9A24A 0%, #d4b06a 100%)",
                transition: "height 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s"
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative", zIndex: 2 }}>
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={step.id || idx}
                  onClick={() => setActiveStep(idx)}
                  className={`pj-mobile-card ${isActive ? "pj-active" : ""}`}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "18px",
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "20px 18px",
                    border: isActive
                      ? "1.5px solid #C9A24A"
                      : "1px solid rgba(18,54,83,0.09)",
                    boxShadow: isActive
                      ? "0 12px 28px rgba(18,54,83,0.1), 0 0 16px rgba(201,162,74,0.14)"
                      : "0 4px 14px rgba(18,54,83,0.04)",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                >
                  {/* Step Node */}
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: isActive
                        ? "linear-gradient(135deg, #123653 0%, #0d283f 100%)"
                        : "#ffffff",
                      border: isActive ? "2px solid #C9A24A" : "2px solid rgba(201,162,74,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isActive ? "#C9A24A" : "var(--navy)",
                      boxShadow: isActive ? "0 4px 14px rgba(201,162,74,0.3)" : "none",
                      flexShrink: 0,
                      position: "relative"
                    }}
                  >
                    {renderStepIcon(step.icon)}
                    <span
                      style={{
                        position: "absolute",
                        top: "-4px",
                        right: "-4px",
                        background: isActive ? "#C9A24A" : "var(--navy)",
                        color: isActive ? "var(--navy)" : "#ffffff",
                        fontSize: "9.5px",
                        fontWeight: 700,
                        padding: "1px 5px",
                        borderRadius: "8px"
                      }}
                    >
                      {step.stepNumber}
                    </span>
                  </div>

                  {/* Body */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                      <h3
                        style={{
                          fontFamily: "var(--serif), Georgia, serif",
                          fontSize: "18px",
                          fontWeight: 600,
                          color: "var(--navy)",
                          margin: 0
                        }}
                      >
                        {step.title}
                      </h3>
                      {step.badge && (
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.6px",
                            color: "var(--gold)",
                            background: "rgba(201,162,74,0.1)",
                            padding: "2px 7px",
                            borderRadius: "12px"
                          }}
                        >
                          {step.badge}
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: "13.5px",
                        color: "var(--muted)",
                        lineHeight: 1.6,
                        margin: 0
                      }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .pj-desktop-wrap {
          display: block;
        }
        .pj-mobile-wrap {
          display: none;
        }

        @media (max-width: 860px) {
          .pj-desktop-wrap {
            display: none;
          }
          .pj-mobile-wrap {
            display: block;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pj-card, .pj-mobile-card {
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </section>
  );
}
