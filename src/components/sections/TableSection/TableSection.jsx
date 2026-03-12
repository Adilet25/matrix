import "./TableSection.css";
import pro from "../../../components/assets/ic_baseline-account-circle.svg";
import fcsmlogo from "../../assets/fcsmlogo.svg";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";

const API_URL = "https://matrix-8of6.onrender.com";

const TableSection = () => {
  const { user } = useAuth();

  const [topPlayers, setTopPlayers] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);

  const [region, setRegion] = useState("EU");
  const [country, setCountry] = useState("kg");

  const [statsLimit, setStatsLimit] = useState(30);
  const [playerStats, setPlayerStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const { apiUrl } = useAuth();

  const handleLogin = () => {
    window.open(
      `${apiUrl}/auth/faceit/login`,
      "faceitLogin",
      "width=500,height=700",
    );
  };
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

  useEffect(() => {
    const fetchPlayerStats = async () => {
      if (!user?.faceitId) return;

      setLoadingStats(true);

      try {
        const response = await fetch(
          `${API_URL}/api/player-stats/${user.faceitId}?limit=${statsLimit}&gameId=cs2`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();
        setPlayerStats(data);
      } catch (error) {
        console.error("Player stats fetch error:", error);
        setPlayerStats(null);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchPlayerStats();
  }, [user?.faceitId, statsLimit]);

  return (
    <div className="containers">
      <p className="tablename" style={{ margin: "1rem 0" }}>
        Таблица
      </p>

      <div className="tableSec">
        <div className="table0 tableshab">
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

        <div className="table01 tableshab">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <p style={{ margin: 0 }}>Статы за последние матчи</p>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                style={{ cursor: "pointer" }}
                onClick={() => setStatsLimit(30)}
              >
                30
              </button>
              <button
                style={{ cursor: "pointer" }}
                onClick={() => setStatsLimit(60)}
              >
                60
              </button>
              <button
                style={{ cursor: "pointer" }}
                onClick={() => setStatsLimit(100)}
              >
                100
              </button>
            </div>
          </div>

          {loadingStats ? (
            <p>Загрузка статистики...</p>
          ) : !playerStats ? (
            <button onClick={handleLogin} className="logBtn_nav">
              Зайдите в аккаунт
              <img src={fcsmlogo} alt="" />
            </button>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
              }}
            >
              <div className="miniStat">
                <strong>Matches</strong>
                <p>{playerStats.totalMatches}</p>
              </div>

              <div className="miniStat">
                <strong>Winrate</strong>
                <p>{playerStats.winrate}%</p>
              </div>

              <div className="miniStat">
                <strong>Wins / Losses</strong>
                <p>
                  {playerStats.wins} / {playerStats.losses}
                </p>
              </div>

              <div className="miniStat">
                <strong>K/D</strong>
                <p>{playerStats.kd}</p>
              </div>

              <div className="miniStat" style={{ gridColumn: "1 / -1" }}>
                <strong>Avg Kills</strong>
                <p>{playerStats.avgKills}</p>
              </div>
            </div>
          )}
        </div>

        <div className="table1 tableshab">
          <p>Топ игроки FACEIT</p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "12px",
              flexWrap: "wrap",
            }}
          >
            <select
              value={region}
              style={{ background: "#000" }}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="EU">EU</option>
              <option value="NA">NA</option>
              <option value="SA">SA</option>
              <option value="OCE">OCE</option>
              <option value="SEA">SEA</option>
            </select>

            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={{ background: "#000" }}
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

        <div className="table2 tableshab">
          <p>Последние матчи</p>

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
