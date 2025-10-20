import './ArticleCard.css';

function ArticleCard({ article }) {
  const {
    title,
    description,
    urlToImage,
    url,
    source,
    publishedAt,
  } = article;

  const publishDate = new Date(publishedAt).toLocaleDateString();

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="article-card">
      {urlToImage && (
        <div className="article-image">
          <img src={urlToImage} alt={title} />
        </div>
      )}
      <div className="article-content">
        <h3 className="article-title">{title}</h3>
        {description && <p className="article-description">{description}</p>}
        <div className="article-footer">
          <span className="article-source">{source?.name || 'Unknown'}</span>
          <span className="article-date">{publishDate}</span>
        </div>
      </div>
    </a>
  );
}

export default ArticleCard;
