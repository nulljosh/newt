import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import NewsFeed from './components/NewsFeed';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Connect to Socket.io server
    const newSocket = io('http://localhost:3000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setError(null);
    });

    newSocket.on('news-update', (data) => {
      setArticles(data.articles);
      setLastUpdate(new Date(data.timestamp));
      setLoading(false);
    });

    newSocket.on('search-results', (data) => {
      setArticles(data.articles);
      setLoading(false);
    });

    newSocket.on('news-error', (data) => {
      setError(data.message);
      setLoading(false);
    });

    newSocket.on('search-error', (data) => {
      setError(data.message);
      setLoading(false);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setError('Connection lost. Reconnecting...');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleSearch = (query) => {
    if (query.trim() && socket) {
      setLoading(true);
      socket.emit('search', query);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Newt</h1>
        <p className="tagline">Real-time News Aggregation</p>
      </header>

      <SearchBar onSearch={handleSearch} />

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading">Loading news...</div>
      ) : (
        <>
          <div className="update-info">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <NewsFeed articles={articles} />
        </>
      )}

      <footer className="footer">
        <p>&copy; 2026</p>
      </footer>
    </div>
  );
}

export default App;
