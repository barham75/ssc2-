import HomeClient from "./HomeClient";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <HomeClient lang={lang} />;
}
