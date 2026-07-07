import type { Metadata } from "next";
import Providers from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "يا إخوتي — مسيرة التمكين النبوي",
  description: "نظام المتابعة الخاص بالحفظ والمراجعة",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="min-h-screen bg-canvas text-text-primary font-body">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
