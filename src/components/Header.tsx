import { Search } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export function Header() {
  return (
    <header className="no-print sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
      <form action="/busca" method="get" className="min-w-[200px] flex-1">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            name="q"
            placeholder="Buscar por placa, cliente, telefone, veículo ou nº da OS..."
            className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </form>
      <LinkButton href="/ordens/nova" size="sm">
        <Plus className="h-4 w-4" />
        Nova Ordem de Serviço
      </LinkButton>
    </header>
  );
}
