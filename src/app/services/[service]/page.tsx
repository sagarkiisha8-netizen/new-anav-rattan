import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getSiteContent } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ServiceDetail {
  slug: string;
  title: string;
  badge: string;
  intro: string;
  symptoms: string[];
  conditions: string[];
  diagnosis: string[];
  treatments: string[];
  whenToConsult: string[];
  faqs: { q: string; a: string }[];
}

const serviceCatalog: Record<string, ServiceDetail> = {
  "ear-care": {
    slug: "ear-care",
    title: "Ear Care & Otology",
    badge: "Specialized Otology",
    intro: "Comprehensive diagnosis and advanced microscopic surgical management for acute and chronic conditions of the outer, middle, and inner ear.",
    symptoms: [
      "Persistent or recurrent ear discharge",
      "Ear pain, fullness, or pressure",
      "Decreased hearing sensitivity or muffling",
      "Ringing, buzzing, or clicking sounds (Tinnitus)",
      "Itching, irritation, or fungal sensation in the canal"
    ],
    conditions: [
      "Chronic Suppurative Otitis Media (CSOM) with eardrum perforation",
      "Cholesteatoma (destructive middle ear cyst)",
      "Otitis Externa (Swimmer's Ear)",
      "Eustachian Tube Dysfunction",
      "Otosclerosis (stapes fixation causing conductive loss)"
    ],
    diagnosis: [
      "High-magnification microscopic examination of the tympanic membrane",
      "Rigid oto-endoscopy with digital photo-documentation",
      "Pure Tone Audiometry (PTA) & Speech Discrimination testing",
      "Impedance Audiometry & Tympanometry",
      "High-Resolution Temporal Bone CT imaging (HRCT)"
    ],
    treatments: [
      "Microscopic Tympanoplasty (eardrum repair and graft placement)",
      "Cortical and Modified Radical Mastoidectomy for chronic infection",
      "Stapedotomy for otosclerosis restoration",
      "Gentle micro-suction debridement under microscope visualization",
      "Targeted topical and systemic antimicrobial therapy"
    ],
    whenToConsult: [
      "Ear discharge persisting for more than 48 hours",
      "Sudden drop in hearing in one or both ears",
      "Ear pain accompanied by facial weakness or fever",
      "Dizziness or loss of balance associated with ear symptoms"
    ],
    faqs: [
      {
        q: "Can a perforated eardrum heal naturally without surgery?",
        a: "Small acute perforations caused by minor trauma often heal spontaneously within weeks under dry ear precautions. However, chronic perforations or those associated with recurrent discharge typically require surgical closure (tympanoplasty) to restore hearing and prevent deep ear infections."
      },
      {
        q: "What is micro-suction ear cleaning?",
        a: "Micro-suction is the international gold standard for ear cleaning. Under direct stereoscopic microscopic vision, a specialized delicate suction probe removes wax, fungal debris, or discharge safely without water irrigation, minimizing infection risk."
      }
    ]
  },

  "hearing-loss": {
    slug: "hearing-loss",
    title: "Hearing Loss & Audiology",
    badge: "Audiological Rehabilitation",
    intro: "Institutional evaluation of conductive, sensorineural, and mixed hearing loss with state-of-the-art diagnostic audiometry and digital hearing aid solutions.",
    symptoms: [
      "Difficulty understanding speech in noisy environments or gatherings",
      "Frequently asking people to repeat themselves",
      "Turning television or phone volume significantly louder",
      "Muffled sound perception or feeling as if ears are plugged",
      "Persistent tinnitus (ringing in ears) accompanying hearing changes"
    ],
    conditions: [
      "Age-related hearing loss (Presbycusis)",
      "Noise-induced sensorineural hearing loss",
      "Sudden Sensorineural Hearing Loss (SSNHL) — medical emergency",
      "Conductive hearing loss due to ossicular discontinuity or fluid",
      "Ototoxic medication-induced auditory impairment"
    ],
    diagnosis: [
      "Diagnostic Pure Tone Audiometry across air and bone conduction",
      "Speech Audiometry (SRT and Speech Recognition Thresholds)",
      "Tympanometry and Acoustic Reflex Thresholds",
      "Otoacoustic Emissions (OAE) screening",
      "Brainstem Evoked Response Audiometry (BERA / ABR)"
    ],
    treatments: [
      "Immediate steroid protocol for Sudden Sensorineural Hearing Loss",
      "Surgical reconstruction of the ossicular chain (Ossiculoplasty)",
      "Digital prescription hearing aid dispensing and real-ear verification",
      "Bone conduction hearing devices (BAHA assessment)",
      "Cochlear implant candidacy evaluation"
    ],
    whenToConsult: [
      "Any sudden drop in hearing over hours or days (requires emergency ENT evaluation)",
      "Hearing loss in only one ear accompanied by ringing or dizziness",
      "Gradual progressive hearing difficulty interfering with work or social life",
      "Hearing loss following head trauma or loud blast exposure"
    ],
    faqs: [
      {
        q: "Is sudden hearing loss an emergency?",
        a: "Yes. Sudden Sensorineural Hearing Loss (SSNHL) is a critical ENT medical emergency. Early intervention with medical protocols within 48 to 72 hours significantly increases the probability of permanent hearing recovery."
      },
      {
        q: "How do modern digital hearing aids differ from older models?",
        a: "Modern digital hearing aids feature multi-channel digital processors that isolate speech from background noise, connect wirelessly via Bluetooth, and are custom-fitted to your exact audiometric frequency curve."
      }
    ]
  },

  "sinus-allergy": {
    slug: "sinus-allergy",
    title: "Sinus & Allergy Care",
    badge: "Rhinology & Sinus Surgery",
    intro: "Comprehensive treatment for chronic sinusitis, allergic rhinitis, nasal polyposis, and deviated nasal septum using advanced high-definition diagnostic endoscopy and minimally invasive FESS.",
    symptoms: [
      "Chronic nasal congestion or persistent blockage on one or both sides",
      "Facial pressure, heaviness over forehead, cheeks, or between eyes",
      "Post-nasal drip causing throat clearing and chronic cough",
      "Frequent sneezing bouts, watery rhinorrhea, and itchy eyes",
      "Reduced or lost sense of smell (Anosmia / Hyposmia)"
    ],
    conditions: [
      "Chronic Rhinosinusitis with or without nasal polyps",
      "Deviated Nasal Septum (DNS) causing airway obstruction",
      "Allergic Rhinitis and Environmental Inhalant Allergies",
      "Hypertrophied inferior turbinates",
      "Fungal Rhinosinusitis (Allergic and Invasive variants)"
    ],
    diagnosis: [
      "High-Definition Rigid Diagnostic Nasal Endoscopy (0° and 30° scopes)",
      "Non-contrast CT Paranasal Sinuses (PNS) with 1mm coronal and axial cuts",
      "Allergy screening and IgE profile analysis",
      "Mucosal biopsy when atypical lesions or fungal elements are suspected",
      "Peak nasal inspiratory flow assessment"
    ],
    treatments: [
      "Functional Endoscopic Sinus Surgery (FESS) with microdebrider technology",
      "Septoplasty to straighten deviated cartilage and bone without external scars",
      "Radiofrequency turbinate reduction for airway enlargement",
      "Evidence-based medical management: intranasal corticosteroids & antihistamines",
      "Targeted allergy control and long-term immunotherapy guidance"
    ],
    whenToConsult: [
      "Sinus pressure or nasal blockage lasting more than 12 weeks despite medication",
      "Unilateral nasal obstruction or recurring single-sided nosebleeds",
      "Severe headache or visual swelling accompanying nasal symptoms",
      "Complete loss of smell or chronic unrefreshing sleep due to mouth breathing"
    ],
    faqs: [
      {
        q: "What is Functional Endoscopic Sinus Surgery (FESS)?",
        a: "FESS is a minimally invasive surgical procedure performed entirely through the nostrils using high-definition endoscopes. It widens natural sinus drainage pathways and removes obstructing polyps without any external facial incisions or bruising."
      },
      {
        q: "Can a deviated septum be corrected with medicines alone?",
        a: "Medicines can temporarily relieve mucosal swelling and allergy symptoms, but they cannot physically straighten a crooked bone or cartilage. When airway obstruction is significant, a Septoplasty safely corrects the structural deviation."
      }
    ]
  },

  "throat-voice": {
    slug: "throat-voice",
    title: "Throat & Voice Care",
    badge: "Laryngology & Voice Disorders",
    intro: "Specialized clinical diagnosis and micro-surgical care for hoarseness of voice, vocal cord lesions, chronic pharyngitis, tonsillar diseases, and swallowing difficulties.",
    symptoms: [
      "Hoarseness, raspiness, or pitch changes lasting more than 2 weeks",
      "Voice fatigue, strain, or loss of vocal range while speaking",
      "Sensation of a lump in the throat (Globus pharyngeus)",
      "Persistent sore throat, painful swallowing, or throat burning",
      "Chronic throat clearing and dry night-time coughing"
    ],
    conditions: [
      "Vocal cord nodules, polyps, cysts, and contact ulcers",
      "Laryngopharyngeal Reflux (LPR / silent acid reflux)",
      "Chronic tonsillitis and recurrent peritonsillar infections",
      "Vocal cord paresis or paralysis",
      "Benign and early premalignant lesions of the vocal cords"
    ],
    diagnosis: [
      "High-resolution Video Laryngoscopy (rigid 70° and flexible endoscopy)",
      "Stroboscopy for vocal cord mucosal wave assessment",
      "Reflux finding score and clinical gastroenterology correlation",
      "Neck ultrasonography and tissue histopathology when indicated"
    ],
    treatments: [
      "Microlaryngeal Surgery (MLS) for vocal cord polyp/nodule excision",
      "Coblation / precision tonsillectomy and adenoidectomy",
      "Structured voice therapy and vocal hygiene protocols",
      "Medical anti-reflux regimens tailored to LPR disease",
      "Injection laryngoplasty for vocal cord insufficiency"
    ],
    whenToConsult: [
      "Any voice change or hoarseness persisting beyond 2 to 3 weeks",
      "Painful swallowing (odynophagia) radiating to the ear",
      "Coughing up blood or blood-tinged saliva",
      "Enlarged neck node accompanying a sore throat or voice change"
    ],
    faqs: [
      {
        q: "Why is persistent hoarseness considered a red flag?",
        a: "While temporary hoarseness often stems from acute laryngitis, any voice change lasting longer than 2 to 3 weeks requires direct laryngoscopy to rule out vocal fold polyps, papillomas, or early neoplastic lesions."
      },
      {
        q: "What is Laryngopharyngeal Reflux (LPR)?",
        a: "LPR occurs when stomach enzymes and acid travel up into the delicate tissues of the larynx and pharynx, often causing throat clearing, foreign body sensation, and hoarseness without typical heartburn."
      }
    ]
  },

  "pediatric-ent": {
    slug: "pediatric-ent",
    title: "Pediatric ENT",
    badge: "Gentle Child ENT Care",
    intro: "Gentle, compassionate, and child-friendly ENT care tailored specifically to the anatomical and physiological needs of infants, toddlers, and young children.",
    symptoms: [
      "Loud snoring, mouth breathing, or restless nighttime sleep",
      "Repeated bouts of high fever, earaches, and ear-tugging in toddlers",
      "Delayed speech development or inattentiveness in school",
      "Chronic nasal discharge and recurring tonsil infections",
      "Nasal obstruction causing daytime tiredness and poor appetite"
    ],
    conditions: [
      "Adenoid hypertrophy causing obstructive sleep apnea in children",
      "Recurrent Acute Otitis Media & Otitis Media with Effusion (Glue Ear)",
      "Recurrent streptococcal tonsillitis",
      "Congenital preauricular sinuses and neck branchial cleft anomalies",
      "Foreign bodies in the ear or nose"
    ],
    diagnosis: [
      "Gentle pediatric oto-endoscopy with mini-optics",
      "Otoacoustic Emissions (OAE) & Tympanometry for Glue Ear detection",
      "Lateral soft tissue neck X-ray for adenoid enlargement scoring",
      "Behavioral and play audiometry for toddlers"
    ],
    treatments: [
      "Grommet / ventilation tube insertion for persistent glue ear",
      "Coblation-assisted adenoidectomy and tonsillectomy (minimal pain/bleeding)",
      "Emergency foreign body extraction with pediatric instrumentation",
      "Non-operative conservative antibiotic and anti-inflammatory protocols",
      "Speech therapy referrals for post-hearing recovery support"
    ],
    whenToConsult: [
      "Child snores loudly, gasps for air, or pauses breathing during sleep",
      "Suspected hearing difficulty or delayed speech milestones",
      "Repeated ear infections requiring multiple courses of antibiotics",
      "Child inserts a foreign object (battery, bead, seed) into ear or nose"
    ],
    faqs: [
      {
        q: "What is 'Glue Ear' in children and how is it treated?",
        a: "Glue Ear is a condition where sticky fluid collects in the middle ear space behind the eardrum, muting hearing. If fluid persists past 3 months despite medical treatment, tiny ventilation tubes (grommets) are placed to restore hearing and prevent developmental speech delays."
      },
      {
        q: "Does my child need their tonsils and adenoids removed?",
        a: "Surgery is recommended only when enlarged tonsils and adenoids cause obstructive sleep apnea (breathing pauses), severe chronic airway blockage, or documented frequent recurrent bacterial infections."
      }
    ]
  },

  "vertigo": {
    slug: "vertigo",
    title: "Vertigo & Balance Disorders",
    badge: "Vestibular Medicine",
    intro: "Specialized clinical diagnosis and rehabilitation for dizziness, spinning sensations, balance unsteadiness, and inner-ear vestibular disorders.",
    symptoms: [
      "Sudden sensation that the room or your surroundings are spinning",
      "Lightheadedness, dizziness, or floating sensations when changing head position",
      "Loss of balance, veering off to one side while walking",
      "Nausea, vomiting, and cold sweats during acute episodes",
      "Fullness in the ear or fluctuating hearing loss with dizziness"
    ],
    conditions: [
      "Benign Paroxysmal Positional Vertigo (BPPV)",
      "Vestibular Neuritis / Labyrinthitis",
      "Meniere's Disease (endolymphatic hydrops)",
      "Vestibular Migraine",
      "Persistent Postural-Perceptual Dizziness (PPPD)"
    ],
    diagnosis: [
      "Positional diagnostic testing (Dix-Hallpike and Supine Roll tests)",
      "Video-Nystagmography (VNG) / Frenzel goggles assessment",
      "Head Impulse Test (HIT) and cerebellar balance screening",
      "Pure Tone Audiometry to assess inner ear auditory involvement",
      "Brain MRI with internal auditory canal protocol when indicated"
    ],
    treatments: [
      "Canalith Repositioning Maneuvers (Epley, Semont, Barbecue maneuvers)",
      "Targeted Vestibular Rehabilitation Therapy (VRT) exercises",
      "Acute vestibular suppressant medications for emergency relief",
      "Dietary lifestyle guidance (low sodium protocols for Meniere's)",
      "Intratympanic pharmacotherapy for intractable Meniere's disease"
    ],
    whenToConsult: [
      "First-ever episode of sudden intense spinning vertigo",
      "Vertigo accompanied by double vision, slurred speech, or limb numbness",
      "Vertigo accompanied by sudden hearing drop or ringing in one ear",
      "Persistent unsteadiness leading to frequent falls or fear of walking"
    ],
    faqs: [
      {
        q: "What is BPPV and how is it cured?",
        a: "BPPV occurs when microscopic calcium carbonate crystals (otoliths) become dislodged and float into the inner ear semicircular canals. It is swiftly cured in the consultation chamber using specialized repositioning maneuvers (such as the Epley maneuver) without any medications or surgery."
      },
      {
        q: "How can I tell if dizziness is from the ear or the brain?",
        a: "Inner ear vertigo typically presents with spinning sensations triggered by head movements and is often accompanied by ear fullness or hearing changes. Dizziness accompanied by neurological deficits (slurred speech, limb weakness, double vision) requires emergency neurological evaluation."
      }
    ]
  },

  "cochlear-implants": {
    slug: "cochlear-implants",
    title: "Cochlear Implants",
    badge: "Advanced Otology & Implants",
    intro: "Comprehensive candidacy assessment, surgical implantation, and post-operative audiological mapping for severe-to-profound sensorineural deafness in pediatric and adult patients.",
    symptoms: [
      "Severe or profound hearing loss offering minimal benefit from hearing aids",
      "Inability to understand speech on the telephone even with amplification",
      "Children born deaf or failing newborn hearing screening (OAE/BERA)",
      "Sudden profound post-meningitic or idiopathic bilateral deafness",
      "High reliance on lip-reading despite optimal hearing aid fitting"
    ],
    conditions: [
      "Congenital bilateral profound sensorineural hearing loss in children",
      "Post-lingual adult severe-to-profound deafness",
      "Auditory neuropathy spectrum disorders",
      "Cochlear ossification post-meningitis requiring rapid implantation",
      "Single-sided deafness (SSD) in selected candidate protocols"
    ],
    diagnosis: [
      "Diagnostic Pure Tone & High-Frequency Audiometry",
      "Auditory Brainstem Response (BERA / ABR) and ASSR testing",
      "Hearing Aid Trial and Aided Speech Perception Score assessment",
      "High-Resolution CT of Temporal Bones (electrode trajectory analysis)",
      "High-field Inner Ear 3D-CISS MRI (cochlear patency & cochlear nerve status)"
    ],
    treatments: [
      "Microscopic posterior tympanotomy and round window cochlear implantation",
      "Preservation of residual acoustic hearing surgical techniques",
      "Intra-operative neural response telemetry (NRT) verification",
      "Post-operative telemetry, audio processor activation, and mapping",
      "Integrated auditory-verbal therapy (AVT) rehabilitation"
    ],
    whenToConsult: [
      "Infants not responding to sounds, claps, or voices by 6 to 9 months",
      "Adults whose hearing has degraded to the point that hearing aids fail to clarify speech",
      "Post-meningitis deafness in children (requires immediate urgent evaluation)"
    ],
    faqs: [
      {
        q: "How does a cochlear implant differ from a hearing aid?",
        a: "A hearing aid amplifies acoustic sound into the ear canal. A cochlear implant bypasses damaged microscopic hair cells entirely and stimulates the auditory nerve directly using an implanted electrode array."
      },
      {
        q: "What is the optimal age for a child to receive a cochlear implant?",
        a: "Children born with profound deafness benefit most when implanted early—ideally before 1 to 2 years of age—enabling normal cortical speech and language development."
      }
    ]
  },

  "skull-base-surgery": {
    slug: "skull-base-surgery",
    title: "Skull Base Surgery",
    badge: "Neurotology & Skull Base",
    intro: "Institutional surgical management of complex lesions, tumors, and cranial nerve disorders located at the delicate junction between the ear, nasal sinuses, and the base of the brain.",
    symptoms: [
      "Unilateral hearing loss accompanied by facial numbness or twitching",
      "Clear, watery fluid dripping from one nostril when bending forward (CSF leak)",
      "Deep-seated intractable ear pain or persistent temporal headaches",
      "Difficulty swallowing or hoarseness associated with lower cranial nerve signs",
      "Unexplained unilateral pulsatile tinnitus (heartbeat sound in ear)"
    ],
    conditions: [
      "Vestibular Schwannoma / Acoustic Neuroma",
      "Glomus Tympanicum and Glomus Jugulare tumors (paragangliomas)",
      "Spontaneous or traumatic Cerebrospinal Fluid (CSF) rhinorrhea / otorrhea",
      "Extensive lateral temporal bone cholesteatoma invading skull base",
      "Endoscopic management of anterior skull base encephaloceles"
    ],
    diagnosis: [
      "Contrast-enhanced High-Resolution MRI with Fiesta/CISS skull base sequences",
      "Multislice Thin-cut Bone Algorithm CT of the skull base",
      "Diagnostic Nasal Endoscopy and beta-2 transferrin CSF confirmation assay",
      "Digital Subtraction Angiography (DSA) for vascular tumors",
      "Full Cranial Nerve sensory and motor electrodiagnostic testing"
    ],
    treatments: [
      "Translabyrinthine and Retrosigmoid approaches for vestibular schwannoma",
      "Endoscopic Endonasal skull base repair of CSF leaks with vascularized mucosal flaps",
      "Infratemporal fossa dissection for glomus jugulare tumors",
      "Facial nerve decompression and cable nerve grafting",
      "Multidisciplinary tumor board coordination and neurosurgical collaboration"
    ],
    whenToConsult: [
      "Clear, watery fluid continuously dripping from one nostril after head injury or sneezing",
      "Unilateral hearing loss combined with tingling/numbness on the same side of the face",
      "Pulsating whooshing sound in one ear synchronized with your heartbeat",
      "Sudden onset facial drooping or paralysis"
    ],
    faqs: [
      {
        q: "What is an endoscopic CSF leak repair?",
        a: "An endoscopic CSF leak repair is performed through the nostrils without opening the skull or making facial incisions. Using high-definition endoscopes, the surgeon locates the defect at the base of the brain and seals it permanently using multilayered tissue grafts."
      },
      {
        q: "What is an Acoustic Neuroma (Vestibular Schwannoma)?",
        a: "It is a benign, slow-growing tumor arising on the vestibular nerve leading from the inner ear to the brain. Early diagnosis preserves hearing and facial nerve function."
      }
    ]
  },

  "head-neck-care": {
    slug: "head-neck-care",
    title: "Head & Neck Surgery",
    badge: "Head & Neck Oncology & Surgery",
    intro: "Comprehensive diagnostic evaluation and precise surgical treatment for thyroid, parotid, salivary gland tumors, neck cysts, and early upper aerodigestive tract lesions.",
    symptoms: [
      "Painless or growing swelling, nodule, or lump in the neck",
      "Swelling in front of the ear or beneath the lower jaw (salivary glands)",
      "Difficulty or pain while swallowing that does not resolve",
      "Non-healing ulcers on tongue, gums, or inner lining of the mouth",
      "Changes in voice, throat heaviness, or blood-streaked sputum"
    ],
    conditions: [
      "Thyroid nodules, multinodular goiters, and thyroid neoplasms",
      "Pleomorphic adenoma and Warthin's tumor of the parotid gland",
      "Submandibular gland calculi (stones) and chronic sialadenitis",
      "Congenital neck masses (Thyroglossal duct cysts, Branchial cleft cysts)",
      "Cervical lymphadenopathy requiring diagnostic surgical excision"
    ],
    diagnosis: [
      "High-resolution Neck Ultrasound with color Doppler analysis",
      "Ultrasound-guided Fine Needle Aspiration Cytology (FNAC)",
      "Contrast-enhanced CT / MRI of the neck and skull base",
      "Flexible Fiberoptic Laryngopharyngoscopy",
      "Comprehensive thyroid hormonal and autoantibody profiling"
    ],
    treatments: [
      "Total and Hemi-Thyroidectomy with recurrent laryngeal nerve preservation",
      "Superficial and Total Parotidectomy with continuous intraoperative facial nerve monitoring",
      "Excision of submandibular salivary gland and sialolithotomy",
      "Sistrunk procedure for thyroglossal duct cyst excision",
      "Selective neck dissection and diagnostic lymph node biopsy"
    ],
    whenToConsult: [
      "Any neck lump or swelling persisting for more than 2 to 3 weeks",
      "Rapidly enlarging swelling in the thyroid or cheek region",
      "Neck mass associated with voice hoarseness or difficulty swallowing",
      "Non-healing mouth ulcer lasting beyond 2 weeks, especially in tobacco users"
    ],
    faqs: [
      {
        q: "How is the facial nerve protected during parotid surgery?",
        a: "During parotidectomy, our surgeons use microsurgical dissection and continuous intraoperative facial nerve monitoring to visually and electrically track every branch of the facial nerve, minimizing post-operative weakness."
      },
      {
        q: "Are all thyroid nodules cancerous?",
        a: "No. The vast majority (>90%) of thyroid nodules are benign. High-resolution ultrasound and an ultrasound-guided FNAC safely determine whether medical observation or surgical excision is needed."
      }
    ]
  },

  "experienced-ent-specialists": {
    slug: "experienced-ent-specialists",
    title: "Experienced ENT Specialists",
    badge: "Institutional Surgical Lineage",
    intro: "PGI-trained ENT surgeons bringing decades of institutional experience, high-volume surgical precision, and academic excellence to your ear, nose, and throat care.",
    symptoms: [
      "Complex or recurrent ear, nose, and throat conditions requiring expert surgical review",
      "Chronic sinus disease unresponsive to standard medications",
      "Hearing loss, severe dizziness, or skull base conditions requiring subspecialist care",
      "Seeking a trusted second opinion regarding recommended ENT surgeries"
    ],
    conditions: [
      "Chronic Suppurative Otitis Media (CSOM) with eardrum perforation & mastoiditis",
      "Cholesteatoma and ossicular chain damage",
      "Functional Endoscopic Sinus Surgery (FESS) surgical cases",
      "Lateral skull base lesions, acoustic neuromas, and glomus tumours",
      "Complex pediatric and adult airway, thyroid, and neck conditions"
    ],
    diagnosis: [
      "High-magnification surgical stereomicroscopy",
      "High-definition rigid video endoscopy and stroboscopy",
      "Diagnostic Pure Tone & Speech Audiometry in calibrated sound booth",
      "High-Resolution Temporal Bone and Paranasal Sinus CT review",
      "Institutional multidisciplinary surgical assessment and recovery planning"
    ],
    treatments: [
      "Microscopic Tympanoplasty & Mastoidectomy for chronic ear disease",
      "Stapedotomy for Otosclerosis hearing restoration",
      "Functional Endoscopic Sinus Surgery (FESS)",
      "Cochlear Implantation & Bone Conduction Hearing Implants",
      "Senior consultant surgical oversight and dedicated post-operative care"
    ],
    whenToConsult: [
      "When seeking expert surgical consultation for chronic or unresolved ENT disorders",
      "If recurring ear discharge, sinus blockage, or voice hoarseness persists despite medication",
      "For comprehensive pre-surgical evaluation and second opinions"
    ],
    faqs: [
      {
        q: "What institutional background do the surgeons at Dr. Rattan ENT Clinic have?",
        a: "Our surgeons are trained and have served at premier national institutions including PGIMER Chandigarh, Seth G.S. Medical College & KEM Hospital Mumbai, and Sir Ganga Ram Hospital New Delhi, providing over 35 years of dedicated surgical practice."
      },
      {
        q: "Can I receive a second opinion regarding an upcoming ENT surgery?",
        a: "Yes. We regularly provide detailed clinical evaluations and objective second opinions on tympanoplasty, mastoidectomy, sinus surgery, tonsillectomy, and skull base procedures."
      }
    ]
  },

  "personalised-treatment": {
    slug: "personalised-treatment",
    title: "Personalised Treatment",
    badge: "Individualized Patient Care",
    intro: "Tailored treatment protocols focused entirely on your specific health needs, anatomy, and lifestyle, combining evidence-based medicine with conservative, patient-centric solutions.",
    symptoms: [
      "Unique or recurrent combinations of ear, nose, or throat symptoms",
      "Inadequate response to generalized or one-size-fits-all medical regimens",
      "Chronic allergies, sinusitis, or reflux-induced throat irritation requiring targeted management",
      "Hearing challenges tailored to individual occupational and daily lifestyle demands"
    ],
    conditions: [
      "Allergic Rhinitis and chronic seasonal environmental allergies",
      "Complex hearing impairment and custom audiological rehabilitation",
      "Chronic pharyngitis, GERD-related throat irritation, and vocal strain",
      "Recurring pediatric otitis media and tonsillar hypertrophy",
      "Recurrent Benign Paroxysmal Positional Vertigo (BPPV)"
    ],
    diagnosis: [
      "Detailed clinical history and lifestyle-aligned symptom evaluation",
      "Targeted endoscopic and audiological diagnostic workup",
      "Allergy profiling and environmental trigger identification",
      "Personalized baseline audiograms and vestibular assessments"
    ],
    treatments: [
      "Individualized medical therapy with step-up/step-down regimens",
      "Custom hearing rehabilitation and acoustic fitting",
      "Conservative management prioritized before considering surgical intervention",
      "Structured home-care, voice hygiene, and rehabilitation plans",
      "Proactive follow-up scheduling and direct consultant access"
    ],
    whenToConsult: [
      "When symptoms persist despite routine standard treatments",
      "When you desire an individualized, conservative approach tailored to your health history",
      "For comprehensive allergy, voice, or hearing management"
    ],
    faqs: [
      {
        q: "How are treatment plans customized for each patient?",
        a: "We take into account your detailed medical history, specific diagnostic findings, daily occupational demands, and individual preferences to recommend treatments ranging from conservative therapies to advanced interventions."
      },
      {
        q: "Are conservative, non-surgical options explored first?",
        a: "Always. Wherever medically viable and safe, we prioritize conservative medical therapy, lifestyle modifications, and non-invasive options before recommending surgical solutions."
      }
    ]
  },

  "advanced-diagnosis": {
    slug: "advanced-diagnosis",
    title: "Advanced Diagnosis",
    badge: "Precision Diagnostic Tools",
    intro: "Equipped with state-of-the-art diagnostic tools for precise, accurate evaluation of ear, nose, throat, audiology, and balance disorders in Chandigarh.",
    symptoms: [
      "Unexplained hearing decline, ear fullness, or persistent ringing sounds",
      "Persistent nasal obstruction, chronic sinus headaches, or olfactory changes",
      "Hoarseness, voice fatigue, or chronic difficulty swallowing",
      "Dizziness, spinning sensations, lightheadedness, or unsteadiness"
    ],
    conditions: [
      "Tympanic membrane perforations and ossicular problems",
      "Nasal polyposis, deviated nasal septum, and sinus drainage blockage",
      "Vocal cord nodules, polyps, cysts, and paresis",
      "Inner ear vestibular dysfunction and labyrinthine disorders",
      "Hidden skull base and middle ear pathologies"
    ],
    diagnosis: [
      "High-Definition Rigid Oto-Endoscopy with live patient display",
      "High-Resolution Diagnostic Nasal Endoscopy (DNE)",
      "Fiberoptic Video Laryngoscopy (FOL) for vocal cord imaging",
      "Pure Tone Audiometry (PTA) & High-Frequency Audiology in sound-treated booth",
      "Impedance Audiometry & Tympanometry",
      "Comprehensive Vestibular & Balance Assessment protocols"
    ],
    treatments: [
      "Precise targeted treatment plans based on objective imaging",
      "Point-of-care micro-suction cleaning under stereoscopic magnification",
      "Immediate digital endoscopy report delivery to patients",
      "Collaborative review of CT and MRI temporal bone and sinus scans"
    ],
    whenToConsult: [
      "For definitive diagnosis of unresolved ear, nose, or throat symptoms",
      "Before undertaking any recommended ENT surgical intervention",
      "When routine examinations have failed to identify the root cause of symptoms"
    ],
    faqs: [
      {
        q: "Are endoscopic examinations painful?",
        a: "No. Diagnostic oto-endoscopy, nasal endoscopy, and video laryngoscopy are gentle, minimally invasive office procedures performed in minutes with topical numbing sprays where appropriate."
      },
      {
        q: "Can I view the endoscopic examination images?",
        a: "Yes. Our high-definition endoscopic camera systems display real-time video on screens so you and your doctor can observe and discuss your condition clearly."
      }
    ]
  },

  "transparent-guidance": {
    slug: "transparent-guidance",
    title: "Transparent Guidance",
    badge: "Honest, Ethical Medical Advice",
    intro: "Clear, honest explanations of your condition, treatment alternatives, expected outcomes, and procedural details so you can make confident, informed healthcare decisions.",
    symptoms: [
      "Uncertainty regarding surgical necessity or medical options",
      "Conflicting medical opinions received for ENT conditions",
      "Questions regarding post-operative recovery timelines and risks",
      "Need for clear, honest counsel on chronic condition management"
    ],
    conditions: [
      "Indications for elective ENT surgery (Tonsillectomy, Septoplasty, FESS, Tympanoplasty)",
      "Management options for chronic hearing loss and tinnitus",
      "Long-term management of chronic allergic rhinosinusitis",
      "Pediatric ENT conditions and watchful waiting strategies"
    ],
    diagnosis: [
      "Visual walkthrough of endoscopic findings and scan images",
      "Objective evaluation of clinical necessity versus optional treatments",
      "Review of risk factors, lifestyle contributors, and prognosis"
    ],
    treatments: [
      "Comprehensive pre-consultation counseling sessions",
      "Transparent discussion of expected recovery times and success rates",
      "Clear guidance on non-surgical alternatives and observation periods",
      "Detailed post-operative care instructions and transparent cost estimates"
    ],
    whenToConsult: [
      "When you want unbiased medical advice without pressure to undergo surgery",
      "When deciding between conservative management and surgical interventions",
      "For an honest, transparent assessment of pediatric or adult ENT conditions"
    ],
    faqs: [
      {
        q: "Will surgery only be recommended when strictly necessary?",
        a: "Yes. We adhere strictly to evidence-based medical ethics. Surgery is only advised when clear clinical indications exist and conservative management is insufficient."
      },
      {
        q: "Do you explain scan results and endoscopic images during the appointment?",
        a: "Absolutely. We review CT/MRI imaging and live endoscopic findings together on screen so you understand exactly what is happening and why a particular treatment is recommended."
      }
    ]
  },

  "comfortable-experience": {
    slug: "comfortable-experience",
    title: "Comfortable Experience",
    badge: "Warm, Patient-Centric Care",
    intro: "Warm, compassionate, and attentive clinical care in a welcoming, hygienic, and modern facility designed for patient comfort, gentle procedures, and peace of mind.",
    symptoms: [
      "Anxiety related to clinical procedures, ear cleaning, or endoscopies",
      "Pediatric patients needing gentle, reassuring clinical handling",
      "Elderly patients requiring accessible, patient-paced consultations"
    ],
    conditions: [
      "Routine and emergency ENT consultations",
      "Office procedures including micro-suction ear wax removal",
      "Pre-operative evaluations and routine follow-up checkups",
      "Pediatric ENT screening in a child-friendly atmosphere"
    ],
    diagnosis: [
      "Gentle clinical examinations performed at the patient's comfort level",
      "Step-by-step procedural explanations before each diagnostic step",
      "Modern, ergonomic examination chairs and clean acoustic booths"
    ],
    treatments: [
      "Pain-free microscopic ear debridement and suctioning",
      "Comfort-focused outpatient minor procedures",
      "Child-friendly examination techniques that prevent anxiety",
      "Prompt appointment scheduling and minimal clinic waiting times"
    ],
    whenToConsult: [
      "For gentle, anxiety-free ENT care for children and adults alike",
      "When seeking routine hygiene care such as microscopic ear cleaning",
      "For comprehensive checkups in a warm, respectful clinical setting"
    ],
    faqs: [
      {
        q: "Is the clinic equipped for elderly or anxious patients?",
        a: "Yes. Our facility is designed for accessibility, with gentle handling, calm examination rooms, and ample time allocated so patients never feel rushed."
      },
      {
        q: "How are pediatric patients made comfortable during examinations?",
        a: "Our specialists use gentle, non-threatening approaches, explaining instruments playfully and allowing parents to remain close at all times."
      }
    ]
  }
};

