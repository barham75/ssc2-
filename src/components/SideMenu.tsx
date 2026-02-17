"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function detectBase(pathname: string) {
  const p = pathname || "/";
  // إذا الرابط يبدأ بـ /ar أو /en
  if (p === "/ar" || p.startsWith("/ar/")) return "/ar";
  if (p === "/en" || p.startsWith("/en/")) return "/en";

  // إذا ما في lang بالمسار (مثل /lunch) خلّيه يروح للغة الافتراضية
  return "/ar";
}

export default function SideMenu() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // استثناء صفحة التسجيل (مع أو بدون lang)
  const isRegister =
    pathname === "/register" ||
    pathname.startsWith("/register/") ||
    pathname === "/ar/register" ||
    pathname.startsWith("/ar/register/") ||
    pathname === "/en/register" ||
    pathname.startsWith("/en/register/");

  const base = useMemo(() => detectBase(pathname), [pathname]);

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
    { href: `${base}/`, label: "الرئيسية" },
    { href: `${base}/program`, label: "برنامج المؤتمر" },
    { href: `${base}/poster-vote`, label: "تصويت أفضل بوستر" },
    { href: `${base}/evaluation`, label: "تقييم المؤتمر" },
    { href: `${base}/sponsors`, label: "الداعمون" },
    { href: `${base}/lunch`, label: "دعوة الغداء" },
  ];

  function logout() {
    try {
      localStorage.clear();
    } catch {}
    setOpen(false);
    router.push(`${base}/`);
  }

  return (
    <>
      {/* زر القائمة تحت الهيدر */}
      <div style={{ padding: "15px 20px" }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            padding: "10px 16px",
            background: "#002b5c",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          القائمة ☰
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
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
          width: "85%",
          maxWidth: "320px",
          background: "white",
          boxShadow: "-5px 0 20px rgba(0,0,0,0.2)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.25s ease",
          zIndex: 999,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          direction: "rtl",
        }}
        aria-hidden={!open}
      >
        <button
          onClick={() => setOpen(false)}
          style={{
            alignSelf: "flex-start",
            border: "none",
            background: "transparent",
            fontSize: "22px",
            cursor: "pointer",
            marginBottom: "14px",
          }}
          aria-label="Close menu"
        >
          ✕
        </button>

        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            style={{
              padding: "12px",
              marginBottom: "8px",
              borderRadius: "10px",
              background: "#f2f4f8",
              textDecoration: "none",
              color: "#002b5c",
              fontWeight: 700,
            }}
          >
            {l.label}
          </Link>
        ))}

        <button
          onClick={logout}
          style={{
            marginTop: "auto",
            width: "100%",
            padding: "10px",
            border: "1px solid #ef4444",
            background: "white",
            color: "#ef4444",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: 800,
            textAlign: "right",
          }}
        >
          تسجيل الخروج
        </button>
      </aside>
    </>
  );
}
