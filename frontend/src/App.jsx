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
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);

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
      setPage(1);
      setSearchQuery('');
      setTotalResults(0);
    });

    newSocket.on('search-results', (data) => {
      setArticles(data.articles);
      setLoading(false);
      setPage(1);
      setSearchQuery(data.query);
      setTotalResults(data.totalResults);
    });

    newSocket.on('more-headlines', (data) => {
      setArticles(prev => [...prev, ...data.articles]);
      setPage(data.page);
      setLoadingMore(false);
      setTotalResults(data.totalResults);
    });

    newSocket.on('more-search-results', (data) => {
      setArticles(prev => [...prev, ...data.articles]);
      setPage(data.page);
      setLoadingMore(false);
      setTotalResults(data.totalResults);
    });

    newSocket.on('news-error', (data) => {
      setError(data.message);
      setLoading(false);
      // Auto-dismiss error after 5 seconds
      setTimeout(() => setError(null), 5000);
    });

    newSocket.on('search-error', (data) => {
      setError(data.message);
      setLoading(false);
      // Auto-dismiss error after 5 seconds
      setTimeout(() => setError(null), 5000);
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

  const handleLoadMore = () => {
    if (socket && !loadingMore && articles.length < totalResults) {
      setLoadingMore(true);
      const nextPage = page + 1;
      if (searchQuery) {
        socket.emit('load-more-search', { query: searchQuery, page: nextPage });
      } else {
        socket.emit('load-more-headlines', nextPage);
      }
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
          <NewsFeed articles={articles} onLoadMore={handleLoadMore} isLoadingMore={loadingMore} hasMore={articles.length < totalResults} />
        </>
      )}

      <footer className="footer">
        <p>&copy; 2026</p>
      </footer>
    </div>
  );
}

export default App;
