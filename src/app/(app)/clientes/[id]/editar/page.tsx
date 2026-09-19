import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { CustomerForm } from "@/components/forms/CustomerForm";
import { updateCustomer } from "@/actions/customers";
import { notFound } from "next/navigation";

export default async function EditarClientePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { id } = await params;
  const { erro } = await searchParams;
  const customer = await prisma.customer.findUnique({ where: { id: Number(id) } });
  if (!customer) notFound();

  const action = updateCustomer.bind(null, customer.id);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Editar Cliente" description={customer.nome} />
      <Banner erro={erro} />
      <Card className="p-5">
        <CustomerForm action={action} customer={customer} cancelHref={`/clientes/${customer.id}`} />
      </Card>
    </div>
  );
}
