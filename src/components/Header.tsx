"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { clearSession } from "@/lib/session";

export default function Header({ lang }: { lang: string }) {
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: "1px solid #eee",
      }}
    >
      {/* Left Logo */}
      <Image src="/conference.png" alt="Conference" width={60} height={60} />

      {/* Title */}
      <div style={{ fontWeight: 900, fontSize: 20 }}>
        Scientific Conference 2026
      </div>

      {/* Right Logo + Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Image src="/university.png" alt="University" width={60} height={60} />
        <button
          onClick={() => {
            clearSession();
            router.push(`/${lang}/register`);
          }}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          خروج
        </button>
      </div>
    </div>
  );
}
