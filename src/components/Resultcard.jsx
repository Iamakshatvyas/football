import "./ResultCard.css";

function formatDate(dateString) {
  return new Date(dateString).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ResultCard({ fixture }) {
  const home = fixture.teams.home;
  const away = fixture.teams.away;

  const homeGoals = fixture.goals.home ?? "-";
  const awayGoals = fixture.goals.away ?? "-";

  return (
    <div className="result-card">

      <div className="result-date">
        {formatDate(fixture.fixture.date)}
      </div>

      <div className="result-row">

        <div className="team left">
          <img
            src={home.logo}
            alt={home.name}
            className="team-logo"
          />
          <span>{home.name}</span>
        </div>

        <div className="score">
          <span>{homeGoals}</span>
          <span className="dash">-</span>
          <span>{awayGoals}</span>
        </div>

        <div className="team right">
          <img
            src={away.logo}
            alt={away.name}
            className="team-logo"
          />
          <span>{away.name}</span>
        </div>

      </div>

      <div className="status">
        FT
      </div>

    </div>
  );
}