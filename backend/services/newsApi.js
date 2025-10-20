import axios from 'axios';

const NEWS_API_BASE = 'https://newsapi.org/v2';

const getApiKey = () => {
  const key = process.env.NEWS_API_KEY;
  if (!key) {
    console.warn('Warning: NEWS_API_KEY environment variable not set');
  }
  return key;
};

export const getHeadlines = async (country = 'us', category = null) => {
  try {
    const params = {
      apiKey: getApiKey(),
      country,
      pageSize: 50
    };

    if (category) {
      params.category = category;
    }

    const response = await axios.get(`${NEWS_API_BASE}/top-headlines`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching headlines:', error.message);
    throw error;
  }
};

export const searchNews = async (query, sortBy = 'publishedAt') => {
  try {
    const params = {
      q: query,
      apiKey: getApiKey(),
      pageSize: 50,
      sortBy,
      language: 'en'
    };

    const response = await axios.get(`${NEWS_API_BASE}/everything`, { params });
    return response.data;
  } catch (error) {
    console.error('Error searching news:', error.message);
    throw error;
  }
};

export const getNewsByCategory = async (category, country = 'us') => {
  return getHeadlines(country, category);
};
