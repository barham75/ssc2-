import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });

    const action = String(body.action || "").trim(); // stats | checkin
    const pin = String(body.pin || "").trim();
    const token = String(body.token || "").trim();

    if (!process.env.ORGANIZER_PIN) {
      return NextResponse.json({ ok: false, error: "Missing ORGANIZER_PIN" }, { status: 500 });
    }
    if (pin !== process.env.ORGANIZER_PIN) {
      return NextResponse.json({ ok: false, error: "Bad PIN" }, { status: 401 });
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const secret = process.env.GOOGLE_SCRIPT_SECRET;
    if (!scriptUrl || !secret) {
      return NextResponse.json(
        { ok: false, error: "Missing GOOGLE_SCRIPT_URL/GOOGLE_SCRIPT_SECRET" },
        { status: 500 }
      );
    }

    // ✅ mapping: stats -> lunchStats (اسم السكربت)
    if (action === "stats") {
      const gsRes = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, action: "lunchStats" }),
        cache: "no-store",
      });

      const data = await gsRes.json().catch(() => null);
      return NextResponse.json(data ?? { ok: false, error: "Bad JSON from script" });
    }

    // ✅ checkin
    if (action === "checkin") {
      if (!token) {
        return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });
      }

      const gsRes = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, action: "checkin", token }),
        cache: "no-store",
      });

      const data = await gsRes.json().catch(() => null);
      return NextResponse.json(data ?? { ok: false, error: "Bad JSON from script" });
    }

    return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
