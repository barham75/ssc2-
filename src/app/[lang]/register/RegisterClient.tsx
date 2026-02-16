"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { saveSession } from "@/lib/session";

function t(lang: string) {
  const ar = lang === "ar";
  return {
    title: ar ? "التسجيل" : "Registration",
    fullName: ar ? "الاسم" : "Name",
    email: ar ? "البريد الإلكتروني" : "Email",
    org: ar ? "المؤسسة / الجامعة" : "Organization / University",
    hint: ar ? "يمكن إدخال عربي أو إنجليزي" : "Arabic or English is allowed",
    btn: ar ? "دخول" : "Enter",

    errName: ar ? "الاسم مطلوب" : "Name is required",
    errEmail: ar ? "يرجى إدخال بريد إلكتروني صحيح" : "Please enter a valid email",
    errOrg: ar ? "اسم المؤسسة/الجامعة مطلوب" : "Organization/University is required",
    errServer: ar ? "حدث خطأ، حاول مرة أخرى" : "Something went wrong, please try again",

    okEligible: ar ? "تم الدخول بنجاح" : "Logged in successfully",
    okNotEligible: ar
      ? "تم الدخول، ولكن QR غير متاح لهذا البريد."
      : "Logged in, but QR is not available for this email.",
  };
}

export default function RegisterClient({ lang }: { lang: string }) {
  const L = useMemo(() => t(lang), [lang]);
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!fullName.trim()) {
      setMsg({ type: "err", text: L.errName });
      return;
    }

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setMsg({ type: "err", text: L.errEmail });
      return;
    }

    if (!organization.trim()) {
      setMsg({ type: "err", text: L.errOrg });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: cleanEmail,
          organization: organization.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!data?.ok) {
        setMsg({ type: "err", text: data?.error || L.errServer });
        return;
      }

      // ✅ حفظ session بالمفاتيح الجديدة + القديمة للتوافق
      saveSession({
        email: data.email,
        name: data.fullName,                 // ✅ هذا أهم سطر للرئيسية
        fullName: data.fullName,             // (توافق مع صفحات قديمة)
        org: data.organization,
        organization: data.organization,      // (توافق قديم)
        regNo: data.regNo || "",              // ✅ رقم التسجيل (إن وجد)
        eligibleForQR: !!data.eligibleForQR,
        lunchToken: data.lunchToken || "",
      } as any);

      setMsg({
        type: "ok",
        text: data.eligibleForQR ? L.okEligible : L.okNotEligible,
      });

      router.push(`/${lang}`); // الرئيسية
    } catch (err: any) {
      setMsg({ type: "err", text: String(err?.message || err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", padding: 16 }}>
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>{L.title}</h1>

      <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
        <label>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>{L.fullName}</div>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={L.hint}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
              outline: "none",
            }}
          />
        </label>

        <label>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>{L.email}</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
              outline: "none",
            }}
          />
        </label>

        <label>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>{L.org}</div>
          <input
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder={L.hint}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
              outline: "none",
            }}
          />
        </label>

        <button
          disabled={loading}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 14,
            border: "1px solid #ddd",
            background: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 900,
            fontSize: 16,
          }}
        >
          {loading ? "..." : L.btn}
        </button>

        {msg && (
          <div
            style={{
              padding: 14,
              borderRadius: 14,
              border: "1px solid #ddd",
              background: msg.type === "ok" ? "#f3fff3" : "#fff3f3",
              textAlign: "center",
              fontWeight: 800,
            }}
          >
            {msg.text}
          </div>
        )}
      </form>
    </div>
  );
}
