import { NextResponse } from "next/server";

type BodyShape = {
  email?: string;
  name?: string;
  regNo?: string;
  org?: string;
  lang?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as BodyShape;

    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "").trim();
    const regNo = String(body.regNo || "").trim();

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Missing email" },
        { status: 400 }
      );
    }

    /**
     * هنا ضع منطق جلب رابط الشهادة الحقيقي:
     * 1) إما من Google Apps Script
     * 2) أو من Sheet
     * 3) أو بناء رابط مباشر إذا كان اسم الملف ثابت
     */

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL || "";

    if (!scriptUrl) {
      return NextResponse.json(
        { ok: false, error: "GOOGLE_SCRIPT_URL is not configured" },
        { status: 500 }
      );
    }

    const url =
      `${scriptUrl}?action=getCertificate` +
      `&email=${encodeURIComponent(email)}` +
      `&name=${encodeURIComponent(name)}` +
      `&regNo=${encodeURIComponent(regNo)}`;

    return NextResponse.json({
      ok: true,
      url,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}