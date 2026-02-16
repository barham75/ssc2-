import { NextResponse } from "next/server";

type Body =
  | { action: "checkin"; pin: string; token: string }
  | { action: "stats"; pin: string };

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Body | null;
    if (!body) {
      return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const action = String((body as any).action || "").trim();
    const pin = String((body as any).pin || "").trim();
    const token = String((body as any).token || "").trim();

    // ✅ تحقق PIN
    const orgPin = process.env.ORGANIZER_PIN || "";
    if (!orgPin) {
      return NextResponse.json({ ok: false, error: "server missing ORGANIZER_PIN" }, { status: 500 });
    }
    if (!pin) {
      return NextResponse.json({ ok: false, error: "missing pin" }, { status: 401 });
    }
    if (pin !== orgPin) {
      return NextResponse.json({ ok: false, error: "bad pin" }, { status: 401 });
    }

    // ✅ تحقق env الخاصة بـ Google Script
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const secret = process.env.GOOGLE_SCRIPT_SECRET;

    if (!scriptUrl || !secret) {
      return NextResponse.json(
        { ok: false, error: "server env missing GOOGLE_SCRIPT_URL/GOOGLE_SCRIPT_SECRET" },
        { status: 500 }
      );
    }

    // ✅ تجهيز payload للـ Apps Script
    let gsAction = "";
    const payload: any = { secret };

    if (action === "checkin") {
      if (!token) {
        return NextResponse.json({ ok: false, error: "missing token" }, { status: 400 });
      }
      gsAction = "checkin";
      payload.action = gsAction;
      payload.token = token;
    } else if (action === "stats") {
      gsAction = "lunchStats";
      payload.action = gsAction;
    } else {
      return NextResponse.json({ ok: false, error: "unknown action" }, { status: 400 });
    }

    // ✅ نرسل للـ Apps Script
    const gsRes = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await gsRes.json().catch(() => null);
    if (!data) {
      return NextResponse.json({ ok: false, error: "Bad JSON response from script" }, { status: 502 });
    }

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
