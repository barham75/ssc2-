"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";

type Stats = {
  eligibleCount: number;
  checkedInCount: number;
  registrationsCount: number;
};

export default function SecretCheckinClient({ lang }: { lang: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const lastTokenRef = useRef<string>("");

  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const [stats, setStats] = useState<Stats>({
    eligibleCount: 0,
    checkedInCount: 0,
    registrationsCount: 0,
  });

  const [msg, setMsg] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function refreshStats(p: string) {
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stats", pin: p }),
      });

      const data = await res.json().catch(() => null);
      if (data?.ok) {
        setStats({
          eligibleCount: Number(data.eligibleCount || 0),
          checkedInCount: Number(data.checkedInCount || 0),
          registrationsCount: Number(data.registrationsCount || 0),
        });
      }
    } catch {
      // ignore
    }
  }

  async function unlock() {
    setMsg("");

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stats", pin }),
      });

      const data = await res.json().catch(() => null);

      if (data?.ok) {
        setUnlocked(true);
        setStats({
          eligibleCount: Number(data.eligibleCount || 0),
          checkedInCount: Number(data.checkedInCount || 0),
          registrationsCount: Number(data.registrationsCount || 0),
        });
        setMsg("✅ تم فتح الصفحة");
      } else {
        setUnlocked(false);
        setMsg("❌ PIN غير صحيح");
      }
    } catch {
      setUnlocked(false);
      setMsg("❌ خطأ في الاتصال");
    }
  }

  useEffect(() => {
    if (!unlocked) return;

    let stopped = false;
    setMsg("");

    refreshStats(pin);
    const interval = setInterval(() => refreshStats(pin), 10000);

    (async () => {
      try {
        if (!videoRef.current) return;

        const reader = new BrowserMultiFormatReader();

        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        if (!devices.length) {
          setMsg("❌ لا توجد كاميرا على الجهاز");
          return;
        }

        const preferred =
          devices.find((d) => /back|rear|environment/i.test(d.label)) || devices[0];

        const controls = await reader.decodeFromVideoDevice(
          preferred.deviceId,
          videoRef.current,
          async (result) => {
            if (stopped) return;
            if (!result) return;

            const token = result.getText();
            if (!token) return;

            if (token === lastTokenRef.current) return;
            lastTokenRef.current = token;

            setBusy(true);
            try {
              const res = await fetch("/api/checkin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "checkin", pin, token }),
              });

              const json = await res.json().catch(() => null);

              if (json?.ok) {
                if (json.status === "checked_in") setMsg("✅ تم السماح بالدخول (تم تسجيله الآن)");
                else if (json.status === "already") setMsg("⚠️ تم استخدام QR مسبقاً");
                else setMsg("✅ تم السماح بالدخول");

                await refreshStats(pin);
              } else {
                setMsg("❌ QR غير صالح");
              }
            } catch {
              setMsg("❌ خطأ في الاتصال");
            } finally {
              setBusy(false);
              setTimeout(() => {
                lastTokenRef.current = "";
              }, 1500);
            }
          }
        );

        controlsRef.current = controls;
      } catch {
        setMsg("❌ تعذر فتح الكاميرا. تأكد من صلاحيات الكاميرا.");
      }
    })();

    return () => {
      stopped = true;
      clearInterval(interval);
      try {
        controlsRef.current?.stop();
      } catch {}
      controlsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked]);

  if (!unlocked) {
    return (
      <div style={{ maxWidth: 420, margin: "80px auto", textAlign: "center", padding: 16 }}>
        <h2>🔒 الصفحة السرية</h2>

        <input
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="PIN"
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            border: "1px solid #ddd",
            textAlign: "center",
            fontWeight: 900,
            fontSize: 18,
            marginTop: 16,
          }}
        />

        <button
          onClick={unlock}
          style={{
            marginTop: 10,
            padding: 12,
            width: "100%",
            borderRadius: 12,
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
            fontWeight: 900,
          }}
        >
          فتح
        </button>

        <div style={{ marginTop: 12, fontWeight: 800 }}>{msg}</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "30px auto", textAlign: "center", padding: 16 }}>
      <h2>✅ فحص دعوات الغداء</h2>

      <div style={{ margin: "16px auto", maxWidth: 520, padding: 16, borderRadius: 14, border: "1px solid #eee" }}>
        <div style={{ fontSize: 22, fontWeight: 900 }}>
          {stats.checkedInCount} / {stats.eligibleCount}
        </div>
        <div style={{ color: "#666", fontWeight: 700 }}>عدد الداخلين / عدد المدعوين</div>
        <div style={{ marginTop: 6, color: "#666", fontWeight: 700 }}>
          إجمالي المسجلين: {stats.registrationsCount}
        </div>

        <button
          onClick={() => refreshStats(pin)}
          style={{
            marginTop: 10,
            padding: 10,
            borderRadius: 12,
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
            fontWeight: 900,
          }}
        >
          تحديث العداد
        </button>
      </div>

      <div style={{ width: 380, margin: "10px auto", padding: 12, borderRadius: 14, border: "1px solid #eee" }}>
        <video ref={videoRef} style={{ width: "100%", borderRadius: 12 }} muted playsInline />
      </div>

      {busy ? <div style={{ fontWeight: 800 }}>جارِ التحقق...</div> : null}
      <div style={{ marginTop: 12, fontWeight: 900 }}>{msg}</div>

      <button
        onClick={() => {
          setUnlocked(false);
          setMsg("");
          try {
            controlsRef.current?.stop();
          } catch {}
          controlsRef.current = null;
        }}
        style={{
          marginTop: 14,
          padding: 10,
          borderRadius: 12,
          border: "1px solid #ddd",
          background: "#fff",
          cursor: "pointer",
          fontWeight: 900,
        }}
      >
        قفل الصفحة
      </button>
    </div>
  );
}
