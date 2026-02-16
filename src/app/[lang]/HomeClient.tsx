"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadSession, clearSession } from "@/lib/session";

const SECRET_PAGE_PATH = "secret-checkin";

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
  return {
    welcome: ar ? "مرحبا" : "Welcome",
    regNo: ar ? "رقم التسجيل" : "Registration No",
    notRegistered: ar ? "غير مسجل" : "Not Registered",
    participant: ar ? "مشارك" : "Participant",
    menuTitle: ar ? "القائمة الرئيسية" : "Main Menu",

    program: ar ? "برنامج المؤتمر" : "Conference Program",
    vote: ar ? "تصويت أفضل بوستر" : "Best Poster Vote",
    eval: ar ? "تقييم المؤتمر" : "Conference Evaluation",
    sponsors: ar ? "الداعمون" : "Sponsors",
    lunch: ar ? "دعوة الغداء" : "Lunch Invitation",

    secret: ar ? "صفحة المنظم" : "Organizer Page",
    logout: ar ? "خروج" : "Logout",
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

  function logout() {
    clearSession();
    router.push(`/${lang}/register`);
  }

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

      {/* زر صفحة المنظم + زر الخروج (كما طلبت) */}
      <div
        style={{
          marginTop: 14,
          display: "flex",
          gap: 10,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Link
          href={`/${lang}/${SECRET_PAGE_PATH}`}
          style={{
            textDecoration: "none",
            background: "#002b5c",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: 12,
            fontWeight: 900,
            boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
          }}
        >
          {L.secret}
        </Link>

        <button
          onClick={logout}
          style={{
            background: "#b00020",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: 12,
            fontWeight: 900,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
          }}
        >
          {L.logout}
        </button>
      </div>

      {/* عناوين الصفحات */}
      <h3 style={{ textAlign: "center", marginTop: 24, marginBottom: 12 }}>{L.menuTitle}</h3>

      {/* ✅ الشبكة: ضع المنظم مباشرة بجانب دعوة الغداء */}
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

        {/* ✅ دعوة الغداء */}
        <Card href={`/${lang}/lunch-invite`} title={L.lunch} />
        {/* ✅ صفحة المنظم بجانبها */}
        <Card href={`/${lang}/secret-checkin`} title={L.secret} />
      </div>

      {/* ملاحظة: لا يوجد Footer هنا (حسب طلبك الرئيسية بدون فوتر) */}
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
