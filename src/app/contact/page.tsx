import { Metadata } from "next";
import { getSiteContent } from "@/lib/db";
import ContactClientView from "@/components/ContactClientView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Contact Us & Clinic Timings | Dr. Rattan ENT Clinic Chandigarh",
  description:
    "Get in touch with Dr. Rattan ENT Clinic in Sector 33C, Chandigarh. Consultation OPD hours, phone numbers, location map, and direct inquiry submission.",
};

export default async function ContactPage() {
  const siteContent = await getSiteContent();
  const contact = siteContent.contact || {};

  return <ContactClientView contact={contact} />;
}
