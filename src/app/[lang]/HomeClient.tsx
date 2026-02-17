"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadSession } from "@/lib/session";

type SessionShape = {
  email?: string;
  name?: string;
  fullName?: string;
  regNo?: string;
  org?: string;
  lunchToken?: string;
};

function t(lang: string) {
  const ar = lang === "ar";

  // ✅ العناوين باللغتين دائمًا
  return {
    // ✅ بدل "مرحبا" -> "Welcome" دائمًا
    welcome: "Welcome",

    regNo: ar ? "رقم التسجيل / Registration No" : "Registration No / رقم التسجيل",
    notRegistered: ar ? "غير مسجل / Not Registered" : "Not Registered / غير مسجل",
    participant: ar ? "مشارك / Participant" : "Participant / مشارك",

    menuTitle: ar ? "القائمة الرئيسية / Main Menu" : "Main Menu / القائمة الرئيسية",

    program: "برنامج المؤتمر / Conference Program",
    vote: "تصويت أفضل بوستر / Best Poster Vote",
    eval: "تقييم المؤتمر / Conference Evaluation",
    sponsors: "الداعمون / Sponsors",
    lunch: "دعوة الغداء / Lunch Invitation",
  };
}

export default function HomeClient({ lang }: { lang: string }) {
  const router = useRouter();
  const L = useMemo(() => t(lang), [lang]);

  const [session, setSession] = useState<SessionShape | null>(null);

  useEffect(() => {
    const s = loadSession() as SessionShape | null;
    if (!s) {
      router.push(`/${lang}/register`);
      return;
    }
    setSession(s);
  }, [lang, router]);

  if (!session) return null;

  const displayName = String(session.name || session.fullName || "").trim();
  const regNo = String(session.regNo || "").trim();

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
      {/* ترحيب + الاسم + رقم التسجيل */}
      <div style={{ textAlign: "center", marginTop: 10 }}>
        <div style={{ fontSize: 22, fontWeight: 900 }}>
          {L.welcome} {displayName || L.participant}
        </div>

        {regNo ? (
          <div style={{ marginTop: 6, fontSize: 16, color: "#555" }}>
            {L.regNo}: <span style={{ fontWeight: 900 }}>{regNo}</span>
          </div>
        ) : (
          <div style={{ marginTop: 6, fontSize: 16, color: "#b00020", fontWeight: 900 }}>
            {L.notRegistered}
          </div>
        )}
      </div>

      {/* ✅ تم حذف زر صفحة المنظم + زر الخروج من الرئيسية (كما طلبت) */}

      {/* عناوين الصفحات */}
      <h3 style={{ textAlign: "center", marginTop: 24, marginBottom: 12 }}>
        {L.menuTitle}
      </h3>

      {/* شبكة الروابط */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          marginTop: 10,
        }}
      >
        <Card href={`/${lang}/program`} title={L.program} />
        <Card href={`/${lang}/poster-vote`} title={L.vote} />
        <Card href={`/${lang}/evaluation`} title={L.eval} />
        <Card href={`/${lang}/sponsors`} title={L.sponsors} />
        <Card href={`/${lang}/lunch-invite`} title={L.lunch} />
      </div>

      {/* لا يوجد Footer هنا */}
    </div>
  );
}

function Card({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        color: "inherit",
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 16,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        textAlign: "center",
        fontWeight: 900,
        display: "block",
      }}
    >
      {title}
    </Link>
  );
}
