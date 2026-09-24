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

function AnimatedStat({ target, suffix, label }: { target: number, suffix: string, label: string }) {
  const { count, ref } = useAnimatedCounter(target, 2000);
  return (
    <div className="trust-item" ref={ref}>
      <div className="num">{count}{suffix}</div>
      <div className="label">{label}</div>
    </div>
  );
}

export default function HomeContent({ initialContent }: { initialContent?: any }) {
  const heroRef = useScrollReveal();
  const trustRef = useScrollReveal();
  const servicesRef = useScrollReveal();
  const contactRef = useScrollReveal();

  const homeInit = initialContent?.home || {};
  const [cmsHome, setCmsHome] = useState({
    heroBadge: homeInit.hero?.badge || homeInit.heroBadge || "Specialist ENT Clinic · Sector 33C, Chandigarh",
    heroTitle: homeInit.hero?.title || homeInit.heroTitle || "Complete Ear, Nose & Throat Care in Chandigarh",
    heroSubtitle: homeInit.hero?.highlightedTitle || homeInit.heroSubtitle || "Ear, Nose & Throat",
    heroDescription: homeInit.hero?.description || homeInit.heroDescription || "Providing comprehensive ear, nose, throat, sinus, allergy, voice, hearing, and head-and-neck care with institution-level expertise and compassionate patient care.",
    heroImage: homeInit.hero?.image || homeInit.heroImage || "/images/dr-rattan-and-dr-anav-rattan-hero2.png",
    patientJourney: homeInit.patientJourney || undefined,
    testimonialsSection: homeInit.testimonialsSection || undefined,
    testimonials: homeInit.testimonials || undefined
  });

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        const home = data?.content?.home || data?.home;
        if (home) {
          setCmsHome({
            heroBadge: home.hero?.badge || home.heroBadge || "Specialist ENT Clinic · Sector 33C, Chandigarh",
            heroTitle: home.hero?.title || home.heroTitle || "Complete Ear, Nose & Throat Care in Chandigarh",
            heroSubtitle: home.hero?.highlightedTitle || home.heroSubtitle || "Ear, Nose & Throat",
            heroDescription: home.hero?.description || home.heroDescription || "Providing comprehensive ear, nose, throat, sinus, allergy, voice, hearing, and head-and-neck care with institution-level expertise and compassionate patient care.",
            heroImage: home.hero?.image || home.heroImage || "/images/dr-rattan-and-dr-anav-rattan-hero2.png",
            patientJourney: home.patientJourney || undefined,
            testimonialsSection: home.testimonialsSection || undefined,
            testimonials: home.testimonials || undefined
          });
        }
      })
      .catch(() => {});
  }, []);

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
                {cmsHome.heroBadge}
                <span style={{ display: "inline-block", width: "20px", height: "1.5px", background: "var(--gold)" }}></span>
              </div>
              <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(34px, 3.8vw, 50px)", lineHeight: 1.14, color: "#ffffff", marginBottom: "1.25rem", letterSpacing: "-0.5px" }}>
                {cmsHome.heroTitle}
              </h1>
              <p style={{ fontSize: "15.5px", color: "rgba(255,255,255,0.8)", maxWidth: "520px", lineHeight: 1.75, marginBottom: "2rem" }}>
                {cmsHome.heroDescription}
              </p>
              <div className="hero-actions" style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", marginBottom: "2rem" }}>
                <Link href="/book-appointment" className="btn-gold btn-has-arrow hover-lift">
                  <span>Book Appointment</span>
                  <span className="btn-arrow">→</span>
                </Link>
                <Link href="/services" className="btn-gold-outline hover-lift">
                  <span>Explore Our Services</span>
                </Link>
              </div>
              <div className="hero-trust-row" style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", fontSize: "12.5px", color: "rgba(255,255,255,0.72)", borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: "1.25rem", maxWidth: "520px" }}>
                <span>Experienced Care</span>
                <span style={{ color: "var(--gold)" }}>•</span>
                <span>Modern Diagnosis</span>
                <span style={{ color: "var(--gold)" }}>•</span>
                <span>Patient-Focused Treatment</span>
              </div>
            </div>

            {/* Right Column: Refined Frame with Cream Backdrop Panel & Doctors Portrait */}
            <div className="hero-right" style={{ position: "relative" }}>
              <div className="hero-panel">
                <div className="hero-img-frame">
                  <Image 
                    src={cmsHome.heroImage || "/images/dr-rattan-and-dr-anav-rattan-hero2.png"} 
                    alt="Dr. Ganesh Dutt Rattan & Dr. Anav Rattan - ENT Specialists at Dr. Rattan ENT Clinic" 
                    fill 
                    sizes="(max-width: 480px) 320px, (max-width: 960px) 380px, 430px"
                    style={{ objectFit: "cover", objectPosition: "center 28%" }} 
                    className="hero-photo-img"
                    priority 
                  />
                  <div className="hero-img-gradient" />
                </div>
                <div className="hero-nameplate">
                  <div className="hero-nameplate-title">Dr. Ganesh Dutt Rattan &amp; Dr. Anav Rattan</div>
                  <div className="hero-nameplate-sub">ENT Specialists</div>
                  <div className="hero-nameplate-reg">Dr. Rattan ENT Clinic</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div ref={trustRef} className="trust-bar reveal reveal-delay-1">
        <AnimatedStat target={35} suffix="+" label="Years Experienced ENT Specialists" />
        <AnimatedStat target={100} suffix="%" label="Patient-Centred Treatment" />
        <div className="trust-item"><div className="num">24/7</div><div className="label">Advanced Diagnostic Care</div></div>
        <div className="trust-item"><div className="num">State-of-the-art</div><div className="label">Modern Clinical Facilities</div></div>
      </div>

      {/* FEATURED SERVICES */}
      <section id="services" ref={servicesRef} className="reveal" style={{ background: "var(--cream)" }}>
        <div className="sec-header" style={{ textAlign: "center" }}>
          <div className="sec-eyebrow" style={{ justifyContent: "center" }}>Our Services</div>
          <h2 className="sec-title">Comprehensive <em style={{ color: "var(--gold)" }}>ENT</em> Solutions</h2>
          <p className="sec-sub" style={{ margin: "0.75rem auto 0" }}>Advanced diagnostic and treatment facilities for complete ear, nose, and throat health.</p>
        </div>
        <div className="services-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[
            { name: "Ear Care & Hearing", link: "ear-care", desc: "Expert treatment for hearing loss, ear infections, and microsurgery of the ear." },
            { name: "Sinus and Allergy Treatment", link: "sinus-allergy", desc: "Endoscopic sinus surgery and comprehensive allergy management." },
            { name: "Throat and Voice Care", link: "throat-voice", desc: "Diagnosis and treatment of vocal cord disorders, tonsillitis, and voice therapy." },
            { name: "Pediatric ENT", link: "pediatric-ent", desc: "Specialised gentle care for children's ear, nose, and throat conditions." },
            { name: "Vertigo and Balance Disorders", link: "vertigo", desc: "Advanced vestibular testing and management of dizziness and balance issues." },
            { name: "Head and Neck Care", link: "head-neck-care", desc: "Surgical management of thyroid, parotid, and neck masses." },
          ].map((srv, i) => (
            <div className="service-item hover-lift reveal" style={{ transitionDelay: `${i * 0.1}s` }} key={srv.link}>
              <div className="service-num">0{i + 1}</div>
              <h3>{srv.name}</h3>
              <p>{srv.desc}</p>
              <Link href={`/services/${srv.link}`} style={{ display: "inline-block", marginTop: "1rem", fontSize: "13px", fontWeight: 500, color: "var(--gold)", textDecoration: "none", transition: "transform 0.2s" }} className="service-link">View Service →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <WhyChooseUsSection />

      {/* DOCTORS PREVIEW */}
      <MeetTheDoctorsSection />

      {/* PATIENT JOURNEY */}
      <PatientJourneySection data={cmsHome.patientJourney} />

      {/* TESTIMONIALS */}
      <PatientTestimonialsSection data={cmsHome.testimonialsSection || cmsHome.testimonials} />

      {/* CTA BANNER */}
      <section style={{ background: "var(--navy)", color: "#fff", textAlign: "center", padding: "6rem 2rem" }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: "32px", marginBottom: "1rem" }}>Your ENT health deserves expert care.</h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", marginBottom: "2rem" }}>Schedule a consultation with our PGI-trained specialists today.</p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/book-appointment" className="btn-primary" style={{ background: "var(--gold)", color: "var(--navy)" }}>Book Appointment</Link>
          <Link href="/contact" className="btn-outline" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>Contact Clinic</Link>
        </div>
      </section>
    </main>
  );
}
