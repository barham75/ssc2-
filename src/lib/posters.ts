export type PosterItem = {
  id: string;          // p1, p2, ...
  titleAr: string;
  titleEn: string;
  researcherAr: string;
  researcherEn: string;
  videoUrl: string;    // رابط الفيديو
};

export const POSTERS: PosterItem[] = [
  {
    id: "p1",
    titleAr: "Novel corrosion For Copper in 1M HCl",
    titleEn: "Novel corrosion For Copper in 1M HCl",
    researcherAr: "Qusai Khamaiseh",
    researcherEn: "Qusai Khamaiseh",

    // تم تحويل الرابط إلى preview
    videoUrl:
      "https://www.youtube.com/embed/3GJDjnhlEf8",
  },

  {
    id: "p2",
    titleAr: "Synthesis, Characterization, and Biological Activities of N-Arylacetamide with Mercapto Triazole Starting from Nalidixic acid.",
    titleEn:
      "Synthesis, Characterization, and Biological Activities of N-Arylacetamide with Mercapto Triazole Starting from Nalidixic acid.",
    researcherAr: "Aya Jamil Jaber",
    researcherEn: "Aya Jamil Jaber",

    // تم تحويل الرابط إلى preview
    videoUrl:
      "https://drive.google.com/file/d/1J4n55t3WJA3ZIJFIOSNrPHbkpKmMcRbC/preview",
  },

  {
    id: "p3",
    titleAr: "عنوان البوستر 3",
    titleEn: "Poster Title 3",
    researcherAr: "اسم الباحث 3",
    researcherEn: "Researcher 3",

    videoUrl: "https://www.youtube.com/embed/VIDEO_ID_3",
  },

  // أكمل بنفس الطريقة حتى p30
];