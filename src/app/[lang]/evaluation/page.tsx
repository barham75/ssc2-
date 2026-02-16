import EvaluationClient from "./EvaluationClient";

export default async function EvaluationPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <EvaluationClient lang={lang || "ar"} />;
}
