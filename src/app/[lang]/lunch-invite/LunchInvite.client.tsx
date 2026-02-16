"use client";

import LunchInviteClient from "./LunchInviteClient";

export default function LunchInviteClientWrapper({ lang }: { lang: string }) {
  return <LunchInviteClient lang={lang} />;
}
