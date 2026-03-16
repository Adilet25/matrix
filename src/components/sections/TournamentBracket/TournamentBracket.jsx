import "./TournamentBracket.css";

const TournamentBracket = ({ matches = [], loading = false }) => {
  const groupedRounds = matches.reduce((acc, match) => {
    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {});

  const sortedRounds = Object.keys(groupedRounds)
    .map(Number)
    .sort((a, b) => a - b);

  if (loading) {
    return (
      <div className="mx-bracket-shell">
        <div className="mx-bracket-empty">LOADING BRACKET...</div>
      </div>
    );
  }

  if (sortedRounds.length === 0) {
    return (
      <div className="mx-bracket-shell">
        <div className="mx-bracket-empty">BRACKET NOT GENERATED</div>
      </div>
    );
  }

  return (
    <div className="mx-bracket-shell ">
      <div className="mx-bracket-scroll">
        <div className="mx-bracket">
          {sortedRounds.map((roundNumber, roundIndex) => {
            const roundMatches = groupedRounds[roundNumber];

            return (
              <div className="mx-bracket-round" key={roundNumber}>
                <div className="mx-bracket-round__header">
                  <span className="mx-bracket-round__label">
                    ROUND {roundNumber}
                  </span>
                  <span className="mx-bracket-round__count">
                    {roundMatches.length} MATCH
                    {roundMatches.length > 1 ? "ES" : ""}
                  </span>
                </div>

                <div
                  className={`mx-bracket-round__matches mx-bracket-round__matches--r${roundIndex + 1}`}
                >
                  {roundMatches.map((match) => {
                    const p1 = match.participant1;
                    const p2 = match.participant2;
                    const winnerId = match.winner?._id || match.winner;

                    const p1Won =
                      p1?._id && String(winnerId) === String(p1._id);
                    const p2Won =
                      p2?._id && String(winnerId) === String(p2._id);

                    return (
                      <div className="mx-bracket-match" key={match._id}>
                        <div className="mx-bracket-match__top">
                          <span className="mx-bracket-match__id">
                            M{match.matchNumber}
                          </span>
                          <span
                            className={`mx-bracket-match__status mx-bracket-match__status--${String(
                              match.status || "PENDING",
                            ).toLowerCase()}`}
                          >
                            {match.status}
                          </span>
                        </div>

                        <div
                          className={`mx-bracket-player ${
                            p1Won ? "mx-bracket-player--winner" : ""
                          }`}
                        >
                          <div className="mx-bracket-player__left">
                            <div className="mx-bracket-player__avatar">
                              {p1?.avatar ? (
                                <img src={p1.avatar} alt={p1.nickname} />
                              ) : (
                                <span>{p1?.nickname?.charAt(0) || "?"}</span>
                              )}
                            </div>

                            <div className="mx-bracket-player__meta">
                              <span className="mx-bracket-player__name">
                                {p1?.nickname || "TBD"}
                              </span>
                              <span className="mx-bracket-player__sub">
                                {p1?.country || "--"} / LVL {p1?.level ?? 0}
                              </span>
                            </div>
                          </div>

                          <div className="mx-bracket-player__score">
                            {match.score1 ?? 0}
                          </div>
                        </div>

                        <div className="mx-bracket-match__vs">VS</div>

                        <div
                          className={`mx-bracket-player ${
                            p2Won ? "mx-bracket-player--winner" : ""
                          }`}
                        >
                          <div className="mx-bracket-player__left">
                            <div className="mx-bracket-player__avatar">
                              {p2?.avatar ? (
                                <img src={p2.avatar} alt={p2.nickname} />
                              ) : (
                                <span>{p2?.nickname?.charAt(0) || "?"}</span>
                              )}
                            </div>

                            <div className="mx-bracket-player__meta">
                              <span className="mx-bracket-player__name">
                                {p2?.nickname || "TBD"}
                              </span>
                              <span className="mx-bracket-player__sub">
                                {p2?.country || "--"} / LVL {p2?.level ?? 0}
                              </span>
                            </div>
                          </div>

                          <div className="mx-bracket-player__score">
                            {match.score2 ?? 0}
                          </div>
                        </div>

                        <div className="mx-bracket-match__footer">
                          <span className="mx-bracket-match__winner">
                            {match.winner?.nickname
                              ? `WINNER // ${match.winner.nickname}`
                              : "WINNER // TBD"}
                          </span>
                        </div>

                        {roundIndex < sortedRounds.length - 1 && (
                          <>
                            <span className="mx-bracket-match__line-h" />
                            <span className="mx-bracket-match__line-v" />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket;
