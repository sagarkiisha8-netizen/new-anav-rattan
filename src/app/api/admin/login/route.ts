import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/db";
import { verifyPassword, setAdminSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const admin = await getAdminUser();

    // Check email
    if (email.trim().toLowerCase() !== admin.email.toLowerCase()) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const isValid = verifyPassword(password, admin.passwordHash, admin.salt);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Set secure HttpOnly session cookie
    await setAdminSessionCookie(admin.email);

    return NextResponse.json({ success: true, email: admin.email });
  } catch (err: unknown) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
