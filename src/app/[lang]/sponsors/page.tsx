"use client";

import Image from "next/image";

export default function SponsorsPage({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  const ar = lang === "ar";

  const sponsors = {
    platinum: [
      { name: "Company A", logo: "/sponsors/a.png" },
    ],
    gold: [
      { name: "Company B", logo: "/sponsors/b.png" },
    ],
    silver: [],
    bronze: [],
  };

  function Section(titleAr: string, titleEn: string, list: any[]) {
    return (
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          {ar ? titleAr : titleEn} / {ar ? titleEn : titleAr}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))",
            gap: 20,
          }}
        >
          {list.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <Image src={s.logo} alt={s.name} width={120} height={80} />
              <div>{s.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ textAlign: "center", marginBottom: 40 }}>
        {ar ? "الداعمون" : "Sponsors"}
      </h1>

      {Section("الداعم البلاتيني", "Platinum Sponsor", sponsors.platinum)}
      {Section("الداعم الذهبي", "Gold Sponsor", sponsors.gold)}
      {Section("الداعم الفضي", "Silver Sponsor", sponsors.silver)}
      {Section("الداعم البرونزي", "Bronze Sponsor", sponsors.bronze)}
    </div>
  );
}