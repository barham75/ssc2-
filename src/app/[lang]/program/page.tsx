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
    search: ar ? "بحث" : "Search",
    searchPlaceholder: ar
      ? "ابحث في الجلسة أو المتحدث "
      : "Search by session, speaker, or room",

    downloadPdf: ar
      ? "تحميل البرنامج PDF"
      : "Download Program PDF",
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

  // رابط ملف البرنامج PDF
  const PROGRAM_PDF_URL =
    "https://drive.google.com/file/d/1O3j5WyXyLBsophYBF2U_ayFLfX-olC7K/view?usp=drive_link";

  // حل مشكلة params في Next.js 16
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
        }
      } catch (err) {
        console.error("PROGRAM ERROR:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [lang, router]);

  const uniqueDays = useMemo(() => {
    return Array.from(
      new Set(
        rows
          .map((r) => String(r.day ?? "").trim())
          .filter(Boolean)
      )
    );
  }, [rows]);

  const uniqueRooms = useMemo(() => {
    return Array.from(
      new Set(
        rows
          .map((r) => String(r.room ?? "").trim())
          .filter(Boolean)
      )
    );
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rows.filter((r) => {
      const matchesDay =
        selectedDay === "__ALL__" ||
        String(r.day ?? "").trim() === selectedDay;

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

      return (
        matchesDay &&
        matchesRoom &&
        matchesSearch
      );
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
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 10,
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              textAlign: "center",
              margin: 0,
              flex: 1,
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
              padding: "10px 14px",
              borderRadius: 10,
              background: "#0f766e",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {L.downloadPdf}
          </a>
        </div>

        {!loading && rows.length > 0 ? (
         <div
  style={{
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    background: "#fcfcfc",
    width: "100%",
    boxSizing: "border-box",
    overflow: "hidden",
  }}
>
            <div
              style={{
                fontWeight: 800,
                marginBottom: 12,
                fontSize: 16,
              }}
            >
              {L.filters}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              <select
                value={selectedDay}
                onChange={(e) =>
                  setSelectedDay(e.target.value)
                }
                style={inputStyle}
              >
                <option value="__ALL__">
                  {L.allDays}
                </option>

                {uniqueDays.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <select
                value={selectedRoom}
                onChange={(e) =>
                  setSelectedRoom(e.target.value)
                }
                style={inputStyle}
              >
                <option value="__ALL__">
                  {L.allRooms}
                </option>

                {uniqueRooms.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder={L.searchPlaceholder}
                style={inputStyle}
              />
            </div>
          </div>
        ) : null}

        {loading ? (
          <p style={{ textAlign: "center" }}>
            {L.loading}
          </p>
        ) : rows.length === 0 ? (
          <p style={{ textAlign: "center" }}>
            {L.empty}
          </p>
        ) : filteredRows.length === 0 ? (
          <p style={{ textAlign: "center" }}>
            {L.noResults}
          </p>
        ) : (
          <div
            style={{
              overflowX: "auto",
              marginTop: 20,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 720,
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
                    <td style={td}>
                      {String(r.day ?? "")}
                    </td>

                    <td style={td}>
                      {String(r.time ?? "")}
                    </td>

                    <td style={td}>
                      <div
                        style={{
                          fontWeight: 700,
                        }}
                      >
                        {lang === "ar"
                          ? String(r.titleAr ?? "")
                          : String(r.titleEn ?? "")}
                      </div>

                      {lang === "ar"
                        ? r.titleEn && (
                            <div
                              style={{
                                opacity: 0.7,
                                marginTop: 4,
                              }}
                            >
                              {r.titleEn}
                            </div>
                          )
                        : r.titleAr && (
                            <div
                              style={{
                                opacity: 0.7,
                                marginTop: 4,
                              }}
                            >
                              {r.titleAr}
                            </div>
                          )}
                    </td>

                    <td style={td}>
                      {String(r.speaker ?? "")}
                    </td>

                    <td style={td}>
                      {String(r.room ?? "")}
                    </td>
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
  padding: 10,
  textAlign: "start",
  background: "#fafafa",
  fontWeight: 800,
};

const td: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: 10,
  verticalAlign: "top",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ccc",
  outline: "none",
  fontSize: 14,
  boxSizing: "border-box",
  display: "block",
  maxWidth: "100%",
};