import { PageHeader } from "@/components/ui";
import { Alertes } from "./alertes";

export default function AlertesPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader back="/compte" title="Mes alertes" subtitle="Une notification dès qu'une annonce correspond." />
      <Alertes />
    </div>
  );
}
