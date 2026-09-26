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
            Our Services
            <span className="eyebrow-line" />
          </div>
          <h2 className="sec-title services-main-title">
            Comprehensive <em className="gold-em">ENT</em> Solutions
          </h2>
          <p className="sec-sub services-sub-title">
            Advanced diagnostic and treatment facilities for complete ear, nose, and throat health in Chandigarh.
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
                  >
                    <span>View Service</span>
                    <span className="service-btn-arrow">→</span>
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
          >
            <span>View All 9 Specialized ENT Services</span>
            <span className="btn-arrow">→</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .services-section-wrap {
          background: var(--cream);
          padding: 5.5rem 2rem 5rem;
          position: relative;
          border-bottom: 1px solid var(--border);
          overflow: hidden;
        }

        .services-container {
          max-width: var(--max-w, 1280px);
          margin: 0 auto;
          width: 100%;
        }

        .services-sec-header {
          text-align: center;
          margin-bottom: 3.5rem;
        }

        .services-eyebrow {
          justify-content: center;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 0.75rem;
        }

        .eyebrow-line {
          display: inline-block;
          width: 20px;
          height: 1.5px;
          background: var(--gold);
        }

        .services-main-title {
          font-family: var(--serif);
          font-size: clamp(28px, 3.8vw, 42px);
          color: var(--navy);
          line-height: 1.18;
          margin-bottom: 0.75rem;
          letter-spacing: -0.5px;
          word-break: normal;
          overflow-wrap: break-word;
          hyphens: none;
        }

        .gold-em {
          color: var(--gold);
          font-style: italic;
        }

        .services-sub-title {
          font-size: 15.5px;
          color: var(--muted);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.65;
        }

        /* ========================================================
           DESKTOP GRID
           ======================================================== */
        .services-desktop-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          width: 100%;
        }

        .service-card-item {
          background: #ffffff;
          padding: 2.2rem 2rem 2rem;
          border-radius: 16px;
          border: 1px solid var(--border);
          box-shadow: 0 4px 18px rgba(18, 54, 83, 0.05);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease;
        }

        .service-card-item:hover {
          transform: translateY(-5px);
          border-color: rgba(201, 162, 74, 0.5);
          box-shadow: 0 14px 34px rgba(18, 54, 83, 0.1), 0 0 18px rgba(201, 162, 74, 0.15);
        }

        .service-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .service-num-badge {
          font-family: var(--serif);
          font-size: 13px;
          font-weight: 700;
          color: var(--gold);
          background: rgba(201, 162, 74, 0.12);
          border: 1px solid rgba(201, 162, 74, 0.25);
          padding: 3px 10px;
          border-radius: 20px;
          letter-spacing: 1px;
        }

        .service-cat-pill {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--navy);
          background: rgba(18, 54, 83, 0.05);
          padding: 3px 10px;
          border-radius: 12px;
        }

        .service-card-title {
          font-family: var(--serif);
          font-size: 21px;
          font-weight: 600;
          color: var(--navy);
          line-height: 1.28;
          margin-bottom: 10px;
          word-break: normal;
          overflow-wrap: break-word;
          hyphens: none;
        }

        .service-card-desc {
          font-size: 14.5px;
          color: var(--muted);
          line-height: 1.68;
          margin-bottom: 1.75rem;
          flex-grow: 1;
        }

        .service-card-action {
          margin-top: auto;
          border-top: 1px solid rgba(18, 54, 83, 0.06);
          padding-top: 1rem;
        }

        .service-card-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--gold);
          text-decoration: none;
          transition: transform 0.25s ease, color 0.2s ease;
        }

        .service-card-btn:hover {
          color: #b38b36;
          transform: translateX(4px);
        }

        .service-btn-arrow {
          display: inline-block;
          transition: transform 0.25s ease;
        }

        .service-card-btn:hover .service-btn-arrow {
          transform: translateX(4px);
        }

        /* ========================================================
           MOBILE CAROUSEL (HIDDEN ON DESKTOP)
           ======================================================== */
        .services-mobile-carousel-wrap {
          display: none;
          width: 100%;
          outline: none;
        }

        .services-bottom-link-row {
          text-align: center;
          margin-top: 3rem;
        }

        .services-explore-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 28px;
          border-radius: 8px;
          background: #ffffff;
          border: 1.5px solid var(--navy);
          color: var(--navy);
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(18, 54, 83, 0.06);
          transition: all 0.3s ease;
        }

        .services-explore-all-btn:hover {
          background: var(--navy);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(18, 54, 83, 0.16);
        }

        /* ========================================================
           RESPONSIVE BREAKPOINTS
           ======================================================== */
        @media (max-width: 1024px) and (min-width: 768px) {
          .services-desktop-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 767px) {
          .services-section-wrap {
            padding: 3.5rem 16px 3.5rem;
          }

          .services-desktop-grid {
            display: none;
          }

          .services-mobile-carousel-wrap {
            display: block;
            width: 100%;
            max-width: 100%;
          }

          .services-sec-header {
            margin-bottom: 2rem;
          }

          .services-main-title {
            font-size: clamp(24px, 6.5vw, 30px);
          }

          .services-sub-title {
            font-size: 14px;
            padding: 0 4px;
          }

          /* Mobile Stage: Exactly 1 card visible */
          .services-mobile-stage {
            width: 100%;
            margin: 0 auto;
          }

          .services-mobile-card-single {
            background: #ffffff;
            border: 1.5px solid rgba(201, 162, 74, 0.45);
            border-radius: 16px;
            padding: 1.75rem 1.35rem 1.6rem;
            box-shadow: 0 10px 30px rgba(18, 54, 83, 0.09), 0 0 16px rgba(201, 162, 74, 0.12);
            display: flex;
            flex-direction: column;
            width: 100%;
            box-sizing: border-box;
            animation: serviceFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            position: relative;
          }

          @keyframes serviceFadeIn {
            from {
              opacity: 0;
              transform: translateY(12px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .services-mobile-card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 1.1rem;
            flex-wrap: wrap;
          }

          .services-mobile-step-count {
            font-size: 11.5px;
            font-weight: 600;
            color: var(--muted);
            margin-left: auto;
          }

          .services-mobile-card-title {
            font-family: var(--serif);
            font-size: clamp(21px, 5.8vw, 25px);
            font-weight: 600;
            color: var(--navy);
            line-height: 1.25;
            margin-bottom: 0.5rem;
            word-break: normal;
            overflow-wrap: break-word;
            hyphens: none;
          }

          .services-card-gold-line {
            width: 36px;
            height: 2px;
            background: var(--gold);
            margin: 8px 0 14px;
            border-radius: 2px;
          }

          .services-mobile-card-desc {
            font-size: 14.5px;
            color: var(--text);
            line-height: 1.68;
            margin-bottom: 1.75rem;
            word-break: normal;
            overflow-wrap: break-word;
          }

          .services-mobile-action-wrap {
            margin-top: auto;
          }

          .services-mobile-cta-btn {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 13px 20px;
            border-radius: 8px;
            background: var(--navy);
            color: #ffffff;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            border: 1.5px solid var(--gold);
            box-shadow: 0 4px 14px rgba(18, 54, 83, 0.18);
            transition: all 0.25s ease;
          }

          .services-mobile-cta-btn:active {
            transform: scale(0.98);
          }

          /* Carousel Controls */
          .services-carousel-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin-top: 1.5rem;
          }

          .services-nav-arrow-btn {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            border: 1.5px solid var(--border);
            background: #ffffff;
            color: var(--navy);
            font-size: 22px;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(18, 54, 83, 0.08);
            transition: all 0.2s ease;
          }

          .services-nav-arrow-btn:active {
            background: var(--gold);
            color: #ffffff;
            border-color: var(--gold);
            transform: scale(0.95);
          }

          .services-dots-row {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .services-carousel-dot {
            width: 9px;
            height: 9px;
            border-radius: 50%;
            border: none;
            background: rgba(18, 54, 83, 0.25);
            cursor: pointer;
            padding: 0;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .services-carousel-dot.active {
            width: 26px;
            border-radius: 6px;
            background: var(--gold);
            box-shadow: 0 2px 8px rgba(201, 162, 74, 0.4);
          }

          .services-bottom-link-row {
            margin-top: 2rem;
          }

          .services-explore-all-btn {
            width: 100%;
            justify-content: center;
            padding: 12px 16px;
            font-size: 13.5px;
          }
        }

        @media (max-width: 360px) {
          .services-section-wrap {
            padding: 3rem 12px 3rem;
          }

          .services-mobile-card-single {
            padding: 1.4rem 1.1rem 1.3rem;
          }

          .services-mobile-card-title {
            font-size: 19.5px;
          }

          .services-mobile-card-desc {
            font-size: 13.5px;
          }
        }
      `}</style>
    </section>
  );
}
