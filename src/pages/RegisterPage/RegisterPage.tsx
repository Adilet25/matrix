import "../../styles/LoginReg.css";
import logo from "../../assets/logo.svg";
import eyeclose from "../../assets/mdi_eye-outline.svg";
import eyeopen from "../../assets/mdi_eye-outline (1).svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [password, setPass] = useState("");
  return (
    <div className="loginMain">
      <div className="containers">
        <div className="loginMain_block">
          <div className="loginMain_panel">
            <img src={logo} alt="error" className="loginMain_img" />
            <h3 className="loginMain_title">СОЗДАТЬ АККАУНТ</h3>
            <div className="loginMain_pass">
              <input
                type="text"
                placeholder="Введите никнейм"
                className="loginMain_inputs"
              />
              <input
                type="text"
                placeholder="Электронная почта"
                className="loginMain_inputs"
              />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Придумайте пароль"
                value={password}
                onChange={(e) => {
                  setPass(e.target.value);
                }}
                className="loginMain_inputs"
              />
              {showPass ? (
                <img
                  src={eyeclose}
                  alt="error"
                  className="regMain_showhide"
                  onClick={() => setShowPass(!showPass)}
                />
              ) : (
                <img
                  src={eyeopen}
                  alt="error"
                  className="regMain_showhide"
                  onClick={() => setShowPass(!showPass)}
                />
              )}
            </div>
            <div className="hexbuttons">
              <div className="hexr">
                <div className="hexagon">
                  <i className="hexagon_text">Создать</i>
                </div>
              </div>
            </div>
            <p className="loginMain_voyt">
              Уже есть аккаунт?
              <span
                style={{
                  color: "white",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/login")}
              >
                Войти
              </span>
            </p>
            <p className="loginMain_pol">
              Создавая аккаунт в “Название” вы соглашаетесь с пользовательским
              соглашением
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
