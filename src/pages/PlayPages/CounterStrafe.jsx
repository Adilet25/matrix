import { useEffect, useRef, useState } from "react";
import "./CounterStrafe.css";

const CounterStrafe = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [heldKey, setHeldKey] = useState(null); // A or D
  const [enemyVisible, setEnemyVisible] = useState(false);
  const [message, setMessage] = useState("Hold A or D to start");
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const timerRef = useRef(null);

  const clearEnemyTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetGame = () => {
    clearEnemyTimer();
    setGameStarted(false);
    setHeldKey(null);
    setEnemyVisible(false);
    setMessage("Hold A or D to start");
    setScore(0);
    setIsGameOver(false);
  };

  const gameOver = (text = "Game Over") => {
    clearEnemyTimer();
    setEnemyVisible(false);
    setGameStarted(false);
    setHeldKey(null);
    setIsGameOver(true);
    setMessage(text);
  };

  const startEnemyTimer = (currentHeldKey) => {
    clearEnemyTimer();
    setEnemyVisible(false);
    setMessage(`Holding ${currentHeldKey}... wait for ENEMY`);

    const delay = Math.floor(Math.random() * 550) + 350; // 1-3 sec

    timerRef.current = setTimeout(() => {
      setEnemyVisible(true);
      setMessage("ENEMY");
    }, delay);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();

      if (key !== "A" && key !== "D") return;

      if (isGameOver) return;

      // start holding first key
      if (!gameStarted && !heldKey) {
        setGameStarted(true);
        setHeldKey(key);
        startEnemyTimer(key);
        return;
      }

      // if enemy is not visible yet and user presses another key -> mistake
      if (!enemyVisible) {
        if (heldKey && key !== heldKey) {
          gameOver("Too early! You pressed before ENEMY");
        }
        return;
      }

      // enemy visible: must press opposite key
      const correctKey = heldKey === "A" ? "D" : "A";

      if (key === correctKey) {
        const nextScore = score + 1;
        setScore(nextScore);
        setEnemyVisible(false);
        setHeldKey(key);
        setMessage("GOOD");

        setTimeout(() => {
          startEnemyTimer(key);
        }, 400);
      } else {
        gameOver("Wrong key!");
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toUpperCase();

      if (key !== "A" && key !== "D") return;
      if (isGameOver) return;

      // releasing held key during active round = fail
      if (gameStarted && heldKey === key) {
        gameOver("You released the movement key");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearEnemyTimer();
    };
  }, [gameStarted, heldKey, enemyVisible, score, isGameOver]);

  return (
    <div className="counterContainer">
      <h1>Counter Strafe Trainer</h1>

      <div className="counterInfo">
        <p>Hold A or D</p>
        <p>When ENEMY appears, press the opposite key</p>
        <p>Do not release your current movement key too early</p>
      </div>

      <div className={`enemyBox ${enemyVisible ? "enemyVisible" : ""}`}>
        {enemyVisible ? "ENEMY" : "WAIT"}
      </div>

      <p className="counterMessage">{message}</p>

      <h3>Score: {score}</h3>

      <button className="counterBtn" onClick={resetGame}>
        Restart
      </button>
    </div>
  );
};

export default CounterStrafe;
