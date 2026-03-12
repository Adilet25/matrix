import "./TableSection.css";
import pro from "../../../components/assets/ic_baseline-account-circle.svg";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";

const API_URL = "https://matrix-8of6.onrender.com";

const TableSection = () => {
  const { user } = useAuth();
  const [topPlayers, setTopPlayers] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);

  useEffect(() => {
    const fetchTopPlayers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/leaderboard`);
        const data = await response.json();
        setTopPlayers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Top players fetch error:", error);
        setTopPlayers([]);
      } finally {
        setLoadingTop(false);
      }
    };

    fetchTopPlayers();
  }, []);

  return (
    <div className="containers">
      <p className="tablename">Таблица</p>

      <div className="tableSec">
        <div className="table0">
          <img
            src={user?.avatar || pro}
            alt="profile"
            width="80"
            style={{ borderRadius: "50%", marginBottom: "12px" }}
          />

          <h2>{user?.nickname || "Guest"}</h2>
          <p>Country: {user?.country || "-"}</p>
          <p>ELO: {user?.elo ?? "-"}</p>
          <p>Level: {user?.level ?? "-"}</p>
        </div>

        <div className="table01">STATA DIAGRAM LAST 5 GAMES</div>

        <div className="table1">
          <p>Топ игроки FACEIT Кыргызстан</p>

          <div className="tableSec_list">
            {loadingTop ? (
              <p>Загрузка...</p>
            ) : topPlayers.length === 0 ? (
              <p>Пока нет данных</p>
            ) : (
              <ol>
                {topPlayers.map((player, index) => (
                  <li key={player.player_id || index}>
                    #{player.position || index + 1} {player.nickname}{" "}
                    <span className="yellowmmr">{player.faceit_elo} MMR</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <div className="table2">
          <p>Последние матчи</p>

          <div className="table2_matches">
            <p className="table2win">Adilet B. 1200MMR</p>
            <p>3:0</p>
            <p className="table2ls">100MMR Adilet U.</p>
          </div>

          <div className="table2_matches">
            <p className="table2win">Adilet B. 1200MMR</p>
            <p>3:0</p>
            <p className="table2ls">100MMR Adilet U.</p>
          </div>

          <div className="table2_matches">
            <p className="table2win">Adilet B. 1200MMR</p>
            <p>3:0</p>
            <p className="table2ls">100MMR Adilet U.</p>
          </div>

          <div className="table2_matches">
            <p className="table2win">Adilet B. 1200MMR</p>
            <p>3:0</p>
            <p className="table2ls">100MMR Adilet U.</p>
          </div>

          <div className="table2_matches">
            <p className="table2win">Adilet B. 1200MMR</p>
            <p>3:0</p>
            <p className="table2ls">100MMR Adilet U.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableSection;
