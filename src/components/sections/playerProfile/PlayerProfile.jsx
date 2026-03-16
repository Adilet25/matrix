import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PlayerProfile.css";

const API_URL = "https://matrix-8of6.onrender.com";

const defaultPerformance = {
  kd: 0,
  winrate: 0,
  hs: 0,
  adr: 0,
  rating: 0,
  matches: 0,
  avgKills: 0,
  avgDeaths: 0,
  avgAssists: 0,
};

const StatCard = ({ title, value, sub }) => {
  return (
    <div className="matrixStatCard">
      <div className="matrixStatLabel">{title}</div>
      <div className="matrixStatValue">{value}</div>
      {sub ? <div className="matrixStatSub">{sub}</div> : null}
    </div>
  );
};

const SectionTitle = ({ title, right }) => {
  return (
    <div className="matrixSectionHead">
      <h2>{title}</h2>
      {right ? <div>{right}</div> : null}
    </div>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "--";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const PlayerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [range, setRange] = useState(30);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setErrorText("");

        const response = await fetch(
          `${API_URL}/api/players/${encodeURIComponent(id)}/profile`,
        );

        const data = await response.json();

        if (!response.ok) {
          setPlayer(null);
          setErrorText(data.message || "Player not found");
          return;
        }

        setPlayer(data);
      } catch (error) {
        console.error("Player profile fetch error:", error);
        setPlayer(null);
        setErrorText("Failed to load player profile");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  const perf = useMemo(() => {
    return player?.performance?.[range] || defaultPerformance;
  }, [player, range]);

  const recentMatches = player?.recentMatches || [];
  const tournaments = player?.tournaments || [];
  const mapStats = player?.mapStats || [];

  if (loading) {
    return (
      <div className="matrixProfilePage ">
        <div className="matrixNoise" />

        <div className="matrixProfileContainer">
          <section className="matrixPanel matrixHeroPanel">
            <div className="matrixCorner matrixCornerTL" />
            <div className="matrixCorner matrixCornerTR" />
            <div className="matrixCorner matrixCornerBL" />
            <div className="matrixCorner matrixCornerBR" />

            <div className="matrixHeroInfo" style={{ width: "100%" }}>
              <div className="matrixTagRow">
                <span className="matrixTag">PLAYER PROFILE</span>
                <span className="matrixTag">LOADING</span>
              </div>

              <h1 className="matrixPlayerName">Loading player profile...</h1>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="matrixProfilePage">
        <div className="matrixNoise" />

        <div className="matrixProfileContainer">
          <section className="matrixPanel matrixHeroPanel">
            <div className="matrixCorner matrixCornerTL" />
            <div className="matrixCorner matrixCornerTR" />
            <div className="matrixCorner matrixCornerBL" />
            <div className="matrixCorner matrixCornerBR" />

            <div className="matrixHeroInfo" style={{ width: "100%" }}>
              <div className="matrixTagRow">
                <span className="matrixTag">PLAYER PROFILE</span>
                <span className="matrixTag">NOT FOUND</span>
              </div>

              <h1 className="matrixPlayerName">
                {errorText || "Player not found"}
              </h1>

              <div className="matrixMetaRow">
                <span>No data for this profile</span>
              </div>

              <div style={{ marginTop: "1rem" }}>
                <button
                  className="matrixTabBtn active"
                  onClick={() => navigate(-1)}
                >
                  GO BACK
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="matrixProfilePage">
      <div className="matrixNoise" />

      <div className="matrixProfileContainer">
        <section className="matrixPanel matrixHeroPanel">
          <div className="matrixCorner matrixCornerTL" />
          <div className="matrixCorner matrixCornerTR" />
          <div className="matrixCorner matrixCornerBL" />
          <div className="matrixCorner matrixCornerBR" />

          <div className="matrixHeroLeft">
            <div className="matrixAvatarWrap">
              <img
                src={player.avatar}
                alt={player.nickname}
                className="matrixAvatar"
              />
              <div className="matrixAvatarGlow" />
            </div>

            <div className="matrixHeroInfo">
              <div className="matrixTagRow">
                <span className="matrixTag">PLAYER PROFILE</span>
                <span className="matrixTag">ONLINE</span>
              </div>

              <h1 className="matrixPlayerName">{player.nickname}</h1>

              <div className="matrixMetaRow">
                <span>LVL {player.level ?? 0}</span>
                <span>ELO {player.elo ?? 0}</span>
                <span>#{player.serverRank ?? "--"} SERVER</span>
                <span>{player.country || "--"}</span>
              </div>
            </div>
          </div>

          <div className="matrixHeroRight">
            <div className="matrixMiniInfo">
              <span className="matrixMiniLabel">RATING</span>
              <span className="matrixMiniValue">{player.rating ?? 0}</span>
            </div>
            <div className="matrixMiniInfo">
              <span className="matrixMiniLabel">MATCHES</span>
              <span className="matrixMiniValue">{player.matches ?? 0}</span>
            </div>
            <div className="matrixMiniInfo">
              <span className="matrixMiniLabel">WINRATE</span>
              <span className="matrixMiniValue">{player.winrate ?? 0}%</span>
            </div>
          </div>
        </section>

        <section className="matrixStatsGrid">
          <StatCard title="K/D" value={player.kd ?? 0} sub="career ratio" />
          <StatCard
            title="WINRATE"
            value={`${player.winrate ?? 0}%`}
            sub="all matches"
          />
          <StatCard
            title="HEADSHOT"
            value={`${player.headshot ?? 0}%`}
            sub="accuracy impact"
          />
          <StatCard
            title="ADR"
            value={player.adr ?? 0}
            sub="avg damage round"
          />
          <StatCard
            title="AVG KILLS"
            value={player.avgKills ?? 0}
            sub="per match"
          />
          <StatCard
            title="AVG DEATHS"
            value={player.avgDeaths ?? 0}
            sub="per match"
          />
        </section>

        <section className="matrixPanel">
          <SectionTitle
            title="MATCH PERFORMANCE"
            right={
              <div className="matrixTabs">
                {[30, 60, 90].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`matrixTabBtn ${range === item ? "active" : ""}`}
                    onClick={() => setRange(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            }
          />

          <div className="matrixPerformanceGrid">
            <StatCard
              title="K/D"
              value={perf.kd}
              sub={`last ${range} matches`}
            />
            <StatCard
              title="WINRATE"
              value={`${perf.winrate}%`}
              sub={`last ${range} matches`}
            />
            <StatCard
              title="HS%"
              value={`${perf.hs}%`}
              sub={`last ${range} matches`}
            />
            <StatCard
              title="ADR"
              value={perf.adr}
              sub={`last ${range} matches`}
            />
            <StatCard
              title="RATING"
              value={perf.rating}
              sub={`last ${range} matches`}
            />
          </div>
        </section>

        <div className="matrixTwoCol">
          <section className="matrixPanel">
            <SectionTitle title="RECENT MATCHES" />

            <div className="matrixTableWrap">
              <table className="matrixTable">
                <thead>
                  <tr>
                    <th>MAP</th>
                    <th>RESULT</th>
                    <th>SCORE</th>
                    <th>K</th>
                    <th>D</th>
                    <th>ADR</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMatches.length === 0 ? (
                    <tr>
                      <td colSpan="6">No recent matches</td>
                    </tr>
                  ) : (
                    recentMatches.map((match, index) => (
                      <tr key={match.matchId || `${match.map}-${index}`}>
                        <td>{match.map || "--"}</td>
                        <td>
                          <span
                            className={`matrixBadge ${
                              match.result === "WIN"
                                ? "matrixBadgeWin"
                                : "matrixBadgeLoss"
                            }`}
                          >
                            {match.result || "--"}
                          </span>
                        </td>
                        <td>{match.score || "--"}</td>
                        <td>{match.kills ?? 0}</td>
                        <td>{match.deaths ?? 0}</td>
                        <td>{match.adr ?? 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="matrixPanel">
            <SectionTitle title="RECENT TOURNAMENTS" />

            <div className="matrixTournamentList">
              {tournaments.length === 0 ? (
                <div className="matrixTournamentCard">
                  <div className="matrixTournamentLeft">
                    <div className="matrixTournamentName">
                      No tournaments yet
                    </div>
                    <div className="matrixTournamentDate">--</div>
                  </div>
                  <div className="matrixTournamentPlace">--</div>
                </div>
              ) : (
                tournaments.map((tournament, index) => (
                  <div
                    className="matrixTournamentCard"
                    key={`${tournament.name}-${index}`}
                  >
                    <div className="matrixTournamentLeft">
                      <div className="matrixTournamentName">
                        {tournament.name || "--"}
                      </div>
                      <div className="matrixTournamentDate">
                        {formatDate(tournament.date)}
                      </div>
                    </div>
                    <div className="matrixTournamentPlace">
                      {tournament.place || "--"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="matrixPanel">
          <SectionTitle title="MAP STATS" />

          <div className="matrixMapGrid">
            {mapStats.length === 0 ? (
              <div className="matrixMapCard">
                <div className="matrixMapTop">
                  <span className="matrixMapName">No map stats</span>
                  <span className="matrixMapMatches">0 matches</span>
                </div>

                <div className="matrixProgressBar">
                  <div className="matrixProgressFill" style={{ width: "0%" }} />
                </div>

                <div className="matrixMapBottom">
                  <span>Winrate</span>
                  <span>0%</span>
                </div>
              </div>
            ) : (
              mapStats.map((map, index) => (
                <div className="matrixMapCard" key={`${map.map}-${index}`}>
                  <div className="matrixMapTop">
                    <span className="matrixMapName">{map.map || "--"}</span>
                    <span className="matrixMapMatches">
                      {map.matches ?? 0} matches
                    </span>
                  </div>

                  <div className="matrixProgressBar">
                    <div
                      className="matrixProgressFill"
                      style={{ width: `${map.winrate ?? 0}%` }}
                    />
                  </div>

                  <div className="matrixMapBottom">
                    <span>Winrate</span>
                    <span>{map.winrate ?? 0}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PlayerProfile;
