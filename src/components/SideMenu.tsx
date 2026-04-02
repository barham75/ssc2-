"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function detectBase(pathname: string) {
  const p = pathname || "/";

  if (p === "/ar" || p.startsWith("/ar/")) return "/ar";
  if (p === "/en" || p.startsWith("/en/")) return "/en";

  return "/ar";
}

export default function SideMenu() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const base = useMemo(() => detectBase(pathname), [pathname]);

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

  const links = [
    { href: `${base}/`, label: "الرئيسية / Home" },
    { href: `${base}/program`, label: "برنامج المؤتمر / Conference Program" },
    { href: `${base}/poster-vote`, label: "تصويت أفضل بوستر / Best Poster Vote" },
    { href: `${base}/evaluation`, label: "تقييم المؤتمر / Conference Evaluation" },
    { href: `${base}/abstracts`, label: "الملخصات / Abstracts" },
    { href: `${base}/poster-videos`, label: "فيديوهات البوسترات / Poster Videos" },
    { href: `${base}/sponsors`, label: "الداعمون / Sponsors" },
    { href: `${base}/lunch-invite`, label: "دعوة الغداء / Lunch Invitation" },
    { href: `${base}/certificate`, label: "شهادة الحضور / Attendance Certificate" },
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
      {/* زر فتح القائمة */}
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

      {/* الخلفية الداكنة */}
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

      {/* القائمة */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,

          height: "100vh",

          width: "80%",
          maxWidth: "320px",

          background: "white",
          boxShadow: "-3px 0 15px rgba(0,0,0,0.15)",

          transform: open
            ? "translateX(0)"
            : "translateX(100%)",

          transition: "transform 0.25s ease",

          zIndex: 999,

          padding: "14px",

          display: "flex",
          flexDirection: "column",

          direction: "rtl",

          overflowY: "auto",
          overflowX: "hidden",

          WebkitOverflowScrolling: "touch",
        }}
        aria-hidden={!open}
      >
        {/* زر الإغلاق */}
        <button
          onClick={() => setOpen(false)}
          style={{
            position: "sticky",
            top: 0,

            alignSelf: "flex-start",

            border: "none",
            background: "white",

            fontSize: "22px",

            cursor: "pointer",

            marginBottom: "10px",

            zIndex: 2,
          }}
          aria-label="Close menu"
        >
          ✕
        </button>

        {/* الروابط */}
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            style={{
              padding: "10px",

              marginBottom: "8px",

              borderRadius: "10px",

              background: "#f5f7fa",

              textDecoration: "none",

              color: "#002b5c",

              fontWeight: 800,

              fontSize: "13px",

              lineHeight: 1.3,

              wordBreak: "break-word",
            }}
          >
            {l.label}
          </Link>
        ))}

        {/* تسجيل الخروج */}
        <button
          onClick={logout}
          style={{
            marginTop: "12px",

            width: "100%",

            padding: "8px",

            border: "1px solid #ef4444",

            background: "white",

            color: "#ef4444",

            borderRadius: "10px",

            cursor: "pointer",

            fontWeight: 900,

            fontSize: "13px",

            textAlign: "right",
          }}
        >
          تسجيل الخروج / Logout
        </button>
      </aside>
    </>
  );
}