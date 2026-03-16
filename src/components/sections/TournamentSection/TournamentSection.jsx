import { useEffect, useMemo, useState } from "react";
import "./Tournament.css";
import TournamentBracket from "../TournamentBracket/TournamentBracket";

const API_URL = "https://matrix-8of6.onrender.com";

const TournamentSection = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);

  const [participants, setParticipants] = useState([]);
  const [matches, setMatches] = useState([]);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [joining, setJoining] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [joinNickname, setJoinNickname] = useState("");

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        activeFilter === "ALL" ? true : item.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [tournaments, search, activeFilter]);

  const groupedRounds = useMemo(() => {
    return matches.reduce((acc, match) => {
      if (!acc[match.round]) {
        acc[match.round] = [];
      }
      acc[match.round].push(match);
      return acc;
    }, {});
  }, [matches]);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoadingTournaments(true);

        const response = await fetch(`${API_URL}/api/tournaments`);
        const data = await response.json();

        const normalized = Array.isArray(data) ? data : [];
        setTournaments(normalized);

        if (normalized.length > 0) {
          setSelectedTournament(normalized[0]);
        }
      } catch (error) {
        console.error("Tournament fetch error:", error);
        setTournaments([]);
      } finally {
        setLoadingTournaments(false);
      }
    };

    fetchTournaments();
  }, []);

  useEffect(() => {
    const fetchTournamentDetails = async () => {
      if (!selectedTournament?.slug) return;

      try {
        setLoadingDetails(true);

        const [participantsRes, matchesRes] = await Promise.all([
          fetch(
            `${API_URL}/api/tournaments/${selectedTournament.slug}/participants`,
          ),
          fetch(
            `${API_URL}/api/tournaments/${selectedTournament.slug}/matches`,
          ),
        ]);

        const participantsData = await participantsRes.json();
        const matchesData = await matchesRes.json();

        setParticipants(
          Array.isArray(participantsData) ? participantsData : [],
        );
        setMatches(Array.isArray(matchesData) ? matchesData : []);
      } catch (error) {
        console.error("Tournament details fetch error:", error);
        setParticipants([]);
        setMatches([]);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchTournamentDetails();
  }, [selectedTournament]);

  const handleSelectTournament = (tournament) => {
    setSelectedTournament(tournament);
  };

  const handleJoinTournament = async () => {
    if (!selectedTournament?.slug) return;

    try {
      setJoining(true);

      const response = await fetch(
        `${API_URL}/api/tournaments/${selectedTournament.slug}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            nickname: joinNickname || "Guest Player",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to join tournament");
        return;
      }

      alert("You joined the tournament");

      const participantsRes = await fetch(
        `${API_URL}/api/tournaments/${selectedTournament.slug}/participants`,
      );
      const participantsData = await participantsRes.json();
      setParticipants(Array.isArray(participantsData) ? participantsData : []);
    } catch (error) {
      console.error("Join tournament error:", error);
      alert("Join tournament failed");
    } finally {
      setJoining(false);
    }
  };

  const handleGenerateBracket = async () => {
    if (!selectedTournament?.slug) return;

    try {
      setGenerating(true);

      const response = await fetch(
        `${API_URL}/api/tournaments/${selectedTournament.slug}/generate-bracket`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to generate bracket");
        return;
      }

      alert("Bracket generated successfully");

      const matchesRes = await fetch(
        `${API_URL}/api/tournaments/${selectedTournament.slug}/matches`,
      );
      const matchesData = await matchesRes.json();
      setMatches(Array.isArray(matchesData) ? matchesData : []);
    } catch (error) {
      console.error("Generate bracket error:", error);
      alert("Generate bracket failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section className="mx-tour containers">
      <div className="mx-tour__header">
        <div>
          <p className="mx-tour__eyebrow">[ MATRIX // TOURNAMENT NODE ]</p>
          <h2 className="mx-tour__title">TOURNAMENT GRID</h2>
        </div>

        <div className="mx-tour__status">
          <span className="mx-tour__status-dot" />
          SYSTEM ONLINE
        </div>
      </div>

      <div className="mx-tour__layout">
        <aside className="mx-tour-panel mx-tour-panel--control">
          <div className="mx-tour-panel__chrome">
            <span>CONTROL_PANEL</span>
            <span>TOURNAMENT_ACCESS</span>
          </div>

          <div className="mx-tour-intro">
            <h3 className="mx-tour-intro__title">ENTER THE BRACKET</h3>
            <p className="mx-tour-intro__text">
              Выбирай турнир, отслеживай статус, смотри участников и сразу
              подключайся к матчам. Эта панель работает как турнирный терминал
              управления внутри Matrix.
            </p>
          </div>

          <div className="mx-tour-search">
            <label className="mx-tour-search__label">SEARCH TOURNAMENT</label>
            <input
              type="text"
              placeholder="Find tournament..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mx-tour-search__input"
            />
          </div>

          <div className="mx-tour-filters">
            <button
              className={`mx-tour-chip ${activeFilter === "ALL" ? "mx-tour-chip--active" : ""}`}
              onClick={() => setActiveFilter("ALL")}
            >
              ALL
            </button>
            <button
              className={`mx-tour-chip ${activeFilter === "OPEN" ? "mx-tour-chip--active" : ""}`}
              onClick={() => setActiveFilter("OPEN")}
            >
              OPEN
            </button>
            <button
              className={`mx-tour-chip ${activeFilter === "LIVE" ? "mx-tour-chip--active" : ""}`}
              onClick={() => setActiveFilter("LIVE")}
            >
              LIVE
            </button>
            <button
              className={`mx-tour-chip ${activeFilter === "FINISHED" ? "mx-tour-chip--active" : ""}`}
              onClick={() => setActiveFilter("FINISHED")}
            >
              DONE
            </button>
          </div>

          <div className="mx-tour-list">
            {loadingTournaments ? (
              <div className="mx-tour-empty">
                <p>LOADING TOURNAMENTS...</p>
              </div>
            ) : filteredTournaments.length === 0 ? (
              <div className="mx-tour-empty">
                <p>NO TOURNAMENTS FOUND</p>
              </div>
            ) : (
              filteredTournaments.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  className={`mx-tour-card ${selectedTournament?._id === item._id ? "mx-tour-card--active" : ""}`}
                  onClick={() => handleSelectTournament(item)}
                >
                  <div className="mx-tour-card__top">
                    <span className="mx-tour-card__name">{item.title}</span>
                    <span
                      className={`mx-tour-card__badge mx-tour-card__badge--${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="mx-tour-card__meta">
                    <span>{item.mode}</span>
                    <span>{item.region}</span>
                  </div>

                  <div className="mx-tour-card__reward">
                    {item.prize || "No prize specified"}
                  </div>
                </button>
              ))
            )}
          </div>

          {selectedTournament && (
            <>
              <div className="mx-tour-info">
                <div className="mx-tour-info__row">
                  <span className="mx-tour-info__label">Mode</span>
                  <span className="mx-tour-info__value">
                    {selectedTournament.mode}
                  </span>
                </div>

                <div className="mx-tour-info__row">
                  <span className="mx-tour-info__label">Region</span>
                  <span className="mx-tour-info__value">
                    {selectedTournament.region}
                  </span>
                </div>

                <div className="mx-tour-info__row">
                  <span className="mx-tour-info__label">Status</span>
                  <span className="mx-tour-info__value">
                    {selectedTournament.status}
                  </span>
                </div>

                <div className="mx-tour-info__row">
                  <span className="mx-tour-info__label">Players</span>
                  <span className="mx-tour-info__value">
                    {participants.length} / {selectedTournament.maxParticipants}
                  </span>
                </div>
              </div>

              <div className="mx-tour-join">
                <label className="mx-tour-search__label">JOIN AS</label>
                <input
                  type="text"
                  placeholder="Your nickname"
                  value={joinNickname}
                  onChange={(e) => setJoinNickname(e.target.value)}
                  className="mx-tour-search__input"
                />
              </div>

              <div className="mx-tour-actions">
                <button
                  className="mx-tour-action mx-tour-action--primary"
                  onClick={handleJoinTournament}
                  disabled={joining}
                >
                  {joining ? "JOINING..." : "JOIN TOURNAMENT"}
                </button>

                <button
                  className="mx-tour-action mx-tour-action--ghost"
                  onClick={handleGenerateBracket}
                  disabled={generating}
                >
                  {generating ? "GENERATING..." : "GENERATE BRACKET"}
                </button>
              </div>
            </>
          )}
        </aside>

        <div className="mx-tour-main">
          <div className="mx-tour-panel mx-tour-panel--participants">
            <div className="mx-tour-panel__chrome">
              <span>PLAYER_POOL</span>
              <span>REGISTERED_USERS</span>
            </div>

            <div className="mx-tour-monitor-head">
              <div>
                <h3 className="mx-tour-monitor-head__title">PARTICIPANTS</h3>
                <p className="mx-tour-monitor-head__sub">
                  Registered players for selected tournament
                </p>
              </div>

              <div className="mx-tour-monitor-badge">
                {participants.length} PLAYERS
              </div>
            </div>

            <div className="mx-tour-participants">
              {loadingDetails ? (
                <div className="mx-tour-empty">
                  <p>LOADING PARTICIPANTS...</p>
                </div>
              ) : participants.length === 0 ? (
                <div className="mx-tour-empty">
                  <p>NO PARTICIPANTS YET</p>
                </div>
              ) : (
                participants.map((player) => (
                  <div className="mx-tour-player" key={player._id}>
                    <div className="mx-tour-player__left">
                      <div className="mx-tour-player__avatar">
                        {player.avatar ? (
                          <img src={player.avatar} alt={player.nickname} />
                        ) : (
                          <span>{player.nickname?.charAt(0) || "P"}</span>
                        )}
                      </div>

                      <div className="mx-tour-player__meta">
                        <span className="mx-tour-player__name">
                          {player.nickname}
                        </span>
                        <span className="mx-tour-player__sub">
                          {player.country || "Unknown"} / LVL{" "}
                          {player.level || 0}
                        </span>
                      </div>
                    </div>

                    <div className="mx-tour-player__right">
                      <span className="mx-tour-player__elo">
                        {player.elo || 0} ELO
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mx-tour-panel mx-tour-panel--bracket">
            <div className="mx-tour-panel__chrome">
              <span>LIVE_BRACKET</span>
              <span>ROUND_STRUCTURE</span>
            </div>

            <div className="mx-tour-monitor-head">
              <div>
                <h3 className="mx-tour-monitor-head__title">
                  MAIN BRACKET SCREEN
                </h3>
                <p className="mx-tour-monitor-head__sub">
                  Tournament rounds, matches and progression tree
                </p>
              </div>

              <div className="mx-tour-monitor-badge">
                {matches.length} MATCHES
              </div>
            </div>

            <TournamentBracket matches={matches} loading={loadingDetails} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TournamentSection;
