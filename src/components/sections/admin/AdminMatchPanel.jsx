import { useEffect, useMemo, useState } from "react";
import "./AdminMatchPanel.css";

const API_URL = "https://matrix-8of6.onrender.com";
const ADMIN_KEY = "matrix_super_admin_2026";

const AdminMatchPanel = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [savingId, setSavingId] = useState("");
  const [message, setMessage] = useState("");

  const [drafts, setDrafts] = useState({});

  const groupedRounds = useMemo(() => {
    return matches.reduce((acc, match) => {
      if (!acc[match.round]) acc[match.round] = [];
      acc[match.round].push(match);
      return acc;
    }, {});
  }, [matches]);

  const fetchTournaments = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/admin/tournaments`, {
        headers: {
          "x-admin-key": ADMIN_KEY,
        },
      });

      const data = await res.json();
      const items = Array.isArray(data) ? data : [];

      setTournaments(items);

      if (items.length > 0 && !selectedTournament) {
        setSelectedTournament(items[0]);
      }
    } catch (error) {
      console.error("fetchTournaments error:", error);
      setMessage("Failed to load tournaments");
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async (slug) => {
    try {
      setLoadingMatches(true);
      setMessage("");

      const res = await fetch(`${API_URL}/api/tournaments/${slug}/matches`);
      const data = await res.json();

      const items = Array.isArray(data) ? data : [];
      setMatches(items);

      const nextDrafts = {};
      items.forEach((match) => {
        nextDrafts[match._id] = {
          score1: match.score1 ?? 0,
          score2: match.score2 ?? 0,
          winnerSide:
            match.winner?._id && match.participant1?._id === match.winner._id
              ? "participant1"
              : match.winner?._id &&
                  match.participant2?._id === match.winner._id
                ? "participant2"
                : "participant1",
        };
      });
      setDrafts(nextDrafts);
    } catch (error) {
      console.error("fetchMatches error:", error);
      setMessage("Failed to load matches");
      setMatches([]);
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (selectedTournament?.slug) {
      fetchMatches(selectedTournament.slug);
    }
  }, [selectedTournament]);

  const handleDraftChange = (matchId, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: value,
      },
    }));
  };

  const handleSaveResult = async (match) => {
    const draft = drafts[match._id];

    if (!draft) return;

    try {
      setSavingId(match._id);
      setMessage("");

      const res = await fetch(
        `${API_URL}/api/tournaments/${selectedTournament.slug}/matches/${match._id}/result`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": ADMIN_KEY,
          },
          body: JSON.stringify({
            score1: Number(draft.score1),
            score2: Number(draft.score2),
            winnerSide: draft.winnerSide,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to save result");
        return;
      }

      setMessage("Match result saved");
      await fetchMatches(selectedTournament.slug);
      await fetchTournaments();
    } catch (error) {
      console.error("handleSaveResult error:", error);
      setMessage("Failed to save result");
    } finally {
      setSavingId("");
    }
  };

  return (
    <section className="mx-match-admin">
      <div className="mx-match-admin__header">
        <div>
          <p className="mx-match-admin__eyebrow">[ MATRIX // MATCH ADMIN ]</p>
          <h2 className="mx-match-admin__title">BRACKET RESULT CONTROL</h2>
        </div>

        <button className="mx-match-admin__refresh" onClick={fetchTournaments}>
          REFRESH
        </button>
      </div>

      <div className="mx-match-admin__layout">
        <aside className="mx-match-admin__sidebar">
          <div className="mx-match-admin__panel-chrome">
            <span>TOURNAMENTS</span>
            <span>{tournaments.length} ITEMS</span>
          </div>

          <div className="mx-match-admin__sidebar-list">
            {loading ? (
              <div className="mx-match-admin__empty">LOADING...</div>
            ) : tournaments.length === 0 ? (
              <div className="mx-match-admin__empty">NO TOURNAMENTS</div>
            ) : (
              tournaments.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  className={`mx-match-admin__tour-btn ${
                    selectedTournament?._id === item._id
                      ? "mx-match-admin__tour-btn--active"
                      : ""
                  }`}
                  onClick={() => setSelectedTournament(item)}
                >
                  <div className="mx-match-admin__tour-top">
                    <span>{item.title}</span>
                    <span>{item.status}</span>
                  </div>
                  <div className="mx-match-admin__tour-meta">
                    {item.mode} / {item.region}
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <div className="mx-match-admin__content">
          <div className="mx-match-admin__panel-chrome">
            <span>{selectedTournament?.title || "NO_TOURNAMENT_SELECTED"}</span>
            <span>RESULT_EDITOR</span>
          </div>

          {loadingMatches ? (
            <div className="mx-match-admin__empty">LOADING MATCHES...</div>
          ) : Object.keys(groupedRounds).length === 0 ? (
            <div className="mx-match-admin__empty">NO MATCHES YET</div>
          ) : (
            <div className="mx-match-admin__rounds">
              {Object.keys(groupedRounds).map((round) => (
                <div className="mx-match-admin__round" key={round}>
                  <div className="mx-match-admin__round-title">
                    ROUND {round}
                  </div>

                  <div className="mx-match-admin__matches">
                    {groupedRounds[round].map((match) => {
                      const draft = drafts[match._id] || {
                        score1: 0,
                        score2: 0,
                        winnerSide: "participant1",
                      };

                      return (
                        <div
                          className="mx-match-admin__match-card"
                          key={match._id}
                        >
                          <div className="mx-match-admin__match-players">
                            <div className="mx-match-admin__player-row">
                              <span>
                                {match.participant1?.nickname || "TBD"}
                              </span>
                              <input
                                type="number"
                                value={draft.score1}
                                onChange={(e) =>
                                  handleDraftChange(
                                    match._id,
                                    "score1",
                                    e.target.value,
                                  )
                                }
                                disabled={
                                  !match.participant1 || !match.participant2
                                }
                              />
                            </div>

                            <div className="mx-match-admin__vs">VS</div>

                            <div className="mx-match-admin__player-row">
                              <span>
                                {match.participant2?.nickname || "TBD"}
                              </span>
                              <input
                                type="number"
                                value={draft.score2}
                                onChange={(e) =>
                                  handleDraftChange(
                                    match._id,
                                    "score2",
                                    e.target.value,
                                  )
                                }
                                disabled={
                                  !match.participant1 || !match.participant2
                                }
                              />
                            </div>
                          </div>

                          <div className="mx-match-admin__winner-select">
                            <label>
                              <input
                                type="radio"
                                name={`winner-${match._id}`}
                                checked={draft.winnerSide === "participant1"}
                                onChange={() =>
                                  handleDraftChange(
                                    match._id,
                                    "winnerSide",
                                    "participant1",
                                  )
                                }
                                disabled={
                                  !match.participant1 || !match.participant2
                                }
                              />
                              P1 WINNER
                            </label>

                            <label>
                              <input
                                type="radio"
                                name={`winner-${match._id}`}
                                checked={draft.winnerSide === "participant2"}
                                onChange={() =>
                                  handleDraftChange(
                                    match._id,
                                    "winnerSide",
                                    "participant2",
                                  )
                                }
                                disabled={
                                  !match.participant1 || !match.participant2
                                }
                              />
                              P2 WINNER
                            </label>
                          </div>

                          <div className="mx-match-admin__match-footer">
                            <span>Status: {match.status}</span>
                            <span>
                              Winner: {match.winner?.nickname || "TBD"}
                            </span>
                          </div>

                          <button
                            className="mx-match-admin__save-btn"
                            onClick={() => handleSaveResult(match)}
                            disabled={
                              savingId === match._id ||
                              !match.participant1 ||
                              !match.participant2
                            }
                          >
                            {savingId === match._id
                              ? "SAVING..."
                              : "SAVE RESULT"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {message ? (
            <div className="mx-match-admin__message">{message}</div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default AdminMatchPanel;
