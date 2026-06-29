import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export const getRoomLeaderboard = async (roomId) => {
  const [predictionsSnap, roomSnap] = await Promise.all([
    getDocs(query(collection(db, 'predictions'), where('roomId', '==', roomId))),
    getDoc(doc(db, 'rooms', roomId)),
  ]);

  if (!roomSnap.exists()) return [];

  const members = roomSnap.data().members || [];
  const predictions = predictionsSnap.docs.map(d => d.data());

  const stats = {};
  members.forEach(m => {
    stats[m.uid] = { userId: m.uid, displayName: m.displayName, points: 0, correct: 0, total: 0, movement: 0 };
  });

  predictions.forEach(p => {
    if (!stats[p.userId]) return;
    if (p.result !== undefined) {
      stats[p.userId].total++;
      if (p.prediction === p.result) {
        stats[p.userId].correct++;
        stats[p.userId].points += 3;
      }
    }
  });

  return Object.values(stats)
    .map(s => ({
      ...s,
      correctPredictions: s.correct,
      accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
    }))
    .sort((a, b) => b.points - a.points);
};
