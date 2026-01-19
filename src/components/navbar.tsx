"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import { useSession, signOut } from "next-auth/react"

export default function Navbar() {

  const {data: session} = useSession()

  if (!session) {
    return null
  } else {
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

          <Button type="submit" variant="outline" onClick={() => signOut()}>
            Sair
          </Button>
        </div>

      </nav>
    );
  }

}