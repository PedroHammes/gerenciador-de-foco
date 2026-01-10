// Este arquivo seed.ts é usado para popular o banco de dados com dados iniciais para testes ou desenvolvimento.
// Ele utiliza o Prisma Client para interagir com o banco de dados.

// O fluxo de dados é o seguinte:
// 1. Código
// 2. Prisma Client (src/generated/prisma)
// 3. Adaptador PrismaPg (@prisma/adapter-pg)
// 4. Driver pg (pg)
// 5. Banco de dados PostgreSQL

import "dotenv/config"; // Carrega variáveis de ambiente do arquivo .env
import { PrismaClient } from "./src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg"; // Importa o adaptador PostgreSQL do Prisma
import { Pool } from "pg"; // Importa o Pool do pg para gerenciar conexões com o PostgreSQL

// Obtém a string de conexão do banco de dados a partir da variável de ambiente DATABASE_URL, através do process.env porque é lá que está a URL do banco
const connectionString = `${process.env.DATABASE_URL}`;
// Cria um pool de conexões com o banco de dados PostgreSQL, através da connectionString como parâmetro porque é lá que está a URL do banco
const pool = new Pool({
  connectionString,
});
// Cria uma instância do adaptador PostgreSQL do Prisma usando o pool de conexões através do pg porque o banco é PostgreSQL
const adapter = new PrismaPg(pool);

// Cria uma instância do Prisma Client usando o adaptador PostgreSQL, através do adapter porque o banco é PostgreSQL
const prisma = new PrismaClient({
  adapter
});

async function CreateUsers() {
  const user = await prisma.user.create({
    data: {
      email: 'elsa@prisma.io',
      name: 'Elsa Prisma',
      password: 'securepassword'
    },
  })

  console.log('Created user:', user);
}

// Executa a função de criação de usuários e lida com desconexão e erros
CreateUsers()
  .then(async () => {
    await prisma.$disconnect() // Desconecta o cliente Prisma após a operação
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect() // Desconecta o cliente Prisma em caso de erro
    process.exit(1) // Sai do processo com código de erro
  })
  
