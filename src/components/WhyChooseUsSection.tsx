"use client";

import { useState, useRef, useEffect } from "react";

interface Benefit {
  id: string;
  number: string;
  title: string;
  description: string;
  tag?: string;
  highlights?: string[];
  icon: React.ReactNode;
}

const benefits: Benefit[] = [
  {
    id: "specialists",
    number: "01",
    title: "Experienced specialists",
    description: "PGI-trained surgeons bringing decades of institutional experience to your care.",
    tag: "Institutional Legacy",
    highlights: [
      "PGI Chandigarh & KEM Hospital surgical lineage",
      "Advanced micro-otology & skull base surgery",
      "Senior consultant oversight for every patient"
    ],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4.5 16.5c-1.5 1.26-2 3-2 5.5h19c0-2.5-.5-4.24-2-5.5" />
        <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" />
        <path d="M10 14h4" />
        <path d="M12 8v4" />
        <circle cx="12" cy="10" r="1.5" fill="currentColor" />
      </svg>
    )
  },
  {
    id: "treatment",
    number: "02",
    title: "Personalised treatment",
    description: "Tailored treatment plans focused entirely on your specific health needs.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="m9 14 2 2 4-4" />
        <path d="M8 10h8" />
      </svg>
    )
  },
  {
    id: "diagnosis",
    number: "03",
    title: "Advanced diagnosis",
    description: "State-of-the-art diagnostic tools for precise and accurate evaluations.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m14 10 3-3 2.5 2.5-3 3" />
        <path d="M10 14 6 18" />
        <path d="M14 10 9 15" />
        <circle cx="17" cy="7" r="1" />
        <path d="M21 21v-1a4 4 0 0 0-4-4h-2" />
        <path d="M7 17a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h2" />
      </svg>
    )
  },
  {
    id: "guidance",
    number: "04",
    title: "Transparent guidance",
    description: "Clear, honest advice regarding your condition and available treatment options.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
  },
  {
    id: "comfort",
    number: "05",
    title: "Comfortable experience",
    description: "A welcoming, hygienic, and patient-friendly clinic environment.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M12 7v6" />
        <path d="M9 10h6" />
      </svg>
    )
  }
];

