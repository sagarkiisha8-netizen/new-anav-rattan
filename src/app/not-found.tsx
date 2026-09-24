import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Dr. Rattan ENT Clinic",
};

export default function NotFoundPage() {
  return (
    <main style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" }}>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: "64px", color: "var(--navy)", marginBottom: "1rem" }}>404</h1>
      <h2 style={{ fontSize: "24px", color: "var(--gold)", marginBottom: "1.5rem" }}>Page Not Found</h2>
      <p style={{ color: "var(--muted)", maxWidth: "400px", marginBottom: "2rem" }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/" className="btn-primary" style={{ background: "var(--navy)", color: "#fff" }}>
        Return Home
      </Link>
    </main>
  );
}
