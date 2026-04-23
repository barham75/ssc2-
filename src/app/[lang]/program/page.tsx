"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
    empty: ar
      ? "لا يوجد بيانات للبرنامج حالياً."
      : "No program data available.",
    day: ar ? "اليوم" : "Day",
    time: ar ? "الوقت" : "Time",
    session: ar ? "الجلسة" : "Session",
    speaker: ar ? "المتحدث" : "Speaker",
    room: ar ? "الجلسة" : "Room",

    filters: ar ? "تصفية البرنامج" : "Program Filters",
    allDays: ar ? "كل الأيام" : "All Days",
    allRooms: ar ? "كل الجلسات" : "All Rooms",
    searchPlaceholder: ar
      ? "ابحث في الجلسة أو المتحدث"
      : "Search by session, speaker, or room",

    downloadPdf: ar ? "تحميل البرنامج PDF" : "Download Program PDF",
    noResults: ar ? "لا توجد نتائج مطابقة." : "No matching results.",
  };
}

export default function ProgramPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const router = useRouter();

  const [lang, setLang] = useState("ar");
  const [rows, setRows] = useState<ProgramRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDay, setSelectedDay] = useState("__ALL__");
  const [selectedRoom, setSelectedRoom] = useState("__ALL__");
  const [search, setSearch] = useState("");

  const L = useMemo(() => t(lang), [lang]);

  const PROGRAM_PDF_URL =
    "https://drive.google.com/file/d/12hlF1Hsn216TnsoO3qCyeuCwZH5q04j5/view?usp=sharing";

  useEffect(() => {
    (async () => {
      const p = await params;
      setLang(p?.lang || "ar");
    })();
  }, [params]);

  useEffect(() => {
    const s = loadSession();

    if (!s) {
      router.push(`/${lang}/register`);
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/program", {
          method: "POST",
        });

        const data = await res.json();
        console.log("PROGRAM:", data);

        if (data?.ok) {
          setRows(data.rows || []);
        } else {
          setRows([]);
        }
      } catch (err) {
        console.error("PROGRAM ERROR:", err);
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [lang, router]);

  const uniqueDays = useMemo(() => {
    return Array.from(
      new Set(rows.map((r) => String(r.day ?? "").trim()).filter(Boolean))
    );
  }, [rows]);

  const uniqueRooms = useMemo(() => {
    return Array.from(
      new Set(rows.map((r) => String(r.room ?? "").trim()).filter(Boolean))
    );
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rows.filter((r) => {
      const matchesDay =
        selectedDay === "__ALL__" || String(r.day ?? "").trim() === selectedDay;

      const matchesRoom =
        selectedRoom === "__ALL__" ||
        String(r.room ?? "").trim() === selectedRoom;

      const text = [
        r.day,
        r.time,
        r.titleAr,
        r.titleEn,
        r.speaker,
        r.room,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !q || text.includes(q);

      return matchesDay && matchesRoom && matchesSearch;
    });
  }, [rows, selectedDay, selectedRoom, search]);

  return (
    <div>
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: 16,
          paddingBottom: 40,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginTop: 10,
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              margin: 0,
              marginBottom: 14,
              fontSize: "clamp(28px, 6vw, 52px)",
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            {L.title}
          </h2>

          <a
            href={PROGRAM_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "12px 20px",
              borderRadius: 14,
              background: "#0f766e",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 16,
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
          >
            {L.downloadPdf}
          </a>
        </div>

        {!loading && rows.length > 0 ? (
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 14,
              padding: 16,
              marginBottom: 18,
              background: "#fcfcfc",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontWeight: 800,
                marginBottom: 14,
                fontSize: 18,
                textAlign: "center",
              }}
            >
              {L.filters}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 12,
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                style={inputStyle}
              >
                <option value="__ALL__">{L.allDays}</option>
                {uniqueDays.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                style={inputStyle}
              >
                <option value="__ALL__">{L.allRooms}</option>
                {uniqueRooms.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={L.searchPlaceholder}
                style={inputStyle}
              />
            </div>
          </div>
        ) : null}

        {loading ? (
          <p style={{ textAlign: "center" }}>{L.loading}</p>
        ) : rows.length === 0 ? (
          <p style={{ textAlign: "center" }}>{L.empty}</p>
        ) : filteredRows.length === 0 ? (
          <p style={{ textAlign: "center" }}>{L.noResults}</p>
        ) : (
          <div
            style={{
              overflowX: "auto",
              marginTop: 20,
              width: "100%",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 720,
                background: "#fff",
              }}
            >
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
                {filteredRows.map((r, i) => (
                  <tr key={i}>
                    <td style={td}>{String(r.day ?? "")}</td>
                    <td style={td}>{String(r.time ?? "")}</td>

                    <td style={td}>
                      <div style={{ fontWeight: 700 }}>
                        {lang === "ar"
                          ? String(r.titleAr ?? "")
                          : String(r.titleEn ?? "")}
                      </div>

                      {lang === "ar" ? (
                        r.titleEn ? (
                          <div style={{ opacity: 0.7, marginTop: 4 }}>
                            {r.titleEn}
                          </div>
                        ) : null
                      ) : r.titleAr ? (
                        <div style={{ opacity: 0.7, marginTop: 4 }}>
                          {r.titleAr}
                        </div>
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
    </div>
  );
}

const th: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: 12,
  textAlign: "start",
  background: "#fafafa",
  fontWeight: 800,
  fontSize: 16,
};

const td: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: 12,
  verticalAlign: "top",
  fontSize: 15,
  lineHeight: 1.6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: 14,
  border: "1px solid #ccc",
  outline: "none",
  fontSize: 15,
  boxSizing: "border-box",
  display: "block",
  background: "#fff",
};