"use client";

import { usePathname, useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { clearSession } from "@/lib/session";

export default function FooterGate() {
  const pathname = usePathname();
  const router = useRouter();

  const parts = (pathname || "/").split("/").filter(Boolean);
  const lang = parts[0] || "ar";
  const page = parts[1] || ""; // "" = الرئيسية داخل lang

  // اخفاء الفوتر في الرئيسية + التسجيل
  if (page === "" || page === "register") return null;

  function logout() {
    clearSession();
    router.push(`/${lang}/register`);
  }

  return <BottomNav lang={lang} onLogout={logout} />;
}
