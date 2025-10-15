'use client'
import { useEffect, useState } from "react";

export default function Home() {

  const [status, setStatus] = useState('stopped')
  const [seconds, setSeconds] = useState(0)
  const [description, setDescription] = useState('')

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

  //Função para salvar uma sessão no BD
  const handleSave = async () => {
    const response = await fetch('api/foco', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        startTime: new Date(),
        endTime: new Date(),
        duration: seconds
      })
    })

    setStatus('stopped')
    setSeconds(0)
  }

  //Função para descartar uma sessão
  const handleCancel = () => {
    setStatus('stopped')
    setSeconds(0)
  }

  const formatTimer = (secs: number) => {
    const hh = String(Math.floor(secs/3600)).padStart(2, '0')
    const mm = String((Math.floor(secs/60))%60).padStart(2, '0')
    const ss = String(secs%60).padStart(2, '0')

    return `${hh}:${mm}:${ss}`
  }


  return (
    <>
      <h1>
        {formatTimer(seconds)}
      </h1>

      <input 
      type="text" value={description} 
      onChange={(event) => { 
        setDescription(event.target.value)
      }}
      >

      </input>

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

      <button id="btn-save"
        onClick={handleSave}
        disabled={ status === 'stopped' ? true : false }
      >
        Save
      </button>

      <button  id="btn-cancel"
        onClick={handleCancel}
        disabled={ status === 'stopped' ? true : false }
      >
        Cancel
      </button>

    </>
  );
}
