'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation"

export default function Home() {

  const { data: session, status } = useSession()

  const [stopwatchStatus, setStopwatchStatus] = useState('stopped')
  const [seconds, setSeconds] = useState(0)
  const [description, setDescription] = useState('')
  const [start, setStart] = useState< Date | null >(null)
    const router = useRouter()

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
    bg-zinc-900 text-zinc-50
    p-8
    "
    >

        <nav
        className="
        w-full
        flex flex-row justify-between items-center
        ">
          <h2>
            Olá, {session.user?.name}!
          </h2>

          <div className="
          flex flex row gap-2
          ">
            <button
            onClick={() => router.push("/profile")}
            className="
            primary-button
            ">
              Perfil
            </button>
            <button onClick={() => signOut()} className="
            secondary-button
            ">
              Sair
            </button>
          </div>

        </nav>
      
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

          <input 
            type="text"
            placeholder="No que você está trabalhando?"
            value={description} 
            onChange={(event) => { 
              setDescription(event.target.value)
            }}
            className="
            form-input-field
            w-full
            ">
          </input>

          <div className="
          flex flex-row gap-2
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

          </div>

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