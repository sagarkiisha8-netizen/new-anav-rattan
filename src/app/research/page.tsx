import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

import { getSiteContent } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Academic Research & Conferences | Dr. Rattan ENT Clinic Chandigarh",
  description:
    "Explore the clinical research, national conference presentations (IAOHNS), cochlear implant certifications (KEM Hospital Mumbai), and temporal bone surgery training of our ENT surgeons.",
};

export default async function ResearchPage() {
  const content = await getSiteContent();
  const research = content?.research;

  const heroTitle = research.title || "Research, Conferences & Surgical Milestones";
  const heroSubtitle = research.subtitle || "Continuous academic engagement, national conference presentations, and certified surgical fellowships ensure that our patients benefit from modern, evidence-backed clinical protocols.";
  
  const m1 = research.milestones?.[0] || {
    badge: "NATIONAL SCIENTIFIC CONFERENCES",
    title: "IAOHNS National Conference, Jammu",
    desc1: "Dr. Anav Rattan actively contributes to scientific discussions at major national gatherings of the Indian Academy of Otorhinolaryngology – Head & Neck Surgery (IAOHNS), presenting clinical data and participating in peer surgical roundtables.",
    desc2: "These conferences bring together the country’s leading neurotologists, rhinologists, and head-neck oncologists to examine nuanced surgical techniques, difficult revision cases, and outcomes in temporal bone and skull base procedures.",
    focusTitle: "Key Scientific Focus:",
    focusDesc: "Contemporary approaches in Otology, Mastoid Obliteration, and Diagnostic Pitfalls in Peripheral Vestibulopathies.",
    image: "/images/dr-anav-rattan-at-iaohns-2023-conference-jammu-16.jpeg",
    caption: "Dr. Anav Rattan at IAOHNS Conference, Jammu",
    subType: "Academic Forum"
  };

  const m2 = research.milestones?.[1] || {
    badge: "ADVANCED SURGICAL CERTIFICATION",
    title: "Cochlear Implant Surgical Fellowship & Certification",
    desc1: "Dr. Anav Rattan completed comprehensive specialized training in the Cochlear Implant Programme at Seth G.S. Medical College & KEM Hospital, Mumbai.",
    desc2: "This institutional program covers all facets of pediatric and adult auditory implantation: high-resolution temporal bone radiological planning, posterior tympanotomy round-window surgical access, intraoperative neural telemetry, and multi-disciplinary rehabilitation handoff.",
    focusTitle: "Certification Details:",
    focusDesc: "Round Window Insertion & Intraoperative Neural Response Telemetry Verification at KEM Hospital Mumbai.",
    image: "/images/cochlear-implant-programme-certificate-kem-hospital-mumbai-12.jpeg",
    caption: "Certified Cochlear Implant Training — KEM Hospital Mumbai",
    subType: "Certification"
  };

  const ongoingInquiries = research.ongoingInquiry || [
    {
      title: "1. Otology & Ossicular Reconstruction",
      desc: "Comparative anatomical outcomes between autologous incus interposition and titanium total/partial ossicular replacement prostheses (TORP/PORP) in diseased middle ears."
    },
    {
      title: "2. Auditory Implants in Severe Hearing Loss",
      desc: "Pre-operative imaging predictors of cochlear patency, round-window visibility during posterior tympanotomy, and hearing preservation electrode protocols."
    },
    {
      title: "3. Endoscopic Sinus Anatomy & Revision FESS",
      desc: "Systematic evaluation of frontal recess pneumatization patterns and mucosal preservation strategies to minimize recurrent polyp formation in allergic fungal sinusitis."
    },
    {
      title: "4. Peripheral Vestibulopathies & Balance",
      desc: "Multi-canal canalithiasis identification, refractory BPPV repositioning variations, and clinical differentiators of acute peripheral vs central vestibular syndromes."
    }
  ];

  return (
    <main>
      {/* Header */}
      <section style={{ padding: "5rem 2rem 4rem", background: "linear-gradient(135deg, var(--navy) 0%, #0d283f 100%)", color: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <Breadcrumbs items={[{ label: "Academic Research & Training" }]} />
          </div>
          <div style={{ maxWidth: "800px" }}>
            <div className="section-label" style={{ color: "var(--gold)", marginBottom: "0.5rem" }}>
              ACADEMIC RIGOUR & CLINICAL INQUIRY
            </div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 44px)", lineHeight: 1.2, color: "#fff", marginBottom: "1.25rem" }}>
              {heroTitle}
            </h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.85)", lineHeight: 1.75 }}>
              {heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Milestone 1: IAOHNS Conference */}
      {(() => {
        const hasM1Image = Boolean(m1.image && m1.image.trim());
        return (
          <section style={{ padding: "5rem 2rem", background: "#fff" }}>
            <div style={{ maxWidth: hasM1Image ? "1200px" : "840px", margin: "0 auto" }}>
              <div style={{
                display: hasM1Image ? "grid" : "block",
                gridTemplateColumns: hasM1Image ? "repeat(auto-fit, minmax(320px, 1fr))" : undefined,
                gap: hasM1Image ? "48px" : undefined,
                alignItems: "center"
              }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", background: "rgba(201,162,74,0.12)", padding: "4px 10px", borderRadius: "16px", display: "inline-block", marginBottom: "1rem" }}>
                    {m1.badge}
                  </span>
                  <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px, 3.2vw, 34px)", color: "var(--navy)", marginBottom: "1.25rem", lineHeight: 1.3 }}>
                    {m1.title}
                  </h2>
                  <p style={{ fontSize: "15px", color: "var(--text)", lineHeight: 1.8, marginBottom: "1.2rem" }}>
                    {m1.desc1}
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                    {m1.desc2}
                  </p>
                  <div style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "16px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--navy)" }}>{m1.focusTitle}</div>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                      {m1.focusDesc}
                    </div>
                  </div>
                </div>

                {hasM1Image && (
                  <div style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 12px 36px rgba(18,54,83,0.1)", border: "1px solid rgba(18,54,83,0.1)", background: "var(--cream)" }}>
                    <div style={{ position: "relative", height: "380px" }}>
                      <Image 
                        src={m1.image}
                        alt={m1.caption || "Dr. Anav Rattan at IAOHNS 2023 Conference in Jammu"}
                        fill
                        style={{ objectFit: "cover", objectPosition: "center" }}
                      />
                    </div>
                    {m1.caption && (
                      <div style={{ padding: "14px 18px", background: "var(--navy)", color: "#fff", fontSize: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>{m1.caption}</span>
                        <span style={{ color: "var(--gold)" }}>{m1.subType || "Academic Forum"}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Featured Milestone 2: Cochlear Implant Certification at KEM Hospital Mumbai */}
      {(() => {
        const hasM2Image = Boolean(m2.image && m2.image.trim());
        return (
          <section style={{ padding: "5rem 2rem", background: "var(--cream)" }}>
            <div style={{ maxWidth: hasM2Image ? "1200px" : "840px", margin: "0 auto" }}>
              <div style={{
                display: hasM2Image ? "grid" : "block",
                gridTemplateColumns: hasM2Image ? "repeat(auto-fit, minmax(320px, 1fr))" : undefined,
                gap: hasM2Image ? "48px" : undefined,
                alignItems: "center"
              }}>
                {hasM2Image && (
                  <div style={{ order: 2, borderRadius: "16px", overflow: "hidden", boxShadow: "0 12px 36px rgba(18,54,83,0.1)", border: "1px solid rgba(18,54,83,0.1)", background: "#fff" }}>
                    <div style={{ position: "relative", height: "420px" }}>
                      <Image 
                        src={m2.image}
                        alt={m2.caption || "Cochlear Implant Programme Certificate at Seth G.S. Medical College & KEM Hospital Mumbai"}
                        fill
                        style={{ objectFit: "contain", background: "#fdfdfd" }}
                      />
                    </div>
                    {m2.caption && (
                      <div style={{ padding: "14px 18px", background: "var(--navy)", color: "#fff", fontSize: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>{m2.caption}</span>
                        <span style={{ color: "var(--gold)" }}>{m2.subType || "Certification"}</span>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ order: hasM2Image ? 1 : undefined }}>
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", background: "rgba(201,162,74,0.15)", padding: "4px 10px", borderRadius: "16px", display: "inline-block", marginBottom: "1rem" }}>
                {m2.badge}
              </span>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px, 3.2vw, 34px)", color: "var(--navy)", marginBottom: "1.25rem", lineHeight: 1.3 }}>
                {m2.title}
              </h2>
              <p style={{ fontSize: "15px", color: "var(--text)", lineHeight: 1.8, marginBottom: "1.2rem" }}>
                {m2.desc1}
              </p>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                {m2.desc2}
              </p>
              <div style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "16px" }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--navy)" }}>{m2.focusTitle}</div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                  {m2.focusDesc}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  })()}

      {/* Institutional Foundations: KEM & PGI Gallery */}
      <section style={{ padding: "5rem 2rem", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 3.5rem" }}>
            <div className="section-label" style={{ color: "var(--gold)", marginBottom: "0.5rem" }}>
              INSTITUTIONAL FOUNDATIONS
            </div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px, 3.2vw, 36px)", color: "var(--navy)" }}>
              PGIMER Chandigarh & KEM Hospital Mumbai
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", marginTop: "8px" }}>
              Shaped by high-volume tertiary care centers, surgical dissection laboratories, and academic departments.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(18,54,83,0.08)", boxShadow: "0 4px 16px rgba(18,54,83,0.05)" }}>
              <div style={{ position: "relative", height: "240px" }}>
                <Image 
                  src="/images/seth-g-s-medical-college-kem-hospital-mumbai-14.jpeg"
                  alt="Seth G.S. Medical College & KEM Hospital Mumbai"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: "16px 20px", background: "#fff" }}>
                <div style={{ fontWeight: 600, fontSize: "15px", color: "var(--navy)", marginBottom: "4px" }}>
                  Seth G.S. Medical College & KEM Hospital
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  Historic medical institution in Mumbai where Dr. Anav Rattan undertook his MS (ENT) residency and surgical foundation.
                </div>
              </div>
            </div>

            <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(18,54,83,0.08)", boxShadow: "0 4px 16px rgba(18,54,83,0.05)" }}>
              <div style={{ position: "relative", height: "240px" }}>
                <Image 
                  src="/images/kem-hospital-auditorium-department-gathering-13.jpeg"
                  alt="KEM Hospital Auditorium Academic Department Gathering"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: "16px 20px", background: "#fff" }}>
                <div style={{ fontWeight: 600, fontSize: "15px", color: "var(--navy)", marginBottom: "4px" }}>
                  Department Academic Assembly
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  Clinical case presentations, mortality audits, and surgical journal clubs at the KEM Hospital main auditorium.
                </div>
              </div>
            </div>

            <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(18,54,83,0.08)", boxShadow: "0 4px 16px rgba(18,54,83,0.05)" }}>
              <div style={{ position: "relative", height: "240px" }}>
                <Image 
                  src="/images/operating-theatre-pgi-chandigarh-10.jpeg"
                  alt="Operating Theatre at PGIMER Chandigarh"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: "16px 20px", background: "#fff" }}>
                <div style={{ fontWeight: 600, fontSize: "15px", color: "var(--navy)", marginBottom: "4px" }}>
                  PGIMER Chandigarh Surgical Suites
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  The premier apex institute where Dr. Ganesh Dutt Rattan and Dr. Anav Rattan honed advanced operative techniques.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Areas of Clinical Investigation */}
      <section style={{ padding: "5rem 2rem", background: "var(--cream)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 3.5rem" }}>
            <div className="section-label" style={{ color: "var(--gold)", marginBottom: "0.5rem" }}>
              ONGOING CLINICAL INQUIRY
            </div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px, 3.2vw, 36px)", color: "var(--navy)" }}>
              Specialised Research & Clinical Interests
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            {ongoingInquiries.map((item, idx: number) => (
              <div key={idx} style={{ background: "#fff", padding: "28px", borderRadius: "12px", border: "1px solid rgba(18,54,83,0.08)" }}>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: "20px", color: "var(--navy)", marginBottom: "10px" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.7 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "4.5rem 2rem", background: "var(--navy)", color: "#fff", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px, 3.5vw, 36px)", color: "#fff", marginBottom: "1rem" }}>
            Explore Our Comprehensive Photo Gallery
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "15px", lineHeight: 1.7, marginBottom: "2rem" }}>
            View academic certificates, surgical milestones, and clinical facility photos in our verified photo archive.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/gallery" className="btn-gold" style={{ padding: "14px 28px", textDecoration: "none" }}>
              View Photo Gallery
            </Link>
            <Link href="/book-appointment" className="btn-navy" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", padding: "14px 28px", textDecoration: "none" }}>
              Book an Appointment
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
