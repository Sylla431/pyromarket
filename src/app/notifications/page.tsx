import Link from "next/link";
import { ButtonLink } from "@/components/button";
import { IconBell, IconChat, IconShield, IconTruck } from "@/components/icons";
import { PageHeader } from "@/components/ui";
import { mockNotifications, type NotificationMock } from "@/lib/mock-data";

const ICONES: Record<NotificationMock["type"], typeof IconBell> = {
  alerte: IconBell,
  message: IconChat,
  transport: IconTruck,
  moderation: IconShield,
};

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Notifications"
        action={
          <ButtonLink href="/compte/alertes" variant="ghost" size="sm">
            Mes alertes
          </ButtonLink>
        }
      />
      <ul className="space-y-2">
        {mockNotifications.map((n) => {
          const Icon = ICONES[n.type];
          return (
            <li key={n.id}>
              <Link
                href={n.href}
                className={`flex gap-3 rounded-2xl border p-4 transition hover:border-teal ${
                  n.lu ? "border-line" : "border-accent/40 bg-mint/5"
                }`}
              >
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${n.lu ? "bg-surface text-subtle" : "bg-mint/15 text-accent"}`}>
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className={n.lu ? "text-soft" : "font-medium text-foreground"}>{n.titre}</span>
                    <span className="shrink-0 font-mono text-xs text-subtle">{n.date}</span>
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">{n.detail}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
