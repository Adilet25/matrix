import "./NewsCard.css";
import { useNavigate } from "react-router-dom";

const tournamentFeed = [
  {
    id: 1,
    title: "Matrix Cup #12",
    winner: "plovoed5",
    format: "1v1",
    status: "FINISHED",
    date: "2026-03-16",
    summary:
      "Fast elimination bracket with strong Mirage and Nuke performances. Champion secured the final with consistent fragging and top ADR.",
  },
  {
    id: 2,
    title: "Matrix Pro League #4",
    winner: "Tokoff",
    format: "5v5",
    status: "FINISHED",
    date: "2026-03-14",
    summary:
      "Full competitive bracket featuring stacked teams, close semifinals and a decisive grand final with high-pressure late rounds.",
  },
  {
    id: 3,
    title: "Bishkek Arena Clash",
    winner: "Yawwnie",
    format: "2v2",
    status: "FINISHED",
    date: "2026-03-12",
    summary:
      "Aggressive duo tournament with fast rounds, upset results and strong map control from the champions across the playoff stage.",
  },
  {
    id: 4,
    title: "Student Open Series",
    winner: "mONTIS-0",
    format: "5v5",
    status: "FINISHED",
    date: "2026-03-10",
    summary:
      "Campus event with multiple comeback games and standout clutch moments. The winning squad closed out the bracket with dominant Inferno form.",
  },
  {
    id: 5,
    title: "Matrix Night Bracket",
    winner: "nunisigma228",
    format: "1v1",
    status: "FINISHED",
    date: "2026-03-08",
    summary:
      "Compact evening tournament focused on individual mechanics and pressure handling. Winner advanced through the bracket with high consistency.",
  },
  {
    id: 6,
    title: "Legends Trial Event",
    winner: "SCARY_44",
    format: "2v2",
    status: "FINISHED",
    date: "2026-03-05",
    summary:
      "Experimental doubles event where spacing, trade timing and entry control were the key factors behind the winning run.",
  },
];

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

const NewsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-feed containers">
      <div className="mx-feed__header">
        <div>
          <p className="mx-feed__eyebrow">[ MATRIX // TOURNAMENT FEED ]</p>
          <h2 className="mx-feed__title">LATEST TOURNAMENTS</h2>
        </div>

        <div className="mx-feed__status">
          <span className="mx-feed__statusDot" />
          ARCHIVE ONLINE
        </div>
      </div>

      <div className="mx-feed__grid">
        {tournamentFeed.map((item) => (
          <article className="mx-feedCard" key={item.id}>
            <div className="mx-feedCard__chrome">
              <span>EVENT_LOG</span>
              <span>{item.format}</span>
            </div>

            <div className="mx-feedCard__body">
              <div className="mx-feedCard__top">
                <span
                  className={`mx-feedCard__badge mx-feedCard__badge--${item.status.toLowerCase()}`}
                >
                  {item.status}
                </span>
                <span className="mx-feedCard__date">
                  {formatDate(item.date)}
                </span>
              </div>

              <h3 className="mx-feedCard__title">{item.title}</h3>

              <div className="mx-feedCard__winnerBox">
                <span className="mx-feedCard__winnerLabel">CHAMPION</span>
                <span className="mx-feedCard__winner">{item.winner}</span>
              </div>

              <p className="mx-feedCard__summary">{item.summary}</p>

              <div className="mx-feedCard__meta">
                <div className="mx-feedCard__metaItem">
                  <span className="mx-feedCard__metaLabel">FORMAT</span>
                  <span className="mx-feedCard__metaValue">{item.format}</span>
                </div>

                <div className="mx-feedCard__metaItem">
                  <span className="mx-feedCard__metaLabel">RESULT</span>
                  <span className="mx-feedCard__metaValue">{item.winner}</span>
                </div>
              </div>
            </div>

            <button
              className="mx-feedCard__btn"
              onClick={() => navigate(`/tournament/${item.id}`)}
            >
              VIEW TOURNAMENT
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
