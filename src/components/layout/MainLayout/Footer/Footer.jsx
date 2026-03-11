import logoicon from "../../../assets/logo.svg";

const Footer = () => {
  return (
    <div
      style={{
        marginTop: "5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: 'black',
        padding:'1rem 0'
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={logoicon}
          alt="error"
          style={{ width: "2rem", marginLeft: "1rem" }}
        />
      </div>
      <p style={{ marginTop: "1rem", color: "white" }}>
        Copyright © 2026 Clams Organisation LoroTech Все права защищены.
      </p>
    </div>
  );
};

export default Footer;
