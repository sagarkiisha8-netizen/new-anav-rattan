import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getSiteContent } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Our ENT Specialists | Dr. Rattan ENT Clinic Chandigarh",
  description:
    "Consult Dr. Ganesh Dutt Rattan (Founder, 35+ years experience, PGI Chandigarh alumnus) and Dr. Anav Rattan (MS, DNB, MNAMS, KEM Hospital Mumbai alumnus) in Chandigarh.",
};

export default async function DoctorsPage() {
  const siteContent = await getSiteContent();
  const doctors = siteContent.doctors || [];

  return (
    <main>
      {/* Header */}
      <section style={{ padding: "5rem 2rem 4rem", background: "linear-gradient(135deg, var(--navy) 0%, #0d283f 100%)", color: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <Breadcrumbs items={[{ label: "Our Doctors" }]} />
          </div>
          <div style={{ maxWidth: "780px" }}>
            <div className="section-label" style={{ color: "var(--gold)", marginBottom: "0.5rem" }}>
              PGI & KEM INSTITUTIONAL PEDIGREE
            </div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 44px)", lineHeight: 1.2, color: "#fff", marginBottom: "1.25rem" }}>
              Our Senior ENT Specialists & Surgeons
            </h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.85)", lineHeight: 1.75 }}>
              Combining over 35 years of established surgical mastery with modern otological, cochlear implant, and skull base innovations to serve patients with utmost clinical integrity.
            </p>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section style={{ padding: "5rem 2rem", background: "var(--cream)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "36px" }}>
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              style={{
                background: "#fff",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 30px rgba(18,54,83,0.06)",
                border: "1px solid rgba(18,54,83,0.08)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                {doctor.image && doctor.image.trim() !== "" ? (
                  <div style={{ height: "380px", position: "relative", background: "var(--navy)" }}>
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      fill
                      style={{ objectFit: "cover", objectPosition: "top center" }}
                      priority
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "16px",
                        left: "16px",
                        background: "rgba(18,54,83,0.9)",
                        backdropFilter: "blur(4px)",
                        padding: "5px 14px",
                        borderRadius: "20px",
                        color: "var(--gold)",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {doctor.title}
                    </div>
                  </div>
                ) : null}

                <div style={{ padding: "32px 28px 20px" }}>
                  {(!doctor.image || doctor.image.trim() === "") && (
                    <div style={{ marginBottom: "12px" }}>
                      <span style={{ background: "rgba(18,54,83,0.08)", color: "var(--navy)", padding: "4px 12px", borderRadius: "16px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {doctor.title}
                      </span>
                    </div>
                  )}
                  <h2 style={{ fontFamily: "var(--serif)", fontSize: "24px", color: "var(--navy)", marginBottom: "4px" }}>
                    {doctor.name}
                  </h2>
                  <div style={{ color: "var(--gold)", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>
                    {doctor.degrees || doctor.qualifications}
                  </div>
                  {doctor.regNumber && (
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>
                      {doctor.regNumber}
                    </div>
                  )}

                  <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: 1.7, marginBottom: "20px" }}>
                    {doctor.bio}
                  </p>

                  {doctor.specialties && doctor.specialties.length > 0 && (
                    <div style={{ borderTop: "1px solid rgba(18,54,83,0.08)", paddingTop: "16px", marginBottom: "16px" }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--navy)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                        Primary Clinical Areas:
                      </div>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                        {doctor.specialties.slice(0, 4).map((spec, sIdx) => (
                          <li key={sIdx}>✓ {spec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ padding: "0 28px 28px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Link
                  href={`/doctors/${doctor.slug}`}
                  className="btn-navy"
                  style={{ flex: 1, minWidth: "140px", justifyContent: "center", textDecoration: "none", display: "flex", padding: "12px 16px", fontSize: "14px" }}
                >
                  Full Profile →
                </Link>
                <Link
                  href="/book-appointment"
                  className="btn-gold"
                  style={{ flex: 1, minWidth: "140px", justifyContent: "center", textDecoration: "none", display: "flex", padding: "12px 16px", fontSize: "14px" }}
                >
                  Book Visit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OPD Timings and Location Info */}
      <section style={{ padding: "4.5rem 2rem", background: "#fff", borderTop: "1px solid rgba(18,54,83,0.06)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <div className="section-label" style={{ color: "var(--gold)", marginBottom: "0.5rem" }}>
            CLINIC APPOINTMENTS
          </div>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "28px", color: "var(--navy)", marginBottom: "1rem" }}>
            Consultation Hours at Sector 33C, Chandigarh
          </h2>
          <div style={{ display: "inline-block", background: "var(--cream)", border: "1px solid rgba(18,54,83,0.08)", borderRadius: "12px", padding: "16px 28px", marginBottom: "1.5rem" }}>
            <span style={{ fontWeight: 600, color: "var(--navy)" }}>Morning:</span> {siteContent.contact.morningOpd} &nbsp;|&nbsp; 
            <span style={{ fontWeight: 600, color: "var(--navy)" }}> Evening:</span> {siteContent.contact.eveningOpd} &nbsp;|&nbsp; 
            <span style={{ fontWeight: 600, color: "var(--navy)" }}> Sunday:</span> {siteContent.contact.sundayOpd}
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.7, maxWidth: "600px", margin: "0 auto 2rem" }}>
            Both doctors consult at our clinic premises in Sector 33C. Direct in-person clinical examinations with high-magnification microscopy are performed during OPD hours.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/book-appointment" className="btn-gold" style={{ padding: "12px 24px", textDecoration: "none" }}>
              Request Appointment Online
            </Link>
            <a href={`tel:${siteContent.contact.phone.replace(/[^0-9]/g, '')}`} className="btn-navy" style={{ padding: "12px 24px", textDecoration: "none" }}>
              Call {siteContent.contact.phone}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
