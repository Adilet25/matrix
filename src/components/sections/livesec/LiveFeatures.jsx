import "./LiveFeatures.css";

const features = [
  {
    title: "FACEIT LOGIN",
    value: "ONLINE",
    desc: "Secure OAuth authorization and player sync.",
    type: "green",
  },
  {
    title: "LEADERBOARD",
    value: "LIVE",
    desc: "Top players by country and region from FACEIT.",
    type: "blue",
  },
  {
    title: "TRAINING MODES",
    value: "3 ACTIVE",
    desc: "Counter-Strafe, Reaction Time and Aim Trainer.",
    type: "yellow",
  },
  {
    title: "PLAYER PROFILE",
    value: "TRACKED",
    desc: "ELO, level, country and linked account data.",
    type: "red",
  },
];

const LiveFeatures = () => {
  return (
    <section className="liveFeatures">
      <div className="liveFeaturesHeader">
        <p className="liveFeaturesLabel">LIVE FEATURES</p>
        <h2>Everything connected to your improvement</h2>
        <p className="liveFeaturesSub">
          Train mechanics, explore rankings, connect your FACEIT account and
          build your skill progression in one place.
        </p>
      </div>

      <div className="liveFeaturesGrid">
        <div className="liveFeaturesPanel">
          <div className="livePanelTop">
            <span className="liveDot green" />
            <span className="liveDot yellow" />
            <span className="liveDot red" />
          </div>

          <div className="livePanelScreen">
            <div className="livePanelScan" />

            <div className="livePanelCenter">
              <div className="liveCoreBox">
                <div className="liveCoreInner" />
              </div>
            </div>

            <div className="liveBars">
              <div className="liveBar">
                <span>SYNC</span>
                <div className="barLine">
                  <div className="barFill greenFill" />
                </div>
              </div>

              <div className="liveBar">
                <span>TRACK</span>
                <div className="barLine">
                  <div className="barFill blueFill" />
                </div>
              </div>

              <div className="liveBar">
                <span>SKILL</span>
                <div className="barLine">
                  <div className="barFill redFill" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="liveFeaturesCards">
          {features.map((item) => (
            <div key={item.title} className={`liveCard ${item.type}`}>
              <div className="liveCardTop">
                <span className={`liveCardBadge ${item.type}`}>
                  {item.value}
                </span>
                <span className="liveCardArrow">+</span>
              </div>

              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveFeatures;
