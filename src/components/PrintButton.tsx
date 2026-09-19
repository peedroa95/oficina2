"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer"
    >
      <Printer className="h-4 w-4" />
      Imprimir / Salvar PDF
    </button>
  );
}
