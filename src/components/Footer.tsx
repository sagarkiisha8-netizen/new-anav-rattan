import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-col">
          <div className="footer-logo">
            Dr. Rattan <span>ENT</span> Clinic
          </div>
          <p className="footer-desc">
            Expert ENT care in Chandigarh by PGI-trained surgeons. We provide comprehensive ear, nose, throat, and head-neck surgical services.
          </p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/doctors">Our Doctors</Link></li>
            <li><Link href="/research">Research</Link></li>
            <li><Link href="/faqs">FAQs</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li><Link href="/services/ear-care">Ear & Otology</Link></li>
            <li><Link href="/services/vertigo">Vertigo & Balance</Link></li>
            <li><Link href="/services/sinus-allergy">Nose & Sinuses</Link></li>
            <li><Link href="/services/head-neck-care">Head & Neck</Link></li>
            <li><Link href="/services/throat-voice">Throat & Voice</Link></li>
            <li><Link href="/services/pediatric-ent">Pediatric ENT</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact Us</h4>
          <ul>
            <li>Sector 33C, Chandigarh</li>
            <li><a href="tel:01722610806">0172-2610806</a></li>
            <li><a href="mailto:rattananav@gmail.com">rattananav@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div>&copy; {new Date().getFullYear()} Dr. Rattan ENT Clinic. All rights reserved.</div>
        <div>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
