import type { Metadata } from "next";
import Image from "next/image";
import SideMenu from "@/components/SideMenu";

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
          <Image
            src="/jerash.png"
            alt="University Logo"
            width={100}
            height={100}
            priority
          />

          <div style={{ textAlign: "center", maxWidth: 700 }}>
            <h1
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "bold",
                color: "#002b5c",
              }}
            >
              Chemistry Horizons 
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

          <Image
            src="/conference.png"
            alt="Conference Logo"
            width={100}
            height={100}
            priority
            style={{
              filter: "drop-shadow(0px 6px 10px rgba(0,0,0,0.18))",
            }}
          />
        </header>

        {/* ✅ القائمة الآن تحت الهيدر */}
        <SideMenu />

        <main style={{ padding: "40px" }}>{children}</main>
      </body>
    </html>
  );
}
