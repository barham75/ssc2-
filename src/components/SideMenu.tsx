"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SideMenu() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (pathname.includes("register")) return null;

  function logout() {
    localStorage.clear();
    setOpen(false);
    router.push("/");
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
          ☰ القائمة
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
      <div
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
          transition: "transform 0.3s ease",
          zIndex: 999,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* إغلاق */}
        <button
          onClick={() => setOpen(false)}
          style={{
            alignSelf: "flex-start",
            border: "none",
            background: "transparent",
            fontSize: "22px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          ✕
        </button>

        <Link href="/" style={linkStyle}>الرئيسية</Link>
        <Link href="/program" style={linkStyle}>البرنامج</Link>
        <Link href="/poster-vote" style={linkStyle}>تصويت أفضل بوستر</Link>
        <Link href="/evaluation" style={linkStyle}>تقييم المؤتمر</Link>
        <Link href="/sponsors" style={linkStyle}>الداعمون</Link>
        <Link href="/lunch" style={linkStyle}>دعوة الغداء</Link>

        <div style={{ marginTop: "auto" }}>
          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid red",
              background: "white",
              color: "red",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    </>
  );
}

const linkStyle: React.CSSProperties = {
  padding: "12px",
  marginBottom: "8px",
  borderRadius: "8px",
  background: "#f2f4f8",
  textDecoration: "none",
  color: "#002b5c",
  fontWeight: 600,
};
