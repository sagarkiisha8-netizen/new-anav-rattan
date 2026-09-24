"use client";

import { useState } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function BookAppointmentPage() {
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "Male",
    phone: "",
    email: "",
    doctor: "Either Specialist / First Available",
    visitType: "First-time Consultation",
    preferredDate: "",
    preferredSlot: "Morning (10:00 AM – 2:00 PM)",
    symptoms: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.patientName,
          phone: formData.phone,
          email: formData.email,
          service: `${formData.visitType} (${formData.gender}, ${formData.age} yrs)`,
          doctor: formData.doctor,
          date: formData.preferredDate,
          time: formData.preferredSlot,
          message: formData.symptoms,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit appointment request");
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setSubmitError(err.message || "Failed to process appointment request. Please contact clinic reception.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format WhatsApp confirmation text
  const waText = encodeURIComponent(
    `Hello Dr. Rattan ENT Clinic, I have requested an appointment.\n` +
    `Patient: ${formData.patientName} (${formData.gender}, ${formData.age} yrs)\n` +
    `Doctor: ${formData.doctor}\n` +
    `Type: ${formData.visitType}\n` +
    `Date: ${formData.preferredDate || "Earliest available"}\n` +
    `Slot: ${formData.preferredSlot}\n` +
    `Phone: ${formData.phone}`
  );

  return (
    <main>
      {/* Header */}
      <section style={{ padding: "5rem 2rem 4rem", background: "linear-gradient(135deg, var(--navy) 0%, #0d283f 100%)", color: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <Breadcrumbs items={[{ label: "Book Appointment" }]} />
          </div>
          <div style={{ maxWidth: "780px" }}>
            <div className="section-label" style={{ color: "var(--gold)", marginBottom: "0.5rem" }}>
              PRIORITY OPD REGISTRATION
            </div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 44px)", lineHeight: 1.2, color: "#fff", marginBottom: "1.25rem" }}>
              Schedule Your ENT Consultation
            </h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.85)", lineHeight: 1.75 }}>
              Reserve your consultation with Dr. Ganesh Dutt Rattan or Dr. Anav Rattan at our Sector 33C clinic in Chandigarh to avoid waiting delays.
            </p>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section style={{ padding: "4.5rem 2rem", background: "var(--cream)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          
          {submitted ? (
            <div style={{ background: "#fff", borderRadius: "16px", padding: "48px 36px", border: "1px solid rgba(18,54,83,0.08)", boxShadow: "0 8px 30px rgba(18,54,83,0.06)", textAlign: "center" }}>
              <div style={{ width: "72px", height: "72px", background: "rgba(201,162,74,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", margin: "0 auto 1.5rem", color: "var(--navy)" }}>
                ✓
              </div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: "32px", color: "var(--navy)", marginBottom: "12px" }}>
                Appointment Request Received
              </h2>
              <p style={{ color: "var(--text)", fontSize: "16px", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto 2rem" }}>
                Thank you, <strong>{formData.patientName}</strong>. Your consultation request has been logged. Our receptionist will reach out via call/WhatsApp at <strong>{formData.phone}</strong> to confirm your slot time.
              </p>

              {/* Summary Card */}
              <div style={{ background: "var(--cream)", padding: "24px", borderRadius: "12px", border: "1px solid rgba(18,54,83,0.08)", textAlign: "left", maxWidth: "560px", margin: "0 auto 2.5rem" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gold)", marginBottom: "12px" }}>
                  Appointment Summary
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "8px", fontSize: "14px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Specialist:</span>
                  <strong style={{ color: "var(--navy)" }}>{formData.doctor}</strong>

                  <span style={{ color: "var(--text-muted)" }}>Visit Type:</span>
                  <span style={{ color: "var(--navy)" }}>{formData.visitType}</span>

                  <span style={{ color: "var(--text-muted)" }}>Date & Slot:</span>
                  <span style={{ color: "var(--navy)" }}>{formData.preferredDate || "First Available"} · {formData.preferredSlot}</span>

                  <span style={{ color: "var(--text-muted)" }}>Clinic Location:</span>
                  <span style={{ color: "var(--navy)" }}>SCO 123, Sector 33C, Chandigarh</span>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href={`https://wa.me/919988004806?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold"
                  style={{ padding: "14px 28px", textDecoration: "none" }}
                >
                  Confirm Instant Slot on WhatsApp →
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      patientName: "",
                      age: "",
                      gender: "Male",
                      phone: "",
                      email: "",
                      doctor: "Either Specialist / First Available",
                      visitType: "First-time Consultation",
                      preferredDate: "",
                      preferredSlot: "Morning (10:00 AM – 2:00 PM)",
                      symptoms: ""
                    });
                  }}
                  className="btn-navy"
                  style={{ padding: "14px 28px" }}
                >
                  Book for Another Patient
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: "16px", padding: "40px 36px", border: "1px solid rgba(18,54,83,0.08)", boxShadow: "0 8px 30px rgba(18,54,83,0.06)" }}>
              <div style={{ marginBottom: "2rem", borderBottom: "1px solid rgba(18,54,83,0.08)", paddingBottom: "1.5rem" }}>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: "26px", color: "var(--navy)", marginBottom: "6px" }}>
                  Patient Registration Details
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0 }}>
                  Please supply accurate information to help us prepare your clinical record before your arrival.
                </p>
              </div>

              {submitError && (
                <div style={{ padding: "12px 16px", borderRadius: "8px", background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: "14px", marginBottom: "1.5rem" }}>
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
                
                {/* Specialist and Visit Type Row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--navy)", marginBottom: "6px" }}>
                      Consulting Specialist *
                    </label>
                    <select
                      value={formData.doctor}
                      onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border: "1px solid rgba(18,54,83,0.15)",
                        fontSize: "14px",
                        background: "#fff",
                        outline: "none"
                      }}
                    >
                      <option value="Either Specialist / First Available">Either Specialist (First Available)</option>
                      <option value="Dr. Ganesh Dutt Rattan (Founder, 35+ yrs exp)">Dr. Ganesh Dutt Rattan (Founder, 35+ Yrs Exp)</option>
                      <option value="Dr. Anav Rattan (Otology, Cochlear & Skull Base)">Dr. Anav Rattan (Otology, Cochlear & Skull Base)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--navy)", marginBottom: "6px" }}>
                      Nature of Consultation *
                    </label>
                    <select
                      value={formData.visitType}
                      onChange={(e) => setFormData({ ...formData, visitType: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border: "1px solid rgba(18,54,83,0.15)",
                        fontSize: "14px",
                        background: "#fff",
                        outline: "none"
                      }}
                    >
                      <option value="First-time Consultation">First-time Clinical Consultation</option>
                      <option value="Follow-up Review">Follow-up / Post-treatment Review</option>
                      <option value="Surgical Second Opinion">Surgical Second Opinion (Ear / Sinus / Neck)</option>
                      <option value="Audiometry & Hearing Test">Audiometry / Hearing Evaluation</option>
                      <option value="Vertigo / Balance Assessment">Vertigo & Vestibular Assessment</option>
                    </select>
                  </div>
                </div>

                {/* Patient Name, Age, Gender */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--navy)", marginBottom: "6px" }}>
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Harpreet Singh"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border: "1px solid rgba(18,54,83,0.15)",
                        fontSize: "14px",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--navy)", marginBottom: "6px" }}>
                      Age *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="110"
                      placeholder="e.g. 42"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border: "1px solid rgba(18,54,83,0.15)",
                        fontSize: "14px",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--navy)", marginBottom: "6px" }}>
                      Gender *
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border: "1px solid rgba(18,54,83,0.15)",
                        fontSize: "14px",
                        background: "#fff",
                        outline: "none"
                      }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Phone & Email */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--navy)", marginBottom: "6px" }}>
                      Mobile Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9988004806"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border: "1px solid rgba(18,54,83,0.15)",
                        fontSize: "14px",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--navy)", marginBottom: "6px" }}>
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. patient@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border: "1px solid rgba(18,54,83,0.15)",
                        fontSize: "14px",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>

                {/* Date and Slot */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--navy)", marginBottom: "6px" }}>
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border: "1px solid rgba(18,54,83,0.15)",
                        fontSize: "14px",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--navy)", marginBottom: "6px" }}>
                      Preferred OPD Timing Slot *
                    </label>
                    <select
                      value={formData.preferredSlot}
                      onChange={(e) => setFormData({ ...formData, preferredSlot: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border: "1px solid rgba(18,54,83,0.15)",
                        fontSize: "14px",
                        background: "#fff",
                        outline: "none"
                      }}
                    >
                      <option value="Morning (10:00 AM – 2:00 PM)">Morning: 10:00 AM – 2:00 PM (Mon–Sat)</option>
                      <option value="Evening (5:30 PM – 8:00 PM)">Evening: 5:30 PM – 8:00 PM (Mon–Sat)</option>
                      <option value="Sunday (11:00 AM – 1:00 PM)">Sunday: 11:00 AM – 1:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Chief Complaints / Symptoms */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--navy)", marginBottom: "6px" }}>
                    Chief Symptoms / Reason for Visit
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe what you are experiencing (e.g., ear discharge for 2 months, decreased hearing, blocked nose, dizziness when turning)..."
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "8px",
                      border: "1px solid rgba(18,54,83,0.15)",
                      fontSize: "14px",
                      outline: "none",
                      resize: "vertical"
                    }}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold"
                  style={{
                    padding: "15px 28px",
                    fontSize: "15px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    justifyContent: "center",
                    marginTop: "8px",
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? "Processing Registration..." : "Confirm Appointment Request →"}
                </button>

                <div style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center" }}>
                  💡 Need urgent assistance? You can also call the reception directly at <a href="tel:01722610806" style={{ color: "var(--navy)", fontWeight: 600 }}>0172-2610806</a> or message on <a href="https://wa.me/919988004806" target="_blank" rel="noopener noreferrer" style={{ color: "var(--navy)", fontWeight: 600 }}>WhatsApp</a>.
                </div>
              </form>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
