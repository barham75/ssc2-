import LangHtmlSync from "./LangHtmlSync";
import type { ReactNode } from "react";

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;

  const lang = rawLang === "en" ? "en" : "ar";
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <>
      <LangHtmlSync lang={lang} dir={dir} />
      <div dir={dir}>{children}</div>
    </>
  );
}
