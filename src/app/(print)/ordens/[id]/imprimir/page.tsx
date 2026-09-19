import { prisma } from "@/lib/prisma";
import { getWorkshopSettings } from "@/lib/settings";
import { formatCurrency, formatDate, formatKm, formatOS } from "@/lib/format";
import { FORMA_PAGAMENTO_LABELS } from "@/lib/constants";
import { PrintButton } from "@/components/PrintButton";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ImprimirOrdemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = Number(id);

  const [order, settings] = await Promise.all([
    prisma.serviceOrder.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        vehicle: true,
        servicos: { orderBy: { id: "asc" } },
        pecas: { orderBy: { id: "asc" } },
      },
    }),
    getWorkshopSettings(),
  ]);

  if (!order) notFound();

  const subtotal = Number(order.valorServicos) + Number(order.valorPecas);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 print-area">
      <div className="no-print mb-6 flex items-center justify-between">
        <Link href={`/ordens/${order.id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Voltar para a ordem
        </Link>
        <PrintButton />
      </div>

      <div className="mb-6 flex items-start justify-between border-b-2 border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{settings.nome}</h1>
          {settings.cpfCnpj && <p className="text-sm text-slate-600">{settings.cpfCnpj}</p>}
          {settings.telefone && <p className="text-sm text-slate-600">{settings.telefone}</p>}
          {settings.endereco && (
            <p className="text-sm text-slate-600">
              {settings.endereco}
              {settings.cidade ? `, ${settings.cidade}` : ""}
              {settings.estado ? `/${settings.estado}` : ""}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-slate-500">Nota / Ordem de Serviço</p>
          <p className="text-2xl font-bold text-slate-900">{formatOS(order.id)}</p>
          <p className="text-sm text-slate-600">{formatDate(order.data)}</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-6">
        <div>
          <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Cliente</h2>
          <p className="font-medium text-slate-900">{order.customer.nome}</p>
          {order.customer.cpfCnpj && <p className="text-sm text-slate-600">{order.customer.cpfCnpj}</p>}
          {order.customer.telefone && <p className="text-sm text-slate-600">{order.customer.telefone}</p>}
        </div>
        <div>
          <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Veículo</h2>
          <p className="font-medium text-slate-900">
            {order.vehicle.marca} {order.vehicle.modelo}
          </p>
          <p className="text-sm text-slate-600">
            Placa: {order.vehicle.placa} {order.vehicle.ano ? `· Ano: ${order.vehicle.ano}` : ""}
          </p>
          {order.quilometragem !== null && <p className="text-sm text-slate-600">KM: {formatKm(order.quilometragem)}</p>}
        </div>
      </div>

      {order.problemaInformado && (
        <div className="mb-6">
          <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Problema informado</h2>
          <p className="text-sm text-slate-800">{order.problemaInformado}</p>
        </div>
      )}

      <div className="mb-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Serviços realizados</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-300 text-left">
              <th className="py-1.5">Descrição</th>
              <th className="py-1.5 text-right">Qtd</th>
              <th className="py-1.5 text-right">Valor</th>
              <th className="py-1.5 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.servicos.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-2 text-slate-400">
                  Nenhum serviço registrado
                </td>
              </tr>
            ) : (
              order.servicos.map((s) => (
                <tr key={s.id} className="border-b border-slate-100">
                  <td className="py-1.5">{s.descricao}</td>
                  <td className="py-1.5 text-right">{Number(s.quantidade)}</td>
                  <td className="py-1.5 text-right">{formatCurrency(s.valorUnitario)}</td>
                  <td className="py-1.5 text-right">{formatCurrency(s.subtotal)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Peças utilizadas</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-300 text-left">
              <th className="py-1.5">Descrição</th>
              <th className="py-1.5 text-right">Qtd</th>
              <th className="py-1.5 text-right">Valor</th>
              <th className="py-1.5 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.pecas.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-2 text-slate-400">
                  Nenhuma peça registrada
                </td>
              </tr>
            ) : (
              order.pecas.map((p) => (
                <tr key={p.id} className="border-b border-slate-100">
                  <td className="py-1.5">{p.descricao}</td>
                  <td className="py-1.5 text-right">{Number(p.quantidade)}</td>
                  <td className="py-1.5 text-right">{formatCurrency(p.valorUnitario)}</td>
                  <td className="py-1.5 text-right">{formatCurrency(p.subtotal)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mb-6 flex justify-end">
        <div className="w-56 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Desconto</span>
            <span>{formatCurrency(order.desconto)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-300 pt-1 text-base font-bold text-slate-900">
            <span>TOTAL</span>
            <span>{formatCurrency(order.valorTotal)}</span>
          </div>
        </div>
      </div>

      <div className="mb-10 flex justify-between text-sm">
        <p>
          <span className="text-slate-500">Forma de pagamento:</span> {FORMA_PAGAMENTO_LABELS[order.formaPagamento]}
        </p>
        <p>
          <span className="text-slate-500">Data:</span> {formatDate(order.data)}
        </p>
      </div>

      {order.observacoes && (
        <div className="mb-10">
          <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Observações</h2>
          <p className="text-sm text-slate-800">{order.observacoes}</p>
        </div>
      )}

      <div className="mt-16 grid grid-cols-2 gap-10 text-center text-sm">
        <div>
          <div className="border-t border-slate-400 pt-2">Assinatura do cliente</div>
        </div>
        <div>
          <div className="border-t border-slate-400 pt-2">Responsável pela oficina</div>
        </div>
      </div>
    </div>
  );
}
