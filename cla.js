const { useState, useEffect, useRef } = React;

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  useEffect(() => {
    if (timeLeft === 0) {
      audioRef.current.play();
      if (isSession) {
        setTimeLeft(breakLength * 60);
        setIsSession(false);
      } else {
        setTimeLeft(sessionLength * 60);
        setIsSession(true);
      }
    }
  }, [timeLeft, isSession, breakLength, sessionLength]);

  const handleStartStop = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    } else {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setIsSession(true);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const changeLength = (type, amount) => {
    if (isRunning) return;
    if (type === "break") {
      const newBreak = breakLength + amount;
      if (newBreak > 0 && newBreak <= 60) {
        setBreakLength(newBreak);
      }
    } else if (type === "session") {
      const newSession = sessionLength + amount;
      if (newSession > 0 && newSession <= 60) {
        setSessionLength(newSession);
        setTimeLeft(newSession * 60);
      }
    }
  };

  return (
    <div>
      <h1>25 + 5 Clock</h1>
      <div className="controls">
        <div className="length-control">
          <h2 id="break-label">Break Length</h2>
          <button id="break-decrement" onClick={() => changeLength("break", -1)}>-</button>
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" onClick={() => changeLength("break", 1)}>+</button>
        </div>
        <div className="length-control">
          <h2 id="session-label">Session Length</h2>
          <button id="session-decrement" onClick={() => changeLength("session", -1)}>-</button>
          <span id="session-length">{sessionLength}</span>
          <button id="session-increment" onClick={() => changeLength("session", 1)}>+</button>
        </div>
      </div>

      <div>
        <h2 id="timer-label">{isSession ? "Session" : "Break"}</h2>
        <div id="time-left">{formatTime(timeLeft)}</div>
        <button id="start_stop" onClick={handleStartStop}>⏯ Start/Stop</button>
        <button id="reset" onClick={handleReset}>🔁 Reset</button>
      </div>

      <audio
        id="beep"
        ref={audioRef}
        src="https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg"
        preload="auto"
      ></audio>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
