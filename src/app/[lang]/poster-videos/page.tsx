import Link from "next/link";
import { POSTERS } from "@/lib/posters";

function t(lang: string) {
  const ar = lang === "ar";
  return {
    title: ar ? "فيديوهات البوسترات" : "Poster Videos",
    subtitle: ar
      ? "اضغط على اسم الباحث أو رقم البوستر لعرض الفيديو"
      : "Click the researcher name or poster number to view the video",
    posterNo: ar ? "رقم البوستر" : "Poster No.",
    researcher: ar ? "الباحث" : "Researcher",
    posterTitle: ar ? "عنوان البوستر" : "Poster Title",
    open: ar ? "عرض الفيديو" : "View Video",
  };
}

export default async function PosterVideosPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const tx = t(lang);
  const isAr = lang === "ar";

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* العنوان */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">{tx.title}</h1>
        <p className="mt-2 text-gray-600">{tx.subtitle}</p>
      </div>

      {/* رأس الجدول */}
      <div className="hidden grid-cols-12 gap-4 rounded-2xl border bg-gray-50 px-4 py-3 text-sm font-semibold md:grid">
        <div className="col-span-2">{tx.posterNo}</div>
        <div className="col-span-3">{tx.researcher}</div>
        <div className="col-span-5">{tx.posterTitle}</div>
        <div className="col-span-2 text-center">{tx.open}</div>
      </div>

      {/* قائمة البوسترات */}
      <div className="mt-4 space-y-4">
        {POSTERS.map((poster) => (
          <div
            key={poster.id}
            className="
              grid grid-cols-1 gap-3
              px-4 py-6
              md:grid-cols-12 md:items-center
              rounded-2xl
              border
              bg-white
              shadow-sm
              hover:shadow-md
              transition
            "
          >
            {/* رقم البوستر */}
            <div className="md:col-span-2">
              <Link
                href={`/${lang}/poster-videos/${poster.id}`}
                className="
                  inline-block
                  rounded-lg
                  bg-blue-50
                  px-3 py-2
                  font-semibold
                  text-blue-700
                  hover:bg-blue-100
                "
              >
                {poster.id.toUpperCase()}
              </Link>
            </div>

            {/* اسم الباحث */}
            <div className="md:col-span-3">
              <Link
                href={`/${lang}/poster-videos/${poster.id}`}
                className="
                  font-medium
                  text-gray-900
                  hover:text-blue-700
                "
              >
                {isAr
                  ? poster.researcherAr
                  : poster.researcherEn}
              </Link>
            </div>

            {/* عنوان البوستر */}
            <div className="md:col-span-5 text-gray-700">
              {isAr
                ? poster.titleAr
                : poster.titleEn}
            </div>

            {/* زر عرض الفيديو */}
            <div className="md:col-span-2 md:text-center">
              <Link
                href={`/${lang}/poster-videos/${poster.id}`}
                className="
                  inline-block
                  rounded-xl
                  bg-black
                  px-4 py-2
                  text-white
                  hover:opacity-90
                "
              >
                {tx.open}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}