'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner";
import Unauthenticated from "@/components/unauthenticated";
import Loading from "@/components/loading";

// Imports pós modularização do useTimer
import { useTimer } from "@/hooks/useTimer";
import Timer from "./timer";

interface ICategory {
  id: string;
  name: string;
  color: string;
}

export default function Home() {

  const { data: session, status } = useSession()
  const [description, setDescription] = useState('')
  const [typeActivity, setTypeActivity] = useState('')
  const [categories, setCategories] = useState<ICategory[]>([])

  // Imports pós modularização do useTimer
  const { stopwatchStatus, setStopwatchStatus, seconds, setSeconds, start, setStart } = useTimer()

  //Função para salvar uma sessão no BD
  const handleSave = async () => {
    // Verificação de segurança: Só tento salvar se a sessão e ID existirem
    if (!session?.user?.id) {
      console.error("Usuário não autenticado, não é possível salvar.")
      return // Interrompe o salvamento
    }

    const response = await fetch('api/foco', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        //typeActivity deve ser declarada aqui
        typeActivity,
        startTime: start,
        endTime: new Date(),
        duration: seconds,
        // adicionar o ID do usuário
        userId: session.user.id
      })
    })

    if (response.ok) { //Verifica se a REQUISIÇÃO foi bem sucedida
      setStopwatchStatus('stopped')
      setSeconds(0)
      setDescription('')
      setTypeActivity('')
      toast.success("Sessão salva com sucesso!")
      
    } else {
      toast.error("Falha ao salvar sessão.")
    }

  }

  //Função para descartar uma sessão
  const handleCancel = () => {
    setStopwatchStatus('stopped')
    setSeconds(0)
  }

  // Buscar categorias do usuário autenticado ao carregar o componente
  useEffect( () => {
    const fetchData = async () => { // Função assíncrona para buscar dados
      const response = await fetch('api/categories') // Chama a API de categorias
      const data = await response.json() // Converte a resposta em JSON
      setCategories(data) // Atualiza o estado com as categorias recebidas
    }
    fetchData() // Chama a função de busca de dados
  }, [])


  if (status === "loading") {
    return <Loading />
  } else if (status === "unauthenticated") {
    return <Unauthenticated />
  } else if (status === "authenticated") {
      return (
    <section
    className="
    h-dvh flex flex-col items-center justify-between
    p-8
    "
    >
      
        <main className="
        flex flex-col items-center justify-center
        gap-8
        ">

          <Timer 
          stopwatchStatus={stopwatchStatus} 
          setStopwatchStatus={setStopwatchStatus} 
          seconds={seconds}
          setStart={setStart}
          />

          <div className="flex w-full max-w-sm items-center gap-2">
              <Input
              type="text"
              placeholder="No que você está trabalhando?"
              value={description} 
              onChange={(event) => { 
              setDescription(event.target.value)
              }}
              />

              <Select
              value={typeActivity} 
              onValueChange={setTypeActivity}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((categorie) => (
                      <SelectItem value={categorie.name} key={categorie.id}>{categorie.name}</SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
          </div>

          <ButtonGroup>

              <Button id="btn-save"
              onClick={handleSave}
              disabled={ stopwatchStatus === 'stopped' ? true : false }
              variant={"secondary"}
              >
                  Salvar
              </Button>

              <Button  id="btn-cancel"
              onClick={handleCancel}
              disabled={ stopwatchStatus === 'stopped' ? true : false }
              variant={"destructive"}
              >
                  Cancelar
              </Button>
          </ButtonGroup>

        </main>

        <footer className="
        w-full text-center text-sm text-zinc-500
        ">
          Gerenciador de Foco
        </footer>
        


    </section>
  );
  }
}