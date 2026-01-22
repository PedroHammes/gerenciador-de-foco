import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

interface ITimerProps {
  stopwatchStatus: string;
  setStopwatchStatus: any;
  seconds: number;
  setStart: any;
}

export default function Timer({stopwatchStatus, setStopwatchStatus, seconds, setStart}: ITimerProps) {

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
      <ButtonGroup>
        <Button onClick={() => {
          if (stopwatchStatus == 'stopped') {
            setStopwatchStatus('running')
            setStart(new Date())
          } else if (stopwatchStatus == 'running') {
            setStopwatchStatus('paused')
          } else if (stopwatchStatus == 'paused') {
            setStopwatchStatus('running')
          }
          }}
            variant={"default"}
          >
            {stopwatchStatus == 'stopped' ? 'Iniciar' : stopwatchStatus == 'running' ? 'Pausar' : 'Retomar'}
        </Button>
      </ButtonGroup>
    </section>
  )
}
