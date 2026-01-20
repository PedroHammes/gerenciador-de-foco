"use client"

import { ColumnDef } from "@tanstack/react-table";
import type { FocusSession } from "../profile/page";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const formatTimer = (secs: number) => {
    const hh = String(Math.floor(secs/3600)).padStart(2, '0')
    const mm = String((Math.floor(secs/60))%60).padStart(2, '0')
    const ss = String(secs%60).padStart(2, '0')

    return `${hh}:${mm}:${ss}`
}


export const columns: ColumnDef<FocusSession>[] = [
    {
        accessorKey: "description",
        header: ({column}) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Descrição
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }
    },
    {
        accessorKey: "category.name",
        header: ({column}) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Categoria
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }
    },
    {
        accessorKey: "duration",
        header: ({column}) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Duração
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({row}) => {
            const timer = Number(row.getValue("duration"))
            return <div>{formatTimer(timer)}</div>
        }
    },
    {
        accessorKey: "createdAt",
        header: ({column}) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Data
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({row}) => {
            const date = new Date(row.getValue("createdAt"))

            return <div>{date.toLocaleDateString("pt-BR", {
                day: "numeric",
                weekday: "short",
                month: "long",
                year: "numeric",
            })}</div>
        }
    },
]