import SecretCheckinClient from "./SecretCheckinClient";



export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <SecretCheckinClient lang={lang} />;
}
