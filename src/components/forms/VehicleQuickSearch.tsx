"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Car } from "lucide-react";

interface VehicleResult {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  ano: number | null;
  customer: { id: number; nome: string };
}

export function VehicleQuickSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<VehicleResult[]>([]);
  const [loading, setLoading] = useState(false);

  const queryTooShort = query.trim().length < 2;

  useEffect(() => {
    if (queryTooShort) return;

    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search/veiculos?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          if (!cancelled) setResults(data);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, queryTooShort]);

  const visibleResults = queryTooShort ? [] : results;

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite a placa, cliente ou modelo do veículo..."
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 pl-10 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {loading && <p className="mt-2 text-sm text-slate-400">Buscando...</p>}

      {visibleResults.length > 0 && (
        <div className="mt-2 divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200">
          {visibleResults.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => router.push(`/ordens/nova?veiculoId=${v.id}`)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50"
            >
              <Car className="h-4 w-4 shrink-0 text-slate-400" />
              <div>
                <p className="font-medium text-slate-900">
                  {v.placa} · {v.marca} {v.modelo} {v.ano ? `(${v.ano})` : ""}
                </p>
                <p className="text-slate-500">{v.customer.nome}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && !queryTooShort && visibleResults.length === 0 && (
        <p className="mt-2 text-sm text-slate-500">Nenhum veículo encontrado para &quot;{query}&quot;.</p>
      )}
    </div>
  );
}
