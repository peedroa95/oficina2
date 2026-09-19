import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding banco de dados...");

  await prisma.payment.deleteMany();
  await prisma.financialTransaction.deleteMany();
  await prisma.serviceOrderService.deleteMany();
  await prisma.serviceOrderProduct.deleteMany();
  await prisma.serviceOrder.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.service.deleteMany();
  await prisma.product.deleteMany();
  await prisma.workshopSettings.deleteMany();

  await prisma.workshopSettings.create({
    data: {
      nome: "Oficina do Zé",
      cpfCnpj: "12.345.678/0001-90",
      telefone: "(11) 3456-7890",
      whatsapp: "(11) 91234-5678",
      endereco: "Rua das Oficinas, 123 - Vila Industrial",
      cidade: "São Paulo",
      estado: "SP",
    },
  });

  const clientes = await Promise.all(
    [
      { nome: "João da Silva", cpfCnpj: "111.111.111-11", telefone: "(11) 98888-1111", whatsapp: "(11) 98888-1111", endereco: "Rua A, 100" },
      { nome: "Maria Oliveira", cpfCnpj: "222.222.222-22", telefone: "(11) 98888-2222", whatsapp: "(11) 98888-2222", endereco: "Rua B, 200" },
      { nome: "Carlos Pereira", cpfCnpj: "333.333.333-33", telefone: "(11) 98888-3333", whatsapp: "(11) 98888-3333", endereco: "Rua C, 300" },
      { nome: "Ana Souza", cpfCnpj: "444.444.444-44", telefone: "(11) 98888-4444", whatsapp: "(11) 98888-4444", endereco: "Rua D, 400" },
      { nome: "Pedro Santos", cpfCnpj: "555.555.555-55", telefone: "(11) 98888-5555", whatsapp: "(11) 98888-5555", endereco: "Rua E, 500" },
    ].map((c) => prisma.customer.create({ data: c }))
  );

  const veiculosData = [
    { customerId: clientes[0].id, placa: "ABC1D23", marca: "Chevrolet", modelo: "Onix", ano: 2020, cor: "Prata", quilometragem: 55200 },
    { customerId: clientes[1].id, placa: "DEF4G56", marca: "Volkswagen", modelo: "Gol", ano: 2018, cor: "Branco", quilometragem: 72300 },
    { customerId: clientes[2].id, placa: "GHI7J89", marca: "Fiat", modelo: "Strada", ano: 2021, cor: "Vermelho", quilometragem: 31500 },
    { customerId: clientes[3].id, placa: "JKL1M23", marca: "Hyundai", modelo: "HB20", ano: 2019, cor: "Preto", quilometragem: 48900 },
    { customerId: clientes[4].id, placa: "MNO4P56", marca: "Toyota", modelo: "Corolla", ano: 2022, cor: "Cinza", quilometragem: 18200 },
  ];
  const veiculos = await Promise.all(veiculosData.map((v) => prisma.vehicle.create({ data: v })));

  const servicosData = [
    { nome: "Troca de óleo", descricao: "Troca de óleo do motor e filtro", valorPadrao: 80 },
    { nome: "Alinhamento", descricao: "Alinhamento das rodas dianteiras", valorPadrao: 70 },
    { nome: "Balanceamento", descricao: "Balanceamento das 4 rodas", valorPadrao: 60 },
    { nome: "Troca de pastilhas", descricao: "Troca de pastilhas de freio", valorPadrao: 120 },
    { nome: "Troca de correia", descricao: "Troca de correia dentada", valorPadrao: 150 },
    { nome: "Suspensão", descricao: "Revisão e reparo da suspensão", valorPadrao: 180 },
    { nome: "Freios", descricao: "Revisão geral do sistema de freios", valorPadrao: 110 },
    { nome: "Troca de embreagem", descricao: "Troca do kit de embreagem", valorPadrao: 350 },
    { nome: "Diagnóstico", descricao: "Diagnóstico eletrônico do veículo", valorPadrao: 50 },
    { nome: "Revisão geral", descricao: "Revisão completa preventiva", valorPadrao: 200 },
  ];
  const servicos = await Promise.all(servicosData.map((s) => prisma.service.create({ data: s })));

  const produtosData = [
    { nome: "Óleo 5W30", codigo: "OL-5W30", marca: "Mobil", quantidade: 40, estoqueMinimo: 10, precoCusto: 22, precoVenda: 35 },
    { nome: "Filtro de óleo", codigo: "FO-100", marca: "Tecfil", quantidade: 8, estoqueMinimo: 10, precoCusto: 15, precoVenda: 25 },
    { nome: "Pastilha de freio (jogo)", codigo: "PF-200", marca: "Bosch", quantidade: 3, estoqueMinimo: 5, precoCusto: 60, precoVenda: 90 },
    { nome: "Correia dentada", codigo: "CD-300", marca: "Gates", quantidade: 6, estoqueMinimo: 3, precoCusto: 55, precoVenda: 80 },
    { nome: "Filtro de ar", codigo: "FA-400", marca: "Tecfil", quantidade: 15, estoqueMinimo: 5, precoCusto: 18, precoVenda: 30 },
    { nome: "Amortecedor dianteiro", codigo: "AM-500", marca: "Cofap", quantidade: 4, estoqueMinimo: 2, precoCusto: 120, precoVenda: 190 },
    { nome: "Disco de freio", codigo: "DF-600", marca: "Fremax", quantidade: 5, estoqueMinimo: 2, precoCusto: 80, precoVenda: 130 },
    { nome: "Vela de ignição", codigo: "VI-700", marca: "NGK", quantidade: 20, estoqueMinimo: 8, precoCusto: 12, precoVenda: 22 },
    { nome: "Kit embreagem", codigo: "KE-800", marca: "Luk", quantidade: 3, estoqueMinimo: 1, precoCusto: 210, precoVenda: 320 },
    { nome: "Bateria 60Ah", codigo: "BT-900", marca: "Moura", quantidade: 5, estoqueMinimo: 2, precoCusto: 280, precoVenda: 420 },
  ];
  const produtos = await Promise.all(produtosData.map((p) => prisma.product.create({ data: p })));

  const hoje = new Date();
  const diasAtras = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

  async function criarOrdemFinalizada(opts: {
    customerId: number;
    vehicleId: number;
    quilometragem: number;
    data: Date;
    servicosLinhas: { service: (typeof servicos)[number]; quantidade: number }[];
    pecasLinhas: { product: (typeof produtos)[number]; quantidade: number }[];
    desconto: number;
    formaPagamento: "DINHEIRO" | "PIX" | "DEBITO" | "CREDITO" | "TRANSFERENCIA" | "OUTRO";
    status: "FINALIZADA" | "ENTREGUE";
    pago: boolean;
  }) {
    const valorServicos = opts.servicosLinhas.reduce((acc, l) => acc + l.quantidade * Number(l.service.valorPadrao), 0);
    const valorPecas = opts.pecasLinhas.reduce((acc, l) => acc + l.quantidade * Number(l.product.precoVenda), 0);
    const valorTotal = Math.max(0, valorServicos + valorPecas - opts.desconto);

    const order = await prisma.serviceOrder.create({
      data: {
        customerId: opts.customerId,
        vehicleId: opts.vehicleId,
        data: opts.data,
        quilometragem: opts.quilometragem,
        problemaInformado: "Cliente relatou ruído e solicitou revisão.",
        formaPagamento: opts.formaPagamento,
        desconto: opts.desconto,
        valorServicos,
        valorPecas,
        valorTotal,
        valorPago: opts.pago ? valorTotal : 0,
        status: opts.status,
        estoqueBaixado: true,
        finalizadaEm: opts.data,
      },
    });

    for (const l of opts.servicosLinhas) {
      await prisma.serviceOrderService.create({
        data: {
          serviceOrderId: order.id,
          serviceId: l.service.id,
          descricao: l.service.nome,
          quantidade: l.quantidade,
          valorUnitario: l.service.valorPadrao,
          subtotal: l.quantidade * Number(l.service.valorPadrao),
        },
      });
    }

    for (const l of opts.pecasLinhas) {
      await prisma.serviceOrderProduct.create({
        data: {
          serviceOrderId: order.id,
          productId: l.product.id,
          descricao: l.product.nome,
          quantidade: l.quantidade,
          valorUnitario: l.product.precoVenda,
          subtotal: l.quantidade * Number(l.product.precoVenda),
        },
      });
      await prisma.product.update({
        where: { id: l.product.id },
        data: { quantidade: { decrement: l.quantidade } },
      });
      await prisma.stockMovement.create({
        data: {
          productId: l.product.id,
          tipo: "SAIDA",
          quantidade: l.quantidade,
          motivo: `Uso na OS ${String(order.id).padStart(4, "0")}`,
        },
      });
    }

    if (opts.pago) {
      const payment = await prisma.payment.create({
        data: { serviceOrderId: order.id, valor: valorTotal, formaPagamento: opts.formaPagamento, data: opts.data },
      });
      await prisma.financialTransaction.create({
        data: {
          tipo: "ENTRADA",
          descricao: `Pagamento OS ${String(order.id).padStart(4, "0")} - cliente`,
          valor: valorTotal,
          data: opts.data,
          categoria: "Ordem de Serviço",
          serviceOrderId: order.id,
          paymentId: payment.id,
        },
      });
    }

    return order;
  }

  // OS 1 - finalizada e paga (exemplo do briefing)
  await criarOrdemFinalizada({
    customerId: clientes[0].id,
    vehicleId: veiculos[0].id,
    quilometragem: 55200,
    data: diasAtras(3),
    servicosLinhas: [
      { service: servicos[0], quantidade: 1 },
      { service: servicos[1], quantidade: 1 },
    ],
    pecasLinhas: [
      { product: produtos[0], quantidade: 4 },
      { product: produtos[1], quantidade: 1 },
    ],
    desconto: 15,
    formaPagamento: "PIX",
    status: "FINALIZADA",
    pago: true,
  });

  // OS 2 - aberta, sem pagamento
  const os2 = await prisma.serviceOrder.create({
    data: {
      customerId: clientes[1].id,
      vehicleId: veiculos[1].id,
      quilometragem: 72300,
      problemaInformado: "Barulho ao frear.",
      formaPagamento: "PIX",
      status: "ABERTA",
      valorServicos: Number(servicos[2].valorPadrao),
      valorPecas: 0,
      valorTotal: Number(servicos[2].valorPadrao),
    },
  });
  await prisma.serviceOrderService.create({
    data: {
      serviceOrderId: os2.id,
      serviceId: servicos[2].id,
      descricao: servicos[2].nome,
      quantidade: 1,
      valorUnitario: servicos[2].valorPadrao,
      subtotal: servicos[2].valorPadrao,
    },
  });

  // OS 3 - em andamento, pagamento parcial
  const valorServicosOs3 = Number(servicos[3].valorPadrao);
  const valorPecasOs3 = Number(produtos[2].precoVenda);
  const totalOs3 = valorServicosOs3 + valorPecasOs3;
  const os3 = await prisma.serviceOrder.create({
    data: {
      customerId: clientes[2].id,
      vehicleId: veiculos[2].id,
      quilometragem: 31500,
      problemaInformado: "Pedal de freio afundando.",
      formaPagamento: "CREDITO",
      status: "EM_ANDAMENTO",
      valorServicos: valorServicosOs3,
      valorPecas: valorPecasOs3,
      valorTotal: totalOs3,
      valorPago: 100,
    },
  });
  await prisma.serviceOrderService.create({
    data: {
      serviceOrderId: os3.id,
      serviceId: servicos[3].id,
      descricao: servicos[3].nome,
      quantidade: 1,
      valorUnitario: servicos[3].valorPadrao,
      subtotal: servicos[3].valorPadrao,
    },
  });
  await prisma.serviceOrderProduct.create({
    data: {
      serviceOrderId: os3.id,
      productId: produtos[2].id,
      descricao: produtos[2].nome,
      quantidade: 1,
      valorUnitario: produtos[2].precoVenda,
      subtotal: produtos[2].precoVenda,
    },
  });
  const paymentOs3 = await prisma.payment.create({
    data: { serviceOrderId: os3.id, valor: 100, formaPagamento: "CREDITO", data: diasAtras(1) },
  });
  await prisma.financialTransaction.create({
    data: {
      tipo: "ENTRADA",
      descricao: `Pagamento OS ${String(os3.id).padStart(4, "0")} - cliente (parcial)`,
      valor: 100,
      data: diasAtras(1),
      categoria: "Ordem de Serviço",
      serviceOrderId: os3.id,
      paymentId: paymentOs3.id,
    },
  });

  // OS 4 - finalizada hoje, paga (garante números no dashboard "hoje")
  await criarOrdemFinalizada({
    customerId: clientes[3].id,
    vehicleId: veiculos[3].id,
    quilometragem: 48900,
    data: hoje,
    servicosLinhas: [{ service: servicos[8], quantidade: 1 }],
    pecasLinhas: [],
    desconto: 0,
    formaPagamento: "DINHEIRO",
    status: "FINALIZADA",
    pago: true,
  });

  // OS 5 - entregue, paga
  await criarOrdemFinalizada({
    customerId: clientes[4].id,
    vehicleId: veiculos[4].id,
    quilometragem: 18200,
    data: diasAtras(7),
    servicosLinhas: [
      { service: servicos[9], quantidade: 1 },
      { service: servicos[4], quantidade: 1 },
    ],
    pecasLinhas: [{ product: produtos[3], quantidade: 1 }],
    desconto: 30,
    formaPagamento: "CREDITO",
    status: "ENTREGUE",
    pago: true,
  });

  // Saída financeira manual de exemplo
  await prisma.financialTransaction.create({
    data: {
      tipo: "SAIDA",
      descricao: "Compra de peças no fornecedor",
      valor: 450,
      data: diasAtras(2),
      categoria: "Compra de peças",
    },
  });
  await prisma.financialTransaction.create({
    data: {
      tipo: "SAIDA",
      descricao: "Conta de energia elétrica",
      valor: 320,
      data: diasAtras(5),
      categoria: "Energia",
    },
  });

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
