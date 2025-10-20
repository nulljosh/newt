import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getHeadlines, searchNews } from './services/newsApi.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const NEWS_UPDATE_INTERVAL = process.env.NEWS_UPDATE_INTERVAL || 300000; // 5 minutes

let updateInterval;

// Emit fresh news to all connected clients
const emitLatestNews = async () => {
  try {
    const news = await getHeadlines();
    io.emit('news-update', {
      timestamp: new Date(),
      articles: news.articles || []
    });
  } catch (error) {
    console.error('Error fetching latest news:', error);
    io.emit('news-error', { message: 'Failed to fetch news' });
  }
};

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send current news immediately on connection
  emitLatestNews();

  // Handle search requests
  socket.on('search', async (query) => {
    try {
      const results = await searchNews(query, 'publishedAt', 1);
      socket.emit('search-results', {
        query,
        articles: results.articles || [],
        totalResults: results.totalResults || 0,
        page: 1
      });
    } catch (error) {
      console.error('Search error:', error);
      socket.emit('search-error', { message: 'Search failed' });
    }
  });

  // Handle load more for headlines
  socket.on('load-more-headlines', async (page) => {
    try {
      const results = await getHeadlines('us', null, page);
      socket.emit('more-headlines', {
        articles: results.articles || [],
        page,
        totalResults: results.totalResults || 0
      });
    } catch (error) {
      console.error('Load more headlines error:', error);
      socket.emit('news-error', { message: 'Failed to load more news' });
    }
  });

  // Handle load more for search
  socket.on('load-more-search', async ({ query, page }) => {
    try {
      const results = await searchNews(query, 'publishedAt', page);
      socket.emit('more-search-results', {
        articles: results.articles || [],
        page,
        totalResults: results.totalResults || 0
      });
    } catch (error) {
      console.error('Load more search error:', error);
      socket.emit('search-error', { message: 'Failed to load more results' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// REST endpoints (for initial data load)
app.get('/api/headlines', async (req, res) => {
  try {
    const news = await getHeadlines();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch headlines' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query required' });

    const results = await searchNews(q);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Setup periodic news updates
updateInterval = setInterval(emitLatestNews, NEWS_UPDATE_INTERVAL);

// Cleanup on exit
process.on('SIGINT', () => {
  clearInterval(updateInterval);
  httpServer.close();
  process.exit(0);
});
