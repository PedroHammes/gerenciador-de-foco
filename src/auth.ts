import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials" // Importa o provedor de autenticação por credenciais
import { prisma } from "./server/db" // Importa a instância do Prisma Client
import bcrypt from "bcryptjs" // Importa a biblioteca para manipulação de senhas
import { authConfig } from "./auth.config" // Importa as configurações de autenticação

export const { handlers, signIn, signOut, auth } = NextAuth({
        //adapter: PrismaAdapter(prisma),
        session: {
                strategy: "jwt" // Uso de JWT para gerenciar sessões
        },
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

                                if (!credentials?.email || !credentials?.password) {
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
        callbacks: authConfig.callbacks
})