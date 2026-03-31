import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL || "";
    const secret = process.env.GOOGLE_SCRIPT_SECRET || "";

    console.log("=== generate-certificate route ===");
    console.log("GOOGLE_SCRIPT_URL:", scriptUrl || "(empty)");
    console.log("GOOGLE_SCRIPT_SECRET exists:", !!secret);
    console.log("Incoming body:", body);

    if (!scriptUrl) {
      return NextResponse.json(
        { ok: false, error: "Missing GOOGLE_SCRIPT_URL" },
        { status: 500 }
      );
    }

    if (!secret) {
      return NextResponse.json(
        { ok: false, error: "Missing GOOGLE_SCRIPT_SECRET" },
        { status: 500 }
      );
    }

    const name = String(body?.name || "").trim();

    if (!name) {
      return NextResponse.json(
        { ok: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const payload = {
      action: "generateCertificate",
      secret,
      name,
    };

    console.log("Payload to Apps Script:", payload);

    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const text = await res.text();
    console.log("Apps Script raw response:", text);

    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return NextResponse.json(
        {
          ok: false,
          error: "Apps Script did not return valid JSON",
          raw: text,
        },
        { status: 500 }
      );
    }

    if (!res.ok || !data?.ok || !data?.url) {
      return NextResponse.json(
        {
          ok: false,
          error: data?.error || "Bad response from Apps Script",
          data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      url: data.url,
      fileId: data.fileId || null,
    });
  } catch (error: any) {
    console.error("Route error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}