import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/server/db";
import { getDailyFocusMetrics } from "@prisma/client/sql";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  try {
        // Busca as métricas diárias de foco do usuário autenticado
        const metrics = await prisma.$queryRawTyped(
        getDailyFocusMetrics(session.user.id)
        );

        // Formata os resultados para garantir que os tipos estejam corretos porque o Prisma pode retornar BigInt que é um valor que o JSON não suporta diretamente.
        // Precisa converter para Number normal antes de enviar.
        const formattedMetrics = metrics.map((item) => ({
        day: item.day,
        totalDuration: Number(item.totalDuration), // Converte BigInt para Number
        }));

        return NextResponse.json(formattedMetrics);
    } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
        return NextResponse.json(
            { message: "Erro interno ao buscar métricas" },
            { status: 500 }
        );
  }
}