"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function getLangBase(pathname: string) {
  // يدعم /ar/... أو /en/... وإذا ما عندك lang يرجع ""
  const parts = (pathname || "/").split("/").filter(Boolean);
  const first = parts[0] || "";
  if (first.length === 2) return "/" + first; // ar/en
  return ""; // بدون lang
}

export default function SideMenu() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  const base = useMemo(() => getLangBase(pathname), [pathname]);

  // استثناء صفحة التسجيل (سواء مع lang أو بدون)
  const isRegister =
    pathname === "/register" ||
    pathname.startsWith("/register/") ||
    pathname === `${base}/register` ||
    pathname.startsWith(`${base}/register/`);

  // اغلق السايدبار عند تغيير الصفحة
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // اقفل بالـ ESC
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (isRegister) return null;

  const links = [
    { href: `${base}/`, label: "Home" },
    { href: `${base}/program`, label: "Program" },
    { href: `${base}/poster-vote`, label: "Poster Vote" },
    { href: `${base}/evaluation`, label: "Evaluation" },
    { href: `${base}/sponsors`, label: "Sponsors" },
    { href: `${base}/lunch`, label: "Lunch" },
  ];

  const isRtl = base === "/ar"; // لو عندك عربي/إنجليزي

  return (
    <>
      {/* زر فتح السايدبار */}
      <div style={{ display: "flex", justifyContent: isRtl ? "flex-end" : "flex-start", padding: "12px 12px 0" }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            padding: "10px 14px",
            background: "#0f172a",
            color: "white",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
          aria-label="Open menu"
        >
          ☰ Menu
        </button>
      </div>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 180ms ease",
          zIndex: 9998,
        }}
      />

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          width: 280,
          background: "white",
          boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
          zIndex: 9999,
          transition: "transform 220ms ease",
          transform: open
            ? "translateX(0)"
            : isRtl
            ? "translateX(320px)"
            : "translateX(-320px)",
          right: isRtl ? 0 : "auto",
          left: isRtl ? "auto" : 0,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
        aria-hidden={!open}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>Conference Menu</div>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: "transparent",
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              lineHeight: 1,
            }}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div style={{ height: 1, background: "#e2e8f0", margin: "6px 0 10px" }} />

        <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  textDecoration: "none",
                  padding: "10px 12px",
                  borderRadius: 10,
                  color: active ? "white" : "#0f172a",
                  background: active ? "#0f172a" : "#f1f5f9",
                  fontWeight: 700,
                  textAlign: isRtl ? "right" : "left",
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: "auto", fontSize: 12, color: "#64748b" }}>
          Tip: Press <b>ESC</b> to close.
        </div>
      </aside>
    </>
  );
}
