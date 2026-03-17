import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthSuccess() {
  const { fetchMe, apiUrl } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const finishAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (token) {
        await fetch(`${apiUrl}/auth/faceit/session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ token }),
        });
      }

      await fetchMe();

      // popup (ПК)
      if (window.opener) {
        window.opener.location.reload();
        window.close();
        return;
      }

      // mobile
      navigate("/");
    };

    finishAuth();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Logging you in...</h2>
    </div>
  );
}
