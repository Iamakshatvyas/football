# ⚽ Football Prediction League — Setup Guide

## Prerequisites
- Node.js 18+ installed
- A Firebase account (free)
- A RapidAPI account for API-Football (free tier = 100 req/day)
- A Netlify account (free) for deployment

---

## Step 1 — Install dependencies
```bash
npm install
```

## Step 2 — Firebase setup
1. Go to https://console.firebase.google.com
2. Create a new project
3. Enable **Authentication** → Email/Password
4. Enable **Firestore Database** (start in test mode)
5. Go to Project Settings → Your apps → Web → Register app
6. Copy the config values

## Step 3 — Create your .env file
```bash
cp .env.example .env
```
Fill in your Firebase values + RapidAPI key:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_API_FOOTBALL_KEY=your_rapidapi_key
```

## Step 4 — Set Firestore security rules
In Firebase Console → Firestore → Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 5 — Run locally
```bash
npm run dev
```
Opens at http://localhost:3000

## Step 6 — Deploy to Netlify
```bash
# Push to GitHub first
git init && git add . && git commit -m "init"
git remote add origin https://github.com/YOU/football-app.git
git push -u origin main
```
Then in Netlify:
1. New site → Import from Git → select your repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add all VITE_ environment variables in Site Settings → Environment
5. Deploy!

## How the app works
- User registers/logs in → Firebase Auth
- Create a room → gets a 6-char code (e.g. ABC123)
- Friends join using that code
- Everyone predicts Home / Draw / Away for upcoming fixtures
- Points: 3 pts for correct prediction
- Leaderboard updates automatically

## Folder structure
```
src/
  App.jsx                  ← Routes + Auth guard
  main.jsx                 ← Entry point
  Styles/theme.css         ← Design system
  context/AuthContext.jsx  ← Auth state
  services/
    firebase.js            ← Firebase init
    authService.js         ← Login/register/logout
    roomService.js         ← Create/join/get rooms
    predictionService.js   ← Save/get predictions
    matchService.js        ← API-Football calls
    leaderboardService.js  ← Points calculation
  pages/
    LoginPage              ← Sign in / register
    DashboardPage          ← Room selector
    RoomPage               ← Main room experience
    CreateRoomPage         ← Create new room
    JoinRoomPage           ← Join with code
    ProfilePage            ← Account + sign out
  components/
    HeroMatch              ← Live/upcoming match hero
    PredictionCard         ← Home/Draw/Away buttons
    MiniLeaderboard        ← Top 5 standings
    ProgressCard           ← Prediction progress bar
    BottomNav              ← Mobile navigation
  layouts/
    MainLayout             ← App shell with nav
```
