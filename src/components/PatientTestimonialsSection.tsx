"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

export interface TestimonialItem {
  id?: string | number;
  stars?: number;
  text: string;
  author: string;
  location?: string;
  condition?: string;
  initials?: string;
}

export interface PatientTestimonialsData {
  label?: string;
  title?: string;
  subtitle?: string;
  autoplay?: boolean;
  autoplayInterval?: number;
  items?: TestimonialItem[];
}

interface Props {
  data?: PatientTestimonialsData | TestimonialItem[];
}

const defaultTestimonials: TestimonialItem[] = [
  {
    id: "1",
    stars: 5,
    text: "Dr. Rattan provided excellent care for my chronic sinus issues. The surgery went smoothly and recovery was much faster than expected.",
    author: "A. Sharma",
    location: "Chandigarh",
    condition: "Chronic Sinus Care",
    initials: "AS"
  },
  {
    id: "2",
    stars: 5,
    text: "Very professional clinic. Dr. Anav was patient, explained the diagnosis clearly, and gave a transparent treatment plan for my vertigo.",
    author: "R. Singh",
    location: "Mohali",
    condition: "Vertigo & Balance Care",
    initials: "RS"
  },
  {
    id: "3",
    stars: 5,
    text: "Got my mother’s hearing aid fitted here. The entire staff is very courteous and the doctors are highly experienced. Highly recommended.",
    author: "S. Gupta",
    location: "Panchkula",
    condition: "Audiology & Hearing Care",
    initials: "SG"
  }
];

