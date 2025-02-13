import type { Metadata } from "next";
import "@/styles/main.scss";

export const metadata: Metadata = {
  title: "My bank app",
  description: "A simple bank app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
