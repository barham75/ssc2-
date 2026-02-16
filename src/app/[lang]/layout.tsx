import FooterGate from "@/components/FooterGate";
import LangHtmlSync from "./LangHtmlSync";

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const lang = params?.lang === "en" ? "en" : "ar";
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <>
      <LangHtmlSync lang={lang} dir={dir} />
      <div dir={dir}>
        {children}
        <FooterGate />
      </div>
    </>
  );
}
