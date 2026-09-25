"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import MeetTheDoctorsSection from "@/components/MeetTheDoctorsSection";
import PatientJourneySection from "@/components/PatientJourneySection";
import PatientTestimonialsSection from "@/components/PatientTestimonialsSection";
import { SiteContent } from "@/lib/types";

function AnimatedStat({ target, suffix, label }: { target: number, suffix: string, label: string }) {
  const { count, ref } = useAnimatedCounter(target, 2000);
  return (
    <div className="trust-item" ref={ref}>
      <div className="num">{count}{suffix}</div>
      <div className="label">{label}</div>
    </div>
  );
}

export default function HomeContent({ initialContent }: { initialContent?: SiteContent | null }) {
  const heroRef = useScrollReveal();
  const trustRef = useScrollReveal();
  const servicesRef = useScrollReveal();

  const [cmsContent, setCmsContent] = useState<SiteContent | null>(initialContent || null);

  useEffect(() => {
    fetch("/api/admin/content", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const fullContent = data?.content || data;
        if (fullContent && fullContent.home) {
          setCmsContent(fullContent);
        }
      })
      .catch(() => {});
  }, []);

  const home = cmsContent?.home;
  const hero = home?.hero;

  const heroBadge = hero?.badge || home?.heroBadge || "Specialist ENT Clinic · Sector 33C, Chandigarh";
  const heroTitle = hero?.title || home?.heroTitle || "Complete Ear, Nose & Throat Care in Chandigarh";
  const heroDescription = hero?.description || "From routine consultations to advanced surgical procedures, Dr. Rattan ENT Clinic provides compassionate, evidence-based ear, nose, and throat care for patients of all ages in Chandigarh.";
  const heroImage = hero?.image !== undefined ? hero.image : (home?.heroImage !== undefined ? home.heroImage : "/images/dr-rattan-and-dr-anav-rattan-hero2.png");
  const primaryBtn = hero?.primaryButton || { label: "Book Appointment", link: "/book-appointment", variant: "primary" };
  const secondaryBtn = hero?.secondaryButton || { label: "Explore Our Services", link: "/services", variant: "secondary" };
  const doctorName = hero?.doctorCardName || "Dr. Ganesh Dutt Rattan & Dr. Anav Rattan";
  const doctorRole = hero?.doctorCardRole || "ENT Specialists";
  const doctorClinic = hero?.doctorCardClinic || "Dr. Rattan ENT Clinic";
  const trustPoints = hero?.trustPoints && hero.trustPoints.length > 0
    ? hero.trustPoints
    : ["Experienced Care", "Modern Diagnosis", "Patient-Focused Treatment"];

  const statistics = home?.statistics && home.statistics.length > 0
    ? home.statistics
    : [
        { number: "35+", label: "Years Experienced ENT Specialists" },
        { number: "100%", label: "Patient-Centred Treatment" },
        { number: "24/7", label: "Advanced Diagnostic Care" },
        { number: "Modern", label: "Clinical & Audiology Facilities" },
      ];

  const servicesList = cmsContent?.services && cmsContent.services.length > 0
    ? cmsContent.services.filter(s => s.isPublished !== false).slice(0, 6)
    : [
        { name: "Ear Care & Hearing", slug: "ear-care", desc: "Expert treatment for hearing loss, ear infections, and microsurgery of the ear." },
        { name: "Sinus and Allergy Treatment", slug: "sinus-allergy", desc: "Endoscopic sinus surgery and comprehensive allergy management." },
        { name: "Throat and Voice Care", slug: "throat-voice", desc: "Diagnosis and treatment of vocal cord disorders, tonsillitis, and voice therapy." },
        { name: "Pediatric ENT", slug: "pediatric-ent", desc: "Specialised gentle care for children's ear, nose, and throat conditions." },
        { name: "Vertigo and Balance Disorders", slug: "vertigo", desc: "Advanced vestibular testing and management of dizziness and balance issues." },
        { name: "Head and Neck Care", slug: "head-neck-care", desc: "Surgical management of thyroid, parotid, and neck masses." },
      ];

  const ctaBanner = home?.ctaBanner || {
    heading: "Your ENT health deserves expert care.",
    subheading: "Schedule a consultation with our PGI-trained specialists today.",
    buttonText: "Book Appointment",
    buttonLink: "/book-appointment"
  };

  return (
    <main>
      {/* HERO SECTION */}
      <section style={{
        minHeight: "640px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid var(--border)",
        background: "linear-gradient(135deg, #0b2438 0%, #123653 55%, #0e2e47 100%)",
        position: "relative",
        overflow: "hidden",
        padding: "3.5rem 0"
      }}>
        {/* Soft glowing ambient lights & decorative gold lines */}
        <div style={{ position: "absolute", width: "420px", height: "420px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,162,74,0.12), transparent 70%)", top: "-40px", left: "10%", pointerEvents: "none" }}></div>
        <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,162,74,0.14), transparent 70%)", bottom: "-80px", right: "5%", pointerEvents: "none" }}></div>
        <div className="animate-float-slow" style={{ position: "absolute", width: "440px", height: "440px", borderRadius: "50%", border: "1px dashed rgba(201,162,74,0.22)", top: "50%", right: "8%", transform: "translate(0, -50%)", pointerEvents: "none" }}></div>
        <div className="animate-float-reverse" style={{ position: "absolute", width: "280px", height: "280px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)", top: "15%", right: "14%", pointerEvents: "none" }}></div>

        {/* Content Container (Two-column responsive) */}
        <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 2rem", width: "100%", position: "relative", zIndex: 2 }}>
          <div ref={heroRef} className="hero-two-col reveal">
            {/* Left Column: Text & CTAs */}
            <div className="hero-left">
              <div style={{ fontSize: "11.5px", fontWeight: "600", letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1.25rem", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                <span style={{ display: "inline-block", width: "20px", height: "1.5px", background: "var(--gold)" }}></span>
                {heroBadge}
                <span style={{ display: "inline-block", width: "20px", height: "1.5px", background: "var(--gold)" }}></span>
              </div>
              <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(34px, 3.8vw, 50px)", lineHeight: 1.14, color: "#ffffff", marginBottom: "1.25rem", letterSpacing: "-0.5px" }}>
                {heroTitle}
              </h1>
              <p style={{ fontSize: "15.5px", color: "rgba(255,255,255,0.8)", maxWidth: "520px", lineHeight: 1.75, marginBottom: "2rem" }}>
                {heroDescription}
              </p>
              <div className="hero-actions" style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", marginBottom: "2rem" }}>
                <Link href={primaryBtn.link || "/book-appointment"} className="btn-gold btn-has-arrow hover-lift">
                  <span>{primaryBtn.label || "Book Appointment"}</span>
                  <span className="btn-arrow">→</span>
                </Link>
                <Link href={secondaryBtn.link || "/services"} className="btn-gold-outline hover-lift">
                  <span>{secondaryBtn.label || "Explore Our Services"}</span>
                </Link>
              </div>
              <div className="hero-trust-row" style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", fontSize: "12.5px", color: "rgba(255,255,255,0.72)", borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: "1.25rem", maxWidth: "520px" }}>
                {trustPoints.map((tp, idx) => (
                  <span key={idx} style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
                    {idx > 0 && <span style={{ color: "var(--gold)" }}>•</span>}
                    <span>{tp}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Refined Frame with Cream Backdrop Panel & Doctors Portrait */}
            <div className="hero-right" style={{ position: "relative" }}>
              <div className="hero-panel">
                <div className="hero-img-frame">
                  {heroImage ? (
                    <>
                      <Image 
                        src={heroImage} 
                        alt="Dr. Ganesh Dutt Rattan & Dr. Anav Rattan - ENT Specialists at Dr. Rattan ENT Clinic" 
                        fill 
                        sizes="(max-width: 480px) 320px, (max-width: 960px) 380px, 430px"
                        style={{ objectFit: "cover", objectPosition: "center 28%" }} 
                        className="hero-photo-img"
                        priority 
                      />
                      <div className="hero-img-gradient" />
                    </>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(145deg, #123653 0%, #0a2033 100%)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "24px",
                        textAlign: "center",
                        color: "#ffffff",
                      }}
                    >
                      <div
                        style={{
                          width: "72px",
                          height: "72px",
                          borderRadius: "50%",
                          background: "rgba(201,162,74,0.15)",
                          border: "2px solid #C9A24A",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "var(--serif), serif",
                          fontSize: "26px",
                          fontWeight: 700,
                          color: "#C9A24A",
                          marginBottom: "14px",
                        }}
                      >
                        DR
                      </div>
                      <div style={{ fontFamily: "var(--serif), serif", fontSize: "20px", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
                        Dr. Rattan ENT Clinic
                      </div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", maxWidth: "260px", lineHeight: 1.5 }}>
                        PGI-Trained ENT & Head-Neck Surgical Excellence in Chandigarh
                      </div>
                      <div style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(201,162,74,0.2)", padding: "4px 14px", borderRadius: "16px", fontSize: "11px", color: "#fef08a", fontWeight: 600 }}>
                        <span>Sector 33C, Chandigarh</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="hero-nameplate">
                  <div className="hero-nameplate-title">{doctorName}</div>
                  <div className="hero-nameplate-sub">{doctorRole}</div>
                  <div className="hero-nameplate-reg">{doctorClinic}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR / STATISTICS */}
      <div ref={trustRef} className="trust-bar reveal reveal-delay-1">
        {statistics.map((st, i) => {
          const numMatch = st.number.match(/^(\d+)(.*)$/);
          if (numMatch) {
            return (
              <AnimatedStat
                key={i}
                target={parseInt(numMatch[1], 10)}
                suffix={numMatch[2]}
                label={st.label}
              />
            );
          }
          return (
            <div className="trust-item" key={i}>
              <div className="num">{st.number}</div>
              <div className="label">{st.label}</div>
            </div>
          );
        })}
      </div>

      {/* FEATURED SERVICES */}
      <section id="services" ref={servicesRef} className="reveal" style={{ background: "var(--cream)" }}>
        <div className="sec-header" style={{ textAlign: "center" }}>
          <div className="sec-eyebrow" style={{ justifyContent: "center" }}>Our Services</div>
          <h2 className="sec-title">Comprehensive <em style={{ color: "var(--gold)" }}>ENT</em> Solutions</h2>
          <p className="sec-sub" style={{ margin: "0.75rem auto 0" }}>Advanced diagnostic and treatment facilities for complete ear, nose, and throat health.</p>
        </div>
        <div className="services-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {servicesList.map((srv, i) => (
            <div className="service-item hover-lift reveal" style={{ transitionDelay: `${i * 0.1}s` }} key={srv.slug || i}>
              <div className="service-num">{String(i + 1).padStart(2, "0")}</div>
              <h3>{srv.name}</h3>
              <p>{srv.desc || (srv as unknown as { shortDescription?: string }).shortDescription}</p>
              <Link href={`/services/${srv.slug}`} style={{ display: "inline-block", marginTop: "1rem", fontSize: "13px", fontWeight: 500, color: "var(--gold)", textDecoration: "none", transition: "transform 0.2s" }} className="service-link">View Service →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <WhyChooseUsSection data={home?.whyChooseUs} />

      {/* DOCTORS PREVIEW */}
      <MeetTheDoctorsSection doctors={cmsContent?.doctors} />

      {/* PATIENT JOURNEY */}
      <PatientJourneySection data={home?.patientJourney} />

      {/* TESTIMONIALS */}
      <PatientTestimonialsSection data={home?.testimonialsSection || home?.testimonials} />

      {/* CTA BANNER */}
      <section style={{ background: "var(--navy)", color: "#fff", textAlign: "center", padding: "6rem 2rem" }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: "32px", marginBottom: "1rem" }}>{ctaBanner.heading}</h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", marginBottom: "2rem" }}>{ctaBanner.subheading}</p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={ctaBanner.buttonLink || "/book-appointment"} className="btn-primary" style={{ background: "var(--gold)", color: "var(--navy)" }}>
            {ctaBanner.buttonText || "Book Appointment"}
          </Link>
          <Link href="/contact" className="btn-outline" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>Contact Clinic</Link>
        </div>
      </section>
    </main>
  );
}
