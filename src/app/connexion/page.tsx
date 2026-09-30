import Link from "next/link";
import { ConnexionForm } from "./connexion-form";

export default function ConnexionPage() {
  return (
    <div className="mx-auto max-w-sm pt-6">
      <h1 className="font-wide text-2xl font-bold text-foreground">Se connecter</h1>
      <p className="mt-1 mb-8 text-sm text-muted">Retrouvez vos annonces, messages et transports.</p>
      <ConnexionForm />
      <p className="mt-8 text-center text-sm text-muted">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-medium text-accent hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
