"use client";

import { useState } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export interface ContactConfig {
  address?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  googleMapsUrl?: string;
  morningOpd?: string;
  eveningOpd?: string;
  sundayOpd?: string;
}

export default function ContactClientView({ contact }: { contact?: ContactConfig }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Consultation",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const phoneDisplay = contact?.phone || "0172-2610806";
  const phoneClean = phoneDisplay.replace(/[^0-9]/g, "");
  const whatsappDisplay = contact?.whatsapp || "+91 9988004806";
  const whatsappClean = whatsappDisplay.replace(/[^0-9]/g, "");
  const emailDisplay = contact?.email || "rattananav@gmail.com";
  const addressDisplay = contact?.address || "SCO 123, Sector 33C, Chandigarh 160020, India";
  const mapsUrl = contact?.googleMapsUrl || "https://maps.google.com/?q=Sector+33C+Chandigarh";
  const morningOpd = contact?.morningOpd || "10:00 AM – 2:00 PM (Mon – Sat)";
  const eveningOpd = contact?.eveningOpd || "5:30 PM – 8:00 PM (Mon – Sat)";
  const sundayOpd = contact?.sundayOpd || "11:00 AM – 1:00 PM";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.subject,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please call reception directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      {/* Header */}
      <section style={{ padding: "clamp(3rem, 6vw, 5rem) clamp(1rem, 4vw, 2rem) clamp(2.5rem, 5vw, 4rem)", background: "linear-gradient(135deg, var(--navy) 0%, #0d283f 100%)", color: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <Breadcrumbs items={[{ label: "Contact Us" }]} />
          </div>
          <div style={{ maxWidth: "780px" }}>
            <div className="section-label" style={{ color: "var(--gold)", marginBottom: "0.5rem" }}>
              CLINIC LOCATION & INQUIRIES
            </div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.2, color: "#fff", marginBottom: "1.25rem" }}>
              Get in Touch with Dr. Rattan ENT Clinic
            </h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.85)", lineHeight: 1.75 }}>
              Located in Sector 33C, Chandigarh. We welcome inquiries regarding outpatient consultations, diagnostic evaluations, surgical opinions, and audiometry appointments.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: "clamp(2.5rem, 5vw, 5rem) clamp(1rem, 4vw, 2rem)", background: "var(--cream)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: "clamp(24px, 4vw, 40px)", alignItems: "start" }}>
            
            {/* Left: Contact Details & OPD Hours */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Card 1: Clinic Coordinates */}
              <div style={{ background: "#fff", padding: "clamp(20px, 4vw, 32px)", borderRadius: "14px", border: "1px solid rgba(18,54,83,0.08)", boxShadow: "0 4px 20px rgba(18,54,83,0.04)" }}>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px, 3vw, 24px)", color: "var(--navy)", marginBottom: "1.5rem" }}>
                  Clinic Address & Access
                </h2>

                <div style={{ display: "flex", gap: "16px", marginBottom: "1.5rem" }}>
                  <span style={{ fontSize: "24px", color: "var(--gold)", flexShrink: 0 }}>📍</span>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--navy)", fontSize: "15px", marginBottom: "4px" }}>
                      Dr. Rattan ENT Clinic
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                      {addressDisplay}
                    </div>
                    <a 
                      href={mapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ display: "inline-block", marginTop: "8px", fontSize: "13px", fontWeight: 600, color: "var(--gold)", textDecoration: "none" }}
                    >
                      Open in Google Maps ↗
                    </a>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px", marginBottom: "1.5rem" }}>
                  <span style={{ fontSize: "24px", color: "var(--gold)", flexShrink: 0 }}>📞</span>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--navy)", fontSize: "15px", marginBottom: "4px" }}>
                      Telephone & WhatsApp
                    </div>
                    <div style={{ fontSize: "14px", color: "var(--text)" }}>
                      Reception: <a href={`tel:${phoneClean}`} style={{ color: "var(--navy)", fontWeight: 600 }}>{phoneDisplay}</a>
                    </div>
                    <div style={{ fontSize: "14px", color: "var(--text)", marginTop: "2px" }}>
                      WhatsApp Helpline: <a href={`https://wa.me/${whatsappClean}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--navy)", fontWeight: 600 }}>{whatsappDisplay}</a>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px" }}>
                  <span style={{ fontSize: "24px", color: "var(--gold)", flexShrink: 0 }}>✉️</span>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--navy)", fontSize: "15px", marginBottom: "4px" }}>
                      Direct Email
                    </div>
                    <a href={`mailto:${emailDisplay}`} style={{ fontSize: "14px", color: "var(--navy)", fontWeight: 600, textDecoration: "none" }}>
                      {emailDisplay}
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 2: OPD Timings */}
              <div style={{ background: "#fff", padding: "32px", borderRadius: "14px", border: "1px solid rgba(18,54,83,0.08)", boxShadow: "0 4px 20px rgba(18,54,83,0.04)" }}>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: "20px", color: "var(--navy)", marginBottom: "1rem" }}>
                  Consultation OPD Hours
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid rgba(18,54,83,0.06)" }}>
                    <span style={{ color: "var(--text)" }}>Morning:</span>
                    <strong style={{ color: "var(--navy)" }}>{morningOpd}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid rgba(18,54,83,0.06)" }}>
                    <span style={{ color: "var(--text)" }}>Evening:</span>
                    <strong style={{ color: "var(--navy)" }}>{eveningOpd}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text)" }}>Sunday:</span>
                    <strong style={{ color: "var(--gold)" }}>{sundayOpd}</strong>
                  </div>
                </div>
              </div>

              {/* Direct Appointment CTA Prompt */}
              <div style={{ background: "var(--navy)", color: "#fff", padding: "24px", borderRadius: "14px", textAlign: "center" }}>
                <h4 style={{ fontFamily: "var(--serif)", fontSize: "18px", color: "#fff", marginBottom: "8px" }}>
                  Looking for a scheduled appointment?
                </h4>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", marginBottom: "16px" }}>
                  Use our dedicated booking form to select preferred visit timings and specialists.
                </p>
                <Link href="/book-appointment" className="btn-gold" style={{ padding: "10px 20px", fontSize: "13px", textDecoration: "none", display: "inline-block" }}>
                  Go to Appointment Booking →
                </Link>
              </div>
            </div>

            {/* Right: Interactive Validated Message Form */}
            <div style={{ background: "#fff", padding: "36px 32px", borderRadius: "14px", border: "1px solid rgba(18,54,83,0.08)", boxShadow: "0 4px 24px rgba(18,54,83,0.05)" }}>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ width: "64px", height: "64px", background: "rgba(201,162,74,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 1.5rem" }}>
                    ✓
                  </div>
                  <h3 style={{ fontFamily: "var(--serif)", fontSize: "26px", color: "var(--navy)", marginBottom: "12px" }}>
                    Message Sent Successfully
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: 1.7, maxWidth: "460px", margin: "0 auto 2rem" }}>
                    Thank you, <strong>{formData.name}</strong>. Our clinical coordinator will review your inquiry regarding &ldquo;{formData.subject}&rdquo; and respond promptly.
                  </p>
                  <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                    <a
                      href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent(`Hello Dr. Rattan ENT Clinic, I sent a message regarding: ${formData.subject}. My name is ${formData.name}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold"
                      style={{ padding: "12px 24px", textDecoration: "none" }}
                    >
                      Connect on WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", email: "", phone: "", subject: "General Consultation", message: "" });
                      }}
                      className="btn-navy"
                      style={{ padding: "12px 24px" }}
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 style={{ fontFamily: "var(--serif)", fontSize: "24px", color: "var(--navy)", marginBottom: "8px" }}>
                    Send Us an Inquiry
                  </h2>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "2rem" }}>
                    Fill out the form below for treatment queries or medical questions. We reply within clinic hours.
                  </p>

                  {submitError && (
                    <div style={{ padding: "12px 16px", borderRadius: "8px", background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: "14px", marginBottom: "1rem" }}>
                      {submitError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--navy)", marginBottom: "6px" }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid rgba(18,54,83,0.15)",
                          fontSize: "14px",
                          outline: "none",
                        }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--navy)", marginBottom: "6px" }}>
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. 9876543210"
                          style={{
                            width: "100%",
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid rgba(18,54,83,0.15)",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--navy)", marginBottom: "6px" }}>
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. ramesh@example.com"
                          style={{
                            width: "100%",
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid rgba(18,54,83,0.15)",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--navy)", marginBottom: "6px" }}>
                        Topic / Speciality *
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid rgba(18,54,83,0.15)",
                          fontSize: "14px",
                          outline: "none",
                          background: "#fff",
                        }}
                      >
                        <option value="General Consultation">General ENT Consultation</option>
                        <option value="Ear Microsurgery / Otology">Ear Microsurgery / Hearing Loss</option>
                        <option value="Cochlear Implantation">Cochlear Implants & Rehabilitation</option>
                        <option value="Sinus & Allergy Care">Sinus, FESS & Allergy</option>
                        <option value="Throat & Voice Disorders">Throat, Voice & Laryngoscopy</option>
                        <option value="Vertigo & Balance Testing">Vertigo & Vestibular Assessment</option>
                        <option value="Pediatric ENT Care">Pediatric ENT Care</option>
                        <option value="Head & Neck Surgery">Head & Neck / Thyroid / Parotid</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--navy)", marginBottom: "6px" }}>
                        Your Message / Clinical Details *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Briefly describe your symptoms, duration, or any prior treatments..."
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: "1px solid rgba(18,54,83,0.15)",
                          fontSize: "14px",
                          outline: "none",
                          resize: "vertical",
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-gold"
                      style={{
                        padding: "14px 24px",
                        fontSize: "15px",
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        justifyContent: "center",
                        marginTop: "8px",
                        opacity: isSubmitting ? 0.7 : 1,
                      }}
                    >
                      {isSubmitting ? "Sending Inquiry..." : "Submit Inquiry →"}
                    </button>

                    <div style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", marginTop: "4px" }}>
                      🔒 Your medical inquiries are strictly confidential under clinic privacy policy.
                    </div>
                  </form>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
