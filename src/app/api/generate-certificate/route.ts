import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = body.name || "Participant";

    const filePath = path.join(
      process.cwd(),
      "public",
      "certificates",
      "template.docx"
    );

    const content = fs.readFileSync(filePath, "binary");

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip);

    doc.setData({
      NAME: name,
    });

    doc.render();

    const buffer = doc.getZip().generate({
      type: "nodebuffer",
    });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition":
          'attachment; filename="certificate.docx"',
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      error: "Failed to generate certificate",
    });
  }
}