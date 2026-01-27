"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Timer } from "lucide-react"

export default function Navbar() {
  const { data: session } = useSession()

  // Se não estiver logado, não renderiza a Navbar
  if (!session) return null

  return (
    <nav className="w-full flex justify-between items-center py-3 px-6 border-b mb-4 bg-background">
      
      <Link href="/home" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity">
        <Timer className="h-6 w-6 text-primary" />
        <span>TimeLy</span>
      </Link>

      <Menubar>
        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer">Navegação</MenubarTrigger>
          <MenubarContent>
            <MenubarItem asChild className="cursor-pointer">
              <Link href="/home">Home</Link>
            </MenubarItem>
            <MenubarItem asChild className="cursor-pointer">
              <Link href="/history">Histórico</Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Menu Conta */}
        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer">Minha Conta</MenubarTrigger>
          <MenubarContent>
            <MenubarItem asChild className="cursor-pointer">
              <Link href="/profile">Perfil</Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem 
              className="text-red-500 focus:text-red-500 cursor-pointer"
              onClick={() => signOut()}
            >
              Sair
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

      </Menubar>

    </nav>
  )
}