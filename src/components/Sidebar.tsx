"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Car,
  ClipboardList,
  Wrench,
  Boxes,
  Wallet,
  Settings,
  Menu,
  X,
  Hammer,
} from "lucide-react";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/veiculos", label: "Veículos", icon: Car },
  { href: "/ordens", label: "Ordens de Serviço", icon: ClipboardList },
  { href: "/servicos", label: "Serviços", icon: Wrench },
  { href: "/estoque", label: "Estoque", icon: Boxes },
  { href: "/financeiro", label: "Financeiro", icon: Wallet },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar({ oficinaNome }: { oficinaNome: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
            )}
          >
            <Icon className="h-4.5 w-4.5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <div className="no-print flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2 text-white">
          <Hammer className="h-5 w-5 text-blue-400" />
          <span className="font-semibold">{oficinaNome}</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-md p-2 text-slate-300 hover:bg-slate-800"
          aria-label="Abrir menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <aside
        className={cn(
          "no-print z-40 w-64 shrink-0 flex-col bg-slate-900 lg:sticky lg:top-0 lg:flex lg:h-screen",
          open ? "fixed inset-0 flex" : "hidden"
        )}
      >
        <div className="hidden items-center gap-2 border-b border-slate-800 px-5 py-5 lg:flex">
          <Hammer className="h-5 w-5 text-blue-400" />
          <span className="truncate font-semibold text-white">{oficinaNome}</span>
        </div>
        {nav}
      </aside>
    </>
  );
}
