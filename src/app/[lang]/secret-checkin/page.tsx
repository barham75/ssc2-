import SecretCheckinClient from "./SecretCheckinClient.tsx";


export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <SecretCheckinClient lang={lang} />;
}
