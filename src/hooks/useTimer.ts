// Hook personalizado para gerenciar o estado do timer, incluindo lógica de contagem progressiva e regressiva, além de persistência no LocalStorage.
import { useState, useEffect, useRef } from "react";

export function useTimer() {
  const [stopwatchStatus, setStopwatchStatus] = useState('stopped');
  const [seconds, setSeconds] = useState(0);
  const [start, setStart] = useState<Date | null>(null);

  // Refs para controlar o tempo acumulado e o momento da última retomada, sem causar re-renderizações desnecessárias
  // lastResumeTimeRef guarda o timestamp do último "play" para calcular o tempo decorrido corretamente
  // accumulatedTimeRef acumula o tempo total decorrido em sessões anteriores, permitindo pausas e retomadas sem perder o progresso
  const lastResumeTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  const [isCountDown, setIsCountDown] = useState(false);
  const [initialPreset, setInitialPreset] = useState(0);

  // Efeito principal para controlar o timer com base no status do stopwatch e no modo (progressivo ou regressivo)
  useEffect(() => {
    let intervalId: number | NodeJS.Timeout;

    if (stopwatchStatus === 'running') {
      const now = Date.now();
      lastResumeTimeRef.current = now; // Salva o momento do "play" sem disparar o efeito

      if (!isCountDown) {
        // Modo Progressivo
        intervalId = setInterval(() => {
          const totalSeconds = Math.floor(accumulatedTimeRef.current + (Date.now() - now) / 1000);
          setSeconds(totalSeconds);
        }, 1000);
      } else {
        // Modo Regressivo
        intervalId = setInterval(() => {
          const elapsedSinceResume = (Date.now() - now) / 1000;
          const totalElapsed = accumulatedTimeRef.current + elapsedSinceResume;
          const remaining = Math.max(0, (initialPreset * 60) - Math.floor(totalElapsed));
          setSeconds(remaining);
        }, 1000);
      }

    } else if (stopwatchStatus === 'paused') {
      // Ao pausar, calcula o tempo decorrido desde a última retomada e acumula no total, garantindo que o timer pare corretamente e mantenha o progresso
      const elapsedSinceLastResume = (Date.now() - lastResumeTimeRef.current) / 1000;
      accumulatedTimeRef.current += elapsedSinceLastResume;
    } else if (stopwatchStatus === 'stopped') {
      // Reset total
      accumulatedTimeRef.current = 0;
      lastResumeTimeRef.current = 0;
      setSeconds(0);
    }

    return () => clearInterval(intervalId);
    
    // O efeito depende do status do stopwatch, do modo de contagem e do preset inicial para garantir que o timer se comporte corretamente em todas as situações, incluindo mudanças de modo e ajustes de tempo 
  }, [stopwatchStatus, isCountDown, initialPreset]);

  // Persistência no LocalStorage
  useEffect(() => {
    const savedSeconds = localStorage.getItem("seconds");
    const savedAccumulated = localStorage.getItem("accumulatedTime");
    const savedStatus = localStorage.getItem("stopwatchStatus");
    const savedStart = localStorage.getItem("start");

    if (savedSeconds) setSeconds(Number(savedSeconds));
    if (savedAccumulated) accumulatedTimeRef.current = Number(savedAccumulated);
    if (savedStatus) setStopwatchStatus(savedStatus);
    if (savedStart) setStart(new Date(savedStart));
  }, []);

  useEffect(() => {
    localStorage.setItem("seconds", seconds.toString());
    localStorage.setItem("accumulatedTime", accumulatedTimeRef.current.toString());
    localStorage.setItem("stopwatchStatus", stopwatchStatus);
    localStorage.setItem("start", start?.toISOString() || '');
  }, [seconds, stopwatchStatus, start]);

  return { 
    stopwatchStatus, setStopwatchStatus, 
    seconds, setSeconds, 
    start, setStart, 
    isCountDown, setIsCountDown, 
    initialPreset, setInitialPreset 
  };
}