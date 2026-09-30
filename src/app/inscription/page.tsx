import Link from "next/link";
import { InscriptionForm } from "./inscription-form";

export default function InscriptionPage() {
  return (
    <div className="mx-auto max-w-lg pt-2">
      <h1 className="font-wide text-2xl font-bold text-foreground">Créer un compte</h1>
      <p className="mt-1 mb-8 text-sm text-muted">Gratuit. Vos annonces sont visibles dès la publication.</p>
      <InscriptionForm />
      <p className="mt-8 text-center text-sm text-muted">
        Déjà inscrit ?{" "}
        <Link href="/connexion" className="font-medium text-accent hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
