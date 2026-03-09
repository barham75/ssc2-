"use client";

import Image from "next/image";

type Tier = "platinum" | "gold" | "silver" | "bronze";

type Sponsor = {
  id: string;
  tier: Tier;
  nameAr: string;
  nameEn: string;
  logo: string; // من public
  url?: string;
};

const SPONSORS: Sponsor[] = [
  // 1) Platinum
  {
    id: "s1",
    tier: "platinum",
    nameAr: "الجمعية الكيميائية الامريكية فرع الاردن",
    nameEn: "",
    logo: "/sponsors/ACS Jordan Chapter .jpg",
  },

  // 2) Gold
  {
    id: "s2",
    tier: "gold",
    nameAr: "GreenField Nutritions",
    nameEn: "GreenField Nutritions",
    logo: "/sponsors/Sponsorship2.jpg",
  },

  // 3) Silver (Compass) ✅
  {
    id: "s3",
    tier: "silver",
    nameAr: "Compass",
    nameEn: "Compass",
    // انتبه: الامتداد .jpeg والاسم فيه مسافات (لازم يكون مطابق 100%)
    logo: "/sponsors/compass.jpg",
  },
  // 4) Bronze (Passore) ✅
  {
    id: "s4",
    tier: "bronze",
    nameAr: "الباسور",
    nameEn: "passore",
    // انتبه: الامتداد .jpeg والاسم فيه مسافات (لازم يكون مطابق 100%)
logo: "/sponsers/Sponsorship1.jpg",    
  },

];
function labels(lang: string) {
  const ar = lang === "ar";
  return {
    title: ar ? "الداعمون" : "Sponsors",
    tiers: [
      { key: "platinum" as const, ar: "الداعم البلاتيني", en: "Platinum Sponsor" },
      { key: "gold" as const, ar: "الداعم الذهبي", en: "Gold Sponsor" },
      { key: "silver" as const, ar: "الداعم الفضي", en: "Silver Sponsor" },
      { key: "bronze" as const, ar: "الداعم البرونزي", en: "Bronze Sponsor" },
    ],
    empty: ar ? "لا يوجد داعمون ضمن هذه الفئة حالياً." : "No sponsors in this tier yet.",
  };
}

export default function SponsorsPage({ params }: { params: { lang: string } }) {
  const ar = params.lang === "ar";
  const t = labels(params.lang);

  const grouped: Record<Tier, Sponsor[]> = {
    platinum: SPONSORS.filter((s) => s.tier === "platinum"),
    gold: SPONSORS.filter((s) => s.tier === "gold"),
    silver: SPONSORS.filter((s) => s.tier === "silver"),
    bronze: SPONSORS.filter((s) => s.tier === "bronze"),
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 16px" }}>
      <h1 style={{ textAlign: "center", marginBottom: 30, fontSize: 34, fontWeight: 800 }}>
        {t.title}
      </h1>

      {t.tiers.map((tier) => {
        const list = grouped[tier.key];

        return (
          <section key={tier.key} style={{ marginBottom: 50 }}>
            <h2 style={{ textAlign: "center", marginBottom: 18, fontSize: 22, fontWeight: 800 }}>
              {ar ? tier.ar : tier.en} <span style={{ opacity: 0.6 }}>/ {ar ? tier.en : tier.ar}</span>
            </h2>

            {list.length === 0 ? (
              <p style={{ textAlign: "center", opacity: 0.7 }}>{t.empty}</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                  alignItems: "stretch",
                }}
              >
                {list.map((s) => {
                  const title = ar ? s.nameAr : s.nameEn;
                  const secondary = ar ? s.nameEn : s.nameAr;

                  const card = (
                    <div
                      style={{
                        background: "white",
                        border: "1px solid rgba(0,0,0,0.08)",
                        borderRadius: 16,
                        padding: 14,
                        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        justifyContent: "center",
                      }}
                    >
                      <div style={{ position: "relative", width: "100%", height: 110 }}>
                        <Image
                          src={s.logo}
                          alt={title}
                          fill
                          style={{ objectFit: "contain" }}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          priority={tier.key === "platinum"}
                        />
                      </div>

                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontWeight: 700 }}>{title}</div>
                        <div style={{ fontSize: 12, opacity: 0.7 }}>{secondary}</div>
                      </div>
                    </div>
                  );

                  return s.url ? (
                    <a key={s.id} href={s.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                      {card}
                    </a>
                  ) : (
                    <div key={s.id}>{card}</div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}