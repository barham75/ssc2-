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
    titleAr: "عنوان البوستر 1",
    titleEn: "Poster Title 1",
    researcherAr: "اسم الباحث 1",
    researcherEn: "Researcher 1",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID_1",
  },
  {
    id: "p2",
    titleAr: "عنوان البوستر 2",
    titleEn: "Poster Title 2",
    researcherAr: "اسم الباحث 2",
    researcherEn: "Researcher 2",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID_2",
  },
  {
    id: "p3",
    titleAr: "عنوان البوستر 3",
    titleEn: "Poster Title 3",
    researcherAr: "اسم الباحث 3",
    researcherEn: "Researcher 3",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID_3",
  },
  // أكمل حتى p30
];