import { useEffect, useState } from "react";
import "./MatrixLoader.css";

const loadingMessages = [
  "SYNCING DATA",
  "INITIALIZING HUD",
  "LOADING PLAYER CORE",
  "CONNECTING TO MATRIX",
  "RENDERING INTERFACE",
];

const MatrixLoader = ({ fullScreen = true, label = "LOADING SYSTEM" }) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 2;
        return next >= 100 ? 100 : next;
      });
    }, 120);

    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 900);

    return () => {
      clearInterval(progressTimer);
      clearInterval(messageTimer);
    };
  }, []);

  return (
    <div className={`mx-loader1 ${fullScreen ? "mx-loader--fullscreen" : ""}`}>
      <div className="mx-loader__scanlines" />

      <div className="mx-loader__panel">
        <div className="mx-loader__corners">
          <span className="mx-loader__corner mx-loader__corner--tl" />
          <span className="mx-loader__corner mx-loader__corner--tr" />
          <span className="mx-loader__corner mx-loader__corner--bl" />
          <span className="mx-loader__corner mx-loader__corner--br" />
        </div>

        <div className="mx-loader__topline">
          <span>[ MATRIX // BOOT SEQUENCE ]</span>
          <span>STATUS: ACTIVE</span>
        </div>

        <div className="mx-loader__core">
          <div className="mx-loader__spinnerWrap">
            <div className="mx-loader__spinnerOuter" />
            <div className="mx-loader__spinnerInner" />
            <div className="mx-loader__spinnerCenter" />
          </div>

          <div className="mx-loader__content">
            <h2 className="mx-loader__title">{label}</h2>
            <p className="mx-loader__subtitle">
              {loadingMessages[messageIndex]}
            </p>

            <div className="mx-loader__progressBox">
              <div className="mx-loader__progressHeader">
                <span>PROGRESS</span>
                <span>{progress}%</span>
              </div>

              <div className="mx-loader__bar">
                <div
                  className="mx-loader__fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mx-loader__ticks">
                {Array.from({ length: 20 }).map((_, i) => (
                  <span
                    key={i}
                    className={`mx-loader__tick ${
                      i < Math.floor(progress / 5) ? "is-active" : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mx-loader__statusRow">
              <span className="mx-loader__dot" />
              <span className="mx-loader__statusText">PLEASE WAIT...</span>
            </div>
          </div>
        </div>

        <div className="mx-loader__bottom">
          <div className="mx-loader__miniBars">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <span className="mx-loader__code">PX-HUD-01</span>
        </div>
      </div>
    </div>
  );
};

export default MatrixLoader;
