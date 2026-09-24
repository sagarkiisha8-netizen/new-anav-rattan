"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const allFaqs: FAQItem[] = [
  // Ear & Hearing
  {
    category: "Ear & Hearing",
    q: "How do I know if my ear discharge needs surgical intervention?",
    a: "Clear, transient discharge during a cold may resolve with antibiotics, but foul-smelling, recurrent, or blood-tinged discharge that does not dry up often indicates chronic suppurative otitis media (CSOM) with a tympanic perforation or cholesteatoma. In such cases, high-magnification microscopy and CT temporal bone imaging are needed to determine if tympanoplasty or mastoidectomy is warranted."
  },
  {
    category: "Ear & Hearing",
    q: "What causes persistent ringing in the ears (tinnitus)?",
    a: "Tinnitus can stem from prolonged noise exposure, age-related sensorineural hearing loss (presbycusis), middle ear fluid, otosclerosis, wax impaction, or vascular conditions. A comprehensive diagnostic audiogram and impedance test help isolate whether the cause originates in the outer, middle, or inner ear."
  },
  {
    category: "Ear & Hearing",
    q: "Who is a candidate for a cochlear implant?",
    a: "Children born with profound bilateral sensorineural hearing loss who show limited benefit after structured hearing aid trials, as well as adults with post-lingual severe-to-profound hearing loss where hearing aids fail to provide adequate speech clarity, are evaluated for cochlear implantation. Dr. Anav Rattan has completed dedicated certified fellowship training in this field at KEM Hospital Mumbai."
  },

  // Sinus & Allergy
  {
    category: "Sinus & Allergy",
    q: "How is chronic sinusitis differentiated from common allergic rhinitis?",
    a: "Allergic rhinitis typically presents with itchy watery eyes, sneezing fits, and clear nasal discharge triggered by dust or pollen. Chronic sinusitis persists beyond 12 weeks with thick discoloured mucus, facial pressure/pain over the cheeks or forehead, nasal congestion, and reduced smell. In-clinic diagnostic nasal endoscopy provides immediate visual distinction."
  },
  {
    category: "Sinus & Allergy",
    q: "When is Functional Endoscopic Sinus Surgery (FESS) recommended?",
    a: "FESS is indicated when chronic sinusitis or nasal polyposis fails to resolve after optimal medical management (such as intranasal steroids, saline irrigations, and targeted antibiotics), or when there is anatomical obstruction blocking the sinus drainage pathways."
  },

  // Throat & Voice
  {
    category: "Throat & Voice",
    q: "When should hoarseness of voice be evaluated by an ENT specialist?",
    a: "Any change in voice or hoarseness persisting for more than 2 to 3 weeks must be evaluated via rigid or flexible video laryngoscopy. This rules out vocal cord nodules, polyps, cysts, papillomas, or early neoplastic lesions, particularly in smokers or professional voice users."
  },
  {
    category: "Throat & Voice",
    q: "What are the indications for tonsillectomy in adults?",
    a: "In adults, recurrent acute tonsillitis (5 or more episodes in a year), peritonsillar abscess (quinsy), unilateral tonsillar enlargement, chronic cryptic tonsillitis with persistent tonsilloliths and halitosis, or severe obstructive sleep apnea are standard indications for surgical removal."
  },

  // Pediatric ENT
  {
    category: "Pediatric ENT",
    q: "How can parents recognize enlarged adenoids in children?",
    a: "Key symptoms include chronic mouth breathing, loud snoring during sleep, frequent pauses in breathing (pediatric sleep apnea), recurring ear infections due to Eustachian tube blockage (glue ear), and daytime sluggishness or behavioral changes."
  },
  {
    category: "Pediatric ENT",
    q: "What is 'glue ear' and does it require ear grommets?",
    a: "Glue ear (Otitis Media with Effusion) is the accumulation of thick fluid behind the intact eardrum without active fever. It leads to muffled hearing and speech delays. If fluid persists past 3 months despite medical treatment, tiny ventilation tubes (grommets) are placed through the eardrum to restore normal hearing."
  },

  // Vertigo & Balance
  {
    category: "Vertigo & Balance",
    q: "What is BPPV and how is it treated at the clinic?",
    a: "Benign Paroxysmal Positional Vertigo (BPPV) occurs when microscopic calcium crystals (otoconia) become dislodged into the semicircular canals of the inner ear, triggering intense spinning sensations when turning in bed or looking upward. It is diagnosed using the Dix-Hallpike test and treated right in the clinic with canalith repositioning maneuvers such as the Epley maneuver."
  },
  {
    category: "Vertigo & Balance",
    q: "How do you distinguish inner ear vertigo from cervical or cardiac dizziness?",
    a: "Inner ear vertigo produces a true rotational spinning sensation often associated with nystagmus (involuntary eye movements), nausea, and sometimes ear fullness or tinnitus. Lightheadedness, feeling faint, or unsteadiness without true rotational vertigo is systematically evaluated to differentiate peripheral vestibular disease from cervical, neurological, or cardiovascular etiologies."
  },

  // Surgeries & Procedures
  {
    category: "Surgeries & Procedures",
    q: "Where are surgical operations performed?",
    a: "In-office procedures—such as diagnostic otomicroscopy, rigid nasal endoscopy, video laryngoscopy, ear cleaning, and minor biopsies—are performed at our Sector 33C clinic. Major surgeries—such as Tympanoplasty, Mastoidectomy, FESS, Cochlear Implantation, Stapedectomy, and Parotid/Thyroid resections—are carried out in modern, fully accredited tertiary hospital operating theatres with full anaesthetic backup."
  },
  {
    category: "Surgeries & Procedures",
    q: "How long is the recovery period after ear microsurgery?",
    a: "Most patients undergoing tympanoplasty or mastoidectomy return home within 24 to 48 hours. The surgical ear must be kept strictly dry for 4 to 6 weeks. Strenuous heavy lifting, blowing the nose forcefully, and air travel are restricted during the initial 3 to 4 weeks while the graft establishes blood supply."
  },

  // Appointments & Clinic Visits
  {
    category: "Appointments & Visits",
    q: "What are the regular OPD consultation timings?",
    a: "Dr. Rattan ENT Clinic is open Monday through Saturday: Morning OPD from 10:00 AM to 2:00 PM, and Evening OPD from 5:30 PM to 8:00 PM. On Sundays, the clinic is open for consultations from 11:00 AM to 1:00 PM."
  },
  {
    category: "Appointments & Visits",
    q: "Do I need to book an appointment in advance or can I walk in?",
    a: "We accommodate both appointments and walk-ins. However, booking an appointment in advance via our website or telephone (0172-2610806 / WhatsApp 9988004806) guarantees your priority slot and substantially minimizes waiting room time."
  },
  {
    category: "Appointments & Visits",
    q: "What should I bring to my initial consultation?",
    a: "Please bring your previous medical prescriptions, recent blood work, any prior audiogram (hearing test) reports, and CD/film discs of CT or MRI scans of the brain, paranasal sinuses, or temporal bone."
  }
];

const categories = [
  "All",
  "Ear & Hearing",
  "Sinus & Allergy",
  "Throat & Voice",
  "Pediatric ENT",
  "Vertigo & Balance",
  "Surgeries & Procedures",
  "Appointments & Visits"
];

export default function FAQsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = useMemo(() => {
    return allFaqs.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const qLower = item.q.toLowerCase();
      const aLower = item.a.toLowerCase();
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch = !searchLower || qLower.includes(searchLower) || aLower.includes(searchLower);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Structured Data Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFaqs.slice(0, 10).map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
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
                  color: "var(--navy)"
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
                    transition: "all 0.2s ease"
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
                    key={i}
                    style={{
                      background: "#fff",
                      borderRadius: "12px",
                      border: isOpen ? "1px solid var(--gold)" : "1px solid rgba(18,54,83,0.08)",
                      boxShadow: isOpen ? "0 6px 20px rgba(18,54,83,0.06)" : "0 2px 8px rgba(18,54,83,0.02)",
                      overflow: "hidden",
                      transition: "all 0.25s ease"
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
                        gap: "16px"
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
                          marginBottom: "6px"
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
                          transition: "transform 0.25s ease, background 0.25s ease, color 0.25s ease"
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
