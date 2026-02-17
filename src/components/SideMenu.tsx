"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

/* تحديد اللغة الحالية من المسار */
function detectBase(pathname: string) {
  const p = pathname || "/";
  if (p === "/ar" || p.startsWith("/ar/")) return "/ar";
  if (p === "/en" || p.startsWith("/en/")) return "/en";
  return "/ar"; // اللغة الافتراضية
}

export default function SideMenu() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const base = useMemo(() => detectBase(pathname), [pathname]);

  /* استثناء صفحة التسجيل */
  const isRegister =
    pathname === "/register" ||
    pathname.startsWith("/register/") ||
    pathname === "/ar/register" ||
    pathname.startsWith("/ar/register/") ||
    pathname === "/en/register" ||
    pathname.startsWith("/en/register/");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (isRegister) return null;

  // ✅ عناوين القائمة باللغتين (نصوص صحيحة بدل أسماء المسارات)
  const links = [
    { href: `${base}/`, label: "الرئيسية / Home" },
    { href: `${base}/program`, label: "برنامج المؤتمر / Conference Program" },
    { href: `${base}/poster-vote`, label: "تصويت أفضل بوستر / Best Poster Vote" },
    { href: `${base}/evaluation`, label: "تقييم المؤتمر / Conference Evaluation" },
    { href: `${base}/sponsors`, label: "الداعمون / Sponsors" },
    { href: `${base}/lunch-invite`, label: "دعوة الغداء / Lunch Invitation" },

    // ✅ جديد: صفحة المنظمون (تفتح secret-checkin)
    { href: `${base}/secret-checkin`, label: "المنظمون / Organizers" },
  ];

  function logout() {
    try {
      localStorage.clear();
    } catch {}
    setOpen(false);
    router.push(`${base}/register`);
  }

  return (
    <>
      {/* زر القائمة تحت الهيدر */}
      <div style={{ padding: "12px 20px" }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            padding: "6px 11px",
            background: "#002b5c",
            color: "white",
            border: "none",
            borderRadius: "7px",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          ☰ القائمة / Menu
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 998,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: "40%",
          maxWidth: "170px",
          background: "white",
          boxShadow: "-3px 0 15px rgba(0,0,0,0.15)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.25s ease",
          zIndex: 999,
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          direction: "rtl",
        }}
        aria-hidden={!open}
      >
        {/* زر الإغلاق */}
        <button
          onClick={() => setOpen(false)}
          style={{
            alignSelf: "flex-start",
            border: "none",
            background: "transparent",
            fontSize: "18px",
            cursor: "pointer",
            marginBottom: "10px",
          }}
          aria-label="Close menu"
        >
          ✕
        </button>

        {/* روابط القائمة */}
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            style={{
              padding: "8px",
              marginBottom: "6px",
              borderRadius: "8px",
              background: "#f5f7fa",
              textDecoration: "none",
              color: "#002b5c",
              fontWeight: 800,
              fontSize: "12px",
              lineHeight: 1.2,
            }}
          >
            {l.label}
          </Link>
        ))}

        {/* ✅ زر الخروج: آخر خيار بأسفل القائمة */}
        <button
          onClick={logout}
          style={{
            marginTop: "auto",
            width: "100%",
            padding: "6px",
            border: "1px solid #ef4444",
            background: "white",
            color: "#ef4444",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 900,
            fontSize: "12px",
            textAlign: "right",
          }}
        >
          تسجيل الخروج / Logout
        </button>
      </aside>
    </>
  );
}
