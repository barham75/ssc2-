"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { loadSession } from "@/lib/session";

type ProgramRow = {
  day: string;
  time: string;
  titleAr: string;
  titleEn: string;
  speaker: string;
  room: string;
};

function t(lang: string) {
  const ar = lang === "ar";
  return {
    title: ar ? "برنامج المؤتمر" : "Conference Program",
    loading: ar ? "جاري التحميل..." : "Loading...",
    empty: ar ? "لا يوجد بيانات للبرنامج حالياً." : "No program data available.",
    day: ar ? "اليوم" : "Day",
    time: ar ? "الوقت" : "Time",
    session: ar ? "الجلسة" : "Session",
    speaker: ar ? "المتحدث" : "Speaker",
    room: ar ? "القاعة" : "Room",
  };
}

export default function ProgramPage({ params }: { params: { lang: string } }) {
  const lang = params.lang || "ar";
  const L = useMemo(() => t(lang), [lang]);
  const router = useRouter();

  const [rows, setRows] = useState<ProgramRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = loadSession();
    if (!s) {
      router.push(`/${lang}/register`);
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/program", { method: "POST" });
        const data = await res.json();
        if (data?.ok) setRows(data.rows || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [lang, router]);

  return (
    <div>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: 16, paddingBottom: 90 }}>
        <h2 style={{ textAlign: "center", marginTop: 10 }}>{L.title}</h2>

        {loading ? (
          <p style={{ textAlign: "center" }}>{L.loading}</p>
        ) : rows.length === 0 ? (
          <p style={{ textAlign: "center" }}>{L.empty}</p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={th}>{L.day}</th>
                  <th style={th}>{L.time}</th>
                  <th style={th}>{L.session}</th>
                  <th style={th}>{L.speaker}</th>
                  <th style={th}>{L.room}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td style={td}>{String(r.day ?? "")}</td>
                    <td style={td}>{String(r.time ?? "")}</td>
                    <td style={td}>
                      <div style={{ fontWeight: 900 }}>
                        {lang === "ar" ? String(r.titleAr ?? "") : String(r.titleEn ?? "")}
                      </div>
                      {lang === "ar" ? (
                        r.titleEn ? <div style={{ opacity: 0.7 }}>{r.titleEn}</div> : null
                      ) : r.titleAr ? (
                        <div style={{ opacity: 0.7 }}>{r.titleAr}</div>
                      ) : null}
                    </td>
                    <td style={td}>{String(r.speaker ?? "")}</td>
                    <td style={td}>{String(r.room ?? "")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <BottomNav lang={lang} />
    </div>
  );
}

const th: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: 10,
  textAlign: "start",
  background: "#fafafa",
  fontWeight: 900,
};

const td: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: 10,
  verticalAlign: "top",
};

