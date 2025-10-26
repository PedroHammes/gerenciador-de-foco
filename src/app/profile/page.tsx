'use client'

import { useSession } from "next-auth/react"
import { useState } from "react";
import Link from "next/link"

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
            <>
                <h1>Olá {session.user?.name}</h1>

                <button onClick={fetchSessions}>
                    Load history
                </button>
                
                <ul>
                    {
                    sessions.map(session => (
                        <li key={session.id}>
                        <p>{session.description}</p>
                        <p>{session.duration}</p>
                        </li>
                    ))
                    }
                </ul>
            </>
        )
    }
}