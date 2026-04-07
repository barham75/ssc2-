import { NextResponse } from "next/server";

export async function POST() {
  try {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL?.trim();
    const secret = process.env.GOOGLE_SCRIPT_SECRET?.trim();

    console.log("=== PROGRAM API ===");
    console.log("GOOGLE_SCRIPT_URL:", scriptUrl);
    console.log("SECRET exists:", !!secret);

    if (!scriptUrl || !secret) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing GOOGLE_SCRIPT_URL or GOOGLE_SCRIPT_SECRET",
        },
        { status: 500 }
      );
    }

    const payload = {
      secret,
      action: "getProgram",
    };

    console.log("Sending payload:", payload);

    const gsRes = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(payload),
    });

    const rawText = await gsRes.text();

    console.log("Google Script raw response:", rawText);

    let data: any;

    try {
      data = JSON.parse(rawText);
    } catch (err) {
      console.error("JSON parse error");

      return NextResponse.json(
        {
          ok: false,
          error: "Google Script did not return valid JSON",
          raw: rawText.slice(0, 500),
        },
        { status: 500 }
      );
    }

    if (!gsRes.ok) {
      console.error("Google Script HTTP error");

      return NextResponse.json(
        {
          ok: false,
          error: "Google Script HTTP request failed",
        },
        { status: 500 }
      );
    }

    if (!data?.ok) {
      console.error("Google Script returned error:", data);

      return NextResponse.json(
        {
          ok: false,
          error: data?.error || "Google Script returned invalid response",
        },
        { status: 500 }
      );
    }

    const rows = Array.isArray(data.rows) ? data.rows : [];

    console.log("Program rows count:", rows.length);

    return NextResponse.json({
      ok: true,
      rows,
    });
  } catch (error: any) {
    console.error("PROGRAM API ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Failed to load program",
      },
      { status: 500 }
    );
  }
}