import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import addNotification from "react-push-notification";

const Pomodoro = () => {
  const [timer, setTimer] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const workerRef = useRef(null);

  const bellSoundUrl =
    "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3";
  const audioSoundRef = useRef();

  useEffect(() => {
    workerRef.current = new Worker("./timerworker.js", { type: "module" });
    workerRef.current.onmessage = (e) => {
      const { timer } = e.data;
      setTimer(timer);
      if (timer === 0) {
        audioSoundRef.current.play();
        addNotification({
          title: "Timer completed",
          message: "Your Pomodoro timer is completed",
          native: true,
          icon: "../../assets/logo.png",
          duration: 4000,
        });
        setIsActive(false);
        workerRef.current.postMessage({ action: "pause" });
      }
    };

    return () => {
      workerRef.current.terminate();
    };
  }, []);

  function startTime() {
    setIsActive(true);
    workerRef.current.postMessage({ action: "start", timer });
    console.log("Main thread: started timer");
  }

  function pauseTimer() {
    setIsActive(false);
    workerRef.current.postMessage({ action: "pause" });
  }
  function resetTimer() {
    setIsActive(false);
    workerRef.current.postMessage({ action: "reset" });
  }

  function setBreakTimer() {
    setTimer(300);
    workerRef.current.postMessage({ action: "pause" });
  }
  return (
    <div className="pomodoroRoot">
      <header className="pomodoroHeader">
        <h3>Pomodoro</h3>
      </header>
      <div className="timerSection">
        <IoIosRemoveCircleOutline
          className="icon"
          onClick={() => (timer > 60 ? setTimer(timer - 60) : null)}
        />

        <h1 className="timer">
          {Math.floor(timer / 60)}:
          {timer % 60 > 9 ? "" + (timer % 60) : "0" + (timer % 60)}
        </h1>

        <IoMdAddCircleOutline
          className="icon"
          onClick={() => setTimer(timer + 60)}
        />
      </div>

      <div className="buttonSection">
        <div className="startPauseSeection">
          <div className="actionButtons" onClick={() => startTime()}>
            Start
          </div>
          <div className="actionButtons" onClick={() => pauseTimer()}>
            Pause
          </div>
        </div>

        <div className="resetBreakSection">
          <div className="actionButtons" onClick={() => setBreakTimer()}>
            Break
          </div>
          <div className="actionButtons" onClick={() => resetTimer()}>
            Reset
          </div>
        </div>
      </div>
      <audio id="beep" src={bellSoundUrl} ref={audioSoundRef} preload="auto" />
    </div>
  );
};

export default Pomodoro;
