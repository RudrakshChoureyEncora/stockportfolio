// import React, { useState, useEffect } from "react";
// import "./styles/News.css";

// export default function News() {
//   const [news, setNews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         // Using the free NewsAPI (requires free API key)
//         const response = await fetch(
//           "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=844839d9cd794f3f829f23b66c3d3c83"
//         );
//         const data = await response.json();

//         if (data.articles) {
//           setNews(data.articles.slice(0, 100)); // Display first 10 articles
//         } else {
//           setError("No articles found.");
//         }
//       } catch (err) {
//         setError("Failed to fetch news.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNews();
//   }, []);

//   return (
//     <div className="news-container">
//       <h1>Latest News</h1>
//       {loading && <p>Loading...</p>}
//       {error && <p className="error">{error}</p>}
//       <div className="news-list">
//         {news.map((article, index) => (
//           <div key={index} className="news-item">
//             <h3>{article.title}</h3>
//             <p>{article.description}</p>
//             <a href={article.url} target="_blank" rel="noopener noreferrer">
//               Read more
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import "./styles/News.css";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Fetch from your custom backend API
        const response = await fetch(
          "http://stockify-env.eba-2erwktvh.ap-south-1.elasticbeanstalk.com/api/news"
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          // Map your backend response to match NewsAPI structure
          const mappedNews = data.map((article) => ({
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.urlToImage,
            publishedAt: article.publishedAt,
            content: article.content,
          }));
          setNews(mappedNews.slice(0, 100)); // Display first 100 articles
        } else {
          setError("No articles found.");
        }
      } catch (err) {
        setError("Failed to fetch news.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="news-container">
      <h1>Latest News</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="news-list">
        {news.map((article, index) => (
          <div key={index} className="news-item">
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
