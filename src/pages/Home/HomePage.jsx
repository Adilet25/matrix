import NewsSection from "../../components/sections/NewsSection/NewsSection";
import TableSection from "../../components/sections/TableSection/TableSection";
import TournamentSection from "../../components/sections/TournamentSection/TournamentSection";
import MainSection from "../../components/sections/homesec/MainSection";
import PlaySection from "../../components/sections/playsec/PlaySection";
import HeroSection from "../../components/sections/herosec/HeroSection";
import SystemOverview from "../../components/sections/syssec/SystemOverview";

import "./HomePage.css";

import { useAuth } from "../../context/AuthContext";
import LiveFeatures from "../../components/sections/livesec/LiveFeatures";
import AdminTournamentPanel from "../../components/sections/admin/AdminTournamentPanel";
import AdminMatchPanel from "../../components/sections/admin/AdminMatchPanel";

const HomePage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p style={{ padding: "24px" }}>Loading...</p>;
  }
  return (
    <div className="">
      {/* {user ? (
        <p style={{ marginTop: "20px" }}>You are logged in.</p>
      ) : (
        <p style={{ marginTop: "20px" }}>You are not logged in.</p>
      )} */}
      <HeroSection />
      <SystemOverview />
      {/* <div className="authStatusWrap">
        <div className={`authPixelCard ${user ? "authOk" : "authBad"}`}>
          <div className="authScanline" />
          <div className="authDots">
            <span />
            <span />
            <span />
          </div>

          <div className="authMainRow">
            <div className="authAvatarPixel">{user ? "✓" : "?"}</div>

            <div className="authTextBlock">
              <p className="authTitle">
                {user ? "PLAYER AUTHORIZED" : "NO SIGNAL"}
              </p>

              <p className="authSub">
                {user
                  ? `FACEIT LINK ESTABLISHED${user?.nickname ? `: ${user.nickname}` : ""}`
                  : "CONNECT FACEIT ACCOUNT TO UNLOCK FEATURES"}
              </p>
            </div>
          </div>

          <div className="authProgress">
            <div className={`authProgressBar ${user ? "barOk" : "barBad"}`} />
          </div>

          <div className="authFooter">
            <span>{user ? "STATUS: ONLINE" : "STATUS: OFFLINE"}</span>
            <span>{user ? "READY" : "WAITING"}</span>
          </div>
        </div>
      </div> */}

      <LiveFeatures />
      <TableSection />
      <TournamentSection />
      <AdminTournamentPanel />
      <AdminMatchPanel />

      <MainSection />
      <NewsSection />
    </div>
  );
};

export default HomePage;
