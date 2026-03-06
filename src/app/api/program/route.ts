import { NextResponse } from "next/server";

export async function POST() {
  try {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL?.trim();
    const secret = process.env.GOOGLE_SCRIPT_SECRET?.trim();

    if (!scriptUrl || !secret) {
      return NextResponse.json(
        { ok: false, error: "Missing GOOGLE_SCRIPT_URL or GOOGLE_SCRIPT_SECRET" },
        { status: 500 }
      );
    }

    const gsRes = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        secret,
        action: "getProgram",
      }),
    });

    const rawText = await gsRes.text();

    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: "Google Script did not return valid JSON",
          raw: rawText.slice(0, 300),
        },
        { status: 500 }
      );
    }

    if (!gsRes.ok || !data?.ok) {
      return NextResponse.json(
        { ok: false, error: data?.error || "Google Script request failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      rows: Array.isArray(data.rows) ? data.rows : [],
    });
  } catch (error: any) {
    console.error("PROGRAM API ERROR:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to load program" },
      { status: 500 }
    );
  }
}