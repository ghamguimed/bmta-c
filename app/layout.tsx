import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Simulateur logistique export",
  description: "Simulateur logistique export pour BMTA&C"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
