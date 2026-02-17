"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

// إذا عندك clearSession موجودة سابقاً بالمشروع اتركها، وإذا لا موجودة احذف السطرين الجايين
// import { clearSession } from "@/lib/session";

function getLangBase(pathname: string) {
  const parts = (pathname || "/").split("/").filter(Boolean);
  const first = parts[0] || "";
  if (first.length === 2) return "/" + first; // ar/en
  return ""; // بدون lang
}

export default function SideMenu() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const base = useMemo(() => getLangBase(pathname), [pathname]);
  const isRtl = base === "/ar" || true; // عندك RTL أساساً

  // استثناء صفحة التسجيل
  const isRegister =
    pathname === "/register" ||
    pathname.startsWith("/register/") ||
    pathname === `${base}/register` ||
    pathname.startsWith(`${base}/register/`);

  // اقفل السايدبار عند تغيير الصفحة
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
    // ✅ Lunch هي نفسها دعوة الغداء
    { href: `${base}/lunch`, label: "Lunch Invitation" },
  ];

  function logout() {
    try {
      // إذا عندك clearSession() استخدمه:
      // clearSession();

      // بديل عام: امسح أي session من التخزين
      localStorage.removeItem("session");
      localStorage.removeItem("conf_session");
      localStorage.removeItem("user");
      localStorage.removeItem("email");
    } catch {}

    setOpen(false);
    router.push(`${base}/`);
    router.refresh?.();
  }

  return (
    <div style={{ padding: "12px 60px 0" }}>
      {/* ✅ زر فتح القائمة الآن يظهر حيث تضع الكومبوننت (تحت الهيدر) */}
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
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
          <div style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>
            Conference Menu
          </div>
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
                  textAlign: "right",
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* ✅ زر الخروج داخل القائمة */}
        <button
          onClick={logout}
          style={{
            marginTop: "auto",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ef4444",
            background: "white",
            color: "#ef4444",
            fontWeight: 800,
            cursor: "pointer",
            textAlign: "right",
          }}
        >
          ⎋ Logout
        </button>

        <div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>
          Tip: Press <b>ESC</b> to close.
        </div>
      </aside>
    </div>
  );
}
