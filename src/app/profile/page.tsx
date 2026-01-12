'use client'

import { signOut, useSession } from "next-auth/react"
import { useState } from "react";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export type FocusSession = {
  id: string;
  description: string;
  typeActivity: string;
  duration: number;
  startTime: string | Date;
  endTime: string | Date;
  createdAt: string | Date;
}

export default function Profile() {

    const { data: session, status } = useSession()
    const [sessions, setSessions] = useState< FocusSession[] >([])
    const router = useRouter()

    if (status === "loading") {
        return (
            <p>Carregando...</p>
        )
    } else if (status === "unauthenticated") {
        return (
            <>
                <p>Acesso negado.</p>
                <p>Faça <Link href={"/signin"}>login</Link> ou se <Link href={"/signup"}>Cadastre</Link></p>
            </>
        )
    } else if (status === "authenticated") {
        return (
            <section className="
            h-dvh flex flex-col items-center justify-between
            p-8
            ">


                <nav
                className="
                w-full
                flex flex-row justify-between items-center
                ">
                    <h2>
                        Olá {session.user?.name}
                    </h2>

                    <div className="
                    flex flex row gap-2
                    ">
                        <Button
                        onClick={() => router.push("/")}
                        >
                            Início
                        </Button>

                        <Button
                        onClick={() => router.push("/history")}
                        >
                            Histórico
                        </Button>
                        
                        <Button onClick={() => signOut()}
                        variant={"secondary"}
                        >
                            Sair
                        </Button>
                    </div>

                </nav>

                <div>
                    <p>Editar perfil</p>
                </div>
            </section>
        )
    }
}