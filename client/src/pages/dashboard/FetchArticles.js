// import React, { useEffect, useState } from 'react';


// const FetchArticles = () => {
//   const [articles, setArticles] = useState([]);

//   useEffect(() => {
//     // Fetch articles from your backend API
//     fetch('/api/articles')
//       .then((response) => response.json())
//       .then((data) => {
//         setArticles(data);
//       });
//   }, []);

//   return (
//     <div>
//       <h2>Fetched Articles</h2>
//       <ul>
//         {articles.map((article) => (
//           <li key={article.id}>
//              <strong>{article.title}</strong>: {article.content}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };
// export default FetchArticles;
