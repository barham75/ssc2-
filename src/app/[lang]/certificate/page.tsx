"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { loadSession } from "@/lib/session";

type SessionShape = {
  email?: string;
  name?: string;
  regNo?: string;
  org?: string;
};

function t(lang: string) {
  const ar = lang === "ar";

  return {
    pageTitle: "شهادة الحضور / Attendance Certificate",
    subtitle: ar
      ? "اضغط على الزر لحفظ الشهادة كملف PDF"
      : "Click the button to save the certificate as a PDF file",
    issue: ar ? "تحميل PDF / Download PDF" : "Download PDF / تحميل PDF",
    back: ar ? "العودة للرئيسية / Back to Home" : "Back to Home / العودة للرئيسية",
    loading: ar ? "جاري التحميل..." : "Loading...",
    generating: ar ? "جاري إنشاء الملف..." : "Generating PDF...",
    noName: ar ? "مشارك المؤتمر" : "Conference Participant",
    regNo: ar ? "رقم التسجيل" : "Registration No",
    org: ar ? "المؤسسة" : "Organization",
    certificateTitle: ar ? "شهادة حضور" : "Certificate of Attendance",
    body1: ar
      ? "تشهد اللجنة المنظمة بأن"
      : "This is to certify that",
    body2: ar
      ? "قد شارك في المؤتمر وحضر فعالياته"
      : "has attended and participated in the conference",
    footer1: ar
      ? "اللجنة التنظيمية للمؤتمر"
      : "Conference Organizing Committee",
    footer2: ar
      ? "جامعة فيلادلفيا"
      : "Philadelphia University",
  };
}

export default function CertificatePage() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang === "en" ? "en" : "ar";
  const L = useMemo(() => t(lang), [lang]);
  const router = useRouter();

  const [session, setSession] = useState<SessionShape | null>(null);
  const [busy, setBusy] = useState(false);
  const certRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const s = loadSession();
    if (!s) {
      router.push(`/${lang}/register`);
      return;
    }
    setSession(s);
  }, [lang, router]);

  async function handleDownloadPdf() {
    if (!certRef.current || !session) return;

    try {
      setBusy(true);

      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

      const safeName = String(session.name || "certificate")
        .replace(/[^\u0600-\u06FFa-zA-Z0-9\s-_]/g, "")
        .trim()
        .replace(/\s+/g, "_");

      pdf.save(`${safeName || "certificate"}.pdf`);
    } finally {
      setBusy(false);
    }
  }

  if (!session) {
    return (
      <div style={{ padding: 20, textAlign: "center", fontWeight: 700 }}>
        {L.loading}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
      <h2 style={{ textAlign: "center", marginBottom: 8 }}>{L.pageTitle}</h2>
      <p style={{ textAlign: "center", color: "#555", marginBottom: 20 }}>
        {L.subtitle}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <button
          onClick={handleDownloadPdf}
          disabled={busy}
          style={{
            padding: "12px 18px",
            fontWeight: 900,
            borderRadius: 10,
            border: "none",
            background: "#111827",
            color: "#fff",
            cursor: busy ? "not-allowed" : "pointer",
            opacity: busy ? 0.7 : 1,
          }}
        >
          {busy ? L.generating : L.issue}
        </button>

        <button
          onClick={() => router.push(`/${lang}`)}
          style={{
            padding: "12px 18px",
            fontWeight: 900,
            borderRadius: 10,
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          {L.back}
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <div
          ref={certRef}
          style={{
            width: 1123,
            minHeight: 794,
            margin: "0 auto",
            background: "#fff",
            position: "relative",
            border: "10px solid #b58b2a",
            boxSizing: "border-box",
            padding: "42px 56px",
            fontFamily: "Arial, Tahoma, sans-serif",
            color: "#1f2937",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 18,
              border: "2px solid #d6b35a",
              pointerEvents: "none",
            }}
          />

          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#8b6b1f",
                letterSpacing: 1,
              }}
            >
              PHILADELPHIA UNIVERSITY
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#8b6b1f",
                marginTop: 6,
              }}
            >
              جامعة فيلادلفيا
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: 42,
              fontWeight: 900,
              color: "#8b6b1f",
              marginTop: 24,
            }}
          >
            {L.certificateTitle}
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: 22,
              marginTop: 36,
              lineHeight: 1.8,
            }}
          >
            {L.body1}
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: 38,
              fontWeight: 900,
              color: "#002b5c",
              marginTop: 18,
              marginBottom: 18,
              padding: "12px 24px",
              borderBottom: "2px solid #d1d5db",
              display: "inline-block",
              left: "50%",
              position: "relative",
              transform: "translateX(-50%)",
              maxWidth: "88%",
              wordBreak: "break-word",
            }}
          >
            {session.name || L.noName}
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: 22,
              marginTop: 20,
              lineHeight: 1.9,
            }}
          >
            {L.body2}
          </div>

          <div
            style={{
              marginTop: 48,
              display: "flex",
              justifyContent: "space-between",
              gap: 24,
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                flex: 1,
                textAlign: "left",
                fontSize: 18,
                lineHeight: 1.8,
              }}
            >
              <div>
                <strong>{L.regNo}:</strong> {session.regNo || "-"}
              </div>
              <div>
                <strong>{L.org}:</strong> {session.org || "-"}
              </div>
            </div>

            <div
              style={{
                flex: 1,
                textAlign: "right",
                fontSize: 18,
                lineHeight: 1.8,
              }}
            >
              <div style={{ fontWeight: 800 }}>{L.footer1}</div>
              <div>{L.footer2}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}