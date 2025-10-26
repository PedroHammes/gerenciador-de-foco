'use client'

import { signOut, useSession } from "next-auth/react"
import { useState } from "react";
import Link from "next/link"
import { useRouter } from "next/navigation";

type FocusSession = {
  id: string;
  description: string;
  duration: number;
  startTime: string | Date;
  endTime: string | Date;
  createdAt: string | Date;
}

export default function Profile() {

    const { data: session, status } = useSession()
    const [sessions, setSessions] = useState< FocusSession[] >([])
    const router = useRouter()

    const fetchSessions = async () => {
        try {
            const response = await fetch('/api/foco')
            const data = await response.json() // Converte a resposta para JSON
            setSessions(data)
        } catch (error) {
            if (error instanceof Error) {
                console.error("Falha ao carregar sessões: ", error.message)
            } else {
                console.error("Erro inesperado", error)
            }
        }
    }

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
            h-dvh flex flex-col items-center justify-center
            bg-zinc-900 text-zinc-50
            ">


                <nav
                className="
                flex flex-row gap-10
                ">
                    <h2>
                        Olá {session.user?.name}
                    </h2>

                    <div className="
                    flex flex row gap-2
                    ">
                        <button
                        onClick={() => router.push("/")}
                        className="
                        primary-button
                        ">
                            Início
                        </button>
                        
                        <button onClick={() => signOut()} className="
                        secondary-button
                        ">
                            Sair
                        </button>
                    </div>

                </nav>

                <div>
                    <p>Editar perfil</p>
                </div>

                <div>
                    <p>Histórico</p>
                    <button
                    onClick={fetchSessions}
                    className="
                    primary-button
                    ">
                        Load history
                    </button>
                
                    <div>
                        {
                        sessions.map(session => (
                            <div key={session.id} className="
                            card-timer
                            ">
                                <h3>{session.description}</h3>
                                <p>Foco: {session.duration}</p>
                                <button className="primary-button">Excluir</button>
                            </div>
                        ))
                        }
                    </div>
                </div>
                


            </section>
        )
    }
}