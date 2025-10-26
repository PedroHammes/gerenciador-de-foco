import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient, Prisma } from "@/generated/prisma"

const prisma = new PrismaClient()

export async function POST(request: Request) {
        // Lógica para criar um novo usuário
        try {
                // Captura os dados da requisição
                const {name, email, password} = await request.json()
                console.log("Dados recebidos no signup:", { name, email, password });

                // Criar uma constante para salvar a senha criptografada usando a lib bcrypt
                const hashedPassword = bcrypt.hashSync(password, 10)

                // Criar uma constate para guardar o resultado da criação do usuário no banco
                const newUser = await prisma.user.create({
                        data: {
                                name: name,
                                email: email,
                                password: hashedPassword
                        }
                })

                return NextResponse.json({message: `Usuário ${newUser.email} criado com sucesso!`})

        } catch (error) {
                console.error("Erro detalhado ao criar usuário:", error);

                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                        if (error.code === 'P2002') {
                                return NextResponse.json(
                                        'There is a unique constraint violation, a new user cannot be created with this email'
                                )
                        }
                }

                return NextResponse.json(
                        {message: "Erro ao criar usuário"},
                        {status: 500}
                )
        }
        
}