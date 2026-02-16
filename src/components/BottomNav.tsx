"use client";

import Link from "next/link";

export default function BottomNav({
  lang,
  onLogout,
}: {
  lang: string;
  onLogout?: () => void;
}) {
  const ar = lang === "ar";

  const nav = [
    { href: `/${lang}/program`, label: ar ? "البرنامج" : "Program" },
    { href: `/${lang}/poster-vote`, label: ar ? "التصويت" : "Vote" },
    { href: `/${lang}/evaluation`, label: ar ? "التقييم" : "Evaluation" },
    { href: `/${lang}/sponsors`, label: ar ? "الداعمون" : "Sponsors" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        background: "#fff",
        borderTop: "1px solid #eee",
        padding: "10px 12px",
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          display: "flex",
          gap: 10,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {nav.map((x) => (
            <Link
              key={x.href}
              href={x.href}
              style={{
                textDecoration: "none",
                border: "1px solid #eee",
                borderRadius: 12,
                padding: "8px 10px",
                fontWeight: 900,
                color: "#111",
                background: "#fff",
              }}
            >
              {x.label}
            </Link>
          ))}
        </div>

        {onLogout ? (
          <button
            onClick={onLogout}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: "8px 12px",
              fontWeight: 900,
              background: "#b00020",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {ar ? "خروج" : "Logout"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
