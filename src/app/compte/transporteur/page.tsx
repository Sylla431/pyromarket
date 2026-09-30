import { PageHeader } from "@/components/ui";
import { TransporteurForm } from "./transporteur-form";

export default function ProfilTransporteurPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader back="/compte" title="Ma capacité de transport" subtitle="Les vendeurs vous trouvent selon votre zone." />
      <TransporteurForm />
    </div>
  );
}
