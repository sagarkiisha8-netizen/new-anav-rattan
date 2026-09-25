"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = footerRef.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer
      ref={footerRef}
      className={`site-footer ${isVisible ? "footer-animated" : ""}`}
      role="contentinfo"
      aria-label="Clinic Footer"
    >
      <div className="footer-top-accent" aria-hidden="true" />
      <div className="footer-container">
        <div className="footer-grid">
          {/* Column 1: Clinic Information */}
          <div className="footer-col footer-col-info">
            <Link href="/" className="footer-logo" aria-label="Dr. Rattan ENT Clinic Home">
              Dr. Rattan <span>ENT</span> Clinic
            </Link>
            <p className="footer-desc">
              Expert ENT care in Chandigarh by PGI-trained surgeons. Comprehensive ear, nose, throat, hearing restoration, and head-neck surgical services.
            </p>
            <div className="footer-badge">
              <span className="footer-badge-dot" aria-hidden="true" />
              <span>Sector 33C, Chandigarh · 35+ Years of Care</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col footer-col-links">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-link-list">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/doctors">Our Doctors</Link></li>
              <li><Link href="/research">Research</Link></li>
              <li><Link href="/faqs">FAQs</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Clinical Services */}
          <div className="footer-col footer-col-services">
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-link-list">
              <li><Link href="/services/ear-care">Ear &amp; Otology</Link></li>
              <li><Link href="/services/vertigo">Vertigo &amp; Balance</Link></li>
              <li><Link href="/services/sinus-allergy">Nose &amp; Sinuses</Link></li>
              <li><Link href="/services/head-neck-care">Head &amp; Neck</Link></li>
              <li><Link href="/services/throat-voice">Throat &amp; Voice</Link></li>
              <li><Link href="/services/pediatric-ent">Pediatric ENT</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="footer-col footer-col-contact">
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="footer-contact-list">
              <li>
                <span className="contact-icon" aria-hidden="true">📍</span>
                <span>SCO 123, Sector 33C, Chandigarh</span>
              </li>
              <li>
                <span className="contact-icon" aria-hidden="true">📞</span>
                <a href="tel:01722610806" aria-label="Call clinic at 0172-2610806">
                  0172-2610806
                </a>
              </li>
              <li>
                <span className="contact-icon" aria-hidden="true">✉️</span>
                <a href="mailto:rattananav@gmail.com" aria-label="Email clinic at rattananav@gmail.com">
                  rattananav@gmail.com
                </a>
              </li>
              <li className="footer-hours-item">
                <span className="contact-icon" aria-hidden="true">🕒</span>
                <span>Mon–Sat: 10AM–2PM &amp; 5:30–8PM</span>
              </li>
            </ul>
            <div className="footer-cta-wrapper">
              <Link href="/book-appointment" className="footer-cta-btn">
                Book Appointment
              </Link>
            </div>
          </div>
        </div>

        {/* Thin elegant gold accent divider */}
        <div className="footer-gold-divider" aria-hidden="true" />

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} Dr. Rattan ENT Clinic. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <span className="footer-bottom-sep" aria-hidden="true">·</span>
            <Link href="/contact">Clinic OPD Timings</Link>
            <span className="footer-bottom-sep" aria-hidden="true">·</span>
            <a
              href="https://maps.google.com/?q=Sector+33C+Chandigarh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View clinic on Google Maps (opens in new tab)"
            >
              Directions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
