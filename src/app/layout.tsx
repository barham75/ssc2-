import type { Metadata } from "next";
import Image from "next/image";
import SideMenu from "@/components/SideMenu";

export const metadata: Metadata = {
  title: "Chemistry Horizons",
  description: "Chemistry Horizons: Innovation for a Sustainable Future",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, Arial",
          background: "#f4f6f9",
        }}
      >
        {/* ================= HEADER ================= */}
        <header
          style={{
            background: "#ffffff",
            borderBottom: "4px solid #002b5c",
            padding: "20px",
            textAlign: "center",
          }}
        >
          {/* الشعارين متجاورين */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "25px",
              marginBottom: "12px",
            }}
          >
            {/* شعار الجامعة (يمين) */}
            <Image
              src="/jerash.png"
              alt="University Logo"
              width={100}
              height={100}
              priority
            />

            {/* شعار المؤتمر */}
            <Image
              src="/conference.png"
              alt="Conference Logo"
              width={100}
              height={100}
              priority
              style={{
                filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.15))",
              }}
            />
          </div>

          {/* عنوان المؤتمر أسفل الشعارين */}
          <h1
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: "bold",
              color: "#002b5c",
            }}
          >
            Chemistry Horizons 2026
          </h1>

          <p
            style={{
              margin: "6px 0 0 0",
              fontSize: "14px",
              color: "#555",
              fontWeight: 500,
            }}
          >
            Innovation for a Sustainable Future
          </p>
        </header>

        {/* القائمة تحت الهيدر */}
        <SideMenu />

        <main style={{ padding: "40px" }}>{children}</main>
      </body>
    </html>
  );
}
