"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { signOut, useSession, } from "next-auth/react"
import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import Link from "next/link"
import { useState, useEffect } from "react"
import { FocusSession } from "../profile/page"


export default function History() {
    const router = useRouter()
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

    useEffect(() => {
        if (status === "authenticated") {
            fetchSessions()
        }
    }, [status])

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
            h-dvh flex flex-col items-center
            p-8
            ">
                <nav
                className="
                w-full
                flex flex-row justify-between items-center
                ">
                    <h2>
                        Histórico
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

                <main className="
                flex flex-col justify-center flex-grow
                ">
                    <DataTable columns={columns} data={sessions}/>
                </main>
            </section>
        )
    }
    


}