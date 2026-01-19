// Este arquivo estende os tipos do NextAuth para incluir o ID do usuário na sessão para melhor tipagem em TypeScript e validação de dados.
import { DefaultSession } from "next-auth" // Importa o tipo DefaultSession de next-auth

// Extende o tipo Session do NextAuth para incluir o ID do usuário
declare module "next-auth" {
  // Adiciona o campo 'id' ao objeto 'user' dentro da sessão
  interface Session {
    user: {
      /** O ID do usuário no banco de dados. */
      id: string
    } & DefaultSession["user"] // Mantém os campos originais (name, email, image)
  }
}