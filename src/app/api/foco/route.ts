import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma'
import { auth } from '@/auth';


const prisma = new PrismaClient()

export async function POST(request: Request) {
        // código para salvar um novo registro de foco no BD
        console.log('Recebi uma req POST')

        // 1. Obtendo a sessão do usuário atual
        // const session = await auth()

        // 2. Segurança: se não houver user logado retorna ero
        // if (!session?.user?.id) { // Checando se sessão, usuário e ID existem
        //         return NextResponse.json(
        //                 {message: "Não autorizado"},
        //                 {status: 401}
        //         )
        // }

        try {
                // Pega os dados de dentro da requisição
                const {startTime, endTime, duration, description, userId} = await request.json()

                // 1 e 2. Verificação de segurança simples: garantir que o userId foi enviado
                if (!userId) {
                        return NextResponse.json(
                                {message: "userId pe obrigatório"},
                                {status: 400}
                        )
                }

                // Cria a seção de foco, conectando-a ao usuário

                const newFocusSession = await prisma.focusSession.create({
                        data: {
                                startTime, 
                                endTime,
                                duration,
                                description,
                                // Código para conectar o ID do usuário da sessão a esta sessão de foco
                                user: {
                                        connect: {
                                                id: userId
                                        }
                                }
                        }
                })
                
                // resposta pós salvamento
                return NextResponse.json(newFocusSession)

        } catch (error) {
                console.error("Erro ao criar sessão de foco:", error); // Mostra o erro detalhado no terminal (para nós)
                
                return NextResponse.json(
                        { message: "Não foi possível criar a sessão de foco." },
                        { status: 500 } // Retorna um erro genérico para o cliente
                ); 
        }
      
}


export async function GET() {

        const session = await auth()

        if (!session?.user?.id) {
                return NextResponse.json(
                        {message: "Não autorizado."},
                        {status: 401}
                )
        }

        try {
                const allFocusSession = await prisma.focusSession.findMany({
                        where: {
                                userId: session.user?.id
                        }
                })
                //console.log("Dados retornados pelo Prisma:", allFocusSession)
                return NextResponse.json(allFocusSession)
        
        } catch (error) {
                console.error("Erro ao buscar sessões de foco:", error);
                return NextResponse.json(
                        { message: "Não foi possível buscar as sessões de foco." },
                        { status: 500 }
                );              
        }
}