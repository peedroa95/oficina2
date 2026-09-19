import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { getWorkshopSettings } from "@/lib/settings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema da Oficina",
  description: "Controle interno de clientes, veículos, ordens de serviço, estoque e financeiro",
};

// Todo o sistema lê dados ao vivo do banco (sem cache estático) — nunca deve ser pré-renderizado.
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getWorkshopSettings();

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="flex min-h-screen flex-col lg:flex-row">
          <Sidebar oficinaNome={settings.nome} />
          <div className="flex min-h-screen flex-1 flex-col">
            <Header />
            <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
