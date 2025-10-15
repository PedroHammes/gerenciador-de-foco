'use client'
import { useEffect, useState } from "react";

export default function Home() {

  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)

  // Efeito que controla o cronômetro
  useEffect(() => {
    let intervalId: number | NodeJS.Timeout;

    if (isRunning) {
      //Começa a contar cada segundo
      intervalId = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1)
      }, 1000)
    }

    //Função de limpeza: para o cronômetro de isRunning virar false
    return() => {
      clearInterval(intervalId)
    }

  }, [isRunning]) // Dependência: o efeito roda quando isRunning muda


  return (
    <>
      <h1>
        {seconds}
      </h1>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? "Pause" : "Start"}
      </button>
    </>
  );
}
