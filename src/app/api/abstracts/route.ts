import { NextResponse } from "next/server";

export async function GET() {
  try {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const secret = process.env.GOOGLE_SCRIPT_SECRET;

    if (!scriptUrl || !secret) {
      return NextResponse.json(
        { ok: false, error: "Missing GOOGLE_SCRIPT_URL or GOOGLE_SCRIPT_SECRET" },
        { status: 500 }
      );
    }

    const gsRes = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // ✅ لمنع الكاش وإظهار آخر تحديثات الشيت مباشرة
      cache: "no-store",
      // ✅ مطابق لسكربتك: doPost + secret + action
      body: JSON.stringify({
        secret,
        action: "getAbstracts",
      }),
    });

    const data = await gsRes.json().catch(() => null);

    if (!data || data.ok !== true) {
      return NextResponse.json(
        { ok: false, error: data?.error || "Bad response from Google Script" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, data: data.data || [] });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
