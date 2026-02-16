import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
    }

    const email = String(body.email || "").trim().toLowerCase();
    const fullName = String(body.fullName || "").trim();
    const organization = String(body.organization || "").trim();

    if (!email || !fullName || !organization) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const secret = process.env.GOOGLE_SCRIPT_SECRET;

    if (!scriptUrl || !secret) {
      return NextResponse.json({ ok: false, error: "Missing env variables" }, { status: 500 });
    }

    const gsRes = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        action: "register",
        email,
        fullName,
        organization,
      }),
      cache: "no-store",
    });

    const data = await gsRes.json().catch(() => null);
    if (!data) {
      return NextResponse.json({ ok: false, error: "Bad response from script" }, { status: 502 });
    }

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
