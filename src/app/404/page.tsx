import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Dr. Rattan ENT Clinic",
  description: "The page you are looking for does not exist or has been moved.",
};

export default function Explicit404Page() {
  return (
    <main style={{ minHeight: "65vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "4rem 2rem", background: "var(--cream)" }}>
      <div style={{ maxWidth: "540px", background: "#fff", padding: "3rem 2rem", borderRadius: "14px", border: "1px solid var(--border)", boxShadow: "0 10px 30px rgba(18,54,83,0.08)" }}>
        <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.5rem" }}>
          ERROR 404
        </div>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "56px", color: "var(--navy)", margin: "0.5rem 0", lineHeight: 1 }}>
          Page Not Found
        </h1>
        <p style={{ color: "var(--muted)", margin: "1.25rem 0 2rem", lineHeight: 1.6 }}>
          We could not find the page you were looking for. It may have been relocated, updated, or temporarily unavailable.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn-primary" style={{ background: "var(--navy)", color: "#fff" }}>
            Return Home
          </Link>
          <Link href="/services" className="btn-outline" style={{ borderColor: "var(--navy)", color: "var(--navy)" }}>
            Explore Services
          </Link>
        </div>
      </div>
    </main>
  );
}
