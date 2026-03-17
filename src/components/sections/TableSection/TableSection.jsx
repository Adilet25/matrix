import "./TableSection.css";
import defaultAvatar from "../../../components/assets/ic_baseline-account-circle.svg";
import faceitLogo from "../../assets/fcsmlogo.svg";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://matrix-8of6.onrender.com";

const TableSection = () => {
  const { user, apiUrl } = useAuth();

  const [region, setRegion] = useState("EU");
  const [country, setCountry] = useState("kg");

  const [topPlayers, setTopPlayers] = useState([]);
  const [loadingTopPlayers, setLoadingTopPlayers] = useState(true);

  const [statsLimit, setStatsLimit] = useState(30);
  const [playerStats, setPlayerStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const navigate = useNavigate();

  const openFaceitLogin = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = `${apiUrl}/auth/faceit/login`;
    } else {
      window.open(
        `${apiUrl}/auth/faceit/login`,
        "faceitLogin",
        "width=600,height=700",
      );
    }
  };

  useEffect(() => {
    const fetchTopPlayers = async () => {
      setLoadingTopPlayers(true);

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
        setLoadingTopPlayers(false);
      }
    };

    fetchTopPlayers();
  }, [region, country]);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      if (!user?.faceitId) {
        setPlayerStats(null);
        return;
      }

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
    <section className="mx-board containers">
      <div className="mx-board__header">
        <div>
          <p className="mx-board__eyebrow">[ MATRIX // LIVE TERMINAL ]</p>
          <h2 className="mx-board__title">PLAYER DATA GRID</h2>
        </div>
        <div className="mx-board__signal">
          <span className="mx-board__signal-dot" />
          ACTIVE
        </div>
      </div>

      <div className="mx-grid">
        <article className="mx-panel mx-panel--profile">
          <div className="mx-panel__chrome">
            <span>IDENTITY</span>
            <span>UNIT_01</span>
          </div>

          <div className="mx-profile">
            <div className="mx-profile__avatar-wrap">
              <img
                src={user?.avatar || defaultAvatar}
                alt="profile"
                className="mx-profile__avatar"
              />
            </div>

            <div className="mx-profile__name-block">
              <h3 className="mx-profile__nickname">
                {user?.nickname || "Guest"}
              </h3>
              <p className="mx-profile__sub">FACEIT OPERATOR PROFILE</p>
            </div>

            <div className="mx-profile__stats">
              <div className="mx-profile__stat">
                <span className="mx-profile__label">Country</span>
                <span className="mx-profile__value">
                  {user?.country || "--"}
                </span>
              </div>

              <div className="mx-profile__stat">
                <span className="mx-profile__label">ELO</span>
                <span className="mx-profile__value mx-profile__value--gold">
                  {user?.elo ?? "--"}
                </span>
              </div>

              <div className="mx-profile__stat">
                <span className="mx-profile__label">Level</span>
                <span className="mx-profile__value">{user?.level ?? "--"}</span>
              </div>
            </div>
          </div>
        </article>

        <article className="mx-panel mx-panel--stats">
          <div className="mx-panel__chrome">
            <span>ANALYTICS</span>
            <span>RECENT_MATCHES</span>
          </div>

          <div className="mx-section-head">
            <h3 className="mx-section-head__title">RECENT STATS</h3>

            <div className="mx-switcher">
              <button
                className={`mx-chip ${statsLimit === 30 ? "mx-chip--active" : ""}`}
                onClick={() => setStatsLimit(30)}
              >
                30
              </button>
              <button
                className={`mx-chip ${statsLimit === 60 ? "mx-chip--active" : ""}`}
                onClick={() => setStatsLimit(60)}
              >
                60
              </button>
              <button
                className={`mx-chip ${statsLimit === 100 ? "mx-chip--active" : ""}`}
                onClick={() => setStatsLimit(100)}
              >
                100
              </button>
            </div>
          </div>

          {loadingStats ? (
            <div className="mx-empty">
              <div className="mx-loader" />
              <p>LOADING PLAYER STATS...</p>
            </div>
          ) : !playerStats ? (
            <div className="mx-loginbox">
              <p className="mx-loginbox__text">
                CONNECT FACEIT TO UNLOCK YOUR MATCH ANALYTICS
              </p>
              <button className="mx-loginbox__button" onClick={openFaceitLogin}>
                <span>LOGIN WITH FACEIT</span>
                <img src={faceitLogo} alt="FACEIT" />
              </button>
            </div>
          ) : (
            <div className="mx-stats-grid">
              <div className="mx-stat-card">
                <span className="mx-stat-card__label">MATCHES</span>
                <strong className="mx-stat-card__value">
                  {playerStats.totalMatches}
                </strong>
              </div>

              <div className="mx-stat-card">
                <span className="mx-stat-card__label">WINRATE</span>
                <strong className="mx-stat-card__value">
                  {playerStats.winrate}%
                </strong>
              </div>

              <div className="mx-stat-card">
                <span className="mx-stat-card__label">WINS / LOSSES</span>
                <strong className="mx-stat-card__value">
                  {playerStats.wins} / {playerStats.losses}
                </strong>
              </div>

              <div className="mx-stat-card">
                <span className="mx-stat-card__label">K / D</span>
                <strong className="mx-stat-card__value">
                  {playerStats.kd}
                </strong>
              </div>

              <div className="mx-stat-card mx-stat-card--wide">
                <span className="mx-stat-card__label">AVG KILLS</span>
                <strong className="mx-stat-card__value">
                  {playerStats.avgKills}
                </strong>
              </div>
            </div>
          )}
        </article>

        <article className="mx-panel mx-panel--leaders">
          <div className="mx-panel__chrome">
            <span>LEADERBOARD</span>
            <span>RANKING_TOP_10</span>
          </div>

          <div className="mx-section-head mx-section-head--stack">
            <h3 className="mx-section-head__title">TOP FACEIT PLAYERS</h3>

            <div className="mx-filters">
              <select
                className="mx-select"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="EU">EU</option>
                <option value="NA">NA</option>
                <option value="SA">SA</option>
                <option value="OCE">OCE</option>
                <option value="SEA">SEA</option>
              </select>

              <select
                className="mx-select"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">ALL COUNTRIES</option>
                <option value="kg">KYRGYZSTAN</option>
                <option value="kz">KAZAKHSTAN</option>
                <option value="uz">UZBEKISTAN</option>
                <option value="ru">RUSSIA</option>
                <option value="tr">TURKEY</option>
                <option value="us">USA</option>
              </select>
            </div>
          </div>

          <div className="mx-ranking">
            {loadingTopPlayers ? (
              <div className="mx-empty">
                <div className="mx-loader" />
                <p>SYNCING LEADERBOARD...</p>
              </div>
            ) : topPlayers.length === 0 ? (
              <div className="mx-empty">
                <p>NO DATA AVAILABLE</p>
              </div>
            ) : (
              topPlayers.map((player, index) => (
                <div
                  className="mx-rank-row"
                  key={player.player_id || index}
                  onClick={() => navigate(`/player/${player.nickname}`)}
                >
                  <div className="mx-rank-row__left">
                    <span className="mx-rank-row__position">
                      #{player.position || index + 1}
                    </span>
                    <span className="mx-rank-row__nickname">
                      {player.nickname}
                    </span>
                  </div>

                  <div className="mx-rank-row__right">
                    <span className="mx-rank-row__mmr">
                      {player.faceit_elo} MMR
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="mx-panel mx-panel--matches">
          <div className="mx-panel__chrome">
            <span>BATTLE FEED</span>
            <span>LAST_GAMES</span>
          </div>

          <div className="mx-section-head">
            <h3 className="mx-section-head__title">LATEST MATCHES</h3>
          </div>

          <div className="mx-feed">
            <div className="mx-feed-card">
              <div className="mx-feed-card__team mx-feed-card__team--win">
                <span className="mx-feed-card__name">Adilet B.</span>
                <span className="mx-feed-card__meta">1200 MMR</span>
              </div>

              <div className="mx-feed-card__score">3 : 0</div>

              <div className="mx-feed-card__team mx-feed-card__team--lose">
                <span className="mx-feed-card__name">Adilet U.</span>
                <span className="mx-feed-card__meta">100 MMR</span>
              </div>
            </div>

            <div className="mx-feed-card">
              <div className="mx-feed-card__team mx-feed-card__team--win">
                <span className="mx-feed-card__name">Matrix Prime</span>
                <span className="mx-feed-card__meta">1450 MMR</span>
              </div>

              <div className="mx-feed-card__score">13 : 9</div>

              <div className="mx-feed-card__team mx-feed-card__team--lose">
                <span className="mx-feed-card__name">Enemy Squad</span>
                <span className="mx-feed-card__meta">1360 MMR</span>
              </div>
            </div>

            <div className="mx-feed-card">
              <div className="mx-feed-card__team mx-feed-card__team--win">
                <span className="mx-feed-card__name">Neo Aim</span>
                <span className="mx-feed-card__meta">1320 MMR</span>
              </div>

              <div className="mx-feed-card__score">16 : 12</div>

              <div className="mx-feed-card__team mx-feed-card__team--lose">
                <span className="mx-feed-card__name">Rush Team</span>
                <span className="mx-feed-card__meta">1280 MMR</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default TableSection;
