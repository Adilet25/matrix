import "./TableSection.css";
import pro from "../../../components/assets/ic_baseline-account-circle.svg";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";

const API_URL = "https://matrix-8of6.onrender.com";

const TableSection = () => {
  const { user } = useAuth();

  const [topPlayers, setTopPlayers] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);

  const [region, setRegion] = useState("EU");
  const [country, setCountry] = useState("kg");

  useEffect(() => {
    const fetchTopPlayers = async () => {
      setLoadingTop(true);

      try {
        let url = `${API_URL}/api/leaderboard?region=${region}&limit=10`;

        if (country) {
          url += `&country=${country}`;
        }

        const response = await fetch(url);
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
  }, [region, country]);

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
          <p>Топ игроки FACEIT</p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "12px",
              flexWrap: "wrap",
            }}
          >
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="EU">EU</option>
              <option value="NA">NA</option>
              <option value="SA">SA</option>
              <option value="OCE">OCE</option>
              <option value="SEA">SEA</option>
            </select>

            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">All countries</option>
              <option value="kg">Kyrgyzstan</option>
              <option value="kz">Kazakhstan</option>
              <option value="uz">Uzbekistan</option>
              <option value="ru">Russia</option>
              <option value="tr">Turkey</option>
              <option value="us">USA</option>
            </select>
          </div>

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
