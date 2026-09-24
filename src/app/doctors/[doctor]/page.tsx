import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

interface DoctorData {
  slug: string;
  name: string;
  title: string;
  degrees: string;
  regNumber?: string;
  bio: string;
  detailedBio: string[];
  experience: string;
  image: string;
  specialties: string[];
  education: string[];
  clinicalFocus: string[];
  opdTimings: string;
}

const ganeshData: DoctorData = {
  slug: "ganesh-dutt-rattan",
  name: "Dr. Ganesh Dutt Rattan",
  title: "Founder & Senior Consultant ENT Surgeon",
  degrees: "MBBS · DLO · MS (ENT), PGI Chandigarh",
  regNumber: "Punjab Medical Council (PMC) Reg. No. 23702",
  bio: "Founder of Dr. Rattan ENT Clinic with over 35 years of dedicated surgical practice. Former Senior Resident at PGIMER Chandigarh and Sir Ganga Ram Hospital, New Delhi.",
  detailedBio: [
    "Dr. Ganesh Dutt Rattan is among the most senior and respected otolaryngologists in the Chandigarh tricity region, with over three and a half decades of surgical and clinical expertise.",
    "Following his post-graduation from the Postgraduate Institute of Medical Education and Research (PGIMER), Chandigarh, he completed high-volume senior residencies at PGIMER Chandigarh and the prestigious Sir Ganga Ram Hospital, New Delhi.",
    "His clinical approach is rooted in uncompromising diagnostic accuracy, gentle patient listening, and conservative surgical decision-making. Over thirty-five years, he has successfully treated tens of thousands of complex ear, nose, and throat cases with enduring results."
  ],
  experience: "35+ Years in Surgical Practice",
  image: "/images/dr-ganesh-dutt-rattan-0.jpeg",
  specialties: [
    "Microscopic Ear Surgery (Tympanoplasty, Mastoidectomy)",
    "Chronic Otitis Media & Hearing Restoration",
    "Endoscopic Sinus Surgery (FESS)",
    "Pediatric ENT & Adenotonsillectomy",
    "Thyroid, Salivary Gland & Neck Mass Evaluation",
    "Conservative Medical Management of ENT Disorders"
  ],
  education: [
    "MS (ENT) — Postgraduate Institute of Medical Education and Research (PGIMER), Chandigarh",
    "Former Senior Resident — PGIMER, Chandigarh",
    "Former Senior Resident — Sir Ganga Ram Hospital, New Delhi",
    "Diploma in Laryngology and Otology (DLO)",
    "MBBS — Renowned Government Medical Institution"
  ],
  clinicalFocus: [
    "Middle Ear Reconstruction",
    "Chronic Sinusitis & Nasal Polyposis",
    "Vocal Cord & Laryngeal Disorders",
    "Pediatric Hearing & Airway Concerns"
  ],
  opdTimings: "Mon–Sat: 10:00 AM – 2:00 PM & 5:30 PM – 8:00 PM | Sun: 11:00 AM – 1:00 PM"
};

