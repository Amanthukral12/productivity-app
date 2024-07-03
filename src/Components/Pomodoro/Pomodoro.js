import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoIosRemoveCircleOutline } from "react-icons/io";
const Pomodoro = () => {
  const [timer, setTimer] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const bellSoundUrl =
    "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3";
  const audioSoundRef = useRef();
  useEffect(() => {
    let id;
    if (isActive) {
      id = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      setIntervalId(id);
    } else if (!isActive && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    return () => clearInterval(id);
  }, [isActive]);

  useEffect(() => {
    if (timer === 0) {
      audioSoundRef.current.play();
      setIsActive(false);
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [timer, intervalId]);

  function startTime() {
    setIsActive(true);
  }

  function pauseTimer() {
    setIsActive(false);
  }
  function resetTimer() {
    setIsActive(false);
    setTimer(1500);
    setIntervalId(null);
  }

  function setBreakTimer() {
    setTimer(300);
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
