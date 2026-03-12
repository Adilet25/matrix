import NewsSection from "../../components/sections/NewsSection/NewsSection";
import TableSection from "../../components/sections/TableSection/TableSection";
import TournamentSection from "../../components/sections/TournamentSection/TournamentSection";
import MainSection from "../../components/sections/homesec/MainSection";
import PlaySection from "../../components/sections/playsec/PlaySection";

import { useAuth } from "../../context/AuthContext";

const HomePage = () => {
  const { user, loading } = useAuth();

  // if (loading) {
  //   return <p style={{ padding: "24px" }}>Loading...</p>;
  // }
  return (
    <div className="">
      {user ? (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            maxWidth: "400px",
          }}
        >
          {user.avatar && (
            <img
              src={user.avatar}
              alt={user.nickname}
              width="80"
              style={{ borderRadius: "50%", marginBottom: "12px" }}
            />
          )}

          <h2>{user.nickname}</h2>
          <p>Faceit ID: {user.faceitId}</p>
          <p>Country: {user.country}</p>
          <p>ELO: {user.elo}</p>
          <p>Level: {user.level}</p>
        </div>
      ) : (
        <p style={{ marginTop: "20px" }}>You are not logged in.</p>
      )}
      <PlaySection />
      <TableSection />
      <TournamentSection />
      <MainSection />
      <NewsSection />
    </div>
  );
};

export default HomePage;
