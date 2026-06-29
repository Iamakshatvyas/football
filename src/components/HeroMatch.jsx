import { useState, useEffect } from 'react';
import './HeroMatch.css';

/* ─── Helpers ───────────────────────────────────────────────────── */
function getStatusInfo(fixture) {
  const short = fixture?.fixture?.status?.short;
  const elapsed = fixture?.fixture?.status?.elapsed;

  const LIVE_STATUSES = ['1H', 'HT', '2H', 'ET', 'BT', 'P', 'LIVE'];
  const isLive = LIVE_STATUSES.includes(short);

  if (isLive) {
    if (short === 'HT') return { label: 'Half Time', isLive: true };
    if (short === 'ET') return { label: `${elapsed}' ET`, isLive: true };
    if (short === 'P')  return { label: 'Penalties', isLive: true };
    return { label: `${elapsed ?? 0}'`, isLive: true };
  }

  if (short === 'NS') {
    const date = fixture?.fixture?.date;
    if (!date) return { label: 'Upcoming', isLive: false };
    return { label: null, isLive: false, kickoff: new Date(date) };
  }

  if (short === 'FT') return { label: 'Full Time', isLive: false };
  return { label: short, isLive: false };
}

function useCountdown(kickoff) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    if (!kickoff) return;

    const tick = () => {
      const diff = kickoff - Date.now();
      if (diff <= 0) { setDisplay('Starting soon'); return; }

      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);

      if (h > 24) {
        const d = Math.floor(h / 24);
        setDisplay(`${d}d ${h % 24}h`);
      } else if (h > 0) {
        setDisplay(`${h}h ${m}m`);
      } else {
        setDisplay(`${m}m ${s}s`);
      }
    };

    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [kickoff]);

  return display;
}

function TeamLogo({ team, size = 56 }) {
  const [imgError, setImgError] = useState(false);
  const initials = team?.name
    ? team.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  if (!team?.logo || imgError) {
    return (
      <div className="hero-team-fallback" style={{ width: size, height: size }}>
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
      className="hero-team-logo"
      onError={() => setImgError(true)}
    />
  );
}

/* ─── Component ─────────────────────────────────────────────────── */
export default function HeroMatch({ fixture, roomName, memberCount }) {
  const statusInfo = fixture ? getStatusInfo(fixture) : null;
  const countdown  = useCountdown(statusInfo?.kickoff);

  const homeTeam  = fixture?.teams?.home;
  const awayTeam  = fixture?.teams?.away;
  const homeGoals = fixture?.goals?.home;
  const awayGoals = fixture?.goals?.away;
  const league    = fixture?.league;

  const isLive = statusInfo?.isLive;
  const isNS   = fixture?.fixture?.status?.short === 'NS';
  const showScore = isLive || fixture?.fixture?.status?.short === 'FT';

  return (
    <div className="hero-root">
      {/* Atmospheric background */}
      <div className="hero-bg">
        <div className="hero-bg-base" />
        <div className="hero-bg-glow hero-bg-glow--left" />
        <div className="hero-bg-glow hero-bg-glow--right" />
        {isLive && <div className="hero-bg-pulse" />}
      </div>

      {/* Room header */}
      <div className="hero-header">
        <div className="hero-room-info">
          <span className="hero-room-name">{roomName || 'My Room'}</span>
          {memberCount > 0 && (
            <span className="hero-member-count">{memberCount} members</span>
          )}
        </div>

        {isLive ? (
          <div className="badge badge-live">
            <span className="live-dot" />
            LIVE
          </div>
        ) : isNS ? (
          <div className="badge badge-muted">Next match</div>
        ) : null}
      </div>

      {/* Match display */}
      {fixture ? (
        <div className="hero-match">
          {/* Home team */}
          <div className="hero-team">
            <TeamLogo team={homeTeam} size={56} />
            <span className="hero-team-name">{homeTeam?.name || '—'}</span>
          </div>

          {/* Centre column */}
          <div className="hero-centre">
            {showScore ? (
              <>
                <div className="hero-score">
                  <span className={homeGoals > awayGoals ? 'hero-score-num hero-score-num--winning' : 'hero-score-num'}>
                    {homeGoals ?? 0}
                  </span>
                  <span className="hero-score-sep">:</span>
                  <span className={awayGoals > homeGoals ? 'hero-score-num hero-score-num--winning' : 'hero-score-num'}>
                    {awayGoals ?? 0}
                  </span>
                </div>
                <div className={`hero-status ${isLive ? 'hero-status--live' : ''}`}>
                  {statusInfo?.label}
                </div>
              </>
            ) : (
              <>
                <div className="hero-vs">VS</div>
                {isNS && countdown && (
                  <div className="hero-countdown">
                    <span className="hero-countdown-label">Kicks off in</span>
                    <span className="hero-countdown-time">{countdown}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Away team */}
          <div className="hero-team">
            <TeamLogo team={awayTeam} size={56} />
            <span className="hero-team-name">{awayTeam?.name || '—'}</span>
          </div>
        </div>
      ) : (
        /* Empty hero — no upcoming match */
        <div className="hero-empty">
          <div className="hero-empty-icon">⚽</div>
          <div className="hero-empty-text">No upcoming matches</div>
        </div>
      )}

      {/* Competition info */}
      {league && (
        <div className="hero-competition">
          {league.logo && (
            <img
              src={league.logo}
              alt={league.name}
              className="hero-comp-logo"
              width={16}
              height={16}
              onError={e => { e.target.style.display = 'none'; }}
            />
          )}
          <span className="hero-comp-name">{league.name}</span>
          {league.round && <span className="hero-comp-round">· {league.round}</span>}
          {isNS && fixture?.fixture?.date && (
            <span className="hero-comp-time">
              · {new Date(fixture.fixture.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      )}

      {/* Bottom fade */}
      <div className="hero-fade" />
    </div>
  );
}
