'use client'
import { useEffect, useState } from "react";

export default function Home() {

  const [status, setStatus] = useState('stopped')
  const [seconds, setSeconds] = useState(0)

  // Efeito que controla o cronômetro
  useEffect(() => {
    let intervalId: number | NodeJS.Timeout;

    if (status == 'running') {
      //Começa a contar cada segundo
      intervalId = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1)
      }, 1000)
    }

    //Função de limpeza: para o cronômetro de isRunning virar false
    return() => {
      clearInterval(intervalId)
    }

  }, [status]) // Dependência: o efeito roda quando isRunning muda


  return (
    <>
      <h1>
        {seconds}
      </h1>

      <button onClick={() => {
        if (status == 'stopped') {
          setStatus('running')
        } else if (status == 'running') {
          setStatus('paused')
        } else if (status == 'paused') {
          setStatus('running')
        }
      }}>
        {status == 'stopped' ? 'Start' : status == 'running' ? 'Pause' : 'Play'}
      </button>

      <button>Save</button>
      
      <button>Cancel</button>

    </>
  );
}
