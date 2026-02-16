import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const action = String(body.action || "").trim(); // posterVote | posterResults
    const email = String(body.email || "").trim().toLowerCase();
    const posterId = String(body.posterId || "").trim().toUpperCase();

    if (!action) {
      return NextResponse.json({ ok: false, error: "missing action" }, { status: 400 });
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const secret = process.env.GOOGLE_SCRIPT_SECRET;

    if (!scriptUrl || !secret) {
      return NextResponse.json({ ok: false, error: "Missing env variables" }, { status: 500 });
    }

    const payload: any = { secret, action };

    if (email) payload.email = email;
    if (posterId) payload.posterId = posterId;

    const gsRes = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
