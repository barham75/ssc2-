"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
      ? "اضغط على الزر لإصدار شهادة الحضور بصيغة PDF"
      : "Click the button to generate your attendance certificate as PDF",
    issue: ar ? "إصدار PDF / Generate PDF" : "Generate PDF / إصدار PDF",
    back: ar ? "العودة للرئيسية / Back to Home" : "Back to Home / العودة للرئيسية",
    loading: ar ? "جاري التحميل..." : "Loading...",
    generating: ar ? "جاري إنشاء الشهادة..." : "Generating certificate...",
    name: ar ? "الاسم / Name" : "Name / الاسم",
    email: ar ? "البريد الإلكتروني / Email" : "Email / البريد الإلكتروني",
    regNo: ar ? "رقم التسجيل / Registration No" : "Registration No / رقم التسجيل",
    org: ar ? "المؤسسة / Organization" : "Organization / المؤسسة",
  };
}

export default function CertificatePage() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang === "en" ? "en" : "ar";
  const L = useMemo(() => t(lang), [lang]);
  const router = useRouter();

  const [session, setSession] = useState<SessionShape | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const s = loadSession();
    if (!s) {
      router.push(`/${lang}/register`);
      return;
    }
    setSession(s);
  }, [lang, router]);

  async function handleGenerate() {
    if (!session) return;

    try {
      setBusy(true);

      const res = await fetch("/api/generate-certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: session.name || "",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok || !data?.url) {
        throw new Error(data?.error || "Failed");
      }

      window.open(data.url, "_blank");
    } catch (err) {
      alert("Failed to generate certificate PDF");
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
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 20,
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        }}
      >
        <h2 style={{ textAlign: "center", marginTop: 0 }}>{L.pageTitle}</h2>

        <p style={{ textAlign: "center", color: "#555", marginBottom: 20 }}>
          {L.subtitle}
        </p>

        <Box label={L.name} value={session.name || "-"} />
        <Box label={L.email} value={session.email || "-"} />
        <Box label={L.regNo} value={session.regNo || "-"} />
        <Box label={L.org} value={session.org || "-"} />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 24,
          }}
        >
          <button
            onClick={handleGenerate}
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
      </div>
    </div>
  );
}

function Box({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 14,
        marginTop: 10,
      }}
    >
      <div style={{ fontSize: 13, color: "#666" }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 900 }}>{value}</div>
    </div>
  );
}