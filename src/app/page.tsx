import { getSiteContent } from "@/lib/db";
import HomeContent from "@/components/HomeContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const content = await getSiteContent();
  return <HomeContent initialContent={content} />;
}
