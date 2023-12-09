import "./globals.css";
import "./styles/base.css";
import HeaderComponent from "@/components/HeaderComponent";
import FooterComponent from "@/components/FooterComponent";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
config.autoAddCss = false;

export const metadata = {
  title: "Social App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <HeaderComponent></HeaderComponent>

        <main className="min-h-screen bg-background flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
export const dynamic = "force-dynamic";
