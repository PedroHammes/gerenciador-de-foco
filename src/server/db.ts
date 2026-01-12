// Este arquivo configura a conexão com o banco de dados PostgreSQL usando o Prisma Client e um adaptador personalizado.
// A estrutura deste arquivo foi retirada da documentação oficial do Prisma para configuração com PostgreSQL e adaptadores personalizados.
// Link para referência: https://www.prisma.io/docs/guides/database/connectors/postgresql/customizing-prisma-client-to-use-a-postgresql-adapter

// O fluxo de dados é o seguinte:
// 1. Código
// 2. Prisma Client (src/generated/prisma)
// 3. Adaptador PrismaPg (@prisma/adapter-pg)
// 4. Driver pg (pg)
// 5. Banco de dados PostgreSQL

import "dotenv/config"; // Carrega variáveis de ambiente do arquivo .env
import { PrismaClient } from "@/generated/prisma"; // Importa o Prisma Client gerado
import { PrismaPg } from "@prisma/adapter-pg"; // Importa o adaptador PostgreSQL do Prisma
import { Pool } from "pg"; // Importa o Pool do pg para gerenciar conexões com o PostgreSQL

const connectionString = `${process.env.DATABASE_URL}`; // Obtém a string de conexão do banco de dados a partir da variável de ambiente DATABASE_URL
const globalForPrisma = global as unknown as { prisma: PrismaClient} // Declara uma variável global para armazenar a instância do Prisma Client

// Função para criar uma nova instância do Prisma Client com o adaptador PostgreSQL
const createPrismaClient = () => {
  const pool = new Pool({ connectionString }) // Cria um pool de conexões com o banco de dados PostgreSQL
  const adapter = new PrismaPg(pool); // Cria uma instância do adaptador PostgreSQL do Prisma usando o pool de conexões

  return new PrismaClient({ adapter }) // Retorna uma nova instância do Prisma Client usando o adaptador PostgreSQL
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient() // Exporta a instância do Prisma Client, reutilizando a instância global se existir

// Armazena a instância do Prisma Client na variável global para reutilização em ambientes de desenvolvimento
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}