export function generateStaticParams() {
  return Object.keys(serviceCatalog).map(slug => ({ service: slug }));
}

type Props = {
  params: Promise<{ service: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: serviceSlug } = await params;
  const service = serviceCatalog[serviceSlug];

  if (!service) {
    return { title: "Service Not Found | Dr. Rattan ENT Clinic" };
  }

  return {
    title: `${service.title} | Dr. Rattan ENT Clinic`,
    description: service.intro,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { service: serviceSlug } = await params;
  const siteContent = await getSiteContent();
  const cmsService = (siteContent.services || []).find((s) => s.slug === serviceSlug);
  const baseService = serviceCatalog[serviceSlug];

  if (!baseService && !cmsService) {
    notFound();
  }

  const service: ServiceDetail = {
    slug: serviceSlug,
    title: cmsService?.name || baseService?.title || "Clinical Service",
    badge: baseService?.badge || cmsService?.category || "Specialized ENT",
    intro: cmsService?.desc || baseService?.intro || "",
    symptoms: baseService?.symptoms || [],
    conditions: baseService?.conditions || [],
    diagnosis: baseService?.diagnosis || [],
    treatments: cmsService?.highlights && cmsService.highlights.length > 0 ? cmsService.highlights : (baseService?.treatments || []),
    whenToConsult: baseService?.whenToConsult || [],
    faqs: baseService?.faqs || [],
  };

  return (
    <main>
      {/* SERVICE HERO BANNER */}
      <section style={{
        padding: "5.5rem 2rem 4rem",
        background: "linear-gradient(135deg, #0b2438 0%, #123653 60%, #0d2a42 100%)",
        color: "#fff",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,162,74,0.12), transparent 70%)", top: "-50px", right: "10%", pointerEvents: "none" }} />
        
        <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ marginBottom: "1rem" }}>
            <Breadcrumbs items={[
              { label: "Services", href: "/services" },
              { label: service.title }
            ]} />
          </div>

          <div style={{
            fontSize: "11.5px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: "0.85rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span style={{ width: "18px", height: "1.5px", background: "var(--gold)" }} />
            {service.badge}
          </div>

          <h1 style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(34px, 4.2vw, 48px)",
            color: "#ffffff",
            lineHeight: 1.15,
            marginBottom: "1.2rem"
          }}>
            {service.title}
          </h1>

          <p style={{
            fontSize: "16.5px",
            color: "rgba(255, 255, 255, 0.84)",
            maxWidth: "720px",
            lineHeight: 1.75
          }}>
            {service.intro}
          </p>
        </div>
      </section>

      {/* CLINICAL CONTENT CONTAINER */}
      <section style={{ padding: "4rem 1.25rem", background: "var(--cream)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          
          {/* SYMPTOMS & CONDITIONS GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
            
            {/* Symptoms Card */}
            <div style={{ background: "#ffffff", padding: "clamp(20px, 4vw, 2.2rem)", borderRadius: "14px", border: "1px solid var(--border)", boxShadow: "0 6px 20px rgba(18,54,83,0.05)", width: "100%", boxSizing: "border-box" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
                <span style={{ fontSize: "20px" }}>⚠️</span>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: "22px", color: "var(--navy)", margin: 0 }}>
                  Common Symptoms
                </h2>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {service.symptoms.map((sym, i) => (
                  <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "0.85rem", fontSize: "14.5px", color: "var(--muted)", lineHeight: 1.6 }}>
                    <span style={{ color: "var(--gold)", fontWeight: 700 }}>•</span>
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Conditions Treated Card */}
            <div style={{ background: "#ffffff", padding: "clamp(20px, 4vw, 2.2rem)", borderRadius: "14px", border: "1px solid var(--border)", boxShadow: "0 6px 20px rgba(18,54,83,0.05)", width: "100%", boxSizing: "border-box" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
                <span style={{ fontSize: "20px" }}>🩺</span>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: "22px", color: "var(--navy)", margin: 0 }}>
                  Conditions Treated
                </h2>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {service.conditions.map((con, i) => (
                  <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "0.85rem", fontSize: "14.5px", color: "var(--muted)", lineHeight: 1.6 }}>
                    <span style={{ color: "var(--navy)", fontWeight: 700 }}>✓</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* DIAGNOSIS & ADVANCED TREATMENT OPTIONS */}
          <div style={{ background: "#ffffff", padding: "clamp(22px, 4vw, 2.5rem)", borderRadius: "16px", border: "1px solid rgba(201,162,74,0.3)", boxShadow: "0 10px 30px rgba(18,54,83,0.06)", marginBottom: "3rem", width: "100%", boxSizing: "border-box" }}>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(22px, 4vw, 26px)", color: "var(--navy)", marginBottom: "1.5rem" }}>
              Diagnostic & Advanced Treatment Protocols
            </h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "2rem" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
                  1. Clinical Diagnosis
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {service.diagnosis.map((diag, i) => (
                    <li key={i} style={{ display: "flex", gap: "8px", marginBottom: "0.75rem", fontSize: "14.5px", color: "var(--text)" }}>
                      <span style={{ color: "var(--gold)" }}>→</span>
                      <span>{diag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
                  2. Surgical & Medical Treatments
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {service.treatments.map((treat, i) => (
                    <li key={i} style={{ display: "flex", gap: "8px", marginBottom: "0.75rem", fontSize: "14.5px", color: "var(--text)" }}>
                      <span style={{ color: "var(--gold)" }}>→</span>
                      <span>{treat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* WHEN TO CONSULT AN ENT SPECIALIST */}
          <div style={{ background: "#fbfbf8", padding: "2.2rem", borderRadius: "14px", borderLeft: "4px solid var(--gold)", borderTop: "1px solid var(--border)", borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)", marginBottom: "3rem" }}>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "22px", color: "var(--navy)", marginBottom: "1rem" }}>
              When to Consult an ENT Specialist
            </h2>
            <p style={{ fontSize: "14.5px", color: "var(--muted)", marginBottom: "1rem" }}>
              Early evaluation prevents chronic complications. Schedule a specialist consultation promptly if you experience:
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {service.whenToConsult.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "0.6rem", fontSize: "14px", color: "var(--navy)" }}>
                  <span style={{ color: "var(--red)", fontWeight: 700 }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* EDUCATIONAL FAQS */}
          {service.faqs && service.faqs.length > 0 && (
            <div style={{ marginBottom: "3.5rem" }}>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: "26px", color: "var(--navy)", marginBottom: "1.5rem", textAlign: "center" }}>
                Frequently Asked Questions
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {service.faqs.map((faq, i) => (
                  <div key={i} style={{ background: "#ffffff", padding: "1.5rem 1.8rem", borderRadius: "10px", border: "1px solid var(--border)" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--navy)", marginBottom: "0.5rem" }}>
                      {faq.q}
                    </h3>
                    <p style={{ fontSize: "14.5px", color: "var(--muted)", lineHeight: 1.7, margin: 0 }}>
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BOOK APPOINTMENT CTA BANNER */}
          <div style={{
            background: "linear-gradient(135deg, #0b2438 0%, #123653 100%)",
            color: "#ffffff",
            padding: "3.5rem 2.5rem",
            borderRadius: "16px",
            textAlign: "center",
            boxShadow: "0 16px 40px rgba(18,54,83,0.18)",
            border: "1px solid rgba(201,162,74,0.3)"
          }}>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "28px", marginBottom: "0.85rem" }}>
              Consult Our ENT Specialists in Chandigarh
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.78)", maxWidth: "560px", margin: "0 auto 2rem", lineHeight: 1.65 }}>
              Receive an accurate evaluation and tailored treatment plan from Dr. Ganesh Dutt Rattan and Dr. Anav Rattan.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/book-appointment" className="btn-gold hover-lift">
                <span>Book an Appointment</span>
                <span>→</span>
              </Link>
              <a href="https://wa.me/919988004806" target="_blank" rel="noopener noreferrer" className="btn-gold-outline hover-lift">
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
