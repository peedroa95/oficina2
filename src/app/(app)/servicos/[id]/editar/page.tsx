import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { ServiceForm } from "@/components/forms/ServiceForm";
import { updateService } from "@/actions/services";
import { notFound } from "next/navigation";

export default async function EditarServicoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { id } = await params;
  const { erro } = await searchParams;
  const service = await prisma.service.findUnique({ where: { id: Number(id) } });
  if (!service) notFound();

  const action = updateService.bind(null, service.id);

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Editar Serviço" description={service.nome} />
      <Banner erro={erro} />
      <Card className="p-5">
        <ServiceForm action={action} service={service} cancelHref="/servicos" />
      </Card>
    </div>
  );
}
