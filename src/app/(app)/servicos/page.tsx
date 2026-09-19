import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";
import { ConfirmDeleteForm } from "@/components/forms/ConfirmDeleteForm";
import { deleteService } from "@/actions/services";
import { formatCurrency } from "@/lib/format";
import { Plus, Wrench, Pencil } from "lucide-react";

export default async function ServicosPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  const { ok, erro } = await searchParams;
  const servicos = await prisma.service.findMany({ orderBy: { nome: "asc" } });

  return (
    <div>
      <PageHeader
        title="Serviços"
        description="Catálogo de serviços oferecidos pela oficina"
        actions={
          <LinkButton href="/servicos/novo">
            <Plus className="h-4 w-4" /> Novo Serviço
          </LinkButton>
        }
      />

      <Banner ok={ok} erro={erro} />

      <Card>
        {servicos.length === 0 ? (
          <EmptyState icon={Wrench} title="Nenhum serviço cadastrado" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Nome</th>
                  <th className="px-5 py-3">Descrição</th>
                  <th className="px-5 py-3">Valor padrão</th>
                  <th className="px-5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {servicos.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-900">{s.nome}</td>
                    <td className="px-5 py-3 text-slate-500">{s.descricao ?? "-"}</td>
                    <td className="px-5 py-3 text-slate-900">{formatCurrency(s.valorPadrao)}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <LinkButton href={`/servicos/${s.id}/editar`} variant="secondary" size="sm">
                          <Pencil className="h-3.5 w-3.5" />
                        </LinkButton>
                        <ConfirmDeleteForm
                          action={deleteService.bind(null, s.id)}
                          confirmText={`Excluir o serviço "${s.nome}"?`}
                          label=""
                          className="px-2.5"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
