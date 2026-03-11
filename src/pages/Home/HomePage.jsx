import NewsSection from "../../components/sections/NewsSection/NewsSection";
import TableSection from "../../components/sections/TableSection/TableSection";
import TournamentSection from "../../components/sections/TournamentSection/TournamentSection";
import MainSection from "../../components/sections/homesec/MainSection";

const HomePage = () => {
  return (
    <div>
      <MainSection />
      <TableSection />
      <TournamentSection />
      <NewsSection />
    </div>
  );
};

export default HomePage;
