import alatooicon from "../../../assets/image 27.svg";
import logoicon from "../../../assets/logo.svg";

const Footer = () => {
  return (
    <div
      style={{
        marginTop: "5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={alatooicon}
          alt="error"
          style={{ width: "4rem", marginRight: "1rem" }}
        />
        <img
          src={logoicon}
          alt="error"
          style={{ width: "2rem", marginLeft: "1rem" }}
        />
      </div>
      <p style={{ marginTop: "1rem", color: "white" }}>
        Copyright © 2024 Clams Organisation Ala-Too Все права защищены.
      </p>
    </div>
  );
};

export default Footer;
