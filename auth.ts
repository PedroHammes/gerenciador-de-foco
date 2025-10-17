import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaClient } from "./src/generated/prisma"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
        // Defino as regras de login
        Credentials({
                credentials: {
                        email: {
                                type: "email",
                                label: "Email",
                                placeholder: "exemplo@email.com",
                        },
                        password: {
                                type: "password",
                                label: "Senha",
                                placeholder: "********"
                        }
                },

                async authorize(credentials) {

                        if (!credentials.email || !credentials.password) {
                                return null
                        }

                        // 1. Busca o usuário pelo email
                        const user = await prisma.user.findUnique({
                                where: {
                                        email: credentials.email as string
                                }
                        })

                        // 2. Verifica se o usuário foi encontrad
                        if (user && user.password) {
                                // 3. Compara a senha digitada (credentials.pssw) com a senha do banco (user.pssw)
                                //    Se as senhas forem iguais eu retorno o objeto 'user'
                                //      (bcryptjs) Para verificar uma senha:
                               const passwords_match = bcrypt.compareSync(
                                        credentials.password as string, // Senha digitada na tentativa de login
                                        user.password                   // Senha criptografada no banco
                                )

                                if (passwords_match) {
                                        return user
                                }
                        }
                        return null
                }
        })
  ],
})