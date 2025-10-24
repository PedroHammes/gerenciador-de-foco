'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type FocusSession = {
  id: number;
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
    const response = await fetch('api/foco', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        startTime: start,
        endTime: new Date(),
        duration: seconds
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
    <>
      <h1>
        Olá {session.user?.email}
      </h1>
      <h2>
        {formatTimer(seconds)}
      </h2>

      <input 
      type="text" value={description} 
      onChange={(event) => { 
        setDescription(event.target.value)
      }}
      >

      </input>

      <button onClick={() => {
        if (stopwatchStatus == 'stopped') {
          setStopwatchStatus('running')
          setStart(new Date())
        } else if (stopwatchStatus == 'running') {
          setStopwatchStatus('paused')
        } else if (stopwatchStatus == 'paused') {
          setStopwatchStatus('running')
        }
      }}>
        {stopwatchStatus == 'stopped' ? 'Start' : stopwatchStatus == 'running' ? 'Pause' : 'Play'}
      </button>

      <button id="btn-save"
        onClick={handleSave}
        disabled={ stopwatchStatus === 'stopped' ? true : false }
      >
        Save
      </button>

      <button  id="btn-cancel"
        onClick={handleCancel}
        disabled={ stopwatchStatus === 'stopped' ? true : false }
      >
        Cancel
      </button>

      <button onClick={fetchSessions}>
        Load history
      </button>

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

    </>
  );
  }
}