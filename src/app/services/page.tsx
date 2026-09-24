import Link from "next/link";
import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Clinical Services | Dr. Rattan ENT Clinic Chandigarh",
  description:
    "Comprehensive ENT diagnostic, medical, and advanced surgical interventions in Chandigarh. Specialising in Otology, Hearing Restoration, Cochlear Implants, Endoscopic Sinus Surgery, Voice Disorders, and Skull Base Surgery.",
};

const servicesList = [
  {
    num: "01",
    name: "Ear Care & Otology",
    link: "ear-care",
    category: "Otology",
    icon: "👂",
    desc: "Comprehensive diagnosis and microscopic surgical management for chronic otitis media, tympanic membrane perforations, cholesteatoma, and mastoid disease.",
    highlights: ["Tympanoplasty", "Mastoidectomy", "Stapedectomy", "Ear Discharge Treatment"]
  },
  {
    num: "02",
    name: "Hearing Loss & Audiology",
    link: "hearing-loss",
    category: "Audiology",
    icon: "🔊",
    desc: "Formal audiometric assessment, pure tone audiometry, impedance testing, and precision hearing rehabilitation for pediatric and adult hearing impairments.",
    highlights: ["Pure Tone Audiometry", "Tympanometry", "Sudden Sensorineural Loss", "Hearing Aids & Counseling"]
  },
  {
    num: "03",
    name: "Sinus & Allergy Care",
    link: "sinus-allergy",
    category: "Rhinology",
    icon: "👃",
    desc: "High-definition nasal endoscopy, medical allergy protocol, and Functional Endoscopic Sinus Surgery (FESS) for chronic sinusitis and nasal polyps.",
    highlights: ["FESS Surgery", "Deviated Septum (Septoplasty)", "Nasal Polyposis", "Allergic Rhinitis Protocol"]
  },
  {
    num: "04",
    name: "Throat & Voice Care",
    link: "throat-voice",
    category: "Laryngology",
    icon: "🗣️",
    desc: "Fibreoptic laryngoscopy and microsurgical intervention for vocal cord nodules, hoarseness, chronic tonsillitis, adenoids, and swallowing difficulties.",
    highlights: ["Microlaryngeal Surgery (MLS)", "Vocal Nodules & Polyps", "Coblation Tonsillectomy", "Hoarseness Workup"]
  },
  {
    num: "05",
    name: "Pediatric ENT Care",
    link: "pediatric-ent",
    category: "Pediatrics",
    icon: "👶",
    desc: "Gentle, specialized ENT care for newborns, infants, and children. Dedicated protocols for recurrent ear discharge, glue ear, adenotonsillar hypertrophy, and speech delays.",
    highlights: ["Grommet Insertion", "Adenoidectomy", "Congenital Hearing Screening", "Childhood Stridor"]
  },
  {
    num: "06",
    name: "Vertigo & Balance Disorders",
    link: "vertigo",
    category: "Vestibular",
    icon: "🌀",
    desc: "Systematic neuro-otological evaluation to pinpoint peripheral vestibular disorders from central pathology, featuring repositioning maneuvers and medical care.",
    highlights: ["Epley Maneuver for BPPV", "Meniere's Disease", "Vestibular Neuritis", "Labyrinthitis Care"]
  },
  {
    num: "07",
    name: "Cochlear Implants & Auditory Implants",
    link: "cochlear-implants",
    category: "Advanced Otology",
    icon: "🦻",
    desc: "State-of-the-art surgical implantation program for profound sensorineural hearing loss unresponsive to conventional hearing aids, trained at KEM Hospital Mumbai.",
    highlights: ["Pre-implant Candidacy Workup", "Minimally Invasive Implantation", "Post-op Telemetry & Mapping", "Auditory-Verbal Handoff"]
  },
  {
    num: "08",
    name: "Skull Base Surgery",
    link: "skull-base-surgery",
    category: "Neurotology",
    icon: "🧠",
    desc: "Complex lateral and anterior skull base surgical procedures for acoustic neuromas, glomus jugulare tumors, CSF leaks, and temporal bone pathologies.",
    highlights: ["Lateral Skull Base Approaches", "Acoustic Neuroma Care", "Endoscopic CSF Leak Repair", "Facial Nerve Decompression"]
  },
  {
    num: "09",
    name: "Head & Neck Surgery",
    link: "head-neck-care",
    category: "Head & Neck",
    icon: "🩺",
    desc: "Diagnostic fine-needle cytology, ultrasound correlation, and meticulous surgical excision of salivary gland neoplasms, thyroid nodules, and congenital neck cysts.",
    highlights: ["Superficial Parotidectomy", "Hemithyroidectomy", "Branchial Cleft & Thyroglossal Excision", "Cervical Lymphadenopathy"]
  },
];

