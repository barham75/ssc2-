"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadSession } from "@/lib/session";

type YourEval = {
  q1: number; q2: number; q3: number; q4: number; q5: number;
  score100: number;
};

function t(lang: string) {
  const ar = lang === "ar";
  return {
    title: ar ? "تقييم المؤتمر" : "Conference Evaluation",
    loading: ar ? "جاري التحميل..." : "Loading...",
    notLogged: ar ? "الرجاء التسجيل أولاً" : "Please register first",
    goRegister: ar ? "الذهاب للتسجيل" : "Go to registration",
    submit: ar ? "إرسال التقييم" : "Submit evaluation",
    already: ar ? "لقد قمت بالتقييم مسبقاً" : "You already submitted an evaluation",
    score: ar ? "نتيجتك من 100:" : "Your score out of 100:",
    avg: ar ? "متوسط التقييم العام:" : "Overall average:",
    err: ar ? "حدث خطأ" : "Something went wrong",
    q: ar
      ? [
          "جودة التنظيم",
          "جودة البرنامج العلمي",
          "جودة المتحدثين/المحتوى",
          "الخدمات والمرافق",
          "الرضا العام عن المؤتمر",
        ]
      : [
          "Organization quality",
          "Scientific program quality",
          "Speakers/content quality",
          "Services & facilities",
          "Overall satisfaction",
        ],
  };
}

export default function EvaluationClient({ lang }: { lang: string }) {
  const L = useMemo(() => t(lang), [lang]);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [q1, setQ1] = useState(3);
  const [q2, setQ2] = useState(3);
  const [q3, setQ3] = useState(3);
  const [q4, setQ4] = useState(3);
  const [q5, setQ5] = useState(3);

  const [your, setYour] = useState<YourEval | null>(null);
  const [avgScore, setAvgScore] = useState<number>(0);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    const s = loadSession();
    if (!s) {
      setLoading(false);
      return;
    }
    setEmail(String(s.email || "").toLowerCase());
  }, []);

  useEffect(() => {
    if (!email) return;

    (async () => {
      setLoading(true);
      setMsg(null);
      try {
        const res = await fetch("/api/evaluation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "getEvaluation", email }),
        });
        const data = await res.json().catch(() => null);

        if (data?.ok) {
          setYour(data.your || null);
          setAvgScore(Number(data.avgScore100 || 0));
          if (data.your) {
            setQ1(data.your.q1);
            setQ2(data.your.q2);
            setQ3(data.your.q3);
            setQ4(data.your.q4);
            setQ5(data.your.q5);
          }
        } else {
          setMsg({ type: "err", text: data?.error || L.err });
        }
      } catch (e: any) {
        setMsg({ type: "err", text: String(e?.message || e) });
      } finally {
        setLoading(false);
      }
    })();
  }, [email, L.err]);

  async function submit() {
    if (!email) return;

    setSubmitting(true);
    setMsg(null);

    try {
      const res = await fetch("/api/evaluation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submitEvaluation",
          email,
          q1,
          q2,
          q3,
          q4,
          q5,
        }),
      });

      const data = await res.json().catch(() => null);

      if (data?.ok) {
        setYour(data.your);
        setAvgScore(Number(data.avgScore100 || 0));
        setMsg({ type: "ok", text: `${L.score} ${data.your.score100}` });
      } else {
        if (data?.error === "already evaluated") {
          setYour(data.your || null);
          setAvgScore(Number(data.avgScore100 || 0));
          setMsg({ type: "err", text: L.already });
        } else {
          setMsg({ type: "err", text: data?.error || L.err });
        }
      }
    } catch (e: any) {
      setMsg({ type: "err", text: String(e?.message || e) });
    } finally {
      setSubmitting(false);
    }
  }

  if (!email && !loading) {
    return (
      <div style={{ maxWidth: 520, margin: "40px auto", padding: 16, textAlign: "center" }}>
        <h2>{L.title}</h2>
        <p>{L.notLogged}</p>
        <button
          onClick={() => router.push(`/${lang}/register`)}
          style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontWeight: 900 }}
        >
          {L.goRegister}
        </button>
      </div>
    );
  }

  const disabled = !!your;

  function Rate({ value, onChange }: { value: number; onChange: (n: number) => void }) {
    return (
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            disabled={disabled}
            onClick={() => onChange(n)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              border: "1px solid #ddd",
              background: n === value ? "#e8f0ff" : "#fff",
              cursor: disabled ? "not-allowed" : "pointer",
              fontWeight: 900,
            }}
            type="button"
          >
            {n}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", padding: 16 }}>
      <h2 style={{ textAlign: "center" }}>{L.title}</h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>{L.loading}</p>
      ) : (
        <>
          <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
            <Card title={L.q[0]}><Rate value={q1} onChange={setQ1} /></Card>
            <Card title={L.q[1]}><Rate value={q2} onChange={setQ2} /></Card>
            <Card title={L.q[2]}><Rate value={q3} onChange={setQ3} /></Card>
            <Card title={L.q[3]}><Rate value={q4} onChange={setQ4} /></Card>
            <Card title={L.q[4]}><Rate value={q5} onChange={setQ5} /></Card>

            <button
              onClick={submit}
              disabled={submitting || disabled}
              style={{
                padding: 14,
                borderRadius: 14,
                border: "1px solid #ddd",
                background: "#fff",
                cursor: submitting || disabled ? "not-allowed" : "pointer",
                fontWeight: 900,
                fontSize: 16,
              }}
            >
              {submitting ? "..." : L.submit}
            </button>

            {your ? (
              <div style={{ textAlign: "center", fontWeight: 900 }}>
                {L.score} <span style={{ fontSize: 22 }}>{your.score100}</span>
              </div>
            ) : null}

            <div style={{ textAlign: "center", fontWeight: 800 }}>
              {L.avg} {avgScore}
            </div>

            {msg ? (
              <div style={{ padding: 12, borderRadius: 14, border: "1px solid #ddd", background: msg.type === "ok" ? "#f3fff3" : "#fff3f3", textAlign: "center", fontWeight: 800 }}>
                {msg.text}
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 16 }}>
      <div style={{ fontWeight: 900, marginBottom: 10, textAlign: "center" }}>{title}</div>
      {children}
    </div>
  );
}
