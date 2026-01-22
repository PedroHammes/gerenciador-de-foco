import { useState, useEffect } from "react";

// Hook personalizado para gerenciar o cronômetro useTimer
export function useTimer() {
  const [stopwatchStatus, setStopwatchStatus] = useState('stopped')
  const [seconds, setSeconds] = useState(0)
  const [start, setStart] = useState< Date | null >(null)

  // Efeito que controla o cronômetro
  useEffect(() => {
    let intervalId: number | NodeJS.Timeout; // Definindo o tipo da variável

    // Inicia a contagem se o status do cronômetro for 'running'
    if (stopwatchStatus == 'running') {
      // Começa a contar cada segundo
      intervalId = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1)
      }, 1000)
    }

    // Função de limpeza: para o cronômetro de isRunning virar false
    return() => {
      clearInterval(intervalId)
    }

  }, [stopwatchStatus]) // Fim do useEffect

  return { stopwatchStatus, setStopwatchStatus, seconds, setSeconds, start, setStart }
}