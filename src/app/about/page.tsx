import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getSiteContent } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "About Us | Dr. Rattan ENT Clinic Chandigarh",
  description:
    "Founded by Dr. Ganesh Dutt Rattan, Dr. Rattan ENT Clinic brings over 35 years of PGI-trained surgical excellence and compassionate medical care to Chandigarh and North India.",
};

export default async function AboutPage() {
  const siteContent = await getSiteContent();
  const about = siteContent.about;
  const doctors = siteContent.doctors || [];

  return (
    <main>
      {/* Page Header */}
      <section style={{ padding: "5rem 2rem 4rem", background: "linear-gradient(135deg, var(--navy) 0%, #0d283f 100%)", color: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <Breadcrumbs items={[{ label: "About Our Clinic" }]} />
          </div>
          <div style={{ maxWidth: "780px" }}>
            <div className="section-label" style={{ color: "var(--gold)", marginBottom: "0.75rem" }}>
              {about.label || "INSTITUTIONAL HERITAGE & CARE"}
            </div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 44px)", lineHeight: 1.2, color: "#fff", marginBottom: "1.25rem" }}>
              {about.title}
            </h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.85)", lineHeight: 1.75 }}>
              {about.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Legacy and History Section */}
      {(() => {
        const hasLegacyImage = Boolean(about.legacyImage && about.legacyImage.trim());
        return (
          <section style={{ padding: "5rem 2rem", background: "#fff" }}>
            <div style={{
              maxWidth: hasLegacyImage ? "1200px" : "860px",
              margin: "0 auto",
              display: hasLegacyImage ? "grid" : "block",
              gridTemplateColumns: hasLegacyImage ? "repeat(auto-fit, minmax(320px, 1fr))" : undefined,
              gap: hasLegacyImage ? "48px" : undefined,
              alignItems: "center"
            }}>
              <div>
                <div className="section-label" style={{ color: "var(--gold)", marginBottom: "0.5rem" }}>
                  {about.experienceYears || "35+"} YEARS OF SURGICAL CARE
                </div>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px, 3.2vw, 36px)", color: "var(--navy)", marginBottom: "1.25rem", lineHeight: 1.25 }}>
                  A Legacy Built on PGI Rigour & Diagnostic Integrity
                </h2>
                <p style={{ fontSize: "15px", color: "var(--text)", lineHeight: 1.8, marginBottom: "1.2rem" }}>
                  Dr. Rattan ENT Clinic was established by <strong>Dr. Ganesh Dutt Rattan</strong> following years of senior residency at the prestigious <em>Postgraduate Institute of Medical Education and Research (PGIMER), Chandigarh</em> and <em>Sir Ganga Ram Hospital, New Delhi</em>. 
                </p>
                <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                  From its inception, the clinic was envisioned as a center where complex ear, nose, and throat disorders are assessed with institutional diagnostic thoroughness, avoiding hasty judgments or unnecessary surgical interventions. Today, with <strong>Dr. Anav Rattan</strong> (MS ENT, DNB) bringing subspecialty mastery in Otology, Cochlear Implants, and Skull Base Surgery from Seth G.S. Medical College & KEM Hospital, Mumbai, the practice combines mature surgical judgment with modern techniques.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginTop: "2rem" }}>
                  <div style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "16px" }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: "28px", color: "var(--navy)", fontWeight: 700 }}>{about.experienceYears || "35+"}</div>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Years of Clinical Experience</div>
                  </div>
                  <div style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "16px" }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: "28px", color: "var(--navy)", fontWeight: 700 }}>{about.trainingInstitution || "PGI & KEM"}</div>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Premier Institutional Training</div>
                  </div>
                </div>
              </div>

              {hasLegacyImage && (
                <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", boxShadow: "0 16px 40px rgba(18,54,83,0.12)", border: "1px solid rgba(18,54,83,0.1)" }}>
                  <Image 
                    src={about.legacyImage} 
                    alt="Dr. Ganesh Dutt Rattan and Dr. Anav Rattan at Dr. Rattan ENT Clinic Chandigarh"
                    width={700}
                    height={550}
                    style={{ width: "100%", height: "auto", objectFit: "cover", display: "block" }}
                    priority
                  />
                  <div style={{ padding: "16px 20px", background: "var(--navy)", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--gold)" }}>Dr. Ganesh Dutt Rattan & Dr. Anav Rattan</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)" }}>Consultant ENT & Head-Neck Surgeons</div>
                    </div>
                    <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(201,162,74,0.2)", padding: "4px 10px", borderRadius: "20px", color: "var(--gold)" }}>
                      Chandigarh
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })()}

      {/* Mission, Vision, and Clinical Philosophy */}
      <section style={{ padding: "5rem 2rem", background: "var(--cream)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 3.5rem" }}>
            <div className="section-label" style={{ color: "var(--gold)", marginBottom: "0.5rem" }}>
              OUR FOUNDING PRINCIPLES
            </div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px, 3.2vw, 36px)", color: "var(--navy)" }}>
              Mission, Vision & Practice Philosophy
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
            {/* Card 1 */}
            <div style={{ background: "#fff", padding: "36px 30px", borderRadius: "14px", border: "1px solid rgba(18,54,83,0.08)", boxShadow: "0 4px 20px rgba(18,54,83,0.04)" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(201,162,74,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "1.25rem", color: "var(--navy)" }}>
                🎯
              </div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "22px", color: "var(--navy)", marginBottom: "0.85rem" }}>
                Our Mission
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.75 }}>
                {about.mission || "To deliver honest, evidence-driven, and patient-centered ENT healthcare. We aim to restore hearing, alleviate chronic sinonasal discomfort, safeguard vocal function, and resolve balance disorders through accurate clinical workup and ethical medical counseling."}
              </p>
            </div>

            {/* Card 2 */}
            <div style={{ background: "#fff", padding: "36px 30px", borderRadius: "14px", border: "1px solid rgba(18,54,83,0.08)", boxShadow: "0 4px 20px rgba(18,54,83,0.04)" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(18,54,83,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "1.25rem", color: "var(--navy)" }}>
                🔭
              </div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "22px", color: "var(--navy)", marginBottom: "0.85rem" }}>
                Our Vision
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.75 }}>
                {about.vision || "To remain the regional benchmark for otological microsurgery, auditory implant rehabilitation, and skull base care in North India, upholding the highest standards of safety, sterility, and long-term functional recovery for every patient."}
              </p>
            </div>

            {/* Card 3 */}
            <div style={{ background: "#fff", padding: "36px 30px", borderRadius: "14px", border: "1px solid rgba(18,54,83,0.08)", boxShadow: "0 4px 20px rgba(18,54,83,0.04)" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(201,162,74,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "1.25rem", color: "var(--navy)" }}>
                ⚖️
              </div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "22px", color: "var(--navy)", marginBottom: "0.85rem" }}>
                Conservative Surgical Ethics
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.75 }}>
                {about.ethics || "We believe surgery is reserved for conditions where conservative medical management has reached its limits or where definitive anatomical correction is clinically mandatory. Every patient receives a transparent explanation of risks, benefits, and alternatives."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Faculty Showcase */}
      <section style={{ padding: "5rem 2rem", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 3.5rem" }}>
            <div className="section-label" style={{ color: "var(--gold)", marginBottom: "0.5rem" }}>
              SENIOR CONSULTANTS
            </div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px, 3.2vw, 36px)", color: "var(--navy)" }}>
              Meet Our ENT Specialists
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", marginTop: "8px" }}>
              Institutional pedigree, decades of operative experience, and active participation in academic otolaryngology.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: "32px" }}>
            {doctors.map((doc, idx) => (
              <div 
                key={doc.id || idx}
                style={{ 
                  borderRadius: "16px", 
                  border: "1px solid rgba(18,54,83,0.1)", 
                  overflow: "hidden", 
                  background: "#fff",
                  boxShadow: "0 6px 24px rgba(18,54,83,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div>
                  <div className="doctor-card-image" style={{ width: "100%", aspectRatio: "4 / 5", position: "relative", overflow: "hidden", background: "var(--cream)" }}>
                    <Image 
                      src={doc.image || (idx === 0 ? "/images/dr-ganesh-dutt-rattan-0.jpeg" : "/images/dr-anav-rattan-1.jpeg")}
                      alt={doc.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 520px"
                      style={{ objectFit: "cover", objectPosition: "center top" }}
                    />
                    <div style={{ position: "absolute", bottom: "16px", left: "16px", background: "rgba(18,54,83,0.9)", backdropFilter: "blur(4px)", padding: "4px 12px", borderRadius: "20px", color: "var(--gold)", fontSize: "12px", fontWeight: 600 }}>
                      {doc.role || (idx === 0 ? "Founder & Senior Surgeon" : "Consultant Otologist")}
                    </div>
                  </div>

                  <div style={{ padding: "28px" }}>
                    <h3 style={{ fontFamily: "var(--serif)", fontSize: "24px", color: "var(--navy)", marginBottom: "4px" }}>
                      {doc.name}
                    </h3>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--gold)", marginBottom: "12px" }}>
                      {doc.qualifications || doc.degrees || doc.title}
                    </div>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "16px" }}>
                      {doc.bio}
                    </p>
                    {((doc.specialties && doc.specialties.length > 0) || (doc.achievements && doc.achievements.length > 0)) && (
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "13px", color: "var(--navy)", display: "flex", flexDirection: "column", gap: "6px" }}>
                        {(doc.specialties || doc.achievements || []).slice(0, 3).map((h: string, hIdx: number) => (
                          <li key={hIdx}>✓ {h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div style={{ padding: "0 28px 28px" }}>
                  <Link 
                    href={`/doctors/${doc.slug || (doc.name.includes("Ganesh") ? "ganesh-dutt-rattan" : "anav-rattan")}`} 
                    className="btn-navy"
                    style={{ width: "100%", justifyContent: "center", textDecoration: "none", display: "flex", padding: "11px 18px", fontSize: "14px" }}
                  >
                    View Full Profile & Credentials →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities & Diagnostic Infrastructure */}
      <section style={{ padding: "5rem 2rem", background: "var(--cream)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 3.5rem" }}>
            <div className="section-label" style={{ color: "var(--gold)", marginBottom: "0.5rem" }}>
              DIAGNOSTIC EXCELLENCE
            </div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px, 3.2vw, 36px)", color: "var(--navy)" }}>
              Clinical Infrastructure & Equipment
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", marginTop: "8px" }}>
              Modern optical, endoscopic, and audiometric diagnostic setups enabling precise in-clinic evaluation.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {(about.facilities && about.facilities.length > 0 ? about.facilities : [
              { icon: "🔬", title: "High-Magnification Otomicroscopy", desc: "Enables microscopic assessment of the tympanic membrane, retraction pockets, middle ear mucosa, and precise micro-suction." },
              { icon: "📸", title: "High-Definition Rigid & Flexible Endoscopy", desc: "Karl Storz endoscopic visualization of sinonasal passages, osteomeatal complexes, adenoids, and dynamic vocal cord motion." },
              { icon: "📊", title: "Audiological Assessment Suite", desc: "Sound-treated room testing including Pure Tone Audiometry, speech audiometry, and impedance tympanometry for middle ear pressure." },
              { icon: "🛡️", title: "Hospital-Grade Autoclaving", desc: "Rigorous multi-stage sterilization protocols, single-use disposables, and ultrasonic cleaning meeting institutional safety benchmarks." }
            ]).map((fac: { icon?: string; title: string; desc: string }, fIdx: number) => (
              <div key={fIdx} style={{ background: "#fff", padding: "28px", borderRadius: "12px", border: "1px solid rgba(18,54,83,0.08)" }}>
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{fac.icon || "🏥"}</div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: "18px", color: "var(--navy)", marginBottom: "8px" }}>
                  {fac.title}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.65 }}>
                  {fac.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Journey */}
      <section style={{ padding: "5rem 2rem", background: "#fff" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-label" style={{ color: "var(--gold)", marginBottom: "0.5rem" }}>
              STEP-BY-STEP CARE
            </div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px, 3.2vw, 36px)", color: "var(--navy)" }}>
              The Patient Care Pathway
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {(about.patientJourney && about.patientJourney.length > 0 ? about.patientJourney : [
              { step: "01", title: "Comprehensive Clinical Consultation", desc: "Detailed discussion of your symptoms, duration, prior prescriptions, and full medical history without rushing." },
              { step: "02", title: "Objective Diagnostic Workup", desc: "In-clinic microscopic or endoscopic examination and audiometric evaluation when indicated, providing instant clarity on anatomy." },
              { step: "03", title: "Transparent Decision-Making", desc: "We review findings directly with you on monitor displays, explaining medical management options and surgical indications clearly." },
              { step: "04", title: "Personalised Treatment & Follow-up", desc: "Structured medical treatment courses or meticulous operative planning followed by scheduled post-intervention reviews." },
            ]).map((item: { step?: string; title: string; desc: string }, idx: number) => (
              <div key={idx} style={{ display: "flex", gap: "20px", alignItems: "flex-start", padding: "20px", borderRadius: "12px", background: "var(--cream)", border: "1px solid rgba(18,54,83,0.06)" }}>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--gold)", background: "var(--navy)", padding: "8px 14px", borderRadius: "8px", flexShrink: 0 }}>
                  {item.step || `0${idx + 1}`}
                </span>
                <div>
                  <h4 style={{ fontFamily: "var(--serif)", fontSize: "18px", color: "var(--navy)", marginBottom: "6px" }}>{item.title}</h4>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action CTA */}
      <section style={{ padding: "4.5rem 2rem", background: "var(--navy)", color: "#fff", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px, 3.5vw, 36px)", color: "#fff", marginBottom: "1rem" }}>
            Experience Trusted, Institutional ENT Care
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "15px", lineHeight: 1.7, marginBottom: "2rem" }}>
            Consult Dr. Ganesh Dutt Rattan and Dr. Anav Rattan at our clinic in Sector 33C, Chandigarh.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/book-appointment" className="btn-gold" style={{ padding: "14px 28px", textDecoration: "none" }}>
              Book an Appointment
            </Link>
            <Link href="/contact" className="btn-navy" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", padding: "14px 28px", textDecoration: "none" }}>
              Clinic Hours & Location
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
