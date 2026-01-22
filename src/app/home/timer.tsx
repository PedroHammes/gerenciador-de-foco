interface ITimerProps {
  seconds: number;
}

export default function Timer({seconds}: ITimerProps) {

  // Formata os segundos em hh:mm:ss
  const formatTimer = (secs: number) => {
    const hh = String(Math.floor(secs/3600)).padStart(2, '0')
    const mm = String((Math.floor(secs/60))%60).padStart(2, '0')
    const ss = String(secs%60).padStart(2, '0')

    return `${hh}:${mm}:${ss}`
  }

  return (
    <section>
      <div className="">
        <h1 className="
        font-mono
        ">
          {formatTimer(seconds)}
        </h1>
      </div>
    </section>
  )
}
