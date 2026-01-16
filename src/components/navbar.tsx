import Link from "next/link";
import { signOut } from "@/auth";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="w-full flex flex-row justify-between items-center py-4 px-6 border-b mb-4 bg-background">
      
      {/* Grupo Esquerda: Navegação */}
      <div className="flex flex-row gap-2">
        <Button asChild variant="outline">
          <Link href="/">
            Home
          </Link>
        </Button>
        
        <Button asChild variant="outline">
          <Link href="/history">
            Histórico
          </Link>
        </Button>
      </div>

      {/* Grupo Direita: Conta */}
      <div className="flex flex-row gap-2">
        <Button asChild variant="outline">
          <Link href="/profile">
            Perfil
          </Link>
        </Button>

        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button type="submit" variant="outline">
            Sair
          </Button>
        </form>
      </div>

    </nav>
  );
}