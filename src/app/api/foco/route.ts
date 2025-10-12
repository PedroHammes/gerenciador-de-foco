import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma'

const prisma = new PrismaClient()

export async function POST(request: Request) {
        // código para salvar um novo registro no BD
        console.log('Recebi uma req POST')

        try {
                // 1. Extrai e converte o corpo da requisição para JSON
                const body = await request.json()

                // 2. Pega os dados de dentro do body
                const {startTime, endTime, duration, description} = body

                // O código para salvar no banco de dados
                console.log({ description, startTime, endTime, duration });
                const newFocusSession = await prisma.focusSession.create({
                        data: {
                                startTime, 
                                endTime,
                                duration,
                                description
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
        try {
                const allFocusSession = await prisma.focusSession.findMany()
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