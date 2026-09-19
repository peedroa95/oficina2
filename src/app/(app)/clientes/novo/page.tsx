import { PageHeader } from "@/components/ui/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { CustomerForm } from "@/components/forms/CustomerForm";
import { createCustomer } from "@/actions/customers";

export default async function NovoClientePage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Novo Cliente" description="Cadastrar um novo cliente da oficina" />
      <Banner erro={erro} />
      <Card className="p-5">
        <CustomerForm action={createCustomer} cancelHref="/clientes" />
      </Card>
    </div>
  );
}
