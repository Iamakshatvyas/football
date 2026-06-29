import './ProgressCard.css';

export default function ProgressCard({ completed = 0, total = 0 }) {
  if (total === 0) return null;
  const pct = Math.round((completed / total) * 100);

  const status =
    pct === 100 ? 'complete' :
    pct >= 50   ? 'good' :
    pct > 0     ? 'started' : 'none';

  const messages = {
    complete: '🎯 All predictions in — good luck!',
    good:     `${total - completed} match${total - completed !== 1 ? 'es' : ''} left to predict`,
    started:  `${total - completed} of ${total} still to pick`,
    none:     'Make your predictions before kick-off',
  };

  return (
    <div className={`progress-card progress-card--${status}`}>
      <div className="progress-top">
        <span className="progress-label">{messages[status]}</span>
        <span className="progress-fraction">
          <strong>{completed}</strong>/{total}
        </span>
      </div>
      <div className="progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
