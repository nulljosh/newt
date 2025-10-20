import ArticleCard from './ArticleCard';
import './NewsFeed.css';

function NewsFeed({ articles }) {
  if (!articles || articles.length === 0) {
    return <div className="empty-state">No articles found</div>;
  }

  return (
    <div className="news-feed">
      {articles.map((article, index) => (
        <ArticleCard key={`${article.url}-${index}`} article={article} />
      ))}
    </div>
  );
}

export default NewsFeed;