const anavData: DoctorData = {
  slug: "anav-rattan",
  name: "Dr. Anav Rattan",
  title: "Consultant ENT, Otologist & Skull Base Surgeon",
  degrees: "MS (ENT), DNB, MNAMS",
  bio: "Subspecialist in Advanced Otology, Cochlear Implantation, Lateral Skull Base Surgery, and Neuro-otology. Trained at Seth G.S. Medical College & KEM Hospital, Mumbai and PGIMER Chandigarh.",
  detailedBio: [
    "Dr. Anav Rattan is an accomplished ENT surgeon with subspecialised training in Otology, Auditory Implantation, and Skull Base Surgery.",
    "He completed his MS (ENT) from the prestigious Seth G.S. Medical College & KEM Hospital, Mumbai, followed by a demanding Senior Residency at PGIMER, Chandigarh. He holds the prestigious Diplomate of National Board (DNB) and Membership of the National Academy of Medical Sciences (MNAMS).",
    "Dr. Anav Rattan has completed advanced certified training in the Cochlear Implant Programme at KEM Hospital Mumbai and actively presents his research at national scientific forums, including the Indian Academy of Otolaryngology - Head & Neck Surgery (IAOHNS). His clinical practice integrates high-magnification microsurgery, rigid endoscopy, and vestibular diagnostic protocols."
  ],
  experience: "Institutional Specialised Practice",
  image: "/images/dr-anav-rattan-1.jpeg",
  specialties: [
    "Cochlear Implantation & Auditory Rehabilitation",
    "Lateral Skull Base Surgery & Acoustic Neuroma Management",
    "Microscopic Ear Surgery (Ossiculoplasty, Stapedectomy, Mastoidectomy)",
    "Neuro-otology & Vestibular Balance Assessment (BPPV, Meniere's)",
    "Endoscopic Sinus Surgery & CSF Rhinorrhea Repair",
    "Microlaryngeal Phonosurgery for Vocal Cord Lesions"
  ],
  education: [
    "Senior Residency — PGIMER, Chandigarh",
    "MS (ENT) — Seth G.S. Medical College & KEM Hospital, Mumbai",
    "DNB (Otorhinolaryngology) — National Board of Examinations",
    "MNAMS — National Academy of Medical Sciences, New Delhi",
    "Certified Cochlear Implant Surgeon — KEM Hospital, Mumbai",
    "MBBS — Government Medical College and Hospital, Chandigarh"
  ],
  clinicalFocus: [
    "Severe-to-Profound Sensorineural Hearing Loss",
    "Complex Cholesteatoma & Revision Ear Surgery",
    "Intractable Vertigo & Vestibular Dysfunction",
    "Skull Base Tumors & Temporal Bone Pathology"
  ],
  opdTimings: "Mon–Sat: 10:00 AM – 2:00 PM & 5:30 PM – 8:00 PM | Sun: 11:00 AM – 1:00 PM"
};

const doctorsData: Record<string, DoctorData> = {
  "ganesh-dutt-rattan": ganeshData,
  "dr-ganesh-rattan": ganeshData,
  "dr-ganesh-dutt-rattan": ganeshData,
  "anav-rattan": anavData,
  "dr-anav-rattan": anavData
};

export function generateStaticParams() {
  return [
    { doctor: "ganesh-dutt-rattan" },
    { doctor: "anav-rattan" },
    { doctor: "dr-ganesh-rattan" },
    { doctor: "dr-anav-rattan" },
  ];
}

