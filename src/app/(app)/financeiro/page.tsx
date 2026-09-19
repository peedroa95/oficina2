import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { Card, CardHeader, StatCard } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { ConfirmDeleteForm } from "@/components/forms/ConfirmDeleteForm";
import { createManualTransaction, deleteManualTransaction } from "@/actions/financial";
import { formatCurrency, formatDate, formatDateInput } from "@/lib/format";
import { CATEGORIAS_SAIDA } from "@/lib/constants";
import { startOfMonth, startOfNextMonth } from "@/lib/dates";
import { Wallet, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { formatOS } from "@/lib/format";

export default async function FinanceiroPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  const { ok, erro } = await searchParams;

  const [entradasMes, saidasMes, transacoes] = await Promise.all([
    prisma.financialTransaction.aggregate({
      where: { tipo: "ENTRADA", data: { gte: startOfMonth(), lt: startOfNextMonth() } },
      _sum: { valor: true },
    }),
    prisma.financialTransaction.aggregate({
      where: { tipo: "SAIDA", data: { gte: startOfMonth(), lt: startOfNextMonth() } },
      _sum: { valor: true },
    }),
    prisma.financialTransaction.findMany({
      orderBy: { data: "desc" },
      take: 60,
    }),
  ]);

  const totalEntradas = Number(entradasMes._sum.valor ?? 0);
  const totalSaidas = Number(saidasMes._sum.valor ?? 0);
  const saldo = totalEntradas - totalSaidas;

  return (
    <div>
      <PageHeader title="Financeiro" description="Entradas, saídas e saldo da oficina" />

      <Banner ok={ok} erro={erro} />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Entradas do mês" value={formatCurrency(totalEntradas)} tone="success" />
        <StatCard label="Saídas do mês" value={formatCurrency(totalSaidas)} tone="danger" />
        <StatCard label="Saldo do mês" value={formatCurrency(saldo)} tone={saldo >= 0 ? "default" : "danger"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Lançamentos recentes" />
            {transacoes.length === 0 ? (
              <EmptyState icon={Wallet} title="Nenhum lançamento registrado" />
            ) : (
              <div className="divide-y divide-slate-100">
                {transacoes.map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                    <div>
                      <p className="font-medium text-slate-900">{t.descricao}</p>
                      <p className="text-slate-500">
                        {formatDate(t.data)} · {t.categoria}
                        {t.serviceOrderId && (
                          <>
                            {" · "}
                            <Link href={`/ordens/${t.serviceOrderId}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                              <LinkIcon className="h-3 w-3" /> {formatOS(t.serviceOrderId)}
                            </Link>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={t.tipo === "ENTRADA" ? "font-medium text-emerald-600" : "font-medium text-red-600"}>
                        {t.tipo === "ENTRADA" ? "+" : "-"} {formatCurrency(t.valor)}
                      </span>
                      {!t.paymentId && (
                        <ConfirmDeleteForm
                          action={deleteManualTransaction.bind(null, t.id)}
                          confirmText="Excluir este lançamento?"
                          label=""
                          className="px-2 py-1"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <Card className="h-fit p-5">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Registrar saída manual</h3>
          <form action={createManualTransaction} className="space-y-3">
            <input type="hidden" name="tipo" value="SAIDA" />
            <Input label="Descrição" name="descricao" required placeholder="Ex: compra de peças" />
            <Input label="Valor (R$)" name="valor" type="number" step="0.01" min="0.01" required />
            <Select label="Categoria" name="categoria" defaultValue={CATEGORIAS_SAIDA[0]}>
              {CATEGORIAS_SAIDA.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Input label="Data" name="data" type="date" defaultValue={formatDateInput(new Date())} />
            <Button type="submit" className="w-full">
              Registrar saída
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
