"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";

export interface GalleryItem {
  id?: string;
  src: string;
  alt?: string;
  title: string;
  category?: string;
  categoryLabel?: string;
  order?: number;
}

type CategoryFilter = "all" | "surgical" | "clinic";

export default function GalleryClientView({ initialGallery }: { initialGallery?: GalleryItem[] }) {
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const allGalleryImages = (initialGallery && initialGallery.length > 0 ? initialGallery : []).filter(
    (img) => Boolean(img.src && img.src.trim())
  );

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
                key={img.id || i} 
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
                    alt={img.alt || img.title} 
                    fill 
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                    style={{ objectFit: "cover" }} 
                    className="gallery-zoom-img"
                  />
                  <div className="gallery-overlay">
                    <span className="gallery-zoom-icon">🔍</span>
                  </div>
                  <span className="gallery-badge">{img.categoryLabel || (img.category === "clinic" ? "Clinic & Facility" : "Academic & Surgical")}</span>
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
                alt={selectedImage.alt || selectedImage.title} 
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
                <div className="lightbox-badge">{selectedImage.categoryLabel || (selectedImage.category === "clinic" ? "Clinic & Facility" : "Academic & Surgical")}</div>
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
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .gallery-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(11, 36, 56, 0.85);
          backdrop-filter: blur(4px);
          color: var(--gold);
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 4px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          border: 1px solid rgba(201, 162, 74, 0.3);
        }

        /* CAPTION */
        .gallery-caption {
          padding: 1.1rem 1.25rem;
          flex-grow: 1;
          display: flex;
          align-items: center;
        }
        .gallery-title {
          font-family: var(--serif);
          font-size: 16px;
          font-weight: 600;
          color: var(--navy);
          line-height: 1.35;
        }

        /* LIGHTBOX MODAL */
        .lightbox-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(11, 36, 56, 0.95);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          animation: fadeIn 0.25s ease;
        }
        .lightbox-dialog {
          max-width: 1000px;
          width: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .lightbox-img-wrap {
          position: relative;
          width: 100%;
          height: 70vh;
        }
        .lightbox-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #fff;
          font-size: 32px;
          line-height: 1;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }
        .lightbox-arrow:hover {
          background: var(--gold);
          color: var(--navy);
        }
        .lightbox-prev { left: 16px; }
        .lightbox-next { right: 16px; }

        .lightbox-footer {
          margin-top: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          color: #fff;
        }
        .lightbox-badge {
          color: var(--gold);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }
        .lightbox-title {
          font-family: var(--serif);
          font-size: 20px;
          margin: 0 0 4px 0;
          color: #fff;
        }
        .lightbox-counter {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }
        .lightbox-close-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          font-size: 18px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .lightbox-close-btn:hover {
          background: var(--gold);
          color: var(--navy);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 900px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .gallery-grid {
            grid-template-columns: 1fr;
          }
          .lightbox-img-wrap {
            height: 50vh;
          }
        }
      `}</style>
    </main>
  );
}
