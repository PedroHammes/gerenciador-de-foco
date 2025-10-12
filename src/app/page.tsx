'use client'
import { useState } from "react";

export default function Home() {

  const [isRunning, setIsRunning] = useState(false)

  return (
    <button onClick={() => setIsRunning(!isRunning)}>
      {isRunning ? "Pausar" : "Iniciar"}
    </button>
  );
}
