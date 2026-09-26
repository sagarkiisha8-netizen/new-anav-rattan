"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Benefit {
  id: string;
  number: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const benefits: Benefit[] = [
  {
    id: "specialists",
    number: "01",
    title: "Experienced specialists",
    description: "PGI-trained surgeons bringing decades of institutional experience to your care.",
    href: "/services/experienced-ent-specialists",
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
    href: "/services/personalised-treatment",
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
    description: "Equipped with state-of-the-art diagnostic tools for accurate evaluation.",
    href: "/services/advanced-diagnosis",
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
    description: "Clear explanations of your condition so you can make informed decisions.",
    href: "/services/transparent-guidance",
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
    description: "Warm and compassionate care in a patient-first clinical environment.",
    href: "/services/comfortable-experience",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M12 7v6" />
        <path d="M9 10h6" />
      </svg>
    )
  }
];

interface WhyChooseUsData {
  label?: string;
  title?: string;
  benefits?: Array<{
    id?: string;
    num?: string;
    title: string;
    desc: string;
    href?: string;
  }>;
}

interface WhyChooseUsProps {
  data?: WhyChooseUsData;
}

export default function WhyChooseUsSection({ data }: WhyChooseUsProps = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const displayBenefits: Benefit[] = data?.benefits && data.benefits.length > 0
    ? data.benefits.map((b, i) => {
        const fallback = benefits[i] || benefits[0];
        return {
          id: b.id || fallback.id || `benefit-${i}`,
          number: b.num || fallback.number || `0${i + 1}`,
          title: b.title || fallback.title,
          description: b.desc || fallback.description,
          href: b.href || fallback.href,
          icon: fallback.icon,
        };
      })
    : benefits;

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

  return (
    <section 
      ref={sectionRef} 
      id="services-comprehensive"
      className="why-choose-section"
      style={{
        position: "relative",
        background: "#ffffff",
        padding: "5.5rem 2rem",
        overflow: "hidden",
        borderBottom: "1px solid var(--border)"
      }}
      aria-label="Comprehensive ENT Solutions"
    >
      {/* Decorative background geometry */}
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
            <span style={{ display: "inline-block", width: "20px", height: "1.5px", background: "var(--gold)" }} />
            {data?.label || "OUR SERVICES"}
            <span style={{ display: "inline-block", width: "20px", height: "1.5px", background: "var(--gold)" }} />
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
            {data?.title || (
              <>
                Comprehensive <em style={{ color: "var(--gold)", fontStyle: "italic" }}>ENT</em> Solutions
              </>
            )}
          </h2>

          <p style={{ fontSize: "15.5px", color: "var(--muted)", lineHeight: 1.7, margin: "0 auto", maxWidth: "660px" }}>
            Advanced diagnostic and treatment facilities for complete ear, nose, and throat health in Chandigarh.
          </p>
        </div>

        {/* 5 SERVICE CARDS GRID */}
        <div className="why-services-grid">
          {displayBenefits.map((item, idx) => {
            const delay = idx * 90;
            return (
              <div 
                key={item.id}
                className="why-card-grid-item"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.98)",
                  transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
                }}
              >
                <div className="why-card">
                  <div className="why-card-top">
                    <div className="why-icon-box" aria-hidden="true">
                      {item.icon}
                    </div>
                    <span className="why-num-plain">{item.number}</span>
                  </div>

                  <div className="why-card-body">
                    <div className="why-title-wrap">
                      <h3 className="why-title">{item.title}</h3>
                      <div className="why-gold-accent-line" />
                    </div>
                    <p className="why-desc">{item.description}</p>
                  </div>

                  <div className="why-card-footer">
                    <Link 
                      href={item.href} 
                      className="why-action-link"
                      aria-label={`Learn more about ${item.title}`}
                    >
                      <span>Learn more</span>
                      <span className="why-arrow" aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        /* ========================================================
           DESKTOP BALANCED GRID (6 Columns: 3 in Row 1, 2 Centered in Row 2)
           ======================================================== */
        .why-services-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
          align-items: stretch;
        }

        .why-card-grid-item {
          display: flex;
        }

        /* Row 1: 3 cards, each spans 2 columns (2 + 2 + 2 = 6) */
        .why-card-grid-item:nth-child(1),
        .why-card-grid-item:nth-child(2),
        .why-card-grid-item:nth-child(3) {
          grid-column: span 2;
        }

        /* Row 2: 2 cards centered symmetrically!
           Card 4 starts at column 2 (span 2).
           Card 5 starts at column 4 (span 2).
           Equal width to the 3 cards above, beautifully centered with 1 col buffer on both edges! */
        .why-card-grid-item:nth-child(4) {
          grid-column: 2 / span 2;
        }

        .why-card-grid-item:nth-child(5) {
          grid-column: 4 / span 2;
        }

        /* CARD BASE - UNIFORM ACROSS ALL 5 */
        .why-card {
          width: 100%;
          background: #ffffff;
          border: 1px solid var(--border, rgba(18, 54, 83, 0.12));
          border-radius: 18px;
          padding: 2.1rem 1.9rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 4px 16px rgba(18, 54, 83, 0.04);
          position: relative;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .why-card:hover {
          transform: translateY(-5px);
          border-color: rgba(201, 162, 74, 0.55);
          box-shadow: 0 16px 36px rgba(18, 54, 83, 0.09), 0 0 16px rgba(201, 162, 74, 0.12);
        }

        .why-card:hover .why-icon-box {
          transform: scale(1.06);
          border-color: var(--gold);
          background: #ffffff;
          box-shadow: 0 6px 16px rgba(201, 162, 74, 0.18);
        }

        .why-card:hover .why-gold-accent-line {
          transform: scaleX(1.4);
          transform-origin: left;
        }

        .why-card:hover .why-arrow {
          transform: translateX(5px);
        }

        /* CARD TOP */
        .why-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.4rem;
        }

        .why-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--cream, #FAF8F4);
          border: 1px solid rgba(201, 162, 74, 0.28);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--navy, #123653);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .why-num-plain {
          font-family: var(--serif);
          font-size: 17px;
          font-weight: 600;
          color: rgba(18, 54, 83, 0.28);
          letter-spacing: 0.5px;
        }

        /* BODY */
        .why-card-body {
          flex: 1;
        }

        .why-title-wrap {
          margin-bottom: 0.6rem;
        }

        .why-title {
          font-family: var(--serif);
          font-size: 20px;
          color: var(--navy, #123653);
          font-weight: 600;
          line-height: 1.28;
          margin: 0;
        }

        .why-gold-accent-line {
          width: 28px;
          height: 2px;
          background: var(--gold, #C9A24A);
          margin-top: 8px;
          margin-bottom: 10px;
          border-radius: 1px;
          transition: transform 0.3s ease;
        }

        .why-desc {
          font-size: 14.5px;
          color: var(--muted, #5A6D7C);
          line-height: 1.62;
          margin: 0 0 1.5rem 0;
        }

        /* FOOTER & ACCESSIBLE LINK */
        .why-card-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(18, 54, 83, 0.06);
          margin-top: auto;
        }

        .why-action-link {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--gold, #C9A24A);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: color 0.2s ease, transform 0.2s ease;
          padding: 4px 6px;
          border-radius: 4px;
        }

        .why-action-link:hover {
          color: var(--navy, #123653);
        }

        .why-action-link:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 2px;
        }

        .why-arrow {
          display: inline-block;
          transition: transform 0.25s ease;
        }

        /* ========================================================
           TABLET BREAKPOINT (768px - 1024px): 2 COLUMNS
           ======================================================== */
        @media (max-width: 1024px) and (min-width: 641px) {
          .why-services-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .why-card-grid-item:nth-child(1),
          .why-card-grid-item:nth-child(2),
          .why-card-grid-item:nth-child(3),
          .why-card-grid-item:nth-child(4) {
            grid-column: span 1;
          }
          .why-card-grid-item:nth-child(5) {
            grid-column: 1 / span 2;
            max-width: 540px;
            width: 100%;
            margin: 0 auto;
          }
        }

        /* ========================================================
           MOBILE BREAKPOINT (<= 640px): 1 COLUMN FULL WIDTH
           ======================================================== */
        @media (max-width: 640px) {
          .why-services-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .why-card-grid-item:nth-child(n) {
            grid-column: span 1;
            max-width: 100%;
            margin: 0;
            width: 100%;
          }
          .why-card {
            padding: 1.6rem 1.4rem;
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
