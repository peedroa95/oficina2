import { CheckCircle2, AlertCircle } from "lucide-react";

export function Banner({ ok, erro }: { ok?: string; erro?: string }) {
  if (!ok && !erro) return null;

  if (erro) {
    return (
      <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{erro}</span>
      </div>
    );
  }

  return (
    <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{ok}</span>
    </div>
  );
}
