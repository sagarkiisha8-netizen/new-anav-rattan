import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getAdminUser } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const admin = await getAdminUser();
  return NextResponse.json({
    authenticated: true,
    email: admin.email,
    admin: {
      email: admin.email,
      name: "Administrator",
    },
    updatedAt: admin.updatedAt,
  });
}
