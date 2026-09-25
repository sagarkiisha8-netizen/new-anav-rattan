"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Doctor {
  id: string;
  name: string;
  role: string;
  qualifications: string;
  bio: string;
  slug: string;
  image: string;
  objectPosition: string;
  alt: string;
}

const doctors: Doctor[] = [
  {
    id: "dr-ganesh-rattan",
    name: "Dr. Ganesh Dutt Rattan",
    role: "Senior ENT Surgeon & Founder",
    qualifications: "MS (ENT), PGI Chandigarh",
    bio: "Founder of Dr. Rattan ENT Clinic with over 35 years of surgical experience. Former Senior Resident at PGI Chandigarh and Sir Ganga Ram Hospital.",
    slug: "ganesh-dutt-rattan",
    image: "/images/dr-ganesh-dutt-rattan-0.jpeg",
    objectPosition: "center 8%",
    alt: "Dr. Ganesh Dutt Rattan, Senior ENT Surgeon and Founder of Dr. Rattan ENT Clinic"
  },
  {
    id: "dr-anav-rattan",
    name: "Dr. Anav Rattan",
    role: "Consultant ENT Surgeon",
    qualifications: "MS (ENT), DNB, MNAMS",
    bio: "Specialist in Otology, Cochlear Implants, and Skull Base Surgery. Trained at Seth G.S. Medical College, Mumbai and PGI Chandigarh.",
    slug: "anav-rattan",
    image: "/images/dr-anav-rattan-1.jpeg",
    objectPosition: "center 14%",
    alt: "Dr. Anav Rattan, Consultant ENT, Otologist, and Skull Base Surgeon at Dr. Rattan ENT Clinic"
  }
];

import { DoctorProfile } from "@/lib/types";

interface MeetTheDoctorsProps {
  doctors?: DoctorProfile[];
}

