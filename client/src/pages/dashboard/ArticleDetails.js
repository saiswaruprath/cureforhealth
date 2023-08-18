import { Link} from 'react-router-dom';
// import { useState} from 'react'
import { useParams} from 'react-router-dom';
function ArticleDetails({ data }) {
    //  const [data, setData] = useState([]);

    // useEffect(() => {
    //     fetch('/api/data')
    //       .then(response => response.json())
    //       .then(jsonData => {
    //         setData(jsonData);
    //       })
          
    //       .catch(error => {
    //         console.error('Error fetching data:', error);
    //       });
    //   }, []);
      
      const { itemTitle } = useParams();
     
      const newitem = data.find(item => item.title === itemTitle);
    
      if (!newitem) {
        return <div>Article not found</div>;
      }
       
    //   const ArticleCard = ({ newitem }) => {
       
    
        const imageUrl = newitem.thumbnails.startsWith('https://')
        ? newitem.thumbnails
        : `https://${newitem.thumbnails}`;
    
 
    
    
    
        return (
      
        
           
            
    
           
    
              <div className="details">
                <h4>Topic: {newitem.topic}</h4>
                <img src={imageUrl} alt="thumbnail" width="250" height="170" />
                <p><strong>Context:</strong> {newitem.context}</p>
                <p><strong>Summary:</strong> {newitem.summary}</p>
                <p>{newitem.questions && Object.keys(newitem.questions).map((question, index) => (
                  <div key={index}>
                    <p><strong>Question:</strong>{question}</p>
                    <ul>
                      {newitem.questions[question].map((answer, answerIndex) => (
                        <li key={answerIndex}>Answer:{answer.answer}</li>
                      ))}
                    </ul>
                  </div>
                ))}</p>
             <Link to="/getcentre">Go Back</Link>
              </div>
       

      
    
    
        
   
        );
    // };

  
     
   



// return (
//      <div className="results">
        
//          {/* {data.map((item, index) => (            */}

//           <ArticleCard />
//           {/* ))} */}
//         </div>
//       );

}



export default ArticleDetails
