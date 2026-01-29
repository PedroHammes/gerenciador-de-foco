import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/server/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/")
  }

  // Puxa a role do usuário logado
  const user = await prisma.user.findUnique({
    where: { 
        email: session.user.email 
    },
    select: { 
        role: true // Só preciso da role do usuário
    }
  })

  // Verifica se o usuário é ADMIN ou SUPER
  const isAuthorized = user?.role === "ADMIN" || user?.role === "SUPER"

  if (!isAuthorized) {
    redirect("/") // Redireciona para a home se não for autorizado
  }
  
  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true }
      }
    }
  })

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel de Controle</h1>
        <Badge variant="secondary">{feedbacks.length} Feedbacks</Badge>
      </div>

      <div className="grid gap-4">
        {feedbacks.length === 0 ? (
          <p className="text-muted-foreground">Nenhum feedback recebido ainda.</p>
        ) : (
          feedbacks.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.user.name}</CardTitle>
                    <CardDescription>{item.user.email}</CardDescription>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{item.message}</p>
                
                {item.url && (
                  <div className="mt-4 p-2 bg-muted rounded text-xs font-mono break-all">
                    Ocorrido em: {item.url}
                  </div>
                )}
                
                {item.userAgent && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Sistema: {item.userAgent}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}