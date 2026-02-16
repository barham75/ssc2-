import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const action = String(body.action || "").trim(); // submitEvaluation | getEvaluation
    const email = String(body.email || "").trim().toLowerCase();

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const secret = process.env.GOOGLE_SCRIPT_SECRET;

    if (!scriptUrl || !secret) {
      return NextResponse.json({ ok: false, error: "Missing env variables" }, { status: 500 });
    }

    if (!action) {
      return NextResponse.json({ ok: false, error: "missing action" }, { status: 400 });
    }

    const payload: any = { secret, action, email };

    if (action === "submitEvaluation") {
      payload.q1 = Number(body.q1);
      payload.q2 = Number(body.q2);
      payload.q3 = Number(body.q3);
      payload.q4 = Number(body.q4);
      payload.q5 = Number(body.q5);
    }

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
