"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

import Breadcrumbs from "@/components/Breadcrumbs";

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: "surgical" | "clinic";
  categoryLabel: string;
}

const allGalleryImages: GalleryItem[] = [
  // 1. Surgical, Academic & Institutional Milestones (From First Screenshot)
  {
    id: "surgical-team-pgi",
    src: "/images/surgical-team-pgi-chandigarh-8.jpeg",
    title: "Surgical Team at PGI Chandigarh",
    category: "surgical",
    categoryLabel: "Academic & Surgical",
    alt: "Surgical team and faculty in scrub attire at PGI Chandigarh"
  },
  {
    id: "ent-team-pgi",
    src: "/images/ent-team-pgi-chandigarh-9.jpeg",
    title: "ENT Department Faculty & Residents",
    category: "surgical",
    categoryLabel: "Academic & Surgical",
    alt: "ENT department colleagues and surgical residents at PGI Chandigarh"
  },
  {
    id: "operating-theatre-pgi",
    src: "/images/operating-theatre-pgi-chandigarh-10.jpeg",
    title: "Advanced Surgical Operating Theatre",
    category: "surgical",
    categoryLabel: "Academic & Surgical",
    alt: "Advanced surgical operating theatre with OT lights and surgical team"
  },
  {
    id: "conference-speaker",
    src: "/images/gallery-15.jpeg",
    title: "Guest Speaker & Academic Presentation",
    category: "surgical",
    categoryLabel: "Academic & Surgical",
    alt: "Guest speaker presentation and felicitation at medical conference"
  },
  {
    id: "cochlear-implant-cert",
    src: "/images/cochlear-implant-programme-certificate-kem-hospital-mumbai-12.jpeg",
    title: "Cochlear Implant Certification, KEM Hospital",
    category: "surgical",
    categoryLabel: "Academic & Surgical",
    alt: "Dr. Anav Rattan receiving Cochlear Implant training certificate at KEM Hospital Mumbai"
  },
  {
    id: "kem-auditorium",
    src: "/images/kem-hospital-auditorium-department-gathering-13.jpeg",
    title: "Academic Gathering, KEM Hospital Auditorium",
    category: "surgical",
    categoryLabel: "Academic & Surgical",
    alt: "Department gathering and clinical lecture in the historic KEM Hospital auditorium"
  },
  {
    id: "seth-gs-college",
    src: "/images/seth-g-s-medical-college-kem-hospital-mumbai-14.jpeg",
    title: "Seth G.S. Medical College & KEM Hospital, Mumbai",
    category: "surgical",
    categoryLabel: "Academic & Surgical",
    alt: "Historic quadrangle and heritage facade of Seth G.S. Medical College, Mumbai"
  },
  {
    id: "surgery-in-progress",
    src: "/images/surgery-in-progress-11.jpeg",
    title: "Precision Microsurgery in Progress",
    category: "surgical",
    categoryLabel: "Academic & Surgical",
    alt: "Surgeons performing delicate ENT microsurgery under theatre lighting"
  },
  {
    id: "iaohns-conference",
    src: "/images/dr-anav-rattan-at-iaohns-2023-conference-jammu-16.jpeg",
    title: "IAOHNS Annual National Conference, Jammu",
    category: "surgical",
    categoryLabel: "Academic & Surgical",
    alt: "Dr. Anav Rattan attending the 9th Annual Conference of IAOHNS in Jammu"
  },

  // 2. Clinic & Diagnostic Facility (From Second Screenshot)
  {
    id: "waiting-lounge",
    src: "/images/full-waiting-room-2.jpeg",
    title: "Patient Waiting Lounge",
    category: "clinic",
    categoryLabel: "Clinic & Facility",
    alt: "Spacious and comfortable patient waiting lounge at Dr. Rattan ENT Clinic"
  },
  {
    id: "diagnostic-suite",
    src: "/images/consultation-room-with-instruments-3.jpeg",
    title: "Diagnostic & Consultation Suite",
    category: "clinic",
    categoryLabel: "Clinic & Facility",
    alt: "ENT examination unit with specialized diagnostic endoscopy and microscopic equipment"
  },
  {
    id: "notice-board",
    src: "/images/waiting-area-notice-board-4.jpeg",
    title: "Clinic Accreditation & Patient Guidance",
    category: "clinic",
    categoryLabel: "Clinic & Facility",
    alt: "Accreditations, registrations, and patient health guidelines notice board"
  },
  {
    id: "seating-area",
    src: "/images/clinic-seating-area-6.jpeg",
    title: "Comfortable Patient Seating Area",
    category: "clinic",
    categoryLabel: "Clinic & Facility",
    alt: "Air-conditioned patient seating area and consultation corridor"
  },
  {
    id: "clinic-entrance",
    src: "/images/clinic-entrance-area-7.jpeg",
    title: "Modern Clinic Entrance & Chambers",
    category: "clinic",
    categoryLabel: "Clinic & Facility",
    alt: "Clinic main entrance with handcrafted teak consultation chamber doors"
  },
  {
    id: "consultant-chambers",
    src: "/images/dr-g-d-rattan-nameplate-5.jpeg",
    title: "Senior Consultant Chambers",
    category: "clinic",
    categoryLabel: "Clinic & Facility",
    alt: "Consultation chamber entrance for Senior ENT Surgeon Dr. Ganesh Dutt Rattan"
  }
];

