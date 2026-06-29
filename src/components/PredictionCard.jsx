import { useState } from "react";
import "./PredictionCard.css";

/* ---------------- Helpers ---------------- */

function formatKickoff(dateStr) {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow =
    date.toDateString() ===
    new Date(now.getTime() + 86400000).toDateString();

  const time = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) return `Today • ${time}`;
  if (isTomorrow) return `Tomorrow • ${time}`;

  return (
    date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }) + ` • ${time}`
  );
}

function TeamLogo({ team, size = 44 }) {
  const [error, setError] = useState(false);

  const initials = team?.name
    ? team.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  if (!team?.logo || error) {
    return (
      <div
        className="pred-team-fallback"
        style={{ width: size, height: size }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={team.logo}
      alt={team.name}
      width={size}
      height={size}
      className="pred-team-logo"
      onError={() => setError(true)}
    />
  );
}

function isLocked(date) {
  return new Date(date) <= new Date();
}

/* ---------------- Component ---------------- */

export default function PredictionCard({
  fixture,
  selected,
  saving,
  onPredict,
  animationDelay = 0,
}) {
  const fixtureId = fixture?.fixture?.id;

  const home = fixture?.teams?.home;
  const away = fixture?.teams?.away;

  const kickoff = fixture?.fixture?.date;

  const locked = isLocked(kickoff);

  const handlePrediction = (team) => {
    if (locked || saving) return;

    if (selected === team) {
      onPredict(fixtureId, null);
    } else {
      onPredict(fixtureId, team);
    }
  };

  return (
    <div
      className={`pred-card
        ${selected ? "pred-card--predicted" : ""}
        ${locked ? "pred-card--locked" : ""}
        animate-fade-up`}
      style={{
        animationDelay: `${animationDelay}ms`,
      }}
    >
      {/* Header */}

      <div className="pred-header">

        <span className="pred-deadline">
          {formatKickoff(kickoff)}
        </span>

        <div className="pred-header-right">

          {saving && <div className="pred-saving-dot" />}

          {locked ? (
            <span className="badge badge-muted">
              🔒 Locked
            </span>
          ) : selected ? (
            <span className="badge badge-success">
              ✓ Saved
            </span>
          ) : null}

        </div>

      </div>

      {/* Teams */}

      <div className="pred-teams">

        <div className="pred-team">
          <TeamLogo team={home} />
          <span className="pred-team-name">
            {home?.name}
          </span>
        </div>

        <div className="pred-centre">

          <span className="pred-vs">VS</span>

          {!selected && !locked && (
            <span className="pred-hint">
              Pick the winner
            </span>
          )}

          {selected && (
            <span className="pred-selected-label">
              {selected === "home"
                ? home?.name
                : away?.name}
            </span>
          )}

        </div>

        <div className="pred-team pred-team--right">
          <TeamLogo team={away} />
          <span className="pred-team-name">
            {away?.name}
          </span>
        </div>

      </div>

      {/* Prediction Buttons */}

      <div className="pred-buttons">

        <button
          className={`pred-btn ${
            selected === "home"
              ? "pred-btn--selected"
              : ""
          }`}
          disabled={locked || saving}
          onClick={() => handlePrediction("home")}
        >
          {saving && selected === "home" ? (
            <span className="pred-btn-spinner" />
          ) : (
            "Home Win"
          )}
        </button>

        <button
          className={`pred-btn ${
            selected === "away"
              ? "pred-btn--selected"
              : ""
          }`}
          disabled={locked || saving}
          onClick={() => handlePrediction("away")}
        >
          {saving && selected === "away" ? (
            <span className="pred-btn-spinner" />
          ) : (
            "Away Win"
          )}
        </button>

      </div>

    </div>
  );
}