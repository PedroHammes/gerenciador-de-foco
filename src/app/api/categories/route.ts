import { auth } from "@/auth";
import { prisma } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
  // Verifique a autenticação do usuário
  const session = await auth();
  if(!session?.user?.id) {
    return NextResponse.json(
      {message: "Usuário não autenticado."},
      {status: 401}
    )
  }

  // Se o usuario estiver autenticado, retorne as categorias
  const categories = await prisma.category.findMany({ // Buscar apenas categorias do usuário autenticado
    where: {
      userId: session.user.id // Filtra categorias pelo ID do usuário
    }
  })

  return NextResponse.json(categories) // Retorna as categorias como resposta JSON


}