"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesMobileOpen, setIsServicesMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setIsServicesMobileOpen(false);
  };

  const handleNavClick = (targetPath: string) => (e: React.MouseEvent) => {
    closeMenu();
    if (pathname === targetPath) {
      e.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  const toggleServicesMobile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsServicesMobileOpen(prev => !prev);
  };

  return (
    <>
      {/* Top Gradient Rule */}
      <div style={{ height: "3px", background: "linear-gradient(90deg,var(--navy) 0%,var(--gold) 30%,var(--gold2) 60%,var(--gold) 80%,var(--navy) 100%)" }} />

      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-left">
          Mon–Sat: 10 AM–2 PM & 5:30–8 PM &nbsp;·&nbsp; Sun: 11 AM–1 PM
        </div>
        <div className="top-bar-right">
          <a href="tel:01722610806" aria-label="Call Clinic">📞 0172-2610806</a>
          <a href="https://wa.me/919988004806" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">💬 WhatsApp</a>
          <a href="mailto:rattananav@gmail.com" aria-label="Send Email">✉ rattananav@gmail.com</a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={isScrolled ? "nav-scrolled" : ""} style={{ transition: "all 0.3s ease" }}>
        <Link href="/" className="nav-logo" onClick={handleNavClick("/")}>
          Dr. Rattan <span>ENT</span> Clinic
        </Link>

        {/* Navigation Links Menu */}
        <ul className={`nav-links ${isMobileMenuOpen ? "open" : ""}`} id="navLinks">
          <li>
            <Link 
              href="/" 
              className={pathname === "/" ? "active" : ""} 
              onClick={handleNavClick("/")}
            >
              Home
            </Link>
          </li>

          <li>
            <Link 
              href="/about" 
              className={pathname === "/about" ? "active" : ""} 
              onClick={handleNavClick("/about")}
            >
              About
            </Link>
          </li>

          {/* Services with Desktop Dropdown & Mobile Accordion */}
          <li className={`nav-services-item ${isServicesMobileOpen ? "services-open-mobile" : ""}`}>
            <div className="services-link-wrap">
              <Link 
                href="/services" 
                className={pathname?.startsWith("/services") ? "active" : ""} 
                onClick={handleNavClick("/services")}
              >
                Services
              </Link>
              <button 
                type="button"
                className="services-dropdown-toggle"
                onClick={toggleServicesMobile}
                aria-label="Toggle services menu"
                aria-expanded={isServicesMobileOpen}
              >
                ▾
              </button>
            </div>

            <div className={`dropdown ${isServicesMobileOpen ? "dropdown-mobile-show" : ""}`}>
              <Link href="/services/ear-care" className={pathname === "/services/ear-care" ? "sub-active" : ""} onClick={handleNavClick("/services/ear-care")}>
                Ear Care & Otology
              </Link>
              <Link href="/services/hearing-loss" className={pathname === "/services/hearing-loss" ? "sub-active" : ""} onClick={handleNavClick("/services/hearing-loss")}>
                Hearing Loss & Audiology
              </Link>
              <Link href="/services/sinus-allergy" className={pathname === "/services/sinus-allergy" ? "sub-active" : ""} onClick={handleNavClick("/services/sinus-allergy")}>
                Sinus & Allergy
              </Link>
              <Link href="/services/throat-voice" className={pathname === "/services/throat-voice" ? "sub-active" : ""} onClick={handleNavClick("/services/throat-voice")}>
                Throat & Voice Care
              </Link>
              <Link href="/services/pediatric-ent" className={pathname === "/services/pediatric-ent" ? "sub-active" : ""} onClick={handleNavClick("/services/pediatric-ent")}>
                Pediatric ENT
              </Link>
              <Link href="/services/vertigo" className={pathname === "/services/vertigo" ? "sub-active" : ""} onClick={handleNavClick("/services/vertigo")}>
                Vertigo & Balance
              </Link>
              <Link href="/services/cochlear-implants" className={pathname === "/services/cochlear-implants" ? "sub-active" : ""} onClick={handleNavClick("/services/cochlear-implants")}>
                Cochlear Implants
              </Link>
              <Link href="/services/skull-base-surgery" className={pathname === "/services/skull-base-surgery" ? "sub-active" : ""} onClick={handleNavClick("/services/skull-base-surgery")}>
                Skull Base Surgery
              </Link>
              <Link href="/services/head-neck-care" className={pathname === "/services/head-neck-care" ? "sub-active" : ""} onClick={handleNavClick("/services/head-neck-care")}>
                Head & Neck Care
              </Link>
              <Link href="/services" style={{ fontWeight: 600, color: "var(--gold)", borderTop: "1px solid rgba(18,54,83,0.06)", marginTop: "4px", paddingTop: "8px" }} onClick={handleNavClick("/services")}>
                View All 9 Services →
              </Link>
            </div>
          </li>

          <li>
            <Link 
              href="/doctors" 
              className={pathname === "/doctors" ? "active" : ""} 
              onClick={handleNavClick("/doctors")}
            >
              Our Doctors
            </Link>
          </li>

          <li>
            <Link 
              href="/research" 
              className={pathname === "/research" ? "active" : ""} 
              onClick={handleNavClick("/research")}
            >
              Research
            </Link>
          </li>

          <li>
            <Link 
              href="/faqs" 
              className={pathname === "/faqs" ? "active" : ""} 
              onClick={handleNavClick("/faqs")}
            >
              FAQs
            </Link>
          </li>

          <li>
            <Link 
              href="/gallery" 
              className={pathname === "/gallery" ? "active" : ""} 
              onClick={handleNavClick("/gallery")}
            >
              Gallery
            </Link>
          </li>

          <li>
            <Link 
              href="/contact" 
              className={pathname === "/contact" ? "active" : ""} 
              onClick={handleNavClick("/contact")}
            >
              Contact
            </Link>
          </li>

          {/* Mobile-only CTA buttons inside drawer */}
          <li className="mob-cta-item" style={{ display: "none", padding: "1.2rem 2rem 0.5rem" }}>
            <Link 
              href="/book-appointment" 
              className="btn-gold" 
              style={{ width: "100%", justifyContent: "center", marginBottom: "10px" }} 
              onClick={handleNavClick("/book-appointment")}
            >
              Book Appointment
            </Link>
            <a 
              href="https://wa.me/919988004806" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-cta whatsapp" 
              style={{ width: "100%", justifyContent: "center", margin: 0, padding: "11px 0" }} 
              onClick={closeMenu}
            >
              Chat on WhatsApp
            </a>
          </li>
        </ul>

        {/* Right CTA Actions */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <a 
            className="nav-cta whatsapp desktop-only-cta" 
            href="https://wa.me/919988004806" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#fff" style={{ flexShrink: 0 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.527 5.845L.057 23.903a.75.75 0 00.92.92l6.058-1.47A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.705 9.705 0 01-4.947-1.354l-.355-.21-3.676.892.908-3.587-.23-.368A9.712 9.712 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
            </svg> 
            WhatsApp
          </a>
          <Link href="/book-appointment" className="nav-cta desktop-only-cta" onClick={handleNavClick("/book-appointment")}>
            Book Appointment
          </Link>
          <button 
            className="mob-toggle" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>
    </>
  );
}
