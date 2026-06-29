import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { joinRoom } from '../services/roomService';
import toast from 'react-hot-toast';
import './CreateJoinPage.css';

export default function JoinRoomPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    try {
      const room = await joinRoom(user.uid, user.displayName, code.trim());
      toast.success(`Joined ${room.name}!`);
      navigate(`/room/${room.id}`);
    } catch (err) {
      toast.error(err.message || 'Room not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cj-root">
      <button className="cj-back" onClick={() => navigate(-1)}>← Back</button>
      <div className="cj-card">
        <div className="cj-icon">🔑</div>
        <h1 className="cj-title">Join a room</h1>
        <p className="cj-sub">Enter the 6-character code your friend shared with you.</p>
        <form onSubmit={handleJoin} className="cj-form">
          <input
            className="cj-input cj-input--code"
            type="text"
            placeholder="ABC123"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            maxLength={6}
            required
            autoFocus
            autoCapitalize="characters"
          />
          <button className="btn btn-primary btn-lg" type="submit" disabled={loading || code.length < 4}>
            {loading ? <span className="login-spinner" /> : 'Join room'}
          </button>
        </form>
      </div>
    </div>
  );
}
