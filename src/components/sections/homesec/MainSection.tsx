import { useNavigate } from "react-router-dom";
import "../../../styles/MainSection.css";

const MainSection = () => {
  const navigate = useNavigate();
  return (
    <div className="mainSec">
      <div className="containers">
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
      </div>
    </div>
  );
};

export default MainSection;
