import { NextResponse } from "next/server";
import { getAdminSession, verifyPassword } from "@/lib/auth";
import { getAdminUser, updateAdminPassword } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters long" }, { status: 400 });
    }

    const admin = await getAdminUser();
    const isCurrentValid = verifyPassword(currentPassword, admin.passwordHash, admin.salt);
    if (!isCurrentValid) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
    }

    await updateAdminPassword(newPassword);

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (err: unknown) {
    console.error("Change password error:", err);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
