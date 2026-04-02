"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTERS } from "@/lib/posters";

function isArabic(lang: string) {
  return String(lang || "").toLowerCase() === "ar";
}

function t(lang: string) {
  const ar = isArabic(lang);

  return {
    back: ar ? "العودة إلى فيديوهات البوسترات" : "Back to Poster Videos",
    researcher: ar ? "الباحث" : "Researcher",
    posterTitle: ar ? "عنوان البوستر" : "Poster Title",
    notFound: ar ? "لم يتم العثور على الفيديو." : "Video not found.",
  };
}

export default function PosterVideoDetailsPage({
  params,
}: {
  params: { lang: string; posterId: string };
}) {
  const lang = params?.lang || "ar";
  const posterId = params?.posterId || "";
  const ar = isArabic(lang);
  const tx = t(lang);

  const poster = POSTERS.find(
    (item) => item.id.toLowerCase() === posterId.toLowerCase()
  );

  if (!poster) {
    notFound();
  }

  const posterTitle = ar ? poster.titleAr : poster.titleEn;
  const researcherName = ar ? poster.researcherAr : poster.researcherEn;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          direction: ar ? "rtl" : "ltr",
        }}
      >
        <Link
          href={`/${lang}/poster-videos`}
          style={{
            display: "inline-block",
            marginBottom: "20px",
            textDecoration: "none",
            color: "#0b3b78",
            fontWeight: 700,
            fontSize: "16px",
          }}
        >
          ← {tx.back}
        </Link>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ marginBottom: "18px" }}>
            <div
              style={{
                fontSize: "14px",
                color: "#6b7280",
                marginBottom: "6px",
                fontWeight: 600,
              }}
            >
              {tx.researcher}
            </div>

            <div
              style={{
                fontSize: "28px",
                fontWeight: 800,
                color: "#111827",
                lineHeight: 1.4,
                wordBreak: "break-word",
              }}
            >
              {researcherName}
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
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
                fontSize: "20px",
                color: "#1f2937",
                lineHeight: 1.7,
                fontWeight: 500,
                wordBreak: "break-word",
              }}
            >
              {posterTitle}
            </div>
          </div>

          <div
            style={{
              position: "relative",
              width: "100%",
              paddingTop: "56.25%",
              borderRadius: "16px",
              overflow: "hidden",
              background: "#000",
            }}
          >
            <iframe
              src={poster.videoUrl}
              title={posterTitle}
              allow="autoplay; fullscreen"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}