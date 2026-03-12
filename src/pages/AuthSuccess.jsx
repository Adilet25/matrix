import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthSuccess() {
  const { fetchMe } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      await fetchMe();
      navigate("/");
    };

    loadUser();
  }, [fetchMe, navigate]);

  return (
    <div style={{ padding: "24px" }}>
      <h2>Logging you in...</h2>
    </div>
  );
}
