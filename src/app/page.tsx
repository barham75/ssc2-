import { redirect } from "next/navigation";

export default function Page() {
  redirect("/ar"); // أو "/en" إذا بدك الافتراضي إنجليزي
}
