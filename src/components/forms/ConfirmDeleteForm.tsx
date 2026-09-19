"use client";

import { Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";

export function ConfirmDeleteForm({
  action,
  confirmText = "Tem certeza que deseja excluir? Esta ação não pode ser desfeita.",
  label = "Excluir",
  className,
}: {
  action: () => void;
  confirmText?: string;
  label?: string;
  className?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 cursor-pointer",
          className
        )}
      >
        <Trash2 className="h-4 w-4" />
        {label}
      </button>
    </form>
  );
}
