import { useNavigate } from "react-router-dom";
import "../../../styles/MainSection.css";
import { useEffect, useState } from "react";
type TableRowData = string[];
const MainSection = () => {
  const navigate = useNavigate();
  const [widthW, setWidth] = useState(window.innerWidth);

  //! The TD's amount
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setCellsPerRow(getCellsPerRow(window.innerWidth));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [widthW]);
  const getCellsPerRow = (_width: number) => {
    return widthW / 70; //? The amount x
  };
  const [cellsPerRow, setCellsPerRow] = useState<number>(
    getCellsPerRow(window.innerWidth)
  );
  const generateTableData = (numCells: number) => {
    const data: TableRowData[] = [];
    for (let i = 0; i < 10; i++) {
      //? The 10 is amount y
      data.push(Array.from({ length: numCells }, (_, _index) => ``));
    }
    return data;
  };
  const tableData = generateTableData(cellsPerRow);
  return (
    <div>
      <div className="mainSec">
        <div className="mainSec_info">
          <p>
            <span id="green">Matrix</span> - играй умом
          </p>
          <button
            className="mainSec_btn"
            onClick={() => navigate("/playground")}
          >
            Играть
          </button>
        </div>
        <div className="tables">
          <table>
            <tr>
              {tableData.map((rowData, rowIndex) => (
                <tr key={rowIndex}>
                  {rowData.map((cellData, cellIndex) => (
                    <td key={cellIndex} className="tableTd">
                      {cellData}
                    </td>
                  ))}
                </tr>
              ))}
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
