import RegisterClient from "./RegisterClient";

export default function RegisterPage({
  params,
}: {
  params: { lang: string };
}) {
  return <RegisterClient lang={params.lang || "ar"} />;
}
