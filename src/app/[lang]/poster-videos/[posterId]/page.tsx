import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTERS } from "@/lib/posters";

function t(lang: string) {
  const ar = lang === "ar";
  return {
    back: ar ? "الرجوع إلى قائمة البوسترات" : "Back to Poster List",
    researcher: ar ? "الباحث" : "Researcher",
    posterNo: ar ? "رقم البوستر" : "Poster No.",
    title: ar ? "عنوان البوستر" : "Poster Title",
  };
}

export default async function PosterVideoDetailsPage({
  params,
}: {
  params: Promise<{ lang: string; posterId: string }>;
}) {
  const { lang, posterId } = await params;
  const tx = t(lang);
  const isAr = lang === "ar";

  const poster = POSTERS.find(
    (item) => item.id.toLowerCase() === posterId.toLowerCase()
  );

  if (!poster) return notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/${lang}/poster-videos`}
          className="inline-block rounded-lg border px-4 py-2 hover:bg-gray-50"
        >
          {tx.back}
        </Link>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-5 space-y-2">
          <div className="text-sm text-gray-500">
            {tx.posterNo}: <span className="font-semibold">{poster.id.toUpperCase()}</span>
          </div>

          <h1 className="text-2xl font-bold">
            {isAr ? poster.titleAr : poster.titleEn}
          </h1>

          <p className="text-gray-700">
            <span className="font-semibold">{tx.researcher}:</span>{" "}
            {isAr ? poster.researcherAr : poster.researcherEn}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border">
          <div className="aspect-video w-full">
            <iframe
              src={poster.videoUrl}
              title={poster.id}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </main>
  );
}