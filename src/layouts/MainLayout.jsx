import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import './MainLayout.css';

export default function MainLayout() {
  return (
    <div className="layout-root">
      <main className="layout-main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
