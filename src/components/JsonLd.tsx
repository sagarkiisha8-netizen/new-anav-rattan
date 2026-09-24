export default function JsonLd() {
  const clinicSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "Dr. Rattan ENT Clinic",
    "image": "https://drrattanentclinic.com/images/dr-rattan-and-dr-anav-rattan-hero2.png",
    "@id": "https://drrattanentclinic.com",
    "url": "https://drrattanentclinic.com",
    "telephone": "+91-172-2610806",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "SCO 123, Sector 33C",
      "addressLocality": "Chandigarh",
      "postalCode": "160020",
      "addressRegion": "CH",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 30.7188,
      "longitude": 76.7645
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "10:00",
        "closes": "14:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "17:30",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Sunday"],
        "opens": "11:00",
        "closes": "13:00"
      }
    ],
    "medicalSpecialty": [
      "Otolaryngologic",
      "PediatricENT",
      "Otology",
      "HeadAndNeckSurgery"
    ],
    "physician": [
      {
        "@type": "Physician",
        "name": "Dr. Ganesh Dutt Rattan",
        "jobTitle": "Senior Consultant & Founder",
        "description": "Founder of Dr. Rattan ENT Clinic with over 35 years of surgical experience. Former Senior Resident at PGI Chandigarh and Sir Ganga Ram Hospital.",
        "medicalSpecialty": "Otolaryngologic",
        "alumniOf": [
          "Postgraduate Institute of Medical Education and Research (PGIMER), Chandigarh"
        ]
      },
      {
        "@type": "Physician",
        "name": "Dr. Anav Rattan",
        "jobTitle": "Consultant ENT, Otologist & Skull Base Surgeon",
        "description": "Specialist in Otology, Cochlear Implants, and Skull Base Surgery. Trained at Seth G.S. Medical College, Mumbai and PGI Chandigarh.",
        "medicalSpecialty": ["Otology", "Otolaryngologic", "HeadAndNeckSurgery"],
        "alumniOf": [
          "Seth G.S. Medical College and KEM Hospital, Mumbai",
          "Postgraduate Institute of Medical Education and Research (PGIMER), Chandigarh"
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicSchema) }}
    />
  );
}
