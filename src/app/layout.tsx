import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Construblock",
  description:
    "Validación de diseño de mampostería confinada en Guatemala según la metodología simplificada AGIES DSE 4.1.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
