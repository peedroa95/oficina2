import { PageHeader } from "@/components/ui/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { ServiceForm } from "@/components/forms/ServiceForm";
import { createService } from "@/actions/services";

export default async function NovoServicoPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Novo Serviço" description="Cadastrar um serviço no catálogo" />
      <Banner erro={erro} />
      <Card className="p-5">
        <ServiceForm action={createService} cancelHref="/servicos" />
      </Card>
    </div>
  );
}
