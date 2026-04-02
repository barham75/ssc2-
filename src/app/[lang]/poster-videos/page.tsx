"use client";

import Link from "next/link";
import { POSTERS } from "@/lib/posters";

function isArabic(lang: string) {
  return String(lang || "").toLowerCase() === "ar";
}

function t(lang: string) {
  const ar = isArabic(lang);

  return {
    title: ar ? "فيديوهات البوسترات" : "Poster Videos",
    subtitle: ar
      ? "اضغط على أي بطاقة لعرض فيديو البوستر"
      : "Click any card to view the poster video",
    posterNo: ar ? "رقم البوستر" : "Poster No.",
    researcher: ar ? "الباحث" : "Researcher",
    posterTitle: ar ? "عنوان البوستر" : "Poster Title",
    viewVideo: ar ? "عرض الفيديو" : "View Video",
  };
}

export default function PosterVideosPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang = params?.lang || "ar";
  const ar = isArabic(lang);
  const tx = t(lang);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
      }}
    >
      {/* ⭐ direction هنا فقط وليس على main */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          direction: ar ? "rtl" : "ltr",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "36px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "40px",
              fontWeight: 800,
              color: "#0b3b78",
            }}
          >
            {tx.title}
          </h1>

          <p
            style={{
              marginTop: "12px",
              fontSize: "18px",
              color: "#4b5563",
            }}
          >
            {tx.subtitle}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "22px",
          }}
        >
          {POSTERS.map((poster) => {
            const posterTitle = ar
              ? poster.titleAr
              : poster.titleEn;

            const researcherName = ar
              ? poster.researcherAr
              : poster.researcherEn;

            return (
              <div
                key={poster.id}
                style={{
                  background: "#ffffff",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.08)",
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ padding: "22px" }}>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "6px 14px",
                      borderRadius: "999px",
                      background: "#e8f0ff",
                      color: "#0b3b78",
                      fontWeight: 700,
                      fontSize: "14px",
                      marginBottom: "18px",
                    }}
                  >
                    {tx.posterNo}:{" "}
                    {poster.id.toUpperCase()}
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        marginBottom: "4px",
                        fontWeight: 600,
                      }}
                    >
                      {tx.researcher}
                    </div>

                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#111827",
                        lineHeight: 1.5,
                      }}
                    >
                      {researcherName}
                    </div>
                  </div>

                  <div style={{ marginTop: "18px" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        marginBottom: "6px",
                        fontWeight: 600,
                      }}
                    >
                      {tx.posterTitle}
                    </div>

                    <div
                      style={{
                        fontSize: "18px",
                        color: "#1f2937",
                        lineHeight: 1.7,
                        fontWeight: 500,
                        wordBreak: "break-word",
                      }}
                    >
                      {posterTitle}
                    </div>
                  </div>
                </div>

                {/* الزر */}
                <Link
                  href={`/${lang}/poster-videos/${poster.id}`}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    background: "#0b3b78",
                    color: "#ffffff",
                    padding: "16px 0",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "16px",
                    borderRadius: 0,
                  }}
                >
                  {tx.viewVideo}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}