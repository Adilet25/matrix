import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SystemOverview.css";

const cards = [
  {
    id: "counter",
    title: "COUNTER STRAFE",
    label: "MOVEMENT",
    desc: "Train perfect stop timing and directional control like in real CS rounds.",
    stats: ["A/D Switch", "Stop Accuracy", "Movement Discipline"],
    color: "green",
    link: "/playground/counter-strafe",
  },
  {
    id: "reaction",
    title: "REACTION TIME",
    label: "REFLEX",
    desc: "Improve reaction speed, target response and decision timing under pressure.",
    stats: ["Reaction Speed", "Trigger Timing", "Focus"],
    color: "blue",
    link: "/playground/reaction",
  },
  {
    id: "aim",
    title: "AIM TRAINER",
    label: "PRECISION",
    desc: "Develop flicks, precision and target control with repeated practice loops.",
    stats: ["Flick Control", "Precision", "Micro Aim"],
    color: "red",
    link: "/playground/aim",
  },
];

const SystemOverview = () => {
  const [activeCard, setActiveCard] = useState(cards[0]);
  const navigate = useNavigate();

  return (
    <section className="systemOverview containers">
      <div className="systemHeader">
        <p className="systemLabel">[ MATRIX // SYSTEM OVERVIEW ]</p>
        <h2>Build your mechanics step by step</h2>
        <p className="systemSub">
          Choose a training mode and upgrade the core skills that matter in
          matches.
        </p>
      </div>

      <div className="systemGrid">
        <div className="systemMonitor">
          <div className="systemWindowTop">
            <span className="pixelDot green" />
            <span className="pixelDot yellow" />
            <span className="pixelDot red" />
          </div>

          <div className={`systemScreen ${activeCard.color}`}>
            <div className="systemScanlines" />

            <p className="systemMode">{activeCard.label}</p>
            <h3>{activeCard.title}</h3>
            <p className="systemDesc">{activeCard.desc}</p>

            <div className="systemStats">
              {activeCard.stats.map((item) => (
                <div key={item} className="systemStatBox">
                  {item}
                </div>
              ))}
            </div>

            <div className="systemFooter">
              <span>STATUS: READY</span>
              <span>MODE: {activeCard.id.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="systemCards">
          {cards.map((card) => (
            <button
              key={card.id}
              className={`systemCard ${activeCard.id === card.id ? "active" : ""}`}
              onMouseEnter={() => setActiveCard(card)}
              onClick={() => {
                (setActiveCard(card), navigate(card.link));
              }}
            >
              <div className="systemCardTop">
                <span className={`systemBadge ${card.color}`}>
                  {card.label}
                </span>
                <span className="systemArrow">→</span>
              </div>

              <h4>{card.title}</h4>
              <p>{card.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SystemOverview;
