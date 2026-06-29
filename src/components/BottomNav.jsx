import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNav.css';

const NAV_ITEMS = [
  { path: '/',        icon: '🏠', label: 'Home' },
  { path: '/create',  icon: '➕', label: 'Create' },
  { path: '/join',    icon: '🔑', label: 'Join' },
  { path: '/profile', icon: '👤', label: 'Profile' },
];

export default function BottomNav() {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {NAV_ITEMS.map(item => {
        const active = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
        return (
          <button
            key={item.path}
            className={`bottom-nav-item ${active ? 'bottom-nav-item--active' : ''}`}
            onClick={() => navigate(item.path)}
            aria-current={active ? 'page' : undefined}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
