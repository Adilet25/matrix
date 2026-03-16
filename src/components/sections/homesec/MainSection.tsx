import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainSection.css";

type TableRowData = string[];

const CELL_SIZE = 68;
const ROWS = 9;

const MainSection = () => {
  const navigate = useNavigate();
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [activeCell, setActiveCell] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cellsPerRow = useMemo(() => {
    return Math.max(8, Math.floor(viewportWidth / CELL_SIZE));
  }, [viewportWidth]);

  const tableData = useMemo(() => {
    const data: TableRowData[] = [];

    for (let i = 0; i < ROWS; i++) {
      data.push(Array.from({ length: cellsPerRow }, () => ""));
    }

    return data;
  }, [cellsPerRow]);

  return (
    <section className="mx-main">
      <div className="mx-main__scanlines" />

      <div className="mx-main__hud">
        <div className="mx-main__panel">
          <div className="mx-main__chrome">
            <span>WELCOME_NODE</span>
            <span>HUD_ACTIVE</span>
          </div>

          <div className="mx-main__content">
            <div className="mx-main__badgeRow">
              <span className="mx-main__badge">CS2 TRAINING SYSTEM</span>
              <span className="mx-main__badge mx-main__badge--live">
                ONLINE
              </span>
            </div>

            <h1 className="mx-main__title">
              <span className="mx-main__titleAccent">MATRIX</span>
              <span className="mx-main__titleSub"> — играй умом</span>
            </h1>

            <p className="mx-main__desc">
              Анализируй игру, тренируй механику, отслеживай прогресс и
              доминируй в матчах через пиксельный боевой интерфейс Matrix.
            </p>

            <div className="mx-main__actions">
              <button
                className="mx-main__btn mx-main__btn--primary"
                onClick={() => navigate("/playground")}
              >
                START TRAINING
              </button>

              <button
                className="mx-main__btn mx-main__btn--ghost"
                onClick={() => navigate("/leaderboard")}
              >
                VIEW RANKING
              </button>
            </div>

            <div className="mx-main__stats">
              <div className="mx-main__statCard">
                <span className="mx-main__statLabel">MODE</span>
                <span className="mx-main__statValue">AIM / ANALYTICS</span>
              </div>

              <div className="mx-main__statCard">
                <span className="mx-main__statLabel">SYSTEM</span>
                <span className="mx-main__statValue">PIXEL HUD</span>
              </div>

              <div className="mx-main__statCard">
                <span className="mx-main__statLabel">STATUS</span>
                <span className="mx-main__statValue mx-main__statValue--gold">
                  READY
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-main__gridWrap">
        <table className="mx-main__grid">
          <tbody>
            {tableData.map((rowData, rowIndex) => (
              <tr key={rowIndex}>
                {rowData.map((cellData, cellIndex) => {
                  const flatIndex = rowIndex * cellsPerRow + cellIndex;
                  const isActive = activeCell === flatIndex;

                  return (
                    <td
                      key={cellIndex}
                      className={`mx-main__cell ${isActive ? "mx-main__cell--active" : ""}`}
                      onMouseEnter={() => setActiveCell(flatIndex)}
                      onMouseLeave={() => setActiveCell(null)}
                      onClick={() => setActiveCell(flatIndex)}
                    >
                      {cellData}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MainSection;
