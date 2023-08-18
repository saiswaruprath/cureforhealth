


import React, { useState, useEffect } from 'react';
import './editarticle.css'
import { Link } from 'react-router-dom';





function EditArticle() {

  const [data, setData] = useState([]);
  const [context, setContext] = useState('');
 
 
  const [selectedType, setSelectedType] = useState('search');
  const [updateMessage, setUpdateMessage] = useState('');
  const [recentDocument, setRecentDocument] = useState(null);



  const handleUpdate = async () => {
    try {
        const response = await fetch('/api/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type: selectedType, value: context }),
          });
          const data = await response.json();
          setUpdateMessage(data.message);
        } catch (error) {
          console.error('Error updating article:', error);
          setUpdateMessage('An error occurred while updating the article');
        }
      };

      useEffect(() => {
        // Fetch the most recent document from the server
        async function fetchData() {
          try {
            const response = await fetch('/api/recent-document'); // Make sure this matches your server route
            const newData = await response.json();
            setRecentDocument(newData);
            console.log(newData)
          } catch (error) {
            console.error('no data');
          }
        }
        fetchData();
      }, []);


  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(jsonData => {
        setData(jsonData);
      })
      
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const ArticleCard = ({ item }) => {
    //  const [expanded, setExpanded] = useState(false);
    // console.log(item)
    const imageUrl = item.thumbnails.startsWith('https://')
    ? item.thumbnails
    : `https://${item.thumbnails}`;

    // const toggleExpand = () => {
    //   setExpanded(!expanded);
    // };




    return (
  
      // <div className={`article-card ${expanded ? 'expanded' : ''}`}>
        <div className="article-card"> 
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          {item.url}
        </a>
        <br />
        {item.title}

        <br />
        
          {item.topic}

         <br />
        <br />
        

        {item.thumbnails}
         <img src={imageUrl} alt="thumbnail" width="250" height="170" />
         <br />
         <br />

         {item.summary}

         {/* {expanded && (
          <div className="details">
            <h4>Topic: {item.topic}</h4>
            <p><strong>Context:</strong> {item.context}</p>
            <p><strong>Summary:</strong> {item.summary}</p>
            <p>{item.questions && Object.keys(item.questions).map((question, index) => (
              <div key={index}>
                <p><strong>Question:</strong>{question}</p>
                <ul>
                  {item.questions[question].map((answer, answerIndex) => (
                    <li key={answerIndex}>Answer:{answer.answer}</li>
                  ))}
                </ul>
              </div>
            ))}</p>
          </div>
        )} */}

        {/* <div className="buttons">
          <button onClick={toggleExpand}>
            {expanded ? 'Collapse' : 'Details'}
          </button>
        </div> */}
        <Link to={`/details/${item.title}`}>Open Details</Link>
        

    
      </div>
    );
};

  return (
   
    <div className="App">
        <h3>WELCOME TO THE CURATED SEARCH AND FILTER RESOURCE CENTER!</h3>  
        <p>Please click on search or url options below and provide the details for your search. Our application will match and display the best possible resource for your needs.</p> 
      <label>
        <input
          type="radio"
          value="search"
          checked={selectedType === 'search'}
          onChange={() => setSelectedType('search')}
        />
        Search
      </label>
      {/* <label>
        <input
          type="radio"
          value="url"
          checked={selectedType === 'url'}
          onChange={() => setSelectedType('url')}
        />
        URL
      </label> */}
      <input
        type="text"
        placeholder={`Enter ${selectedType === 'search' ? 'context' : 'URL'}`}
        value={context}
        onChange={(e) => setContext(e.target.value)}
      />
      <button onClick={handleUpdate}>Search</button>
     
      {/* <p>{updateMessage}</p> */}

      <div>
  {recentDocument ? (
    <div>
      {Object.keys(recentDocument).map((topic, index) => (
        <div key={index}>
          <h2>{topic}</h2> {/* Display the topic as the header */}
          {recentDocument[topic].map((item, subIndex) => (
            <div key={subIndex}>
              <h3>{item.title}</h3>
              <p>{item.context}</p>
              {/* Render other fields */}
            </div>
          ))}
        </div>
      ))}
    </div>
  ) : (
    <p>Loading...</p>
  )}
</div>

             <br />

             <br />
        {/* instead of data replacing with filteredArticle to try */}
        
      <div className="results">
        
        {data.map((item, index) => {           
         console.log(data);
         return (
        <ArticleCard key={index} item={item} />
         );
})}
        
      </div>



      
      </div>




  );
}

export default EditArticle;