export default function PatientTestimonialsSection({ data }: Props) {
  // Normalize data whether passed as an array or object
  const isArray = Array.isArray(data);
  const items: TestimonialItem[] = isArray
    ? (data as TestimonialItem[])
    : (data as PatientTestimonialsData)?.items && (data as PatientTestimonialsData).items!.length > 0
    ? (data as PatientTestimonialsData).items!
    : defaultTestimonials;

  const label = (!isArray && (data as PatientTestimonialsData)?.label) || "PATIENT STORIES";
  const title = (!isArray && (data as PatientTestimonialsData)?.title) || "What Our Patients Say";
  const subtitle =
    (!isArray && (data as PatientTestimonialsData)?.subtitle) ||
    "Genuine feedback from patients who entrusted their ear, nose, throat, and balance care to our specialists.";
  const autoplayEnabled = !isArray ? (data as PatientTestimonialsData)?.autoplay !== false : true;
  const autoplayDelay = (!isArray && (data as PatientTestimonialsData)?.autoplayInterval) || 5500;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = items.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Viewport intersection observer for entry animations
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

  // Autoplay timer
  useEffect(() => {
    if (!autoplayEnabled || isPaused || total <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [autoplayEnabled, isPaused, nextSlide, autoplayDelay, total]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (diff > minSwipeDistance) {
      nextSlide();
    } else if (diff < -minSwipeDistance) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      aria-label="Patient Testimonials"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{
        background: "var(--cream, #F8F7F3)",
        padding: "6rem 2rem",
        borderBottom: "1px solid var(--border, rgba(18,54,83,0.08))",
        position: "relative",
        overflow: "hidden",
        outline: "none"
      }}
    >
      {/* Decorative background ambient glows */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "5%",
          right: "-60px",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,162,74,0.06), transparent 70%)",
          pointerEvents: "none"
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "0%",
          left: "-80px",
          width: "460px",
          height: "460px",
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
            margin: "0 auto 3.5rem",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(22px)",
            transition: "opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "var(--gold, #C9A24A)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "0.75rem"
            }}
          >
            <span style={{ display: "inline-block", width: "24px", height: "1.5px", background: "var(--gold, #C9A24A)" }} />
            {label}
            <span style={{ display: "inline-block", width: "24px", height: "1.5px", background: "var(--gold, #C9A24A)" }} />
          </div>

          <h2
            style={{
              fontFamily: "var(--serif), Georgia, serif",
              fontSize: "clamp(28px, 3.6vw, 42px)",
              color: "var(--navy, #123653)",
              lineHeight: 1.2,
              marginBottom: "1rem"
            }}
          >
            {title}
          </h2>

          <p
            style={{
              fontSize: "15.5px",
              color: "var(--muted, #64748b)",
              lineHeight: 1.7,
              margin: "0 auto"
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* ========================================================
            CAROUSEL STAGE
           ======================================================== */}
        <div
          className="pt-carousel-stage"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            position: "relative",
            minHeight: "340px",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "center"
          }}
        >
          {/* DESKTOP 3-CARD CAROUSEL VIEW (Visible on >= 960px) */}
          <div className="pt-desktop-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", width: "100%" }}>
            {items.map((item, idx) => {
              const isActive = idx === currentIndex;
              const initials =
                item.initials ||
                item.author
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

              return (
                <div
                  key={item.id || idx}
                  onClick={() => goToSlide(idx)}
                  className={`pt-card ${isActive ? "pt-active-card" : "pt-passive-card"}`}
                  style={{
                    background: "#ffffff",
                    borderRadius: "18px",
                    padding: "36px 30px 30px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    border: isActive
                      ? "1.5px solid var(--gold, #C9A24A)"
                      : "1px solid rgba(18,54,83,0.08)",
                    boxShadow: isActive
                      ? "0 20px 45px rgba(18,54,83,0.11), 0 0 24px rgba(201,162,74,0.18)"
                      : "0 8px 24px rgba(18,54,83,0.05)",
                    transform: isVisible
                      ? isActive
                        ? "translateY(-6px) scale(1.02)"
                        : "translateY(0) scale(0.98)"
                      : "translateY(30px)",
                    opacity: isVisible ? (isActive ? 1 : 0.88) : 0,
                    transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                    cursor: "pointer",
                    overflow: "hidden"
                  }}
                >
                  {/* Subtle Gold Top Accent Bar */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: isActive ? "4px" : "2px",
                      background: isActive
                        ? "linear-gradient(90deg, #C9A24A 0%, #dfc384 50%, #C9A24A 100%)"
                        : "transparent",
                      transition: "all 0.3s ease"
                    }}
                  />

                  {/* Elegant Watermark Quotation Mark */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "22px",
                      fontSize: "68px",
                      fontFamily: "Georgia, serif",
                      color: isActive ? "rgba(201,162,74,0.16)" : "rgba(18,54,83,0.05)",
                      lineHeight: 1,
                      pointerEvents: "none",
                      userSelect: "none"
                    }}
                  >
                    “
                  </div>

                  {/* Card Header: 5 Stars + Service Tag */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
                      <div style={{ display: "flex", gap: "3px" }} aria-label={`${item.stars || 5} out of 5 stars`}>
                        {[...Array(item.stars || 5)].map((_, sIdx) => (
                          <svg
                            key={sIdx}
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="#C9A24A"
                            stroke="#C9A24A"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>

                      {item.condition && (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            color: isActive ? "var(--gold, #C9A24A)" : "var(--muted, #64748b)",
                            background: isActive ? "rgba(201,162,74,0.1)" : "rgba(18,54,83,0.04)",
                            padding: "3px 9px",
                            borderRadius: "12px"
                          }}
                        >
                          {item.condition}
                        </span>
                      )}
                    </div>

                    {/* Testimonial Quote */}
                    <p
                      style={{
                        fontFamily: "var(--serif), Georgia, serif",
                        fontSize: "16.5px",
                        lineHeight: 1.7,
                        color: "var(--navy, #123653)",
                        margin: 0,
                        fontStyle: "italic",
                        letterSpacing: "-0.1px"
                      }}
                    >
                      &ldquo;{item.text}&rdquo;
                    </p>
                  </div>

                  {/* Card Footer: Patient Initials Avatar & Verification */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      marginTop: "24px",
                      paddingTop: "18px",
                      borderTop: "1px solid rgba(18,54,83,0.08)"
                    }}
                  >
                    {/* Patient Initials Avatar */}
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: isActive
                          ? "linear-gradient(135deg, #123653 0%, #0d283f 100%)"
                          : "rgba(18,54,83,0.07)",
                        border: isActive ? "2px solid #C9A24A" : "1.5px solid rgba(18,54,83,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isActive ? "#C9A24A" : "var(--navy, #123653)",
                        fontWeight: 700,
                        fontSize: "14px",
                        letterSpacing: "0.5px",
                        flexShrink: 0,
                        boxShadow: isActive ? "0 4px 12px rgba(201,162,74,0.3)" : "none",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {initials}
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: 700,
                          color: "var(--navy, #123653)",
                          lineHeight: 1.2
                        }}
                      >
                        {item.author}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--muted, #64748b)",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          marginTop: "3px"
                        }}
                      >
                        <span style={{ color: "#16a34a", fontWeight: 600 }}>✓ Verified Patient</span>
                        {item.location && <span>· {item.location}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* TABLET & MOBILE SINGLE/FEATURED CARD VIEW (Visible on < 960px) */}
          <div className="pt-mobile-slider" style={{ width: "100%", display: "none" }}>
            {items.map((item, idx) => {
              if (idx !== currentIndex) return null;
              const initials =
                item.initials ||
                item.author
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

              return (
                <div
                  key={item.id || idx}
                  className="pt-card-mobile"
                  style={{
                    background: "#ffffff",
                    borderRadius: "18px",
                    padding: "32px 24px 26px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    border: "1.5px solid var(--gold, #C9A24A)",
                    boxShadow: "0 16px 36px rgba(18,54,83,0.09), 0 0 20px rgba(201,162,74,0.15)",
                    overflow: "hidden",
                    animation: "ptFadeSlideIn 0.35s ease forwards"
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: "linear-gradient(90deg, #C9A24A 0%, #dfc384 50%, #C9A24A 100%)"
                    }}
                  />

                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "20px",
                      fontSize: "64px",
                      fontFamily: "Georgia, serif",
                      color: "rgba(201,162,74,0.18)",
                      lineHeight: 1,
                      pointerEvents: "none"
                    }}
                  >
                    “
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                      <div style={{ display: "flex", gap: "3px" }} aria-label={`${item.stars || 5} out of 5 stars`}>
                        {[...Array(item.stars || 5)].map((_, sIdx) => (
                          <svg
                            key={sIdx}
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="#C9A24A"
                            stroke="#C9A24A"
                            strokeWidth="1"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>

                      {item.condition && (
                        <span
                          style={{
                            fontSize: "10.5px",
                            fontWeight: 700,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            color: "var(--gold, #C9A24A)",
                            background: "rgba(201,162,74,0.1)",
                            padding: "3px 8px",
                            borderRadius: "10px"
                          }}
                        >
                          {item.condition}
                        </span>
                      )}
                    </div>

                    <p
                      style={{
                        fontFamily: "var(--serif), Georgia, serif",
                        fontSize: "16px",
                        lineHeight: 1.68,
                        color: "var(--navy, #123653)",
                        margin: 0,
                        fontStyle: "italic"
                      }}
                    >
                      &ldquo;{item.text}&rdquo;
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginTop: "22px",
                      paddingTop: "16px",
                      borderTop: "1px solid rgba(18,54,83,0.08)"
                    }}
                  >
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #123653 0%, #0d283f 100%)",
                        border: "2px solid #C9A24A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#C9A24A",
                        fontWeight: 700,
                        fontSize: "13.5px",
                        boxShadow: "0 4px 10px rgba(201,162,74,0.3)"
                      }}
                    >
                      {initials}
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: "14.5px",
                          fontWeight: 700,
                          color: "var(--navy, #123653)"
                        }}
                      >
                        {item.author}
                      </div>
                      <div
                        style={{
                          fontSize: "11.5px",
                          color: "var(--muted, #64748b)",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          marginTop: "2px"
                        }}
                      >
                        <span style={{ color: "#16a34a", fontWeight: 600 }}>✓ Verified Patient</span>
                        {item.location && <span>· {item.location}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            NAVIGATION CONTROLS (Arrows & Pagination Dots)
           ======================================================== */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            marginTop: "2.5rem"
          }}
        >
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            aria-label="Previous testimonial"
            className="pt-nav-btn"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "1.5px solid rgba(18,54,83,0.15)",
              background: "#ffffff",
              color: "var(--navy, #123653)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.25s ease",
              boxShadow: "0 3px 10px rgba(18,54,83,0.06)"
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div
            role="tablist"
            aria-label="Testimonial pagination"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            {items.map((_, i) => {
              const isActive = i === currentIndex;
              return (
                <button
                  key={i}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Testimonial ${i + 1}`}
                  onClick={() => goToSlide(i)}
                  className={`pt-dot ${isActive ? "active" : ""}`}
                  style={{
                    width: isActive ? "28px" : "9px",
                    height: "9px",
                    borderRadius: isActive ? "5px" : "50%",
                    background: isActive ? "var(--gold, #C9A24A)" : "rgba(18,54,83,0.22)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                />
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            aria-label="Next testimonial"
            className="pt-nav-btn"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "1.5px solid rgba(18,54,83,0.15)",
              background: "#ffffff",
              color: "var(--navy, #123653)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.25s ease",
              boxShadow: "0 3px 10px rgba(18,54,83,0.06)"
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes ptFadeSlideIn {
          from {
            opacity: 0;
            transform: translateX(16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .pt-nav-btn:hover {
          background: var(--navy, #123653) !important;
          color: #ffffff !important;
          border-color: var(--navy, #123653) !important;
          transform: scale(1.06);
          box-shadow: 0 6px 16px rgba(18,54,83,0.2) !important;
        }

        .pt-nav-btn:focus-visible {
          outline: 2px solid var(--gold, #C9A24A);
          outline-offset: 3px;
        }

        .pt-dot:focus-visible {
          outline: 2px solid var(--gold, #C9A24A);
          outline-offset: 2px;
        }

        .pt-card:hover {
          border-color: var(--gold, #C9A24A) !important;
          box-shadow: 0 18px 40px rgba(18,54,83,0.11), 0 0 20px rgba(201,162,74,0.15) !important;
        }

        @media (max-width: 960px) {
          .pt-desktop-cards {
            display: none !important;
          }
          .pt-mobile-slider {
            display: block !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pt-card, .pt-card-mobile, .pt-nav-btn, .pt-dot {
            transition: none !important;
            transform: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
