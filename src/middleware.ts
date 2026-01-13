import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

// Middleware de autenticação usando NextAuth e a configuração definida em auth.config.ts
export default NextAuth(authConfig).auth

// Configuração do middleware para aplicar a autenticação em todas as rotas, exceto as especificadas
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}