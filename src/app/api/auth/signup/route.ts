import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/server/db";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
        // Lógica para criar um novo usuário
        try {
                // Captura os dados da requisição
                const {name, email, password} = await request.json()

                // Criar uma constante para salvar a senha criptografada usando a lib bcrypt
                const hashedPassword = bcrypt.hashSync(password, 10)

                // Criar uma constate para guardar o resultado da criação do usuário no banco
                const newUser = await prisma.user.create({
                        data: {
                                name,
                                email,
                                password: hashedPassword
                        }
                })

                return NextResponse.json({message: `Usuário ${newUser.email} criado com sucesso!`})

        } catch (error) {
                console.error("Erro detalhado ao criar usuário:", error);

                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                        if (error.code === 'P2002') {
                                return NextResponse.json(
                                        {message: 'Email já está em uso. Por favor, utilize outro email.'},
                                        {status: 409} // Conflict
                                )
                        }
                }

                return NextResponse.json(
                        {message: "Erro ao criar usuário"},
                        {status: 500}
                )
        }
        
}