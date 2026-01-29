import { NextResponse, userAgent } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/server/db";
import * as z from "zod"
import { ur } from "zod/v4/locales";

// Uso zod para definir um esquema padrão para o feedback
const feedbackSchema = z.object({
    message: z.string().min(5, "A mensagem devem ter pelo menos 5 caracteres"),
    url: z.string().optional()
})

export async function POST(req: Request) {
    try {
        const session = await auth()

        // Por segurança só aceito feedback de usuário logado.
        if (!session?.user.id) {
            return NextResponse.json({
                message: "Não autorizado."
            })
        }

        // Lê e valida os dados recebidos
        const json = await req.json()
        const body = feedbackSchema.parse(json) // Passa o conteúdo da requisição para o formato de feedback

        await prisma.feedback.create({
            data: {
                message: body.message,
                url: body.url,
                // Captura automática do navegador e OS do usuário (útil para saber em qual ambiente a aplicação está quebrando)
                userAgent: req.headers.get("user-agent") || undefined,
                userId: session.user.id
            }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: "Dados inválidos"})
        }

        console.error("Erro ao salvar feedback:", error);
        return NextResponse.json(
            { message: "Erro interno no servidor" },
            { status: 500 }
        );
        
    }
}