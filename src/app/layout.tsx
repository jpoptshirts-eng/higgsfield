import type { Metadata } from "next";
import { calSans, gillSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jacinto De Matos — Senior Product Designer",
  description:
    "Portfolio of Jacinto De Matos, a Senior Product Designer specialising in complex digital products across e-commerce, fintech and ed-tech.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${calSans.variable} ${gillSans.variable} h-full`}
    >
      <body className="min-h-full bg-black font-body text-white antialiased">
        {children}
      </body>
    </html>
  );
}
