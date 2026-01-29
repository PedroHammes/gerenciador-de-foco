"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner" // Supondo que você use sonner ou use-toast
import { MessageSquareWarning } from "lucide-react"

export function FeedbackDialog() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit() {
    if (!message.trim()) return

    setIsSubmitting(true)
    
    try {
      // Vamos criar essa rota API em seguida
      const response = await fetch("/api/feedback", {
        method: "POST",
        body: JSON.stringify({
          message,
          url: window.location.href, // Pega a URL atual automaticamente
        }),
      })

      if (!response.ok) throw new Error()

      toast.success("Obrigado! Seu feedback foi recebido.")
      setMessage("")
      setOpen(false)
    } catch (error) {
      toast.error("Erro ao enviar feedback. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageSquareWarning className="h-4 w-4" />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Encontrou um erro?</DialogTitle>
          <DialogDescription>
            Conte o que aconteceu. Se possível, diga o passo a passo para reproduzir o erro.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Ex: Quando clico em 'Salvar', o botão trava..."
            className="min-h-25"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}