export default function MeetTheDoctorsSection({ doctors: propDoctors }: MeetTheDoctorsProps = {}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const displayDoctors: Doctor[] = propDoctors && propDoctors.length > 0
    ? propDoctors.map((d, i) => {
        const fallback = doctors[i] || doctors[0];
        return {
          id: d.id || fallback.id,
          name: d.name || fallback.name,
          role: d.title || d.role || fallback.role,
          qualifications: d.degrees || d.qualifications || fallback.qualifications,
          bio: d.bio || fallback.bio,
          slug: d.slug || fallback.slug,
          image: d.image || fallback.image,
          objectPosition: fallback.objectPosition || "center 10%",
          alt: `${d.name || fallback.name}, ENT Specialist at Dr. Rattan ENT Clinic`,
        };
      })
    : doctors;

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

  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const cardWidth = carouselRef.current.offsetWidth * 0.85;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex >= 0 && newIndex < displayDoctors.length) {
      setActiveIndex(newIndex);
    }
  };

  const scrollToDoctor = (index: number) => {
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
      id="doctors"
      className="doctors-section"
      style={{ 
        background: "var(--cream)", 
        padding: "5.5rem 2rem", 
        borderBottom: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Subtle background ambient glow */}
      <div 
        aria-hidden="true" 
        style={{
          position: "absolute",
          top: "10%",
          right: "-80px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201, 162, 74, 0.05), transparent 70%)",
          pointerEvents: "none"
        }} 
      />
      <div 
        aria-hidden="true" 
        style={{
          position: "absolute",
          bottom: "5%",
          left: "-100px",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(18, 54, 83, 0.04), transparent 70%)",
          pointerEvents: "none"
        }} 
      />

      <div style={{ maxWidth: "1080px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        {/* Section Header */}
        <div 
          style={{ 
            textAlign: "center", 
            marginBottom: "3.5rem",
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
            OUR EXPERTS
            <span style={{ display: "inline-block", width: "20px", height: "1.5px", background: "var(--gold)" }}></span>
          </div>

          <h2 
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(32px, 3.6vw, 44px)",
              color: "var(--navy)",
              lineHeight: 1.15,
              letterSpacing: "-0.5px",
              marginBottom: "0.75rem"
            }}
          >
            Meet the <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Doctors</em>
          </h2>

          <p style={{ fontSize: "15.5px", color: "var(--muted)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
            Decades of institutional surgical leadership and dedicated patient care in Sector 21-A, Chandigarh.
          </p>
        </div>

        {/* DESKTOP 2-COLUMN PROFILE CARDS */}
        <div className="doc-desktop-layout">
          {displayDoctors.map((doc, idx) => {
            const isLeft = idx === 0;
            const delay = idx * 120;
            return (
              <div 
                key={doc.id}
                className="doc-profile-card"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible 
                    ? "translate(0, 0)" 
                    : isLeft 
                      ? "translateX(-32px)" 
                      : "translateX(32px)",
                  transition: `opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, box-shadow 0.35s ease, border-color 0.35s ease`
                }}
              >
                {/* Doctor Photo Container with Fixed Height & Natural Framing */}
                <div className="doc-photo-wrapper">
                  {doc.image ? (
                    <>
                      <Image 
                        src={doc.image}
                        alt={doc.alt}
                        fill
                        sizes="(max-width: 860px) 100vw, 500px"
                        style={{ 
                          objectFit: "cover", 
                          objectPosition: doc.objectPosition,
                          transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
                        }}
                        className="doc-zoom-photo"
                        priority={idx === 0}
                      />
                      <div className="doc-photo-gradient" />
                    </>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(135deg, #123653 0%, #0d283e 100%)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff",
                        padding: "20px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          background: "rgba(201,162,74,0.15)",
                          border: "2px solid #C9A24A",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "var(--serif), serif",
                          fontSize: "28px",
                          fontWeight: 700,
                          color: "#C9A24A",
                          marginBottom: "12px",
                        }}
                      >
                        {doc.name.split(" ").map((w: string) => w[0]).filter(Boolean).slice(0, 2).join("") || "DR"}
                      </div>
                      <div style={{ fontFamily: "var(--serif), serif", fontSize: "18px", fontWeight: 700, color: "#ffffff" }}>
                        {doc.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#C9A24A", marginTop: "4px" }}>
                        {doc.role}
                      </div>
                    </div>
                  )}
                </div>

                {/* Doctor Information Card Body */}
                <div className="doc-info-body">
                  <span className="doc-role-badge">{doc.role}</span>
                  <h3 className="doc-name-title">{doc.name}</h3>
                  <div className="doc-qualification-text">{doc.qualifications}</div>
                  
                  {/* Refined Gold Accent Divider */}
                  <div className="doc-gold-divider" />

                  <p className="doc-bio-text">{doc.bio}</p>

                  <div className="doc-action-wrap">
                    <Link 
                      href={`/doctors/${doc.slug}`} 
                      className="doc-profile-btn"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "11px 24px",
                        border: "1.5px solid var(--gold, #C9A24A)",
                        borderRadius: "8px",
                        background: "var(--navy, #123653)",
                        color: "#ffffff",
                        fontSize: "13.5px",
                        fontWeight: 600,
                        letterSpacing: "0.3px",
                        textDecoration: "none",
                        boxShadow: "0 4px 14px rgba(18, 54, 83, 0.18)"
                      }}
                    >
                      <span>View Profile</span>
                      <span className="doc-arrow" style={{ fontSize: "16px" }}>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MOBILE & TABLET HORIZONTAL SWIPE CAROUSEL (< 860px) */}
        <div className="doc-mobile-container">
          <div 
            ref={carouselRef}
            className="doc-mobile-track"
            onScroll={handleCarouselScroll}
            role="region"
            aria-label="Doctors Carousel"
          >
            {displayDoctors.map((doc, idx) => (
              <div 
                key={doc.id}
                className="doc-profile-card doc-mobile-card"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.65s ease ${idx * 100}ms, transform 0.65s ease ${idx * 100}ms`
                }}
              >
                <div className="doc-photo-wrapper">
                  {doc.image ? (
                    <>
                      <Image 
                        src={doc.image}
                        alt={doc.alt}
                        fill
                        sizes="(max-width: 860px) 85vw, 420px"
                        style={{ 
                          objectFit: "cover", 
                          objectPosition: doc.objectPosition 
                        }}
                        className="doc-zoom-photo"
                      />
                      <div className="doc-photo-gradient" />
                    </>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(135deg, #123653 0%, #0d283e 100%)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff",
                        padding: "20px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "72px",
                          height: "72px",
                          borderRadius: "50%",
                          background: "rgba(201,162,74,0.15)",
                          border: "2px solid #C9A24A",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "var(--serif), serif",
                          fontSize: "24px",
                          fontWeight: 700,
                          color: "#C9A24A",
                          marginBottom: "10px",
                        }}
                      >
                        {doc.name.split(" ").map((w: string) => w[0]).filter(Boolean).slice(0, 2).join("") || "DR"}
                      </div>
                      <div style={{ fontFamily: "var(--serif), serif", fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>
                        {doc.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "#C9A24A", marginTop: "2px" }}>
                        {doc.role}
                      </div>
                    </div>
                  )}
                </div>

                <div className="doc-info-body">
                  <span className="doc-role-badge">{doc.role}</span>
                  <h3 className="doc-name-title">{doc.name}</h3>
                  <div className="doc-qualification-text">{doc.qualifications}</div>
                  
                  <div className="doc-gold-divider" style={{ transform: "none" }} />

                  <p className="doc-bio-text">{doc.bio}</p>

                  <div className="doc-action-wrap">
                    <Link 
                      href={`/doctors/${doc.slug}`} 
                      className="doc-profile-btn"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 22px",
                        border: "1.5px solid var(--gold, #C9A24A)",
                        borderRadius: "8px",
                        background: "var(--navy, #123653)",
                        color: "#ffffff",
                        fontSize: "13px",
                        fontWeight: 600,
                        letterSpacing: "0.3px",
                        textDecoration: "none",
                        boxShadow: "0 4px 14px rgba(18, 54, 83, 0.18)"
                      }}
                    >
                      <span>View Profile</span>
                      <span className="doc-arrow" style={{ fontSize: "16px" }}>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Controls */}
          <div className="doc-carousel-controls">
            <button
              onClick={() => scrollToDoctor(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="doc-nav-btn"
              aria-label="Previous doctor"
            >
              ‹
            </button>

            <div className="doc-dots-container" role="tablist" aria-label="Doctors pagination">
              {displayDoctors.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={activeIndex === i}
                  aria-label={`Doctor ${i + 1}`}
                  className={`doc-dot ${activeIndex === i ? "active" : ""}`}
                  onClick={() => scrollToDoctor(i)}
                />
              ))}
            </div>

            <button
              onClick={() => scrollToDoctor(Math.min(displayDoctors.length - 1, activeIndex + 1))}
              disabled={activeIndex === displayDoctors.length - 1}
              className="doc-nav-btn"
              aria-label="Next doctor"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <style>{`
        /* DESKTOP 2-COLUMN LAYOUT */
        .doc-desktop-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.2rem;
          align-items: stretch;
        }

        /* CARD STYLING */
        .doc-profile-card {
          background: #ffffff;
          border: 1px solid rgba(201, 162, 74, 0.32);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(18, 54, 83, 0.07);
          display: flex;
          flex-direction: column;
          position: relative;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease;
        }

        .doc-profile-card:hover {
          transform: translateY(-6px) !important;
          border-color: rgba(201, 162, 74, 0.65);
          box-shadow: 0 20px 45px rgba(18, 54, 83, 0.12), 0 0 20px rgba(201, 162, 74, 0.18);
        }

        .doc-profile-card:hover .doc-zoom-photo {
          transform: scale(1.03);
        }

        .doc-profile-card:hover .doc-gold-divider {
          transform: scaleX(1.4);
          transform-origin: left;
        }

        .doc-profile-card:hover .doc-profile-btn {
          background: var(--navy);
          color: #ffffff;
          border-color: var(--navy);
          box-shadow: 0 6px 18px rgba(18, 54, 83, 0.22);
        }

        .doc-profile-card:hover .doc-arrow {
          transform: translateX(4px);
        }

        /* PHOTO CONTAINER (Fixed height for consistent framing) */
        .doc-photo-wrapper {
          position: relative;
          width: 100%;
          height: 390px;
          overflow: hidden;
          background: #0b2438;
          border-top-left-radius: 19px;
          border-top-right-radius: 19px;
        }

        .doc-photo-gradient {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: linear-gradient(to top, rgba(18, 54, 83, 0.15), transparent);
          pointer-events: none;
        }

        /* CARD BODY */
        .doc-info-body {
          padding: 1.8rem 2rem 2.2rem;
          display: flex;
          flex-direction: column;
          flex: 1;
          background: #ffffff;
        }

        .doc-role-badge {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 6px;
        }

        .doc-name-title {
          font-family: var(--serif);
          font-size: 24px;
          font-weight: 600;
          color: var(--navy);
          line-height: 1.2;
          margin-bottom: 4px;
        }

        .doc-qualification-text {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--gold);
          letter-spacing: 0.2px;
        }

        .doc-gold-divider {
          width: 32px;
          height: 2px;
          background: var(--gold);
          margin: 14px 0 16px;
          border-radius: 1px;
          transition: transform 0.3s ease;
        }

        .doc-bio-text {
          font-size: 14.5px;
          color: var(--muted);
          line-height: 1.68;
          margin-bottom: 1.8rem;
          flex: 1;
        }

        .doc-action-wrap {
          margin-top: auto;
        }

        .doc-profile-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border: 1.5px solid var(--navy);
          border-radius: 6px;
          background: transparent;
          color: var(--navy);
          font-size: 13.5px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .doc-profile-btn:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 3px;
        }

        .doc-arrow {
          display: inline-block;
          transition: transform 0.25s ease;
        }

        /* MOBILE CONTROLS & TRACK */
        .doc-mobile-container {
          display: none;
        }

        /* RESPONSIVE BREAKPOINTS */
        @media (max-width: 860px) {
          .doc-desktop-layout {
            display: none;
          }
          .doc-mobile-container {
            display: block;
          }

          .doc-mobile-track {
            display: flex;
            gap: 18px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            padding: 10px 4px 20px;
            scrollbar-width: none;
          }
          .doc-mobile-track::-webkit-scrollbar {
            display: none;
          }

          .doc-mobile-card {
            flex: 0 0 84%;
            scroll-snap-align: center;
          }

          .doc-mobile-card .doc-photo-wrapper {
            height: 330px;
          }

          .doc-mobile-card .doc-info-body {
            padding: 1.5rem 1.4rem 1.8rem;
          }

          .doc-carousel-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin-top: 1rem;
          }

          .doc-nav-btn {
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
          .doc-nav-btn:disabled {
            opacity: 0.35;
            cursor: not-allowed;
          }
          .doc-nav-btn:not(:disabled):hover {
            background: var(--cream);
            border-color: var(--gold);
            color: var(--gold);
          }
          .doc-nav-btn:focus-visible {
            outline: 2px solid var(--gold);
            outline-offset: 2px;
          }

          .doc-dots-container {
            display: flex;
            gap: 8px;
            align-items: center;
          }

          .doc-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            border: none;
            background: rgba(18, 54, 83, 0.25);
            cursor: pointer;
            padding: 0;
            transition: all 0.3s ease;
          }
          .doc-dot:focus-visible {
            outline: 2px solid var(--gold);
            outline-offset: 2px;
          }
          .doc-dot.active {
            width: 22px;
            border-radius: 6px;
            background: var(--gold);
          }
        }

        @media (max-width: 420px) {
          .doc-mobile-card {
            flex: 0 0 88%;
          }
          .doc-mobile-card .doc-photo-wrapper {
            height: 300px;
          }
          .doc-name-title {
            font-size: 21px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .doc-profile-card, .doc-zoom-photo, .doc-gold-divider, .doc-profile-btn, .doc-arrow {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
