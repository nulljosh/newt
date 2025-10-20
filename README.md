Newt

Real-time news aggregation service with React frontend and Express backend.

## Features

- Real-time news updates via WebSocket
- Search functionality
- Multiple news sources through NewsAPI
- Responsive design
- Auto-refresh news every 5 minutes

## Prerequisites

- Node.js (v16+)
- npm or yarn
- NewsAPI key (free at https://newsapi.org)

## Installation

### 1. Get a NewsAPI Key

Go to https://newsapi.org and sign up for a free API key.

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your NewsAPI key
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

## Development

### Terminal 1: Start Backend

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:3000`

### Terminal 2: Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

Open your browser to `http://localhost:5173` and start using Newt!

## Project Structure

```
newt/
├── backend/
│   ├── services/
│   │   └── newsApi.js       # NewsAPI integration
│   ├── server.js             # Express + Socket.io server
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── NewsFeed.jsx
│   │   │   ├── ArticleCard.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── index.html
│   └── package.json
└── README.md
```

## Deployment

### Frontend: GitHub Pages (Free)

GitHub Pages can host **static** content only. Since this project has a backend API dependency, you have two options:

**Option A: Frontend-only with public APIs**
- Build the frontend: `cd frontend && npm run build`
- The `dist/` folder can be hosted on GitHub Pages
- You'd need to redeploy your backend separately or use a serverless solution

**Option B: Full Stack (Recommended for beginners)**
- Use a free service like **Render.com**, **Railway.app**, or **Fly.io** (they have generous free tiers)
- Deploy both backend and frontend together
- Much easier than managing separate deployments

### Backend Deployment Options

**Free Options:**
- **Render.com**: Deploy Node.js apps free (with some limitations)
- **Railway.app**: $5/month free tier, very generous
- **Fly.io**: Free tier available
- **Heroku**: Paid now, but other services have replaced it

**Steps for Render.com (simplest):**

1. Push code to GitHub
2. Go to Render.com, connect your GitHub account
3. Click "New Web Service"
4. Select your repo
5. Set environment variables (NEWS_API_KEY)
6. Deploy

### Full Stack on One Service

**Recommended for beginners:** Use Render or Railway to deploy both frontend and backend from the same repo. They handle building and serving both.

### TL;DR on Hosting

- **GitHub Pages**: Free but static only (not suitable for this project)
- **Render/Railway**: ~$0-5/month, perfect for small projects
- **Option 1 (Simple)**: Use one of these services, deploy everything together
- **Option 2 (Advanced)**: Deploy frontend to GitHub Pages, backend to Render (more complex)

## Environment Variables

Backend requires these in `.env`:

```
NEWS_API_KEY=your_api_key
PORT=3000
FRONTEND_URL=http://localhost:5173
NEWS_UPDATE_INTERVAL=300000
```

## Available Scripts

### Backend

- `npm run dev` - Start with auto-reload (watches for changes)
- `npm start` - Start production server

### Frontend

- `npm run dev` - Start dev server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Architecture

- **Backend**: Express.js + Socket.io for real-time updates
- **Frontend**: React with Socket.io client
- **API**: NewsAPI.org for news data
- **Real-time**: WebSocket connections update all connected clients immediately

## Next Steps

- Add category filtering
- Implement user preferences/bookmarks
- Add dark mode
- Improve error handling
- Add tests
