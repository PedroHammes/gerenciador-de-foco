// Este arquivo define as configurações de autenticação para o NextAuth
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    // Providers fica vazio aqui por enquanto para não bugar o Edge
    providers: [],
    callbacks: {
        async jwt({token, user}) {
                if (user) {
                        token.id = user.id
                        token.name = user.name
                }
                return token
        },
        async session({session, token}) {
                if (token.id && session.user) {
                        session.user.id = token.id as string
                        session.user.name = token.name as string
                }
                return session
        }
    }
} satisfies NextAuthConfig