"use client";

import { use, useEffect, useMemo, useState } from "react";

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
    chooseType: ar ? "اختر نوع المشاركة" : "Select participation type",
    all: ar ? "الكل" : "All",

    name: ar ? "الاسم" : "Name",
    type: ar ? "نوع المشاركة" : "Participation Type",
    spec: ar ? "التخصص" : "Specialization",
    view: ar ? "عرض الملخص" : "View Abstract",
    download: ar ? "تحميل الملخص" : "Download Abstract",
  };
}

function uniqSorted(list: string[]) {
  return Array.from(new Set(list.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );
}

export default function AbstractsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const L = useMemo(() => t(lang), [lang]);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [selectedName, setSelectedName] = useState<string>(ALL);
  const [selectedType, setSelectedType] = useState<string>(ALL);

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

        // الفرز: أولاً حسب نوع المشاركة ثم حسب الاسم
        normalized.sort((a, b) => {
          const typeCompare = a.type.localeCompare(b.type);
          if (typeCompare !== 0) return typeCompare;
          return a.name.localeCompare(b.name);
        });

        setRows(normalized);
        setSelectedName(ALL);
        setSelectedType(ALL);
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

  // الأسماء تعتمد على نوع المشاركة المختار
  const nameOptions = useMemo(() => {
    const base =
      selectedType === ALL ? rows : rows.filter((r) => r.type === selectedType);
    return uniqSorted(base.map((r) => r.name));
  }, [rows, selectedType]);

  // أنواع المشاركة تعتمد على الاسم المختار
  const typeOptions = useMemo(() => {
    const base =
      selectedName === ALL ? rows : rows.filter((r) => r.name === selectedName);
    return uniqSorted(base.map((r) => r.type));
  }, [rows, selectedName]);

  useEffect(() => {
    if (selectedName !== ALL && !nameOptions.includes(selectedName)) {
      setSelectedName(ALL);
    }
  }, [nameOptions, selectedName]);

  useEffect(() => {
    if (selectedType !== ALL && !typeOptions.includes(selectedType)) {
      setSelectedType(ALL);
    }
  }, [typeOptions, selectedType]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const okName = selectedName === ALL ? true : r.name === selectedName;
      const okType = selectedType === ALL ? true : r.type === selectedType;
      return okName && okType;
    });
  }, [rows, selectedName, selectedType]);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
        {L.title}
      </h1>

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
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #ddd",
              outline: "none",
              width: "100%",
            }}
          >
            <option value={ALL}>
              {L.all} — {L.chooseType}
            </option>
            {typeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

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

              <div style={{ marginBottom: 12 }}>
                <b>{L.spec}:</b> {r.specialization || "-"}
              </div>

              {r.url ? (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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

                  <a
                    href={r.url}
                    download
                    style={{
                      display: "inline-block",
                      padding: "8px 12px",
                      borderRadius: 12,
                      border: "1px solid #ccc",
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    {L.download}
                  </a>
                </div>
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