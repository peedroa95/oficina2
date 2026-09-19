import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Nota de Serviço",
};

export const dynamic = "force-dynamic";

export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-slate-900 antialiased">{children}</body>
    </html>
  );
}
