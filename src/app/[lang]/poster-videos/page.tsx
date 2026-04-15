import Link from "next/link";
import { POSTERS } from "@/lib/posters";

function isArabic(lang: string) {
  return String(lang || "").toLowerCase() === "ar";
}

function t(lang: string) {
  const ar = isArabic(lang);

  return {
    pageTitle: ar ? "فيديوهات البوسترات" : "Poster Videos",
    posterNo: ar ? "رقم البوستر" : "Poster Number",
    researcher: ar ? "الباحث" : "Researcher",
    posterTitle: ar ? "عنوان البوستر" : "Poster Title",
    watchVideo: ar ? "عرض الفيديو" : "Watch Video",
    noVideo: ar ? "لا يوجد فيديو" : "No Video Available",
  };
}

export default async function PosterVideosPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const ar = isArabic(lang);
  const tx = t(lang);

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
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "24px",
            fontSize: "32px",
            fontWeight: 800,
            color: "#111827",
          }}
        >
          {tx.pageTitle}
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {POSTERS.map((poster) => {
            const posterTitle =
              ar ? poster.titleAr : poster.titleEn;

            const researcherName =
              ar ? poster.researcherAr : poster.researcherEn;

            const hasVideo =
              !!poster.videoUrl &&
              String(poster.videoUrl).trim() !== "";

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
                <div
                  style={{
                    padding: "22px 18px",
                    textAlign: "center",
                    direction: ar ? "rtl" : "ltr",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      padding: "10px 18px",
                      borderRadius: "999px",
                      background: "#eef4ff",
                      color: "#1f4a7c",
                      fontWeight: 800,
                      fontSize: "14px",
                      marginBottom: "18px",
                    }}
                  >
                    {tx.posterNo}: {poster.id.toUpperCase()}
                  </div>

                  <div
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: "8px",
                      fontWeight: 600,
                    }}
                  >
                    {tx.researcher}
                  </div>

                  <div
                    style={{
                      fontSize: "clamp(24px, 4vw, 28px)",
                      fontWeight: 800,
                      color: "#111827",
                      lineHeight: 1.4,
                      marginBottom: "22px",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {researcherName}
                  </div>

                  <div
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: "8px",
                      fontWeight: 600,
                    }}
                  >
                    {tx.posterTitle}
                  </div>

                  <div
                    style={{
                      fontSize: "clamp(18px, 3.4vw, 22px)",
                      color: "#111827",
                      lineHeight: 1.7,
                      fontWeight: 500,
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {posterTitle}
                  </div>
                </div>

                {hasVideo ? (
                  <Link
                    href={`/${lang}/poster-videos/${poster.id}`}
                    style={{
                      display: "block",
                      backgroundColor: "#0b3b78",
                      color: "#ffffff",
                      padding: "18px",
                      textAlign: "center",
                      textDecoration: "none",
                      fontWeight: 800,
                      fontSize: "18px",
                    }}
                  >
                    {tx.watchVideo}
                  </Link>
                ) : (
                  <div
                    style={{
                      backgroundColor: "#e5e7eb",
                      color: "#6b7280",
                      padding: "18px",
                      textAlign: "center",
                      fontWeight: 800,
                      fontSize: "18px",
                    }}
                  >
                    {tx.noVideo}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}