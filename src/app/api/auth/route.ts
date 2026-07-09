import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, getAuthToken, isPasswordValid } from "@/lib/auth";

export async function POST(request: Request) {
  if (!process.env.SITE_PASSWORD) {
    return NextResponse.json(
      { error: "Password protection is not configured." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as { password?: string };
  const password = body.password ?? "";

  if (!isPasswordValid(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, getAuthToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}
