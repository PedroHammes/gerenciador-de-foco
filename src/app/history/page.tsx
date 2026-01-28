"use client"

import { useSession, } from "next-auth/react"
import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import Link from "next/link"
import { useState, useEffect } from "react"
import type { FocusSession } from "../profile/page"
import { toast } from "sonner"
import Unauthenticated from "@/components/unauthenticated"
import Loading from "@/components/loading"
import { FocusChart } from "./focus-chart"
import { CategoryRadar } from "./category-radar"


export default function History() {

    const { status } = useSession()
    const [sessions, setSessions] = useState< FocusSession[] >([])  
     

    const fetchSessions = async () => {
        try {
            const response = await fetch('/api/foco')
            const data = await response.json() // Converte a resposta para JSON
            setSessions(data)
        } catch (error) {
            if (error instanceof Error) {
                console.error("Falha ao carregar sessões: ", error.message)
                toast.error("Falha ao carregar sessões.")
            } else {
                toast.error("Erro inesperado.")
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
        return <Loading />
    } else if (status === "unauthenticated") {
        return <Unauthenticated />
    } else if (status === "authenticated") {


        return (
            <section className="
            h-dvh flex flex-col items-center
            p-8 gap-6
            ">
                <div className="
                flex flex-row
                w-full gap-4
                ">
                    <div className="flex-1 min-w-0">
                        <FocusChart />
                    </div>
                    <div className="flex-1 min-w-0">
                        <CategoryRadar />
                    </div>
                </div>
                <main className="
                flex flex-col justify-center grow w-full
                ">
                    <DataTable columns={columns} data={sessions}/>
               </main>
            </section>
        )
    }
    


}