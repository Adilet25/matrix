import NewsSection from "../../components/sections/NewsSection/NewsSection";
import TableSection from "../../components/sections/TableSection/TableSection";
import TournamentSection from "../../components/sections/TournamentSection/TournamentSection";
import MainSection from "../../components/sections/homesec/MainSection";
import PlaySection from "../../components/sections/playsec/PlaySection";

import { useAuth } from "../../context/AuthContext";

const HomePage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p style={{ padding: "24px" }}>Loading...</p>;
  }
  return (
    <div className="">
      {user ? (
        <p style={{ marginTop: "20px" }}>You are logged in.</p>
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
