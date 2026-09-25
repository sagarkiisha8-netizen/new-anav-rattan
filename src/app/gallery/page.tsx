import { Metadata } from "next";
import { getSiteContent } from "@/lib/db";
import GalleryClientView from "@/components/GalleryClientView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Clinical & Surgical Gallery | Dr. Rattan ENT Clinic Chandigarh",
  description:
    "Explore photographs of Dr. Rattan ENT Clinic, advanced diagnostic endoscopy suites, otomicroscopy setups, and surgical milestones from PGI Chandigarh and KEM Hospital Mumbai.",
};

export default async function GalleryPage() {
  const siteContent = await getSiteContent();
  const gallery = siteContent.gallery || [];

  return <GalleryClientView initialGallery={gallery} />;
}
