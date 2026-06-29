import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import LoginPage      from './pages/LoginPage';
import DashboardPage  from './pages/DashboardPage';
import RoomPage       from './pages/RoomPage';
import CreateRoomPage from './pages/CreateRoomPage';
import JoinRoomPage   from './pages/JoinRoomPage';
import ProfilePage    from './pages/ProfilePage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#0D0D0F' }}>
      <div style={{ fontSize:40 }}>⚽</div>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background:'#1A1A20', color:'#fff', border:'0.5px solid rgba(255,255,255,0.1)' },
            success: { iconTheme: { primary:'#FF5A00', secondary:'#fff' } },
          }}
        />
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
            <Route path="/"              element={<DashboardPage />} />
            <Route path="/room/:roomId"  element={<RoomPage />} />
            <Route path="/create"        element={<CreateRoomPage />} />
            <Route path="/join"          element={<JoinRoomPage />} />
            <Route path="/profile"       element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
