import { useState, useEffect, use } from "react";

// Hook personalizado para gerenciar o cronômetro useTimer
export function useTimer() {
  const [stopwatchStatus, setStopwatchStatus] = useState('stopped')
  const [seconds, setSeconds] = useState(0)
  const [start, setStart] = useState< Date | null >(null)

  const [isCountDown, setIsCountDown] = useState(false)
  const [initialPreset, setInitialPreset] = useState(0)

  // Efeito que controla o cronômetro com base no status e faz a contagem de segundos
  useEffect(() => {
    let intervalId: number | NodeJS.Timeout; // Definindo o tipo da variável

    // Inicia a contagem se o status do cronômetro for 'running'
    if (stopwatchStatus == 'running') {
      // Começa a contar cada segundo
      if (!isCountDown) { // Modo contagem progressiva
        intervalId = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds + 1)
        }, 1000)
      } else { // Modo contagem regressiva
        intervalId = setInterval(() => {
            setSeconds(prevSeconds => {
                if (prevSeconds > 0) {
                    return prevSeconds -1
                } else {
                    return 0
                }
            })
        }, 1000)
      }
    }

    // Função de limpeza: para o cronômetro de isRunning virar false
    return() => {
      clearInterval(intervalId)
    }

  }, [stopwatchStatus]) // Fim do useEffect

    // Efeito para parar o cronômetro quando chegar a zero no modo contagem regressiva
    useEffect(() => {
        if (seconds === 0 && isCountDown) {
            setStopwatchStatus("stopped")
        }
    }, [seconds, isCountDown])

  // Efeito usado para salvar o estado do elementos do cronômetro no localStorage, garantindo persistência das informações entre recarregamentos da página
  useEffect(() => {
    setSeconds(Number(localStorage.getItem("seconds"))) // Converte o valor recuperado para número
    if (localStorage.getItem("start")) { // Verifica se existe um valor salvo para "start"
      setStart(new Date(localStorage.getItem("start") || '')) // Converte a string de volta para um objeto Date
    }
    setStopwatchStatus(localStorage.getItem("stopwatchStatus") || 'stopped') // Define o status do cronômetro, padrão para 'stopped' se não houver valor salvo
  },[])

  // Este efeito tem a mesma função do anterior, mas é acionado sempre que seconds, stopwatchStatus ou start mudam
  useEffect(() => {
    localStorage.setItem("seconds", seconds.toString()) // Salva o valor atual de seconds no localStorage
    localStorage.setItem("start", start?.toISOString() || '') // Salva a data de início no localStorage em formato ISO
    localStorage.setItem("stopwatchStatus", stopwatchStatus) // Salva o status atual do cronômetro no localStorage
  },[seconds, stopwatchStatus, start])

  return { stopwatchStatus, setStopwatchStatus, seconds, setSeconds, start, setStart, setIsCountDown, isCountDown, initialPreset, setInitialPreset }
}