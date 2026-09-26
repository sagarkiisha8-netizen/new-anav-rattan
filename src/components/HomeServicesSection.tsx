"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ServiceItem } from "@/lib/types";

interface ServiceDisplayItem {
  name: string;
  slug: string;
  desc?: string;
  category?: string;
  shortDescription?: string;
}

interface HomeServicesSectionProps {
  services?: ServiceDisplayItem[] | ServiceItem[];
}

const defaultServices: ServiceDisplayItem[] = [
  {
    name: "Ear Care & Hearing",
    slug: "ear-care",
    desc: "Expert treatment for hearing loss, ear infections, eardrum perforations, and microsurgery of the ear.",
    category: "Otology & Hearing"
  },
  {
    name: "Sinus & Allergy Treatment",
    slug: "sinus-allergy",
    desc: "Comprehensive diagnostic endoscopy, advanced FESS sinus surgery, and allergy desensitization care.",
    category: "Rhinology & Sinus"
  },
  {
    name: "Throat and Voice Care",
    slug: "throat-voice",
    desc: "Specialized phonosurgery for vocal cord disorders, hoarseness, chronic tonsillitis, and voice therapy.",
    category: "Laryngology & Voice"
  },
  {
    name: "Pediatric ENT",
    slug: "pediatric-ent",
    desc: "Gentle, child-centered clinical care for tonsils, adenoids, glue ear, and pediatric breathing difficulties.",
    category: "Pediatric Care"
  },
  {
    name: "Vertigo & Balance Disorders",
    slug: "vertigo",
    desc: "Advanced vestibular balance diagnostics, BPPV repositioning maneuvers, and neuro-otological treatment.",
    category: "Neuro-otology"
  },
  {
    name: "Head & Neck Surgical Care",
    slug: "head-neck-care",
    desc: "Careful surgical evaluation and management of thyroid nodules, salivary glands, and neck masses.",
    category: "Head & Neck"
  },
];

export default function HomeServicesSection({ services }: HomeServicesSectionProps) {
  const displayServices: ServiceDisplayItem[] = services && services.length > 0
    ? (services as ServiceDisplayItem[]).slice(0, 6)
    : defaultServices;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Autoplay carousel on mobile every 5 seconds when not paused
  useEffect(() => {
    if (isPaused || displayServices.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayServices.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, displayServices.length]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayServices.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + displayServices.length) % displayServices.length);
  };

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 40; // 40px swipe threshold

    if (diff > threshold) {
      nextSlide();
    } else if (diff < -threshold) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
    setTimeout(() => setIsPaused(false), 2000);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    }
  };

  return (
    <section 
      id="services" 
      className="services-section-wrap"
      aria-label="Clinical ENT Services"
    >
      <div className="services-container">
        {/* Section Header */}
        <div className="sec-header services-sec-header">
          <div className="sec-eyebrow services-eyebrow">
            <span className="eyebrow-line" />
            Clinical Specialities
            <span className="eyebrow-line" />
          </div>
          <h2 className="sec-title services-main-title">
            Specialized <em className="gold-em">ENT</em> Treatments
          </h2>
          <p className="sec-sub services-sub-title">
            State-of-the-art diagnostic and surgical care across all ear, nose, throat, head and neck subspecialties.
          </p>
        </div>

        {/* ========================================================
            DESKTOP & TABLET SERVICES GRID (>= 768px)
           ======================================================== */}
        <div className="services-desktop-grid">
          {displayServices.map((srv, i) => {
            const desc = srv.desc || srv.shortDescription || "";
            return (
              <div 
                className="service-card-item hover-lift" 
                key={srv.slug || i}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="service-card-top">
                  <div className="service-num-badge">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {srv.category && (
                    <span className="service-cat-pill">{srv.category}</span>
                  )}
                </div>

                <h3 className="service-card-title">{srv.name}</h3>
                <p className="service-card-desc">{desc}</p>

                <div className="service-card-action">
                  <Link 
                    href={`/services/${srv.slug}`} 
                    className="service-card-btn"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#C9A24A",
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: "13.5px",
                    }}
                  >
                    <span>View Service</span>
                    <span className="service-btn-arrow" style={{ color: "#C9A24A", display: "inline-block" }}>→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================
            MOBILE 1-CARD-AT-A-TIME CAROUSEL (< 768px)
           ======================================================== */}
        <div 
          className="services-mobile-carousel-wrap"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Services Mobile Carousel"
          ref={containerRef}
        >
          {/* Active Service Card Stage */}
          <div className="services-mobile-stage">
            {displayServices.map((srv, i) => {
              if (i !== currentIndex) return null;
              const desc = srv.desc || srv.shortDescription || "";
              return (
                <div 
                  className="services-mobile-card-single"
                  key={srv.slug || i}
                >
                  <div className="services-mobile-card-header">
                    <div className="service-num-badge">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <span className="service-cat-pill">
                      {srv.category || "ENT Speciality"}
                    </span>
                    <span className="services-mobile-step-count">
                      {i + 1} / {displayServices.length}
                    </span>
                  </div>

                  <h3 className="services-mobile-card-title">{srv.name}</h3>
                  <div className="services-card-gold-line" />
                  <p className="services-mobile-card-desc">{desc}</p>

                  <div className="services-mobile-action-wrap">
                    <Link 
                      href={`/services/${srv.slug}`} 
                      className="services-mobile-cta-btn"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        width: "100%",
                        padding: "12px 20px",
                        background: "var(--navy, #123653)",
                        color: "#ffffff",
                        borderRadius: "8px",
                        fontWeight: 600,
                        textDecoration: "none",
                        fontSize: "13.5px"
                      }}
                    >
                      <span>Explore Service Details</span>
                      <span className="btn-arrow">→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel Controls (Arrows + Dots) */}
          <div className="services-carousel-controls">
            <button
              type="button"
              onClick={prevSlide}
              className="services-nav-arrow-btn"
              aria-label="Previous service"
            >
              ‹
            </button>

            <div className="services-dots-row" role="tablist" aria-label="Services pagination">
              {displayServices.map((_, dotIdx) => (
                <button
                  type="button"
                  key={dotIdx}
                  role="tab"
                  aria-selected={currentIndex === dotIdx}
                  aria-label={`Go to service ${dotIdx + 1}`}
                  className={`services-carousel-dot ${currentIndex === dotIdx ? "active" : ""}`}
                  onClick={() => goToSlide(dotIdx)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextSlide}
              className="services-nav-arrow-btn"
              aria-label="Next service"
            >
              ›
            </button>
          </div>
        </div>

        {/* Explore All Services Link */}
        <div className="services-bottom-link-row">
          <Link 
            href="/services" 
            className="services-explore-all-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 28px",
              borderRadius: "8px",
              background: "#ffffff",
              border: "1.5px solid var(--navy, #123653)",
              color: "var(--navy, #123653)",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(18, 54, 83, 0.08)"
            }}
          >
            <span>View All 9 Specialized ENT Services</span>
            <span className="btn-arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
