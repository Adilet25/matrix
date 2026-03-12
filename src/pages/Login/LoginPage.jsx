import faceitlogo from "../../components/assets/fclogo.svg";

const LoginPage = () => {
  return (
    <div>
      <a
        href="https://matrix-8of6.onrender.com/auth/faceit/login"
        className="bg-white mt-1rem"
      >
        FACEIT LOGIN <img src={faceitlogo} alt="e" />
      </a>
    </div>
  );
};

export default LoginPage;
