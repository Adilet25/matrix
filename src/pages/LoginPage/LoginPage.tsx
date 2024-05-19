import "../../styles/LoginReg.css";
import logo from "../../assets/logo.svg";
import steam from "../../assets/mdi_steam.svg";
import apple from "../../assets/bx_bxl-apple.svg";
import google from "../../assets/mdi_google.svg";
import facebook from "../../assets/bx_bxl-facebook.svg";
import eyeclose from "../../assets/mdi_eye-outline.svg";
import eyeopen from "../../assets/mdi_eye-outline (1).svg";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [password, setPass] = useState("");
  return (
    <div className="loginMain">
      <div className="containers">
        <div className="loginMain_block">
          <div className="loginMain_panel">
            <img src={logo} alt="error" className="loginMain_img" />
            <h3 className="loginMain_title">ВОЙТИ</h3>
            <div className="loginMain_pass">
              <input
                type="text"
                placeholder="Никнейм или электронная почта"
                className="loginMain_inputs"
              />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Пароль"
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
                  className="loginMain_showhide"
                  onClick={() => setShowPass(!showPass)}
                />
              ) : (
                <img
                  src={eyeopen}
                  alt="error"
                  className="loginMain_showhide"
                  onClick={() => setShowPass(!showPass)}
                />
              )}
            </div>
            <p className="loginMain_frgt">
              Забыли пароль?
              <span
                style={{
                  color: "white",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Восстановить
              </span>
            </p>
            <div className="hexbuttons">
              <div className="hexr">
                <div className="hexagon">
                  <i className="hexagon_text">Войти</i>
                </div>
              </div>
            </div>
            <p className="loginMain_voyt">
              Нет аккаунта?
              <span
                style={{
                  color: "white",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/register")}
              >
                Создать аккаунт
              </span>
            </p>
            <p>Или войдите через</p>
            <div className="loginMain_social">
              <img src={steam} alt="error" />
              <img src={apple} alt="error" />
              <img src={google} alt="error" />
              <img src={facebook} alt="error" />
            </div>
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

export default LoginPage;
