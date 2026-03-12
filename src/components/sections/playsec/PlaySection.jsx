import "./PlaySection.css";
import { useNavigate } from "react-router-dom";

const PlaySection = () => {
  const navigate = useNavigate();

  return (
    <div className="containers">
      <h1>Train with Us</h1>

      <div className="playCard_list">
        <div className="playCard" id="playCard1">
          <h2>Counter Strafe</h2>
          <p>Upgrade your movement with pro players data</p>

          <button
            className="playCard_btn"
            onClick={() => navigate("/playground/counter-strafe")}
          >
            Play
          </button>
        </div>

        <div className="playCard" id="playCard2">
          <h2>Reaction Time</h2>
          <p>Upgrade your reaction with training your brain</p>

          <button
            className="playCard_btn"
            onClick={() => navigate("/playground/reaction")}
          >
            Play
          </button>
        </div>

        <div className="playCard" id="playCard3">
          <h2>Aim Trainer</h2>
          <p>Upgrade your movement with pro players data</p>

          <button
            className="playCard_btn"
            onClick={() => navigate("/playground/aim")}
          >
            Play
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaySection;
