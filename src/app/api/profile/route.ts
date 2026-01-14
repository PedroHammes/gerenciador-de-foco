// Este arquivo lida com a rota de atualização do perfil do usuário
import { NextResponse } from "next/server"; // Importa o NextResponse para criar respostas HTTP
import { auth } from "@/auth"; ;// Importa a função de autenticação
import { prisma } from "@/server/db"; // Importa a instância do Prisma Client
import bcrypt from "bcryptjs"; // Importa a biblioteca para manipulação de senhas

export async function PATCH(request: Request) {
    const session = await auth();

    // 1. Verifica se o usuário está autenticado
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    // 2. Recebe os dados do corpo da requisição
    const data = await request.json();

    try {
        // 3. Atualização no Banco de Dados
        const updatedUser = await prisma.user.update({
            where: {
                email: session.user.email,
            },
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                gender: data.gender,
                city: data.city,
                profilePic: data.profilePic,
                birthDate: data.birthDate
                  ? new Date(data.birthDate)
                  : undefined,
                password: data.password
                    ? bcrypt.hashSync(data.password, 10)
                    : undefined,  
            },
        });
        return NextResponse.json(updatedUser);
        
    } catch (error) {
        console.error("Erro ao atualizar:", error);
        return NextResponse.json({ message: "Erro ao atualizar perfil" }, { status: 500 });
    }
}