type Props = {
  params: Promise<{ doctor: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const doctor = doctorsData[resolvedParams.doctor];
  
  if (!doctor) {
    return { title: "Doctor Profile Not Found | Dr. Rattan ENT Clinic" };
  }

  return {
    title: `${doctor.name} - ${doctor.degrees} | Dr. Rattan ENT Clinic`,
    description: `${doctor.name}, ${doctor.title} at Dr. Rattan ENT Clinic Chandigarh. ${doctor.bio}`,
  };
}

import { getSiteContent } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DoctorProfilePage({ params }: Props) {
  const resolvedParams = await params;
  const siteContent = await getSiteContent();
  const dbDoctor = siteContent.doctors.find(
    (d) => d.slug === resolvedParams.doctor || d.id === resolvedParams.doctor
  );
  const fallback = doctorsData[resolvedParams.doctor];
  const doctor = dbDoctor ? { ...fallback, ...dbDoctor } : fallback;

  if (!doctor) {
    notFound();
  }

  return (
    <main>
      {/* Profile Header */}
      <section style={{ padding: "5rem 2rem 4rem", background: "linear-gradient(135deg, var(--navy) 0%, #0d283f 100%)", color: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <Breadcrumbs items={[
              { label: "Our Doctors", href: "/doctors" },
              { label: doctor.name }
            ]} />
          </div>
          <div style={{ maxWidth: "800px" }}>
            <div className="section-label" style={{ color: "var(--gold)", marginBottom: "0.5rem" }}>
              {doctor.title.toUpperCase()}
            </div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 44px)", lineHeight: 1.2, color: "#fff", marginBottom: "0.75rem" }}>
              {doctor.name}
            </h1>
            <div style={{ color: "var(--gold)", fontSize: "17px", fontWeight: 600, marginBottom: "0.5rem" }}>
              {doctor.degrees}
            </div>
            {doctor.regNumber && (
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", letterSpacing: "0.02em" }}>
                {doctor.regNumber}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Profile Body */}
      <section style={{ padding: "5rem 2rem", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "48px", alignItems: "start" }}>
            
            {/* Left Photo & Key Facts Box */}
            <div>
              <div style={{ 
                borderRadius: "16px", 
                overflow: "hidden", 
                boxShadow: "0 12px 36px rgba(18,54,83,0.12)", 
                border: "1px solid rgba(18,54,83,0.1)",
                position: "relative",
                height: "440px",
                background: "var(--cream)",
                marginBottom: "24px"
              }}>
                <Image 
                  src={doctor.image} 
                  alt={doctor.name} 
                  fill 
                  style={{ objectFit: "cover", objectPosition: "top center" }} 
                  priority
                />
              </div>

              {/* Consultation Card */}
              <div style={{ background: "var(--cream)", padding: "28px", borderRadius: "14px", border: "1px solid rgba(18,54,83,0.08)" }}>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: "18px", color: "var(--navy)", marginBottom: "12px" }}>
                  OPD Consultation Schedule
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text)", lineHeight: 1.6, marginBottom: "16px" }}>
                  {doctor.opdTimings}
                </p>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "20px" }}>
                  📍 Dr. Rattan ENT Clinic, Sector 33C, Chandigarh
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Link href="/book-appointment" className="btn-gold" style={{ justifyContent: "center", textDecoration: "none", display: "flex", padding: "12px 20px", fontSize: "14px" }}>
                    Book Appointment With {doctor.name.split(" ")[1]}
                  </Link>
                  <a 
                    href="https://wa.me/919988004806" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-navy" 
                    style={{ justifyContent: "center", textDecoration: "none", display: "flex", padding: "12px 20px", fontSize: "14px" }}
                  >
                    Inquire via WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Right Information Column */}
            <div>
              <div className="section-label" style={{ color: "var(--gold)", marginBottom: "0.5rem" }}>
                PROFESSIONAL BACKGROUND
              </div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: "28px", color: "var(--navy)", marginBottom: "1.25rem" }}>
                About {doctor.name}
              </h2>

              <div style={{ fontSize: "15px", color: "var(--text)", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: "14px", marginBottom: "2.5rem" }}>
                {doctor.detailedBio.map((paragraph, idx) => (
                  <p key={idx} style={{ margin: 0 }}>{paragraph}</p>
                ))}
              </div>

              {/* Specialties */}
              <div style={{ marginBottom: "2.5rem" }}>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: "22px", color: "var(--navy)", marginBottom: "1rem", borderBottom: "2px solid var(--gold)", paddingBottom: "6px" }}>
                  Clinical & Surgical Expertise
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
                  {doctor.specialties.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "14px", color: "var(--navy)", background: "var(--cream)", padding: "12px 14px", borderRadius: "8px" }}>
                      <span style={{ color: "var(--gold)", fontWeight: 700 }}>✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Qualifications */}
              <div style={{ marginBottom: "2.5rem" }}>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: "22px", color: "var(--navy)", marginBottom: "1rem", borderBottom: "2px solid var(--gold)", paddingBottom: "6px" }}>
                  Institutional Training & Credentials
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {doctor.education.map((edu, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "14px", color: "var(--text)", lineHeight: 1.6 }}>
                      <span style={{ color: "var(--gold)", fontSize: "12px", marginTop: "4px" }}>◆</span>
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Research Link for Dr. Anav Rattan */}
              {doctor.slug === "anav-rattan" && (
                <div style={{ background: "rgba(18,54,83,0.04)", border: "1px solid rgba(18,54,83,0.1)", borderRadius: "12px", padding: "20px 24px" }}>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--navy)", marginBottom: "6px" }}>
                    Academic Presentations & Research
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "12px" }}>
                    Explore Dr. Anav Rattan&apos;s recent presentations at IAOHNS Jammu, cochlear implant certifications from KEM Hospital Mumbai, and temporal bone dissection milestones.
                  </p>
                  <Link href="/research" style={{ fontSize: "13px", fontWeight: 600, color: "var(--gold)", textDecoration: "none" }}>
                    View Academic Research & Presentations →
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
