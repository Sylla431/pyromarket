import { Thread } from "@/components/thread";
import { PageHeader, Pill } from "@/components/ui";

export default async function NouveauMessagePage({ searchParams }: PageProps<"/messages/nouveau">) {
  const params = await searchParams;
  const a = typeof params.a === "string" ? params.a : "Nouveau message";
  const sujet = typeof params.sujet === "string" ? params.sujet : "";

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader back="/messages" title={a} subtitle="Nouvelle conversation" />
      {sujet && (
        <div className="mb-4 flex justify-center">
          <Pill tone="teal">{sujet}</Pill>
        </div>
      )}
      <Thread initial={[]} />
    </div>
  );
}
