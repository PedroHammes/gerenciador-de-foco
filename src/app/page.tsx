'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
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

interface ICategory {
  id: string;
  name: string;
  color: string;
}

export default function Home() {

  const { data: session, status } = useSession()

  const [stopwatchStatus, setStopwatchStatus] = useState('stopped')
  const [seconds, setSeconds] = useState(0)
  const [description, setDescription] = useState('')
  const [typeActivity, setTypeActivity] = useState('')
  const [start, setStart] = useState< Date | null >(null)

  const [categories, setCategories] = useState<ICategory[]>([])

  // Efeito que controla o cronômetro
  useEffect(() => {
    let intervalId: number | NodeJS.Timeout;

    if (stopwatchStatus == 'running') {
      //Começa a contar cada segundo
      intervalId = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1)
      }, 1000)
    }

    //Função de limpeza: para o cronômetro de isRunning virar false
    return() => {
      clearInterval(intervalId)
    }

  }, [stopwatchStatus])

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
      console.log("Sessão salva com sucesso!")
      window.alert("Sessão salva com sucesso!")
      
    } else {
      window.alert("Falha ao salvar a sessão.")
    }

  }

  //Função para descartar uma sessão
  const handleCancel = () => {
    setStopwatchStatus('stopped')
    setSeconds(0)
  }

  // Formata os segundos em hh:mm:ss
  const formatTimer = (secs: number) => {
    const hh = String(Math.floor(secs/3600)).padStart(2, '0')
    const mm = String((Math.floor(secs/60))%60).padStart(2, '0')
    const ss = String(secs%60).padStart(2, '0')

    return `${hh}:${mm}:${ss}`
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
    return (
      <p>Carregando...</p>
    )
  } else if (status === "unauthenticated") {
    return (
      <p>Acesso negado. <br /> Faça o login em: <Link href="/signin">Login</Link></p>
    )
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
          <div className="

          ">
            <h1 className="
            font-mono
            ">
              {formatTimer(seconds)}
            </h1>
          </div>

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
                <Button onClick={() => {
                if (stopwatchStatus == 'stopped') {
                    setStopwatchStatus('running')
                    setStart(new Date())
                } else if (stopwatchStatus == 'running') {
                    setStopwatchStatus('paused')
                } else if (stopwatchStatus == 'paused') {
                    setStopwatchStatus('running')
                }
                }}
                variant={"default"}
                >
                    {stopwatchStatus == 'stopped' ? 'Start' : stopwatchStatus == 'running' ? 'Pause' : 'Play'}
                </Button>

                <Button id="btn-save"
                onClick={handleSave}
                disabled={ stopwatchStatus === 'stopped' ? true : false }
                variant={"secondary"}
                >
                    Save
                </Button>

                <Button  id="btn-cancel"
                onClick={handleCancel}
                disabled={ stopwatchStatus === 'stopped' ? true : false }
                variant={"destructive"}
                >
                    Cancel
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