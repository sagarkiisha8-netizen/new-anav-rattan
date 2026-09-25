import { Metadata } from "next";
import { getSiteContent } from "@/lib/db";
import AppointmentClientView from "@/components/AppointmentClientView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Book an Appointment | Dr. Rattan ENT Clinic Chandigarh",
  description:
    "Schedule an outpatient consultation with Dr. Ganesh Dutt Rattan and Dr. Anav Rattan at our Sector 33C clinic in Chandigarh.",
};

export default async function BookAppointmentPage() {
  const siteContent = await getSiteContent();
  const doctors = siteContent.doctors || [];
  const contact = siteContent.contact || {};

  return <AppointmentClientView doctors={doctors} contact={contact} />;
}