export default function WhyChooseUsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

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
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const cardWidth = carouselRef.current.offsetWidth * 0.85;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex >= 0 && newIndex < benefits.length) {
      setActiveIndex(newIndex);
    }
  };

  const scrollToCard = (index: number) => {
    if (!carouselRef.current) return;
    const cardWidth = carouselRef.current.offsetWidth * 0.85;
    carouselRef.current.scrollTo({
      left: index * cardWidth,
      behavior: "smooth"
    });
    setActiveIndex(index);
  };

  return (
    <section 
      ref={sectionRef} 
      id="why-choose-us"
      className="why-choose-section"
      style={{
        position: "relative",
        background: "#ffffff",
        padding: "5.5rem 2rem",
        overflow: "hidden",
        borderBottom: "1px solid var(--border)"
      }}
    >
      {/* Decorative background pattern with very light gold circles and medical lines */}
      <div 
        aria-hidden="true" 
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          border: "1px dashed rgba(201, 162, 74, 0.16)",
          pointerEvents: "none"
        }} 
      />
      <div 
        aria-hidden="true" 
        style={{
          position: "absolute",
          bottom: "-70px",
          left: "-50px",
          width: "440px",
          height: "440px",
          borderRadius: "50%",
          border: "1px solid rgba(18, 54, 83, 0.04)",
          pointerEvents: "none"
        }} 
      />
      <div 
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "40%",
          left: "8%",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201, 162, 74, 0.05), transparent 70%)",
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
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          <div 
            style={{
              fontSize: "11.5px",
              fontWeight: 600,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "var(--gold)",
              marginBottom: "0.85rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <span style={{ display: "inline-block", width: "20px", height: "1.5px", background: "var(--gold)" }}></span>
            WHY CHOOSE US
            <span style={{ display: "inline-block", width: "20px", height: "1.5px", background: "var(--gold)" }}></span>
          </div>

          <h2 
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(30px, 3.4vw, 44px)",
              lineHeight: 1.15,
              color: "var(--navy)",
              letterSpacing: "-0.5px",
              marginBottom: "0.85rem"
            }}
          >
            A legacy of expert <em style={{ color: "var(--gold)", fontStyle: "italic" }}>surgical care</em>
          </h2>

          <p style={{ fontSize: "15.5px", color: "var(--muted)", lineHeight: 1.7, margin: "0 auto", maxWidth: "620px" }}>
            Decades of specialized ear, nose, and throat surgical experience committed to clinical precision, transparent guidance, and patient-first recovery.
          </p>
        </div>

        {/* DESKTOP BALANCED GRID (2+1 Row 1, 1+1+1 Row 2) */}
        <div className="why-desktop-grid">
          {/* Card 1: Featured 2-Column Span */}
          <div 
            className="why-card why-card-featured"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.98)",
              transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0ms, box-shadow 0.35s ease, border-color 0.35s ease"
            }}
          >
            <div className="why-featured-inner">
              <div className="why-featured-left">
                <div className="why-card-top">
                  <div className="why-icon-box why-icon-box-gold">
                    {benefits[0].icon}
                  </div>
                  <div className="why-num-badge">01 · Featured Focus</div>
                </div>

                <div className="why-title-wrap">
                  <h3 className="why-title why-title-lg">{benefits[0].title}</h3>
                  <div className="why-gold-accent-line" />
                </div>
                <p className="why-desc why-desc-lg">{benefits[0].description}</p>
              </div>

              <div className="why-featured-right">
                <div className="why-highlights-title">Institutional Highlights</div>
                <ul className="why-highlights-list">
                  {benefits[0].highlights?.map((hl, i) => (
                    <li key={i}>
                      <span className="why-check">✓</span>
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>

                <div className="why-featured-footer">
                  <span className="why-tag">{benefits[0].tag}</span>
                  <span className="why-action-indicator">
                    Learn more <span className="why-arrow">→</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Row 1, Col 3 */}
          <div 
            className="why-card"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.98)",
              transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 100ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 100ms, box-shadow 0.35s ease, border-color 0.35s ease"
            }}
          >
            <div className="why-card-top">
              <div className="why-icon-box">
                {benefits[1].icon}
              </div>
              <span className="why-num-plain">{benefits[1].number}</span>
            </div>

            <div className="why-card-body">
              <div className="why-title-wrap">
                <h3 className="why-title">{benefits[1].title}</h3>
                <div className="why-gold-accent-line" />
              </div>
              <p className="why-desc">{benefits[1].description}</p>
            </div>

            <div className="why-card-footer">
              <span className="why-action-indicator">
                Learn more <span className="why-arrow">→</span>
              </span>
            </div>
          </div>

          {/* Card 3: Row 2, Col 1 */}
          <div 
            className="why-card"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.98)",
              transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms, box-shadow 0.35s ease, border-color 0.35s ease"
            }}
          >
            <div className="why-card-top">
              <div className="why-icon-box">
                {benefits[2].icon}
              </div>
              <span className="why-num-plain">{benefits[2].number}</span>
            </div>

            <div className="why-card-body">
              <div className="why-title-wrap">
                <h3 className="why-title">{benefits[2].title}</h3>
                <div className="why-gold-accent-line" />
              </div>
              <p className="why-desc">{benefits[2].description}</p>
            </div>

            <div className="why-card-footer">
              <span className="why-action-indicator">
                Learn more <span className="why-arrow">→</span>
              </span>
            </div>
          </div>

          {/* Card 4: Row 2, Col 2 */}
          <div 
            className="why-card"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.98)",
              transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 300ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 300ms, box-shadow 0.35s ease, border-color 0.35s ease"
            }}
          >
            <div className="why-card-top">
              <div className="why-icon-box">
                {benefits[3].icon}
              </div>
              <span className="why-num-plain">{benefits[3].number}</span>
            </div>

            <div className="why-card-body">
              <div className="why-title-wrap">
                <h3 className="why-title">{benefits[3].title}</h3>
                <div className="why-gold-accent-line" />
              </div>
              <p className="why-desc">{benefits[3].description}</p>
            </div>

            <div className="why-card-footer">
              <span className="why-action-indicator">
                Learn more <span className="why-arrow">→</span>
              </span>
            </div>
          </div>

          {/* Card 5: Row 2, Col 3 */}
          <div 
            className="why-card"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.98)",
              transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 400ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 400ms, box-shadow 0.35s ease, border-color 0.35s ease"
            }}
          >
            <div className="why-card-top">
              <div className="why-icon-box">
                {benefits[4].icon}
              </div>
              <span className="why-num-plain">{benefits[4].number}</span>
            </div>

            <div className="why-card-body">
              <div className="why-title-wrap">
                <h3 className="why-title">{benefits[4].title}</h3>
                <div className="why-gold-accent-line" />
              </div>
              <p className="why-desc">{benefits[4].description}</p>
            </div>

            <div className="why-card-footer">
              <span className="why-action-indicator">
                Learn more <span className="why-arrow">→</span>
              </span>
            </div>
          </div>
        </div>

        {/* MOBILE HORIZONTAL SWIPE CAROUSEL (< 768px) */}
        <div className="why-mobile-container">
          <div 
            ref={carouselRef}
            className="why-mobile-track"
            onScroll={handleCarouselScroll}
            role="region"
            aria-label="Why Choose Us Benefits"
          >
            {benefits.map((benefit, idx) => (
              <div 
                key={benefit.id}
                className={`why-card why-mobile-card ${idx === 0 ? "why-mobile-card-featured" : ""}`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.6s ease ${idx * 80}ms, transform 0.6s ease ${idx * 80}ms`
                }}
              >
                <div className="why-card-top">
                  <div className={`why-icon-box ${idx === 0 ? "why-icon-box-gold" : ""}`}>
                    {benefit.icon}
                  </div>
                  <span className="why-num-plain">{benefit.number}</span>
                </div>

                <div className="why-card-body">
                  <h3 className="why-title">{benefit.title}</h3>
                  <div className="why-gold-accent-line" style={{ transform: "none" }} />
                  <p className="why-desc">{benefit.description}</p>

                  {benefit.highlights && (
                    <ul className="why-highlights-list" style={{ marginTop: "0.75rem", marginBottom: "1rem" }}>
                      {benefit.highlights.map((hl, i) => (
                        <li key={i} style={{ fontSize: "12px" }}>
                          <span className="why-check">✓</span>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="why-card-footer">
                  {benefit.tag && <span className="why-tag">{benefit.tag}</span>}
                  <span className="why-action-indicator">
                    Learn more <span className="why-arrow">→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Controls (Accessible Arrows & Dots) */}
          <div className="why-carousel-controls">
            <button
              onClick={() => scrollToCard(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="why-nav-btn"
              aria-label="Previous slide"
            >
              ‹
            </button>

            <div className="why-dots-container" role="tablist" aria-label="Carousel pagination">
              {benefits.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={activeIndex === i}
                  aria-label={`Slide ${i + 1}`}
                  className={`why-dot ${activeIndex === i ? "active" : ""}`}
                  onClick={() => scrollToCard(i)}
                />
              ))}
            </div>

            <button
              onClick={() => scrollToCard(Math.min(benefits.length - 1, activeIndex + 1))}
              disabled={activeIndex === benefits.length - 1}
              className="why-nav-btn"
              aria-label="Next slide"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* DESKTOP GRID (3 Columns: 2+1, 1+1+1) */
        .why-desktop-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          align-items: stretch;
        }

        /* CARD BASE */
        .why-card {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 1.85rem 1.7rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 4px 16px rgba(18, 54, 83, 0.04);
          position: relative;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease;
        }

        .why-card-featured {
          grid-column: span 2;
          background: linear-gradient(135deg, #ffffff 0%, #FAF8F4 100%);
          border-color: rgba(201, 162, 74, 0.38);
          box-shadow: 0 6px 22px rgba(18, 54, 83, 0.06);
        }

        .why-featured-inner {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
          height: 100%;
        }

        .why-featured-left {
          display: flex;
          flex-direction: column;
        }

        .why-featured-right {
          background: rgba(18, 54, 83, 0.03);
          border: 1px solid rgba(201, 162, 74, 0.2);
          border-radius: 14px;
          padding: 1.25rem 1.35rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .why-highlights-title {
          font-size: 11.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: var(--navy);
          margin-bottom: 0.75rem;
        }

        .why-highlights-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .why-highlights-list li {
          font-size: 12.5px;
          color: var(--muted);
          line-height: 1.45;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .why-check {
          color: var(--gold);
          font-weight: 700;
          font-size: 13px;
          line-height: 1.2;
          flex-shrink: 0;
        }

        .why-featured-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(18, 54, 83, 0.08);
        }

        /* HOVER INTERACTIONS */
        .why-card:hover {
          transform: translateY(-6px) !important;
          border-color: rgba(201, 162, 74, 0.55);
          box-shadow: 0 16px 36px rgba(18, 54, 83, 0.1), 0 0 18px rgba(201, 162, 74, 0.14);
        }

        .why-card:hover .why-icon-box {
          transform: scale(1.06) rotate(3deg);
          border-color: var(--gold);
          background: #ffffff;
          box-shadow: 0 6px 16px rgba(201, 162, 74, 0.18);
        }

        .why-card:hover .why-gold-accent-line {
          transform: scaleX(1.4);
          transform-origin: left;
        }

        .why-card:hover .why-arrow {
          transform: translateX(4px);
        }

        /* CARD ELEMENTS */
        .why-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.2rem;
        }

        .why-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--cream);
          border: 1px solid rgba(201, 162, 74, 0.28);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--navy);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .why-icon-box-gold {
          background: rgba(201, 162, 74, 0.12);
          color: var(--navy);
          border-color: var(--gold);
        }

        .why-num-badge {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: var(--gold);
          background: rgba(201, 162, 74, 0.1);
          padding: 4px 12px;
          border-radius: 20px;
        }

        .why-num-plain {
          font-family: var(--serif);
          font-size: 16px;
          font-weight: 600;
          color: rgba(18, 54, 83, 0.25);
        }

        .why-card-body {
          flex: 1;
        }

        .why-title-wrap {
          margin-bottom: 0.5rem;
        }

        .why-title {
          font-family: var(--serif);
          font-size: 19px;
          color: var(--navy);
          font-weight: 600;
          line-height: 1.25;
          margin: 0;
        }

        .why-title-lg {
          font-size: 22px;
        }

        .why-gold-accent-line {
          width: 28px;
          height: 2px;
          background: var(--gold);
          margin-top: 6px;
          margin-bottom: 8px;
          border-radius: 1px;
          transition: transform 0.3s ease;
        }

        .why-desc {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.6;
          margin: 0 0 1.25rem 0;
        }

        .why-desc-lg {
          font-size: 14.5px;
          line-height: 1.65;
        }

        .why-card-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-top: 0.85rem;
          border-top: 1px solid rgba(18, 54, 83, 0.06);
          margin-top: auto;
        }

        .why-tag {
          font-size: 11.5px;
          font-weight: 600;
          color: var(--navy);
          background: rgba(18, 54, 83, 0.05);
          padding: 3px 10px;
          border-radius: 4px;
        }

        .why-action-indicator {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--gold);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .why-arrow {
          display: inline-block;
          transition: transform 0.25s ease;
        }

        /* MOBILE CONTROLS & TRACK */
        .why-mobile-container {
          display: none;
        }

        /* RESPONSIVE BREAKPOINTS */
        @media (max-width: 1024px) and (min-width: 768px) {
          .why-desktop-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .why-card-featured {
            grid-column: span 2;
          }
        }

        @media (max-width: 767px) {
          .why-desktop-grid {
            display: none;
          }
          .why-mobile-container {
            display: block;
          }

          .why-mobile-track {
            display: flex;
            gap: 16px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            padding: 10px 4px 18px;
            scrollbar-width: none;
          }
          .why-mobile-track::-webkit-scrollbar {
            display: none;
          }

          .why-mobile-card {
            flex: 0 0 84%;
            scroll-snap-align: center;
            min-height: 270px;
            padding: 1.6rem 1.4rem;
          }

          .why-mobile-card-featured {
            background: linear-gradient(135deg, #ffffff 0%, #FAF8F4 100%);
            border-color: rgba(201, 162, 74, 0.4);
          }

          .why-carousel-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin-top: 1rem;
          }

          .why-nav-btn {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            border: 1px solid var(--border);
            background: #ffffff;
            color: var(--navy);
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .why-nav-btn:disabled {
            opacity: 0.35;
            cursor: not-allowed;
          }
          .why-nav-btn:not(:disabled):hover {
            background: var(--cream);
            border-color: var(--gold);
            color: var(--gold);
          }

          .why-dots-container {
            display: flex;
            gap: 8px;
            align-items: center;
          }

          .why-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            border: none;
            background: rgba(18, 54, 83, 0.2);
            cursor: pointer;
            padding: 0;
            transition: all 0.3s ease;
          }
          .why-dot.active {
            width: 22px;
            border-radius: 6px;
            background: var(--gold);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .why-card, .why-icon-box, .why-gold-accent-line, .why-arrow {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
