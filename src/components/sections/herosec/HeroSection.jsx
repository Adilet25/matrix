import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./HeroSection.css";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const heroRef = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMove = (e) => {
      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setPos({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      });
    };

    const node = heroRef.current;
    if (node) {
      node.addEventListener("mousemove", handleMove);
    }

    return () => {
      if (node) {
        node.removeEventListener("mousemove", handleMove);
      }
    };
  }, []);

  return (
    <section className="heroSection" ref={heroRef}>
      <div className="heroGlow" />
      <div className="heroGrid" />

      <div
        className="heroCursorTarget"
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
        }}
      />

      <div className="heroContent">
        <div className="heroLeft">
          <p className="heroLabel">FACEIT TRAINING PLATFORM</p>

          <h1 className="heroTitle">
            Train your <span>Counter-Strafe</span>, improve your mechanics,
            dominate your next match.
          </h1>

          <p className="heroSubtitle">
            Practice reaction, movement, aim and compare yourself with FACEIT
            players from your region.
          </p>

          <div className="heroButtons">
            <button
              className="heroBtn heroBtnMain"
              onClick={() => navigate("/playground")}
            >
              Start Training
            </button>

            <button
              className="heroBtn heroBtnGhost"
              onClick={() => navigate("/leaderboard")}
            >
              Open Leaderboard
            </button>
          </div>

          <div className="heroStats">
            <div className="heroStatCard">
              <span className="heroStatNumber">3</span>
              <span className="heroStatText">Training Modes</span>
            </div>

            <div className="heroStatCard">
              <span className="heroStatNumber">FACEIT</span>
              <span className="heroStatText">Connected</span>
            </div>

            <div className="heroStatCard">
              <span className="heroStatNumber">LIVE</span>
              <span className="heroStatText">Leaderboard</span>
            </div>
          </div>
        </div>

        <div className="heroRight">
          <div className="heroPanel">
            <div className="heroPanelHeader">
              <span className="heroDot green" />
              <span className="heroDot yellow" />
              <span className="heroDot red" />
            </div>

            <div className="heroRadar">
              <div className="heroRadarCircle heroRadarCircle1" />
              <div className="heroRadarCircle heroRadarCircle2" />
              <div className="heroRadarCircle heroRadarCircle3" />
              <div className="heroRadarSweep" />
              <div className="heroRadarCenter" />
            </div>

            <div className="heroUserCard">
              <p className="heroUserTitle">
                {user ? "PLAYER DETECTED" : "NO PLAYER LINKED"}
              </p>

              <div className="heroUserRows">
                <div className="heroUserRow">
                  <span>Status</span>
                  <strong>{user ? "ONLINE" : "OFFLINE"}</strong>
                </div>

                <div className="heroUserRow">
                  <span>Nickname</span>
                  <strong>{user?.nickname || "Guest"}</strong>
                </div>

                <div className="heroUserRow">
                  <span>ELO</span>
                  <strong>{user?.elo ?? "---"}</strong>
                </div>

                <div className="heroUserRow">
                  <span>Level</span>
                  <strong>{user?.level ?? "---"}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
