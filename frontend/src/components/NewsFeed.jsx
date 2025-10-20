import { useRef, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import './NewsFeed.css';

function NewsFeed({ articles, onLoadMore, isLoadingMore, hasMore }) {
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [onLoadMore, isLoadingMore, hasMore]);

  if (!articles || articles.length === 0) {
    return <div className="empty-state">No articles found</div>;
  }

  return (
    <>
      <div className="news-feed">
        {articles.map((article, index) => (
          <ArticleCard key={`${article.url}-${index}`} article={article} />
        ))}
      </div>
      {hasMore && (
        <div ref={loadMoreRef} className="load-more-trigger">
          {isLoadingMore && <div className="loading-more">Loading more...</div>}
        </div>
      )}
    </>
  );
}

export default NewsFeed;
