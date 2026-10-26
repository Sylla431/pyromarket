import { exigerAdmin, lireSignalements } from "@/lib/admin";
import { AdminTabs } from "./_components/admin-tabs";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const supabase = await exigerAdmin();
  const aTraiter = (await lireSignalements(supabase)).filter((s) => s.statut === "a_traiter").length;

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.12em] text-teal uppercase">Administration</p>
      <h1 className="font-wide mt-1 mb-4 text-2xl text-foreground">Tableau de bord</h1>
      <AdminTabs aTraiter={aTraiter} />
      {children}
    </div>
  );
}
