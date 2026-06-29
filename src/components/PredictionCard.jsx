import { useEffect, useMemo, useState } from "react";
import "./PredictionCard.css";

function formatKickoff(dateStr) {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 86400000);

  const time = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (date.toDateString() === now.toDateString()) {
    return `Today - ${time}`;
  }

  if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow - ${time}`;
  }

  return `${date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })} - ${time}`;
}

function TeamLogo({ team, size = 48 }) {
  const [error, setError] = useState(false);

  const initials = team?.name
    ? team.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  if (!team?.logo || error) {
    return (
      <div className="pred-team-fallback" style={{ width: size, height: size }}>
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

function getInitialScore(winner, currentHomeGoals = 0, currentAwayGoals = 0) {
  const homeGoals = Number(currentHomeGoals) || 0;
  const awayGoals = Number(currentAwayGoals) || 0;

  if (winner === "home" && homeGoals <= awayGoals) {
    return { homeGoals: awayGoals + 1, awayGoals };
  }

  if (winner === "away" && awayGoals <= homeGoals) {
    return { homeGoals, awayGoals: homeGoals + 1 };
  }

  return { homeGoals, awayGoals };
}

function getScoreWinner(homeGoals, awayGoals) {
  if (homeGoals > awayGoals) return "home";
  if (awayGoals > homeGoals) return "away";
  return null;
}

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

  const [selectedWinner, setSelectedWinner] = useState(null);
  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);

  useEffect(() => {
    if (!selected) {
      setSelectedWinner(null);
      setHomeGoals(0);
      setAwayGoals(0);
      return;
    }

    if (typeof selected === "string") {
      const score = getInitialScore(selected, 0, 0);
      setSelectedWinner(selected);
      setHomeGoals(score.homeGoals);
      setAwayGoals(score.awayGoals);
      return;
    }

    const score = getInitialScore(
      selected.winner,
      selected.homeGoals ?? 0,
      selected.awayGoals ?? 0
    );

    setSelectedWinner(selected.winner || null);
    setHomeGoals(score.homeGoals);
    setAwayGoals(score.awayGoals);
  }, [selected]);

  const scoreWinner = useMemo(
    () => getScoreWinner(homeGoals, awayGoals),
    [homeGoals, awayGoals]
  );

  const scoreMatchesWinner = selectedWinner && selectedWinner === scoreWinner;
  const canSave = Boolean(selectedWinner && scoreMatchesWinner && !locked && !saving);

  const isSaved =
    typeof selected === "string"
      ? selected === selectedWinner && homeGoals === 0 && awayGoals === 0
      : selected?.winner === selectedWinner &&
        Number(selected?.homeGoals ?? 0) === homeGoals &&
        Number(selected?.awayGoals ?? 0) === awayGoals;

  const handleSelectWinner = (team) => {
    if (locked || saving) return;

    const nextWinner = selectedWinner === team ? null : team;
    setSelectedWinner(nextWinner);

    if (nextWinner) {
      const score = getInitialScore(nextWinner, homeGoals, awayGoals);
      setHomeGoals(score.homeGoals);
      setAwayGoals(score.awayGoals);
    }
  };

  const handleGoalChange = (team, delta) => {
    if (locked || saving) return;

    if (team === "home") {
      setHomeGoals((value) => Math.max(0, value + delta));
      return;
    }

    setAwayGoals((value) => Math.max(0, value + delta));
  };

  const handleSave = () => {
    if (!canSave) return;
    onPredict(fixtureId, selectedWinner, homeGoals, awayGoals);
  };

  return (
    <div
      className={`pred-card ${selectedWinner ? "pred-card--predicted" : ""} ${
        locked ? "pred-card--locked" : ""
      } ${isSaved ? "pred-card--saved" : ""} animate-fade-up`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="pred-header">
        <span className="pred-deadline">{formatKickoff(kickoff)}</span>

        <div className="pred-header-right">
          {saving && <div className="pred-saving-dot" />}
          {locked ? (
            <span className="badge badge-muted">Locked</span>
          ) : isSaved ? (
            <span className="badge badge-success">Saved</span>
          ) : null}
        </div>
      </div>

      <div className="pred-teams-selector">
        <button
          className={`pred-team-card ${
            selectedWinner === "home" ? "pred-team-card--selected" : ""
          } ${locked ? "pred-team-card--disabled" : ""}`}
          disabled={locked || saving}
          onClick={() => handleSelectWinner("home")}
          type="button"
        >
          <TeamLogo team={home} size={52} />
          <span className="pred-team-card-name">{home?.name}</span>
          {selectedWinner === "home" && (
            <span className="pred-team-card-check">✓</span>
          )}
        </button>

        <div className="pred-vs-divider">
          <span className="pred-vs-text">VS</span>
        </div>

        <button
          className={`pred-team-card ${
            selectedWinner === "away" ? "pred-team-card--selected" : ""
          } ${locked ? "pred-team-card--disabled" : ""}`}
          disabled={locked || saving}
          onClick={() => handleSelectWinner("away")}
          type="button"
        >
          <TeamLogo team={away} size={52} />
          <span className="pred-team-card-name">{away?.name}</span>
          {selectedWinner === "away" && (
            <span className="pred-team-card-check">✓</span>
          )}
        </button>
      </div>

      {selectedWinner && !locked && (
        <div className="pred-score-section">
          <div className="pred-score-label">Predict scoreline</div>

          <div className="pred-score-inputs">
            <div className="pred-score-group">
              <div className="pred-score-team-label">{home?.name}</div>
              <div className="pred-score-control">
                <button
                  className="pred-score-btn"
                  disabled={homeGoals === 0 || saving}
                  onClick={() => handleGoalChange("home", -1)}
                  type="button"
                  aria-label="Decrease home goals"
                >
                  -
                </button>
                <div className="pred-score-display">{homeGoals}</div>
                <button
                  className="pred-score-btn"
                  disabled={saving}
                  onClick={() => handleGoalChange("home", 1)}
                  type="button"
                  aria-label="Increase home goals"
                >
                  +
                </button>
              </div>
            </div>

            <div className="pred-score-group">
              <div className="pred-score-team-label">{away?.name}</div>
              <div className="pred-score-control">
                <button
                  className="pred-score-btn"
                  disabled={awayGoals === 0 || saving}
                  onClick={() => handleGoalChange("away", -1)}
                  type="button"
                  aria-label="Decrease away goals"
                >
                  -
                </button>
                <div className="pred-score-display">{awayGoals}</div>
                <button
                  className="pred-score-btn"
                  disabled={saving}
                  onClick={() => handleGoalChange("away", 1)}
                  type="button"
                  aria-label="Increase away goals"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {!scoreMatchesWinner && (
            <div className="pred-score-warning">
              Scoreline must match your selected winner.
            </div>
          )}
        </div>
      )}

      <div className="pred-scoring-info">
        <div className="pred-scoring-row">
          <span className="pred-scoring-label">Correct winner</span>
          <span className="pred-scoring-points">+1 point</span>
        </div>
        <div className="pred-scoring-row">
          <span className="pred-scoring-label">Exact score</span>
          <span className="pred-scoring-points">+0.5 point</span>
        </div>
      </div>

      {!locked && selectedWinner && (
        <button
          className={`pred-save-btn ${isSaved ? "pred-save-btn--saved" : ""} ${
            saving ? "pred-save-btn--saving" : ""
          }`}
          disabled={!canSave}
          onClick={handleSave}
          type="button"
        >
          {saving ? (
            <span className="pred-save-spinner" />
          ) : isSaved ? (
            "Prediction saved"
          ) : (
            "Save prediction"
          )}
        </button>
      )}
    </div>
  );
}
