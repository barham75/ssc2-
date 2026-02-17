import type { Metadata } from "next";
import Image from "next/image";
import SideMenu from "@/components/SideMenu"; // ✅ أضفناه

export const metadata: Metadata = {
  title: "Chemistry Horizons ",
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
        {/* ✅ القائمة الجانبية */}
        <SideMenu />

        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 60px",
            background: "#ffffff",
            borderBottom: "5px solid #002b5c",
          }}
        >
          {/* شعار الجامعة */}
          <Image
            src="/jerash.png"
            alt="University Logo"
            width={150}
            height={150}
            priority
          />

          {/* عنوان المؤتمر */}
          <div style={{ textAlign: "center", maxWidth: 700 }}>
            <h1
              style={{
                margin: 0,
                fontSize: "30px",
                fontWeight: "bold",
                color: "#002b5c",
              }}
            >
              Chemistry Horizons 2026
            </h1>

            <p
              style={{
                margin: "6px 0 0 0",
                fontSize: "18px",
                color: "#444",
                fontWeight: 500,
              }}
            >
              Innovation for a Sustainable Future
            </p>
          </div>

          {/* شعار المؤتمر */}
          <Image
            src="/conference.png"
            alt="Conference Logo"
            width={200}
            height={200}
            priority
            style={{
              filter: "drop-shadow(0px 6px 10px rgba(0,0,0,0.18))",
            }}
          />
        </header>

        <main style={{ padding: "40px" }}>{children}</main>
      </body>
    </html>
  );
}
