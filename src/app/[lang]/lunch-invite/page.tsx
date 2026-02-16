import LunchInviteClientWrapper from "./LunchInvite.client";

export default async function LunchInvitePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <LunchInviteClientWrapper lang={lang || "ar"} />;
}
