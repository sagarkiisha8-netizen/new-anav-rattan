export interface HeroButton {
  label: string;
  link: string;
  variant: "primary" | "secondary";
}

export interface HeroContent {
  badge: string;
  title: string;
  highlightedTitle: string;
  description: string;
  primaryButton: HeroButton;
  secondaryButton: HeroButton;
  image: string;
  doctorCardName: string;
  doctorCardRole: string;
  doctorCardClinic: string;
  trustPoints: string[];
}

export interface StatisticItem {
  number: string;
  label: string;
}

export interface WhyChooseUsBenefit {
  id: string;
  num: string;
  title: string;
  desc: string;
  subPoints: string[];
}

export interface TestimonialItem {
  id: string;
  stars: number;
  text: string;
  author: string;
  location?: string;
  condition?: string;
  initials?: string;
}

export interface JourneyStepItem {
  id: string;
  stepNumber: string;
  title: string;
  desc: string;
  badge?: string;
  icon?: string;
}

export interface HomeContent {
  hero: HeroContent;
  statistics: StatisticItem[];
  whyChooseUs: {
    label: string;
    title: string;
    benefits: WhyChooseUsBenefit[];
  };
  patientJourney?: {
    label: string;
    title: string;
    subtitle: string;
    steps: JourneyStepItem[];
  };
  testimonialsSection?: {
    label: string;
    title: string;
    subtitle: string;
    autoplay?: boolean;
    autoplayInterval?: number;
    items?: TestimonialItem[];
  };
  testimonials: TestimonialItem[];
  ctaBanner: {
    heading: string;
    subheading: string;
    buttonText: string;
    buttonLink: string;
  };
}

export interface AboutContent {
  label: string;
  title: string;
  subtitle: string;
  legacyTitle: string;
  legacyParagraph1: string;
  legacyParagraph2: string;
  legacyImage: string;
  experienceYears: string;
  trainingInstitution: string;
  mission: string;
  vision: string;
  ethics: string;
  facilities: { icon: string; title: string; desc: string }[];
  patientJourney: { step: string; title: string; desc: string }[];
}

export interface ServiceItem {
  id: string;
  slug: string;
  num: string;
  name: string;
  title?: string;
  category: string;
  icon: string;
  desc: string;
  shortDescription?: string;
  fullDescription?: string;
  highlights: string[];
  fullOverview?: string;
  symptoms?: string[];
  treatments?: string[];
  procedures?: string[];
  recovery?: string;
  diagnosticWorkup?: string[];
  treatmentProcedures?: { name: string; details: string }[];
  redFlags?: string[];
  faqs?: { q: string; a: string }[];
  isPublished: boolean;
  order: number;
}

export interface DoctorProfile {
  id: string;
  slug: string;
  name: string;
  title: string;
  role?: string;
  qualifications?: string;
  degrees?: string;
  regNumber?: string;
  bio: string;
  detailedBio?: string[];
  experience?: string;
  experienceYears?: number;
  surgeriesCount?: string;
  image: string;
  specialties: string[];
  achievements?: string[];
  schedule?: string;
  education?: string[];
  clinicalFocus?: string[];
  opdTimings?: string;
  isPublished?: boolean;
  order?: number;
}

export interface ResearchMilestone {
  id: string;
  badge: string;
  title: string;
  desc1: string;
  desc2: string;
  focusTitle: string;
  focusDesc: string;
  image: string;
  caption: string;
  subType: string;
}

export interface ResearchContent {
  title: string;
  subtitle: string;
  headline?: string;
  description?: string;
  milestones: ResearchMilestone[];
  ongoingInquiry: { title: string; desc: string }[];
}

export interface FAQItem {
  id: string;
  category: string;
  q: string;
  a: string;
  question?: string;
  answer?: string;
  order: number;
  isPublished: boolean;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: "surgical" | "clinic";
  categoryLabel: string;
  order: number;
}

export interface ContactContent {
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  googleMapsUrl: string;
  morningOpd: string;
  eveningOpd: string;
  sundayOpd: string;
}

export interface NavigationLink {
  label: string;
  href: string;
  enabled: boolean;
}

export interface SiteNavigation {
  logoText: string;
  logoHighlight: string;
  links: NavigationLink[];
  topBarHours: string;
  whatsappNumber: string;
  appointmentLink: string;
  footerTagline: string;
}

export interface ClinicInfo {
  name?: string;
  tagline?: string;
  phone?: string;
  emergencyPhone?: string;
  email?: string;
  address?: string;
  opdHours?: string;
  mapEmbedUrl?: string;
}

export interface SiteContent {
  clinicInfo?: ClinicInfo;
  home: HomeContent & {
    heroBadge?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    heroDescription?: string;
    heroImage?: string;
    stats?: { value: string; label: string }[];
  };
  about: AboutContent & {
    headline?: string;
  };
  services: ServiceItem[];
  doctors: DoctorProfile[];
  research: ResearchContent;
  faqs: FAQItem[];
  gallery: GalleryImage[];
  contact: ContactContent;
  navigation: SiteNavigation;
  footer?: {
    description?: string;
    copyright?: string;
  };
}

export type SubmissionStatus = "new" | "contacted" | "resolved" | "New" | "Contacted" | "Resolved";
export type SubmissionType = "contact" | "appointment";

export interface UnifiedSubmission {
  id: string;
  type: SubmissionType;
  fullName: string;
  name?: string;
  patientName?: string;
  phone: string;
  email?: string;
  service?: string;
  subject?: string;
  doctor?: string;
  visitType?: string;
  date?: string;
  preferredDate?: string;
  time?: string;
  preferredSlot?: string;
  message?: string;
  symptoms?: string;
  status: SubmissionStatus;
  notes?: string;
  adminNotes?: string;
  createdAt: string;
  submittedAt?: string;
}

export type SubmissionItem = UnifiedSubmission;
export type ContactSubmission = UnifiedSubmission;
export type AppointmentSubmission = UnifiedSubmission;
export type Submission = UnifiedSubmission;

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  title: string;
  alt: string;
  caption?: string;
  pageUsed?: string;
  sizeBytes?: number;
  size?: number;
  mimeType?: string;
  uploadedAt: string;
}

export interface AdminUser {
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
  updatedAt: string;
}
