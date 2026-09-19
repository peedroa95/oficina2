import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { Card, CardHeader, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button, LinkButton } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { AddServiceLineForm } from "@/components/forms/AddServiceLineForm";
import { AddProductLineForm } from "@/components/forms/AddProductLineForm";
import {
  addProductLine,
  addServiceLine,
  removeProductLine,
  removeServiceLine,
  updateServiceOrderInfo,
  updateStatus,
} from "@/actions/serviceOrders";
import { addPayment } from "@/actions/payments";
import { formatCurrency, formatDate, formatDateInput, formatKm, formatOS } from "@/lib/format";
import {
  FORMA_PAGAMENTO_LABELS,
  STATUS_OS_BADGE,
  STATUS_OS_LABELS,
  STATUS_PAGAMENTO_BADGE,
  STATUS_PAGAMENTO_LABELS,
  statusPagamento,
} from "@/lib/constants";
import { EDITABLE_STATUSES } from "@/lib/serviceOrder";
import { Printer, X } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function OrdemDetalhePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  const { id } = await params;
  const { ok, erro } = await searchParams;
  const orderId = Number(id);

  const [order, services, products] = await Promise.all([
    prisma.serviceOrder.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        vehicle: true,
        servicos: { orderBy: { id: "asc" } },
        pecas: { orderBy: { id: "asc" } },
        pagamentos: { orderBy: { data: "desc" } },
      },
    }),
    prisma.service.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } }),
    prisma.product.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } }),
  ]);

  if (!order) notFound();

  const editable = EDITABLE_STATUSES.includes(order.status);
  const valorTotal = Number(order.valorTotal);
  const valorPago = Number(order.valorPago);
  const valorRestante = Math.max(0, valorTotal - valorPago);
  const pagamento = statusPagamento(valorTotal, valorPago);

  const updateInfoAction = updateServiceOrderInfo.bind(null, order.id);
  const updateStatusAction = updateStatus.bind(null, order.id);
  const addServiceAction = addServiceLine.bind(null, order.id);
  const addProductAction = addProductLine.bind(null, order.id);
  const addPaymentAction = addPayment.bind(null, order.id);

  return (
    <div>
      <PageHeader
        title={formatOS(order.id)}
        description={`${order.customer.nome} · ${order.vehicle.placa} · ${formatDate(order.data)}`}
        actions={
          <>
            <Badge className={STATUS_OS_BADGE[order.status]}>{STATUS_OS_LABELS[order.status]}</Badge>
            <LinkButton href={`/ordens/${order.id}/imprimir`} variant="secondary">
              <Printer className="h-4 w-4" /> Imprimir Nota
            </LinkButton>
          </>
        }
      />

      <Banner ok={ok} erro={erro} />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Valor total" value={formatCurrency(order.valorTotal)} />
        <StatCard label="Valor pago" value={formatCurrency(order.valorPago)} tone="success" />
        <StatCard
          label="Valor restante"
          value={formatCurrency(valorRestante)}
          tone={valorRestante > 0 ? "danger" : "default"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Serviços" />
            {order.servicos.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                      <th className="px-5 py-2.5">Descrição</th>
                      <th className="px-5 py-2.5">Qtd</th>
                      <th className="px-5 py-2.5">Valor</th>
                      <th className="px-5 py-2.5">Subtotal</th>
                      {editable && <th className="px-5 py-2.5" />}
                    </tr>
                  </thead>
                  <tbody>
                    {order.servicos.map((s) => (
                      <tr key={s.id} className="border-b border-slate-100 last:border-0">
                        <td className="px-5 py-2.5">{s.descricao}</td>
                        <td className="px-5 py-2.5">{Number(s.quantidade)}</td>
                        <td className="px-5 py-2.5">{formatCurrency(s.valorUnitario)}</td>
                        <td className="px-5 py-2.5 font-medium">{formatCurrency(s.subtotal)}</td>
                        {editable && (
                          <td className="px-5 py-2.5 text-right">
                            <form action={removeServiceLine.bind(null, order.id, s.id)}>
                              <button type="submit" className="text-slate-400 hover:text-red-600" aria-label="Remover">
                                <X className="h-4 w-4" />
                              </button>
                            </form>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {editable && (
              <div className="border-t border-slate-100 p-5">
                <AddServiceLineForm
                  action={addServiceAction}
                  services={services.map((s) => ({ id: s.id, nome: s.nome, valorPadrao: Number(s.valorPadrao) }))}
                />
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Peças utilizadas" />
            {order.pecas.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                      <th className="px-5 py-2.5">Descrição</th>
                      <th className="px-5 py-2.5">Qtd</th>
                      <th className="px-5 py-2.5">Valor</th>
                      <th className="px-5 py-2.5">Subtotal</th>
                      {editable && <th className="px-5 py-2.5" />}
                    </tr>
                  </thead>
                  <tbody>
                    {order.pecas.map((p) => (
                      <tr key={p.id} className="border-b border-slate-100 last:border-0">
                        <td className="px-5 py-2.5">{p.descricao}</td>
                        <td className="px-5 py-2.5">{Number(p.quantidade)}</td>
                        <td className="px-5 py-2.5">{formatCurrency(p.valorUnitario)}</td>
                        <td className="px-5 py-2.5 font-medium">{formatCurrency(p.subtotal)}</td>
                        {editable && (
                          <td className="px-5 py-2.5 text-right">
                            <form action={removeProductLine.bind(null, order.id, p.id)}>
                              <button type="submit" className="text-slate-400 hover:text-red-600" aria-label="Remover">
                                <X className="h-4 w-4" />
                              </button>
                            </form>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {editable && (
              <div className="border-t border-slate-100 p-5">
                <AddProductLineForm
                  action={addProductAction}
                  products={products.map((p) => ({
                    id: p.id,
                    nome: p.nome,
                    precoVenda: Number(p.precoVenda),
                    quantidade: p.quantidade,
                  }))}
                />
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Detalhes da ordem" />
            <form action={updateInfoAction} className="space-y-4 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Quilometragem"
                  name="quilometragem"
                  type="number"
                  defaultValue={order.quilometragem ?? ""}
                  disabled={!editable}
                />
                <Select label="Forma de pagamento" name="formaPagamento" defaultValue={order.formaPagamento} disabled={!editable}>
                  {Object.entries(FORMA_PAGAMENTO_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>
              <Textarea
                label="Problema informado pelo cliente"
                name="problemaInformado"
                defaultValue={order.problemaInformado ?? ""}
                disabled={!editable}
              />
              <Textarea label="Observações" name="observacoes" defaultValue={order.observacoes ?? ""} disabled={!editable} />
              <Input
                label="Desconto (R$)"
                name="desconto"
                type="number"
                step="0.01"
                min="0"
                defaultValue={Number(order.desconto)}
                disabled={!editable}
              />
              {editable && (
                <div className="flex justify-end">
                  <Button type="submit" variant="secondary">
                    Salvar detalhes
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Status da ordem</h3>
            <form action={updateStatusAction} className="space-y-3">
              <Select name="status" defaultValue={order.status}>
                {Object.entries(STATUS_OS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
              <Button type="submit" className="w-full" variant="secondary">
                Atualizar status
              </Button>
            </form>
            {order.estoqueBaixado && (
              <p className="mt-3 text-xs text-slate-500">
                O estoque das peças desta OS já foi baixado em {formatDate(order.finalizadaEm)}.
              </p>
            )}
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Pagamento</h3>
              <Badge className={STATUS_PAGAMENTO_BADGE[pagamento]}>{STATUS_PAGAMENTO_LABELS[pagamento]}</Badge>
            </div>
            <dl className="mb-4 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Total</dt>
                <dd className="font-medium text-slate-900">{formatCurrency(valorTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Pago</dt>
                <dd className="font-medium text-emerald-600">{formatCurrency(valorPago)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Restante</dt>
                <dd className="font-medium text-red-600">{formatCurrency(valorRestante)}</dd>
              </div>
            </dl>

            {valorRestante > 0 && (
              <form action={addPaymentAction} className="space-y-3 border-t border-slate-100 pt-4">
                <Input
                  label="Valor recebido (R$)"
                  name="valor"
                  type="number"
                  step="0.01"
                  min="0.01"
                  defaultValue={valorRestante}
                />
                <Select label="Forma de pagamento" name="formaPagamento" defaultValue={order.formaPagamento}>
                  {Object.entries(FORMA_PAGAMENTO_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
                <Input label="Data" name="data" type="date" defaultValue={formatDateInput(new Date())} />
                <Button type="submit" className="w-full">
                  Registrar pagamento
                </Button>
              </form>
            )}

            {order.pagamentos.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                {order.pagamentos.map((p) => (
                  <div key={p.id} className="flex justify-between text-sm">
                    <span className="text-slate-500">
                      {formatDate(p.data)} · {FORMA_PAGAMENTO_LABELS[p.formaPagamento]}
                    </span>
                    <span className="font-medium text-slate-900">{formatCurrency(p.valor)}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5 text-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Cliente e veículo</h3>
            <p>
              <Link href={`/clientes/${order.customer.id}`} className="font-medium text-blue-600 hover:underline">
                {order.customer.nome}
              </Link>
            </p>
            <p className="text-slate-500">{order.customer.telefone}</p>
            <div className="mt-3 border-t border-slate-100 pt-3">
              <Link href={`/veiculos/${order.vehicle.id}`} className="font-mono font-medium text-blue-600 hover:underline">
                {order.vehicle.placa}
              </Link>
              <p className="text-slate-500">
                {order.vehicle.marca} {order.vehicle.modelo}
              </p>
              {order.quilometragem && <p className="text-xs text-slate-400">KM na OS: {formatKm(order.quilometragem)}</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
