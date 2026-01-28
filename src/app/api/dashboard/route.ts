import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/server/db";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Busca as sessões de foco agrupadas por dia.
    const dailyMetrics = await prisma.$queryRaw<Array<{ day: Date; totalDuration: number | bigint }>>`
      SELECT 
        DATE_TRUNC('day', "startTime") as "day",
        SUM("duration") as "totalDuration"
      FROM "FocusSession"
      WHERE "userId" = ${userId}
      GROUP BY DATE_TRUNC('day', "startTime")
      ORDER BY "day" ASC
      LIMIT 7
    `;

    // Busca as sessões de foco agrupadas por categoria.
    const categoryMetrics = await prisma.$queryRaw<Array<{ category: string; totalDuration: number | bigint }>>`
      SELECT 
        c."name" AS "category", 
        SUM(s."duration") AS "totalDuration"
      FROM "FocusSession" AS s
      JOIN "Category" AS c ON s."categoryId" = c."id"
      WHERE s."userId" = ${userId}
      GROUP BY c."name"
      ORDER BY "totalDuration" DESC
    `;

    // --- Formatação dos Dados ---

    // Converteo resultado de SUM (bigint) para number
    const formattedDaily = dailyMetrics.map((item) => ({
      day: item.day,
      totalDuration: Number(item.totalDuration),
    }));

    const formattedCategories = categoryMetrics.map((item) => ({
      category: item.category,
      totalDuration: Number(item.totalDuration),
    }));

    return NextResponse.json({
      daily: formattedDaily,
      categories: formattedCategories
    });

  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
    return NextResponse.json(
      { message: "Erro interno ao buscar métricas" },
      { status: 500 }
    );
  }
}