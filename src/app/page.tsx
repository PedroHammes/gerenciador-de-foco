'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signOut } from "next-auth/react";

type FocusSession = {
  id: string;
  description: string;
  duration: number;
  startTime: string | Date;
  endTime: string | Date;
  createdAt: string | Date;
}

export default function Home() {

  const { data: session, status } = useSession()

  const [stopwatchStatus, setStopwatchStatus] = useState('stopped')
  const [seconds, setSeconds] = useState(0)
  const [description, setDescription] = useState('')
  const [sessions, setSessions] = useState< FocusSession[] >([])
  const [start, setStart] = useState< Date | null >(null)

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
      
    } else {
      console.error("Falha ao salvar a sessão.")
    }

  }

  //Função para descartar uma sessão
  const handleCancel = () => {
    setStopwatchStatus('stopped')
    setSeconds(0)
  }

  const formatTimer = (secs: number) => {
    const hh = String(Math.floor(secs/3600)).padStart(2, '0')
    const mm = String((Math.floor(secs/60))%60).padStart(2, '0')
    const ss = String(secs%60).padStart(2, '0')

    return `${hh}:${mm}:${ss}`
  }

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/foco')
      const data = await response.json() // Converte a resposta para JSON
      setSessions(data)
    } catch (error) {
      if (error instanceof Error) {
        console.error("Falha ao carregar sessões: ", error.message)
      } else {
        console.error("Erro inesperado", error)
      }
    }

  }

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
    h-dvh flex items-center justify-center
    bg-zinc-950 text-zinc-50
    p-4 sm:px-8 md:px-16 lg:px-72
    "
    >
      <section className="
        w-full h-dvh
        flex flex-col items-center justify-between
        border-2
        p-8
      ">
        <nav 
        className="
        flex flex-row justify-between w-full
        ">
          <h1 
          className="text-2xl
          ">
            Olá {session.user?.email}
          </h1>
          <button onClick={() => signOut()} className="
          secondary-button
          ">Sair</button>
        </nav>
      
        <h2 className="
        text-6xl
        ">
          {formatTimer(seconds)}
        </h2>

        <div>
          <input 
            type="text"
            placeholder="Tarefa"
            value={description} 
            onChange={(event) => { 
              setDescription(event.target.value)
            }}
            className="
            form-input-field
            ">
          </input>
        </div>

        <div className="
        flex flex-col gap-2
        ">
          <button onClick={() => {
            if (stopwatchStatus == 'stopped') {
              setStopwatchStatus('running')
              setStart(new Date())
            } else if (stopwatchStatus == 'running') {
              setStopwatchStatus('paused')
            } else if (stopwatchStatus == 'paused') {
              setStopwatchStatus('running')
            }
          }}
          className="
          primary-button
          ">
            {stopwatchStatus == 'stopped' ? 'Start' : stopwatchStatus == 'running' ? 'Pause' : 'Play'}
          </button>

          <button id="btn-save"
          onClick={handleSave}
          disabled={ stopwatchStatus === 'stopped' ? true : false }
          className="
          secondary-button
          ">
            Save
          </button>

          <button  id="btn-cancel"
          onClick={handleCancel}
          disabled={ stopwatchStatus === 'stopped' ? true : false }
          className="
          secondary-button
          ">
            Cancel
          </button>

          <button onClick={fetchSessions}>
            Load history
          </button>
        </div>

      <ul>
        {
          sessions.map(session => (
            <li key={session.id}>
              <p>{session.description}</p>
              <p>{session.duration}</p>
            </li>
          ))
        }
      </ul>

      </section>

    </section>
  );
  }
}