import { getSiteContent } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const siteContent = await getSiteContent();
  const dbServices = siteContent.services || [];
  const servicesList = dbServices.map((s) => ({
    num: s.num || String(s.order).padStart(2, "0"),
    name: s.name,
    link: s.slug,
    category: s.category,
    icon: s.icon || "👂",
    desc: s.desc,
    highlights: s.highlights || [],
  }));

  return (
    <main>
      {/* Header Section */}
      <section style={{ padding: "5rem 2rem 4rem", background: "linear-gradient(135deg, var(--navy) 0%, #0d283f 100%)", color: "#fff", position: "relative" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <Breadcrumbs items={[{ label: "Clinical Services" }]} />
          </div>
          <div style={{ maxWidth: "760px" }}>
            <div className="section-label" style={{ color: "var(--gold)", marginBottom: "0.75rem" }}>
              COMPREHENSIVE SURGICAL & MEDICAL ENT
            </div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 44px)", lineHeight: 1.2, color: "#fff", marginBottom: "1.25rem" }}>
              Specialised Clinical & Surgical Services
            </h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
              Guided by institutional surgical training from PGI Chandigarh and KEM Hospital Mumbai, Dr. Rattan ENT Clinic provides evidence-based diagnostic and surgical care across 9 dedicated subspecialties.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section style={{ padding: "4.5rem 2rem", background: "var(--cream)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", 
            gap: "24px" 
          }}>
            {servicesList.map((srv) => (
              <div 
                key={srv.link}
                style={{
                  background: "#fff",
                  borderRadius: "14px",
                  padding: "32px 28px",
                  boxShadow: "0 4px 20px rgba(18,54,83,0.06)",
                  border: "1px solid rgba(18,54,83,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                    <span style={{ fontSize: "28px" }}>{srv.icon}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ 
                        fontSize: "11px", 
                        fontWeight: 700, 
                        letterSpacing: "0.08em", 
                        textTransform: "uppercase", 
                        background: "rgba(201,162,74,0.12)", 
                        color: "var(--navy)", 
                        padding: "4px 10px", 
                        borderRadius: "20px" 
                      }}>
                        {srv.category}
                      </span>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--gold)", opacity: 0.8 }}>
                        {srv.num}
                      </span>
                    </div>
                  </div>

                  <h2 style={{ fontFamily: "var(--serif)", fontSize: "22px", color: "var(--navy)", marginBottom: "0.75rem", lineHeight: 1.3 }}>
                    {srv.name}
                  </h2>

                  <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.65, marginBottom: "1.25rem" }}>
                    {srv.desc}
                  </p>

                  <div style={{ borderTop: "1px solid rgba(18,54,83,0.06)", paddingTop: "1rem", marginBottom: "1.5rem" }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--navy)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                      Key Procedures & Workup:
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                      {srv.highlights.map((item, idx) => (
                        <li key={idx} style={{ fontSize: "13px", color: "var(--navy)", display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ color: "var(--gold)", fontSize: "10px" }}>◆</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <Link 
                    href={`/services/${srv.link}`}
                    className="btn-navy"
                    style={{ 
                      width: "100%", 
                      justifyContent: "center", 
                      fontSize: "14px", 
                      padding: "11px 18px",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    Explore Clinical Care <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Banner */}
      <section style={{ padding: "4.5rem 2rem", background: "var(--navy)", color: "#fff", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <span style={{ color: "var(--gold)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: "0.75rem" }}>
            EXPERT SURGICAL CONSULTATION
          </span>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px, 3.5vw, 36px)", marginBottom: "1rem", color: "#fff" }}>
            Need an accurate diagnosis or a surgical second opinion?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "15px", lineHeight: 1.7, marginBottom: "2rem" }}>
            Our senior surgeons evaluate each case systematically with clinical microscopy and high-definition endoscopy.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/book-appointment" className="btn-gold" style={{ padding: "14px 28px", textDecoration: "none" }}>
              Schedule Clinical Visit
            </Link>
            <a 
              href="https://wa.me/919988004806" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-navy" 
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", padding: "14px 28px", textDecoration: "none" }}
            >
              Consult via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
