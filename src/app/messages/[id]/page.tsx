import { notFound } from "next/navigation";
import { Thread } from "@/components/thread";
import { PageHeader, Pill } from "@/components/ui";
import { mockConversations } from "@/lib/mock-data";

export default async function ConversationPage({ params }: PageProps<"/messages/[id]">) {
  const { id } = await params;
  const c = mockConversations.find((x) => x.id === id);
  if (!c) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader back="/messages" title={c.interlocuteur} subtitle={c.role} />
      <div className="mb-4 flex justify-center">
        <Pill tone="teal">{c.sujet}</Pill>
      </div>
      <Thread initial={c.messages} />
    </div>
  );
}