type CategoryFilter = "all" | "surgical" | "clinic";

export default function GalleryPage() {
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filteredImages = filter === "all" 
    ? allGalleryImages 
    : allGalleryImages.filter(img => img.category === filter);

  const selectedImage = selectedIndex !== null ? filteredImages[selectedIndex] : null;

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + filteredImages.length) % filteredImages.length);
  }, [selectedIndex, filteredImages.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % filteredImages.length);
  }, [selectedIndex, filteredImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handlePrev, handleNext]);

  return (
    <main>
      {/* PAGE HEADER */}
      <section style={{ 
        padding: "5.5rem 2rem 4rem", 
        background: "linear-gradient(135deg, #0b2438 0%, #123653 60%, #0d2a42 100%)", 
        color: "#fff", 
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,162,74,0.12), transparent 70%)", top: "-50px", right: "10%", pointerEvents: "none" }} />
        
        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "center" }}>
            <Breadcrumbs items={[{ label: "Photo Gallery" }]} />
          </div>
          <div style={{ 
            fontSize: "11.5px", 
            fontWeight: "600", 
            letterSpacing: "2.5px", 
            textTransform: "uppercase", 
            color: "var(--gold)", 
            marginBottom: "1rem", 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "10px" 
          }}>
            <span style={{ display: "inline-block", width: "20px", height: "1.5px", background: "var(--gold)" }}></span>
            CLINICAL & SURGICAL EXCELLENCE
            <span style={{ display: "inline-block", width: "20px", height: "1.5px", background: "var(--gold)" }}></span>
          </div>

          <h1 style={{ 
            fontFamily: "var(--serif)", 
            fontSize: "clamp(34px, 4.2vw, 50px)", 
            marginBottom: "1rem", 
            color: "#fff",
            lineHeight: 1.15
          }}>
            Clinic & Surgical <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Gallery</em>
          </h1>

          <p style={{ 
            fontSize: "16px", 
            color: "rgba(255,255,255,0.78)", 
            maxWidth: "640px", 
            margin: "0 auto",
            lineHeight: 1.65
          }}>
            Explore our state-of-the-art diagnostic suites, surgical operating environments, and institutional milestones from PGI Chandigarh and KEM Hospital.
          </p>
        </div>
      </section>

      {/* FILTER TABS & GALLERY GRID */}
      <section style={{ padding: "3.5rem 2rem 5.5rem", background: "var(--cream)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* Category Filter Controls */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "10px", 
            flexWrap: "wrap",
            marginBottom: "3rem" 
          }}>
            <button
              onClick={() => { setFilter("all"); setSelectedIndex(null); }}
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
            >
              All Photos ({allGalleryImages.length})
            </button>
            <button
              onClick={() => { setFilter("surgical"); setSelectedIndex(null); }}
              className={`filter-btn ${filter === "surgical" ? "active" : ""}`}
            >
              Academic & Surgical ({allGalleryImages.filter(i => i.category === "surgical").length})
            </button>
            <button
              onClick={() => { setFilter("clinic"); setSelectedIndex(null); }}
              className={`filter-btn ${filter === "clinic" ? "active" : ""}`}
            >
              Clinic & Facilities ({allGalleryImages.filter(i => i.category === "clinic").length})
            </button>
          </div>

          {/* 3-Column Responsive Grid */}
          <div className="gallery-grid">
            {filteredImages.map((img, i) => (
              <div 
                key={img.id} 
                onClick={() => setSelectedIndex(i)}
                className="gallery-card"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedIndex(i); }}
                aria-label={`View ${img.title}`}
              >
                <div className="gallery-photo-box">
                  <Image 
                    src={img.src} 
                    alt={img.alt} 
                    fill 
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                    style={{ objectFit: "cover" }} 
                    className="gallery-zoom-img"
                  />
                  <div className="gallery-overlay">
                    <span className="gallery-zoom-icon">🔍</span>
                  </div>
                  <span className="gallery-badge">{img.categoryLabel}</span>
                </div>
                
                <div className="gallery-caption">
                  <div className="gallery-title">{img.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL WITH FULL CONTROLS & COUNTER */}
      {selectedImage && selectedIndex !== null && (
        <div 
          onClick={() => setSelectedIndex(null)}
          className="lightbox-backdrop"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="lightbox-dialog"
          >
            {/* Modal Image Box */}
            <div className="lightbox-img-wrap">
              <Image 
                src={selectedImage.src} 
                alt={selectedImage.alt} 
                fill 
                style={{ objectFit: "contain" }} 
                priority
              />

              {/* Navigation Arrows */}
              <button 
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="lightbox-arrow lightbox-prev"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="lightbox-arrow lightbox-next"
                aria-label="Next image"
              >
                ›
              </button>
            </div>

            {/* Modal Footer Bar */}
            <div className="lightbox-footer">
              <div>
                <div className="lightbox-badge">{selectedImage.categoryLabel}</div>
                <h3 className="lightbox-title">{selectedImage.title}</h3>
                <div className="lightbox-counter">
                  Image {selectedIndex + 1} of {filteredImages.length}
                </div>
              </div>

              <button 
                onClick={() => setSelectedIndex(null)}
                className="lightbox-close-btn"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* FILTER BUTTONS */
        .filter-btn {
          padding: 8px 18px;
          border-radius: 30px;
          border: 1px solid rgba(18, 54, 83, 0.15);
          background: #ffffff;
          color: var(--navy);
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 2px 6px rgba(18, 54, 83, 0.04);
        }
        .filter-btn:hover {
          border-color: var(--gold);
          color: var(--gold);
          transform: translateY(-1px);
        }
        .filter-btn.active {
          background: var(--navy);
          color: #ffffff;
          border-color: var(--navy);
          box-shadow: 0 4px 12px rgba(18, 54, 83, 0.18);
        }

        /* GALLERY GRID */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        /* GALLERY CARD */
        .gallery-card {
          background: #ffffff;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 18px rgba(18, 54, 83, 0.06);
          border: 1px solid rgba(201, 162, 74, 0.25);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .gallery-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 30px rgba(18, 54, 83, 0.12), 0 0 15px rgba(201, 162, 74, 0.15);
          border-color: rgba(201, 162, 74, 0.6);
        }
        .gallery-card:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 3px;
        }

        /* PHOTO BOX */
        .gallery-photo-box {
          height: 250px;
          position: relative;
          overflow: hidden;
          background: #0b2438;
        }
        .gallery-zoom-img {
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .gallery-card:hover .gallery-zoom-img {
          transform: scale(1.05);
        }

        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: rgba(11, 36, 56, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .gallery-card:hover .gallery-overlay {
          opacity: 1;
        }
        .gallery-zoom-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #ffffff;
          color: var(--navy);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transform: scale(0.8);
          transition: transform 0.3s ease;
        }
        .gallery-card:hover .gallery-zoom-icon {
          transform: scale(1);
        }

        .gallery-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(11, 36, 56, 0.85);
          backdrop-filter: blur(4px);
          color: var(--gold);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid rgba(201, 162, 74, 0.35);
          z-index: 2;
        }

        /* CAPTION */
        .gallery-caption {
          padding: 1.1rem 1.25rem;
          background: #ffffff;
          border-top: 1px solid rgba(18, 54, 83, 0.05);
          flex: 1;
          display: flex;
          align-items: center;
        }
        .gallery-title {
          font-size: 14.5px;
          font-weight: 600;
          color: var(--navy);
          line-height: 1.35;
        }

        /* LIGHTBOX MODAL */
        .lightbox-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(8, 26, 41, 0.94);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: fadeIn 0.25s ease forwards;
        }

        .lightbox-dialog {
          position: relative;
          max-width: 920px;
          width: 100%;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 30px 70px rgba(0,0,0,0.6);
          animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          border: 1px solid rgba(201, 162, 74, 0.3);
        }

        .lightbox-img-wrap {
          position: relative;
          width: 100%;
          height: 520px;
          background: #071926;
        }

        .lightbox-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: #ffffff;
          font-size: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 5;
        }
        .lightbox-arrow:hover {
          background: rgba(255, 255, 255, 0.95);
          color: var(--navy);
        }
        .lightbox-prev {
          left: 16px;
        }
        .lightbox-next {
          right: 16px;
        }

        .lightbox-footer {
          padding: 1.25rem 1.6rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ffffff;
          border-top: 1px solid rgba(18, 54, 83, 0.08);
        }

        .lightbox-badge {
          font-size: 11px;
          font-weight: 700;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 3px;
        }

        .lightbox-title {
          color: var(--navy);
          font-family: var(--serif);
          font-size: 19px;
          font-weight: 600;
          margin: 0;
          line-height: 1.25;
        }

        .lightbox-counter {
          font-size: 12.5px;
          color: var(--muted);
          margin-top: 4px;
        }

        .lightbox-close-btn {
          background: var(--cream);
          border: 1px solid var(--border);
          border-radius: 50%;
          width: 38px;
          height: 38px;
          cursor: pointer;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--navy);
          transition: all 0.2s ease;
        }
        .lightbox-close-btn:hover {
          background: var(--navy);
          color: #ffffff;
        }

        /* RESPONSIVE */
        @media (max-width: 992px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25rem;
          }
          .lightbox-img-wrap {
            height: 420px;
          }
        }

        @media (max-width: 600px) {
          .gallery-grid {
            grid-template-columns: 1fr;
            gap: 1.2rem;
          }
          .gallery-photo-box {
            height: 220px;
          }
          .lightbox-img-wrap {
            height: 320px;
          }
          .lightbox-arrow {
            width: 36px;
            height: 36px;
            font-size: 20px;
          }
          .lightbox-footer {
            padding: 1rem 1.2rem;
          }
          .lightbox-title {
            font-size: 16px;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </main>
  );
}
