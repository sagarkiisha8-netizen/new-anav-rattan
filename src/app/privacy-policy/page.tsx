import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Dr. Rattan ENT Clinic",
  description: "Privacy policy and patient data confidentiality guidelines at Dr. Rattan ENT Clinic, Chandigarh.",
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <section style={{ padding: "6rem 2rem 4.5rem", background: "linear-gradient(135deg, #0b2438 0%, #123653 60%, #0d2a42 100%)", color: "#fff", textAlign: "center" }}>
        <div style={{ fontSize: "11.5px", fontWeight: "600", letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1rem", display: "inline-flex", alignItems: "center", gap: "10px" }}>
          <span style={{ display: "inline-block", width: "20px", height: "1.5px", background: "var(--gold)" }}></span>
          Patient Confidentiality & Trust
          <span style={{ display: "inline-block", width: "20px", height: "1.5px", background: "var(--gold)" }}></span>
        </div>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(34px, 4vw, 48px)", marginBottom: "1rem" }}>Privacy Policy</h1>
        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.75)", maxWidth: "600px", margin: "0 auto" }}>
          How we protect your medical records, personal details, and clinical data.
        </p>
      </section>

      <section style={{ padding: "5rem 2rem", background: "#fff" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", lineHeight: 1.8, color: "var(--text)" }}>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "2rem" }}>Last updated: September 2026</p>

          <h2 style={{ fontFamily: "var(--serif)", fontSize: "24px", color: "var(--navy)", marginBottom: "1rem" }}>1. Information We Collect</h2>
          <p style={{ marginBottom: "1.5rem" }}>
            When you schedule an appointment, submit an enquiry, or visit Dr. Rattan ENT Clinic, we collect personal and medical information necessary for your healthcare, including your name, contact phone number, email address, medical symptoms, clinical history, and diagnostic records.
          </p>

          <h2 style={{ fontFamily: "var(--serif)", fontSize: "24px", color: "var(--navy)", margin: "2.5rem 0 1rem" }}>2. How We Use Your Information</h2>
          <p style={{ marginBottom: "1rem" }}>We use the collected information exclusively to:</p>
          <ul style={{ listStylePosition: "inside", paddingLeft: "1rem", marginBottom: "1.5rem" }}>
            <li>Provide professional medical consultations, examinations, and surgical care.</li>
            <li>Maintain accurate medical records in accordance with Indian healthcare regulations.</li>
            <li>Contact you regarding appointment confirmations, follow-ups, and test results.</li>
            <li>Respond to your health queries submitted through our website or direct channels.</li>
          </ul>

          <h2 style={{ fontFamily: "var(--serif)", fontSize: "24px", color: "var(--navy)", margin: "2.5rem 0 1rem" }}>3. Confidentiality and Medical Records</h2>
          <p style={{ marginBottom: "1.5rem" }}>
            We adhere strictly to medical confidentiality standards and medical ethics. Your personal details and medical history are never sold, rented, or shared with third parties for commercial or marketing purposes. Information is only disclosed to healthcare associates when directly necessary for your clinical treatment or as required by law.
          </p>

          <h2 style={{ fontFamily: "var(--serif)", fontSize: "24px", color: "var(--navy)", margin: "2.5rem 0 1rem" }}>4. Data Security</h2>
          <p style={{ marginBottom: "1.5rem" }}>
            We implement administrative and technical security measures to protect your personal information against unauthorized access, loss, or disclosure.
          </p>

          <h2 style={{ fontFamily: "var(--serif)", fontSize: "24px", color: "var(--navy)", margin: "2.5rem 0 1rem" }}>5. Contact Us</h2>
          <p style={{ marginBottom: "2rem" }}>
            If you have questions regarding this Privacy Policy or wish to review your records, please contact our clinic at:
          </p>
          <div style={{ background: "var(--cream)", padding: "1.5rem", borderRadius: "8px", borderLeft: "4px solid var(--gold)" }}>
            <strong>Dr. Rattan ENT Clinic</strong><br />
            SCO 123, Sector 33C, Chandigarh 160020<br />
            Phone: <a href="tel:01722610806" style={{ color: "var(--navy)", fontWeight: 600 }}>0172-2610806</a><br />
            Email: <a href="mailto:rattananav@gmail.com" style={{ color: "var(--navy)", fontWeight: 600 }}>rattananav@gmail.com</a>
          </div>

          <div style={{ marginTop: "3.5rem", textAlign: "center" }}>
            <Link href="/" className="btn-primary" style={{ background: "var(--navy)", color: "#fff" }}>
              Return to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
