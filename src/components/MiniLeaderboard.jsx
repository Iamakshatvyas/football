import './MiniLeaderboard.css';

function InitialsAvatar({ name }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  return <div className="mini-lb-avatar">{initials}</div>;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export default function MiniLeaderboard({ entries = [], currentUserId }) {
  if (!entries.length) return null;

  return (
    <div className="mini-lb">
      {entries.map((entry, i) => {
        const isYou = entry.userId === currentUserId;
        const isTop3 = i < 3;

        return (
          <div
            key={entry.userId}
            className={`mini-lb-row animate-fade-up ${isYou ? 'mini-lb-row--you' : ''}`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Rank */}
            <div className="mini-lb-rank">
              {isTop3 ? MEDALS[i] : <span className="mini-lb-rank-num">{i + 1}</span>}
            </div>

            {/* Avatar */}
            <InitialsAvatar name={entry.displayName} />

            {/* Name */}
            <div className="mini-lb-name truncate">
              {entry.displayName || 'Player'}
              {isYou && <span className="lb-you-tag">You</span>}
            </div>

            {/* Stats */}
            <div className="mini-lb-stats">
              <span className="mini-lb-pts">{entry.points ?? 0}</span>
              <span className="mini-lb-acc">{entry.accuracy ?? 0}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
