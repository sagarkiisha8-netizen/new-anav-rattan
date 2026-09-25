"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export interface FAQItem {
  id?: string;
  category: string;
  q: string;
  a: string;
  order?: number;
  isPublished?: boolean;
}

const defaultCategories = [
  "All",
  "Ear & Hearing",
  "Sinus & Allergy",
  "Throat & Voice",
  "Pediatric ENT",
  "Vertigo & Balance",
  "Surgeries & Procedures",
  "Appointments & Visits",
];

export default function FAQClientView({ initialFaqs }: { initialFaqs?: FAQItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const allFaqs = initialFaqs && initialFaqs.length > 0 ? initialFaqs : [];

  // Derive categories dynamically from faqs, preserving standard order
  const categories = useMemo(() => {
    const cats = new Set<string>(["All"]);
    defaultCategories.forEach((c) => cats.add(c));
    allFaqs.forEach((f) => {
      if (f.category) cats.add(f.category);
    });
    return Array.from(cats);
  }, [allFaqs]);

  const filteredFaqs = useMemo(() => {
    return allFaqs.filter((item) => {
      if (item.isPublished === false) return false;
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const qLower = (item.q || "").toLowerCase();
      const aLower = (item.a || "").toLowerCase();
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch = !searchLower || qLower.includes(searchLower) || aLower.includes(searchLower);
      return matchesCategory && matchesSearch;
    });
  }, [allFaqs, selectedCategory, searchQuery]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFaqs.slice(0, 10).map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a,
      },
    })),
  };

  return (
    <main>
      {/* Schema injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header */}
      <section style={{ padding: "5rem 2rem 4rem", background: "linear-gradient(135deg, var(--navy) 0%, #0d283f 100%)", color: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <Breadcrumbs items={[{ label: "Frequently Asked Questions" }]} />
          </div>
          <div style={{ maxWidth: "800px" }}>
            <div className="section-label" style={{ color: "var(--gold)", marginBottom: "0.5rem" }}>
              PATIENT EDUCATION & TRANSPARENCY
            </div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 44px)", lineHeight: 1.2, color: "#fff", marginBottom: "1.25rem" }}>
              Frequently Asked Questions
            </h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.85)", lineHeight: 1.75 }}>
              Find clear, medically sound answers to common inquiries regarding ear microsurgery, sinus endoscopy, vertigo treatments, pediatric conditions, and clinic consultations.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section style={{ padding: "4.5rem 2rem", background: "var(--cream)" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          
          {/* Search bar */}
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setOpenIndex(null);
                }}
                placeholder="Search questions by symptom, surgery, or condition (e.g. tympanoplasty, vertigo, grommet)..."
                style={{
                  width: "100%",
                  padding: "16px 20px 16px 48px",
                  fontSize: "15px",
                  borderRadius: "12px",
                  border: "1px solid rgba(18,54,83,0.15)",
                  background: "#fff",
                  boxShadow: "0 4px 16px rgba(18,54,83,0.04)",
                  outline: "none",
                  color: "var(--navy)",
                }}
              />
              <span style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", fontSize: "18px", color: "var(--navy)", opacity: 0.5 }}>
                🔍
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", fontSize: "16px", cursor: "pointer", color: "var(--text-muted)" }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setOpenIndex(null);
                  }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "30px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: isActive ? "1px solid var(--navy)" : "1px solid rgba(18,54,83,0.12)",
                    background: isActive ? "var(--navy)" : "#fff",
                    color: isActive ? "#fff" : "var(--navy)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Results count */}
          <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "1.25rem", display: "flex", justifyContent: "space-between" }}>
            <span>Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? "question" : "questions"}</span>
            {searchQuery && (
              <span>Filtered by query: &ldquo;{searchQuery}&rdquo;</span>
            )}
          </div>

          {/* FAQ Accordion List */}
          {filteredFaqs.length === 0 ? (
            <div style={{ background: "#fff", padding: "40px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(18,54,83,0.08)" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔎</div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "20px", color: "var(--navy)", marginBottom: "8px" }}>
                No matching questions found
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                Try searching with different keywords or browse our categories. You can also consult our doctors directly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="btn-navy"
                style={{ padding: "10px 20px", fontSize: "13px" }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filteredFaqs.map((faq, i) => {
                const isOpen = openIndex === i;
                return (
                  <div
                    key={faq.id || i}
                    style={{
                      background: "#fff",
                      borderRadius: "12px",
                      border: isOpen ? "1px solid var(--gold)" : "1px solid rgba(18,54,83,0.08)",
                      boxShadow: isOpen ? "0 6px 20px rgba(18,54,83,0.06)" : "0 2px 8px rgba(18,54,83,0.02)",
                      overflow: "hidden",
                      transition: "all 0.25s ease",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFAQ(i)}
                      aria-expanded={isOpen}
                      style={{
                        width: "100%",
                        padding: "1.25rem 1.5rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        color: "var(--navy)",
                        gap: "16px",
                      }}
                    >
                      <div>
                        <span style={{ 
                          fontSize: "11px", 
                          fontWeight: 700, 
                          textTransform: "uppercase", 
                          letterSpacing: "0.05em", 
                          color: "var(--gold)", 
                          background: "rgba(201,162,74,0.1)", 
                          padding: "2px 8px", 
                          borderRadius: "4px",
                          display: "inline-block",
                          marginBottom: "6px",
                        }}>
                          {faq.category}
                        </span>
                        <div style={{ fontFamily: "var(--serif)", fontSize: "17px", fontWeight: 600, color: "var(--navy)", lineHeight: 1.4 }}>
                          {faq.q}
                        </div>
                      </div>

                      <span
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: isOpen ? "var(--gold)" : "rgba(18,54,83,0.06)",
                          color: isOpen ? "#fff" : "var(--navy)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                          fontWeight: 700,
                          flexShrink: 0,
                          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                          transition: "transform 0.25s ease, background 0.25s ease, color 0.25s ease",
                        }}
                      >
                        +
                      </span>
                    </button>

                    {isOpen && (
                      <div style={{ padding: "0 1.5rem 1.5rem", borderTop: "1px solid rgba(18,54,83,0.04)" }}>
                        <p style={{ color: "var(--text)", lineHeight: 1.75, fontSize: "14.5px", margin: "1rem 0 0" }}>
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section style={{ padding: "4.5rem 2rem", background: "var(--navy)", color: "#fff", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <span style={{ color: "var(--gold)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
            STILL HAVE QUESTIONS?
          </span>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px, 3.5vw, 36px)", color: "#fff", marginBottom: "1rem" }}>
            Speak Directly With Our ENT Specialists
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "15px", lineHeight: 1.7, marginBottom: "2rem" }}>
            Every individual condition has unique anatomical nuances. Schedule a clinic consultation for an objective microscopic or endoscopic evaluation.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/book-appointment" className="btn-gold" style={{ padding: "14px 28px", textDecoration: "none" }}>
              Book an Appointment
            </Link>
            <a 
              href="https://wa.me/919988004806" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-navy" 
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", padding: "14px 28px", textDecoration: "none" }}
            >
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
