import { getSiteContent } from "@/lib/db";
import HomeContent from "@/components/HomeContent";

export const revalidate = 60;

export default async function Home() {
  const content = await getSiteContent();
  return <HomeContent initialContent={content} />;
}
