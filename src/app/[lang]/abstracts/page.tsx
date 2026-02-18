"use client";

import { useEffect, useMemo, useState } from "react";

type Row = {
  name: string;
  type: string;
  specialization: string;
  url: string;
};

const ALL = "__ALL__";

function isArabic(lang: string) {
  return String(lang || "").toLowerCase() === "ar";
}

function t(lang: string) {
  const ar = isArabic(lang);
  return {
    title: ar ? "الملخصات" : "Abstracts",
    loading: ar ? "جاري التحميل..." : "Loading...",
    empty: ar ? "لا يوجد ملخصات لعرضها." : "No abstracts to show.",
    error: ar ? "حدث خطأ أثناء جلب البيانات." : "Failed to load data.",

    filters: ar ? "تصفية" : "Filters",
    chooseName: ar ? "اختر الاسم" : "Select name",
    chooseSpec: ar ? "اختر التخصص" : "Select specialization",
    all: ar ? "الكل" : "All",

    name: ar ? "الاسم" : "Name",
    type: ar ? "نوع المشاركة" : "Participation Type",
    spec: ar ? "التخصص" : "Specialization",
    view: ar ? "عرض الملخص" : "View Abstract",
  };
}

function uniqSorted(list: string[]) {
  return Array.from(new Set(list.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

export default function AbstractsPage({ params }: { params: { lang: string } }) {
  const lang = params?.lang || "ar";
  const L = useMemo(() => t(lang), [lang]);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [selectedName, setSelectedName] = useState<string>(ALL);
  const [selectedSpec, setSelectedSpec] = useState<string>(ALL);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch("/api/abstracts", { method: "GET" });
        const js = await res.json().catch(() => null);

        if (!alive) return;

        if (!js || js.ok !== true) {
          setErr(js?.error || L.error);
          setRows([]);
          return;
        }

        const data = Array.isArray(js.data) ? js.data : [];
        const normalized: Row[] = data.map((r: any) => ({
          name: String(r?.name || "").trim(),
          type: String(r?.type || "").trim(),
          specialization: String(r?.specialization || "").trim(),
          url: String(r?.url || "").trim(),
        }));

        setRows(normalized);

        // reset
        setSelectedName(ALL);
        setSelectedSpec(ALL);
      } catch (e: any) {
        if (!alive) return;
        setErr(String(e?.message || e));
        setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [L.error]);

  // 🔗 قائمة الأسماء تعتمد على التخصص المختار
  const nameOptions = useMemo(() => {
    const base = selectedSpec === ALL ? rows : rows.filter((r) => r.specialization === selectedSpec);
    return uniqSorted(base.map((r) => r.name));
  }, [rows, selectedSpec]);

  // 🔗 قائمة التخصص تعتمد على الاسم المختار
  const specOptions = useMemo(() => {
    const base = selectedName === ALL ? rows : rows.filter((r) => r.name === selectedName);
    return uniqSorted(base.map((r) => r.specialization));
  }, [rows, selectedName]);

  // ✅ إذا الخيار الحالي صار غير صالح بعد تحديث الخيارات -> رجعه ALL
  useEffect(() => {
    if (selectedName !== ALL && !nameOptions.includes(selectedName)) {
      setSelectedName(ALL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameOptions]);

  useEffect(() => {
    if (selectedSpec !== ALL && !specOptions.includes(selectedSpec)) {
      setSelectedSpec(ALL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specOptions]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const okName = selectedName === ALL ? true : r.name === selectedName;
      const okSpec = selectedSpec === ALL ? true : r.specialization === selectedSpec;
      return okName && okSpec;
    });
  }, [rows, selectedName, selectedSpec]);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>{L.title}</h1>

      {/* Filters */}
      <div
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: 16,
          padding: 12,
          marginBottom: 14,
        }}
      >
        <div style={{ fontWeight: 800, marginBottom: 10 }}>{L.filters}</div>

        <div
          style={{
            display: "grid",
            gap: 10,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {/* تخصص */}
          <select
            value={selectedSpec}
            onChange={(e) => setSelectedSpec(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #ddd",
              outline: "none",
              width: "100%",
            }}
          >
            <option value={ALL}>
              {L.all} — {L.chooseSpec}
            </option>
            {specOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* اسم */}
          <select
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #ddd",
              outline: "none",
              width: "100%",
            }}
          >
            <option value={ALL}>
              {L.all} — {L.chooseName}
            </option>
            {nameOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p>{L.loading}</p>}

      {!loading && err && (
        <p style={{ color: "crimson", fontWeight: 600 }}>
          {L.error} ({err})
        </p>
      )}

      {!loading && !err && filtered.length === 0 && <p>{L.empty}</p>}

      {!loading && !err && filtered.length > 0 && (
        <div style={{ display: "grid", gap: 12 }}>
          {filtered.map((r, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 16,
                padding: 14,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>
                {L.name}: {r.name || "-"}
              </div>

              <div style={{ marginBottom: 6 }}>
                <b>{L.type}:</b> {r.type || "-"}
              </div>

              <div style={{ marginBottom: 10 }}>
                <b>{L.spec}:</b> {r.specialization || "-"}
              </div>

              {r.url ? (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: 12,
                    border: "1px solid #ccc",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  {L.view}
                </a>
              ) : (
                <span style={{ opacity: 0.7 }}>-</span>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
