"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { loadSession } from "@/lib/session";

type SessionShape = {
  email?: string;
  name?: string;
  fullName?: string;
  eligibleForQR?: boolean;
  lunchToken?: string;
};

export default function LunchInviteClient({ lang }: { lang: string }) {
  const router = useRouter();
  const [session, setSession] = useState<SessionShape | null>(null);
  const [loading, setLoading] = useState(true);

  const ar = useMemo(() => lang === "ar", [lang]);

  useEffect(() => {
    const s = loadSession() as SessionShape | null;
    if (!s) {
      router.push(`/${lang}/register`);
      return;
    }
    setSession(s);
    setLoading(false);
  }, [lang, router]);

  if (loading) {
    return (
      <div style={{ maxWidth: 700, margin: "40px auto", padding: 16, textAlign: "center" }}>
        {ar ? "جاري التحميل..." : "Loading..."}
      </div>
    );
  }

  if (!session) return null;

  const displayName = String(session.name || session.fullName || "").trim();
  const email = String(session.email || "").trim();
  const eligible = Boolean(session.eligibleForQR);
  const token = String(session.lunchToken || "").trim();

  if (!eligible) {
    return (
      <div style={{ maxWidth: 700, margin: "40px auto", padding: 16, textAlign: "center" }}>
        <h2 style={{ marginBottom: 8 }}>{ar ? "دعوة الغداء" : "Lunch Invitation"}</h2>

        <div style={{ padding: 14, border: "1px solid #eee", borderRadius: 14 }}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>
            {ar ? "🚫 هذا البريد غير موجود ضمن قائمة المدعوين للغداء" : "🚫 This email is not eligible for lunch"}
          </div>
          <div style={{ marginTop: 8, color: "#666", fontWeight: 700 }}>
            {ar ? "يمكنك استخدام باقي صفحات التطبيق، لكن QR غير متاح." : "You can use the app, but QR is not available."}
          </div>
        </div>
      </div>
    );
  }

  // ✅ eligible لكن token فاضي => خلل بالـ session أو register API
  if (!token) {
    return (
      <div style={{ maxWidth: 700, margin: "40px auto", padding: 16, textAlign: "center" }}>
        <h2 style={{ marginBottom: 8 }}>{ar ? "🎟 دعوة الغداء" : "🎟 Lunch Invitation"}</h2>

        <div style={{ padding: 14, border: "1px solid #eee", borderRadius: 14 }}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>
            {ar ? "⚠️ لا يوجد رمز QR مرتبط بهذا الحساب" : "⚠️ No QR token found for this account"}
          </div>
          <div style={{ marginTop: 8, color: "#666", fontWeight: 700 }}>
            {ar ? "جرّب تسجيل الخروج ثم الدخول من جديد." : "Try logging out and registering again."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 16, textAlign: "center" }}>
      <h2 style={{ marginBottom: 8 }}>{ar ? "🎟 دعوة الغداء" : "🎟 Lunch Invitation"}</h2>

      <div style={{ marginTop: 6, fontWeight: 900 }}>{displayName || (ar ? "مشارك" : "Participant")}</div>
      <div style={{ marginTop: 4, color: "#666", fontWeight: 700 }}>{email}</div>

      <div
        style={{
          margin: "22px auto 10px",
          display: "inline-block",
          padding: 14,
          borderRadius: 16,
          border: "1px solid #eee",
          background: "#fff",
        }}
      >
        <QRCode value={token} size={220} />
      </div>

      <div style={{ marginTop: 10, fontWeight: 800 }}>
        {ar ? "تحت رعاية  ا د رئيس  الجامعه  يتشرف ا.د عميد كلية العلوم  بدعوتكم  للغداءارجود للاستفادة من الدعوة." : "Please show this QR at the restaurant entrance."}
      </div>

      <div style={{ marginTop: 10, color: "#666", fontWeight: 700, fontSize: 13 }}>
        {ar ? "ملاحظة: ارجو عدم  مشارك الرمز مع الآخرين." : "Note: Do not share this QR with others."}
      </div>
    </div>
  );
}
