"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadSession } from "@/lib/session";

type Winner = { bestId: string; bestCount: number };
type Results = Record<string, number>;

function t(lang: string) {
  const ar = lang === "ar";
  return {
    title: ar ? "تصويت أفضل بوستر" : "Best Poster Vote",
    loading: ar ? "جاري التحميل..." : "Loading...",
    choose: ar ? "اختر رقم البوستر" : "Choose a poster",
    vote: ar ? "تصويت" : "Vote",
    yourVote: ar ? "تصويتك:" : "Your vote:",
    already: ar ? "لقد قمت بالتصويت مسبقاً" : "You have already voted",
    winner: ar ? "الأكثر تصويتاً الآن:" : "Current leader:",
    votes: ar ? "صوت" : "votes",
    notLogged: ar ? "الرجاء التسجيل أولاً" : "Please register first",
    goRegister: ar ? "الذهاب للتسجيل" : "Go to registration",
    errGeneric: ar ? "حدث خطأ" : "Something went wrong",
    votesCol: ar ? "عدد الأصوات" : "Votes",
  };
}

function postersList() {
  return Array.from({ length: 30 }, (_, i) => `P${i + 1}`);
}

export default function PosterVoteClient({ lang }: { lang: string }) {
  const L = useMemo(() => t(lang), [lang]);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState("P1");
  const [yourVote, setYourVote] = useState("");
  const [results, setResults] = useState<Results>({});
  const [winner, setWinner] = useState<Winner | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
        const res = await fetch("/api/poster-vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "posterResults", email }),
        });
        const data = await res.json().catch(() => null);

        if (data?.ok) {
          setYourVote(String(data.yourVote || ""));
          setResults(data.results || {});
          setWinner(data.winner || null);
        } else {
          setMsg({ type: "err", text: data?.error || L.errGeneric });
        }
      } catch (e: any) {
        setMsg({ type: "err", text: String(e?.message || e) });
      } finally {
        setLoading(false);
      }
    })();
  }, [email, L.errGeneric]);

  async function submitVote() {
    if (!email) return;

    setSubmitting(true);
    setMsg(null);
    try {
      const res = await fetch("/api/poster-vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "posterVote", email, posterId: selected }),
      });
      const data = await res.json().catch(() => null);

      if (data?.ok) {
        setYourVote(String(data.yourVote || ""));
        setResults(data.results || {});
        setWinner(data.winner || null);
        setMsg({ type: "ok", text: `${L.yourVote} ${String(data.yourVote || "")}` });
      } else {
        if (data?.error === "already voted") {
          setYourVote(String(data.yourVote || ""));
          setResults(data.results || {});
          setWinner(data.winner || null);
          setMsg({ type: "err", text: `${L.already}: ${String(data.yourVote || "")}` });
        } else {
          setMsg({ type: "err", text: data?.error || L.errGeneric });
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

  const posterOptions = postersList();
  const sorted = posterOptions
    .map((p) => ({ id: p, c: Number(results?.[p] || 0) }))
    .sort((a, b) => b.c - a.c);

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", padding: 16 }}>
      <h2 style={{ textAlign: "center" }}>{L.title}</h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>{L.loading}</p>
      ) : (
        <>
          <div style={{ marginTop: 18, padding: 16, border: "1px solid #eee", borderRadius: 14, display: "grid", gap: 12 }}>
            <div style={{ fontWeight: 900 }}>{L.choose}</div>

            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              disabled={!!yourVote}
              style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
            >
              {posterOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <button
              onClick={submitVote}
              disabled={submitting || !!yourVote}
              style={{
                padding: 12,
                borderRadius: 12,
                border: "1px solid #ddd",
                background: "#fff",
                cursor: submitting || yourVote ? "not-allowed" : "pointer",
                fontWeight: 900,
              }}
            >
              {submitting ? "..." : L.vote}
            </button>

            {yourVote ? (
              <div style={{ fontWeight: 900 }}>
                {L.yourVote} <span style={{ paddingInline: 8 }}>{yourVote}</span>
              </div>
            ) : null}

            {msg ? (
              <div style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd", background: msg.type === "ok" ? "#f3fff3" : "#fff3f3", fontWeight: 800, textAlign: "center" }}>
                {msg.text}
              </div>
            ) : null}
          </div>

          <div style={{ marginTop: 18, padding: 16, border: "1px solid #eee", borderRadius: 14 }}>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>
              {L.winner}{" "}
              {winner ? (
                <span>
                  {winner.bestId} ({winner.bestCount} {L.votes})
                </span>
              ) : (
                "-"
              )}
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
                <thead>
                  <tr>
                    <th style={th}>Poster</th>
                    <th style={th}>{L.votesCol}</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((x) => (
                    <tr key={x.id}>
                      <td style={td}>{x.id}</td>
                      <td style={td}>{x.c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const th: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: 10,
  background: "#fafafa",
  textAlign: "start",
  fontWeight: 900,
};

const td: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: 10,
};
