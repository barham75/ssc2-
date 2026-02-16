import PosterVoteClient from "./PosterVoteClient";

export default async function PosterVotePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <PosterVoteClient lang={lang || "ar"} />;
}
