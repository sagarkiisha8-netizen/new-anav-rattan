import { Metadata } from "next";
import { getSiteContent } from "@/lib/db";
import FAQClientView from "@/components/FAQClientView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Dr. Rattan ENT Clinic Chandigarh",
  description:
    "Find clear, medically sound answers to common inquiries regarding ear microsurgery, sinus endoscopy, vertigo treatments, pediatric conditions, and clinic consultations.",
};

export default async function FAQsPage() {
  const siteContent = await getSiteContent();
  const faqs = siteContent.faqs || [];

  return <FAQClientView initialFaqs={faqs} />;
}
