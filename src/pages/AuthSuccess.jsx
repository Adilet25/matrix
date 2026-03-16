import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthSuccess() {
  const { fetchMe } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const finishLogin = async () => {
      await fetchMe();

      if (window.opener) {
        window.opener.location.reload();
        window.close();
        return;
      }

      navigate("/");
    };

    finishLogin();
  }, [fetchMe, navigate]);

  return <div>Авторизация успешна...</div>;
}
