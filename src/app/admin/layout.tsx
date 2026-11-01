import { compteursNav, dateDuJour, exigerAdmin } from "@/lib/admin";
import { AdminCadre } from "./_components/admin-cadre";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const supabase = await exigerAdmin();
  const compteurs = await compteursNav(supabase);
  return (
    <AdminCadre compteurs={compteurs} date={dateDuJour()}>
      {children}
    </AdminCadre>
  );
}
