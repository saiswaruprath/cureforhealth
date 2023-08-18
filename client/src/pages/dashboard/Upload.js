import React, { useState } from 'react';
import './upload.css';
import SearchResource from './SearchResource';

const Upload = () => {
  const [resourceTopic, setResourceTopic] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);
  const [userId, setUserId] = useState('');
  const [searchedResource, setSearchedResource] = useState(null);
  const [searchedResourceNotFound, setSearchedResourceNotFound] = useState(false);
  const [successMessage, setSuccessMessage] = useState('')


  const handleResourceTopicChange = (e) => {
    setResourceTopic(e.target.value);
  };

  const handleResourceTypeChange = (e) => {
    setResourceType(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSelectedFileUrlChange = (e) => {
  
    setSelectedFileUrl(e.target.value);
  };

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };


  const handleSearch = async (searchUserId) => {
    // Fetch resource data based on the searchUserId
    const response = await fetch(`/api/search?userId=${searchUserId}`);
    if (response.status === 404) {
      setSearchedResource(null);
      setSearchedResourceNotFound(true);
    } else {
      const data = await response.json();
      setSearchedResource(data);
      setSearchedResourceNotFound(false);
    }

  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Perform your resource upload logic here

       // Prepare form data
       // Create a new document in your Firestore collection
       await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceTopic,
          resourceType,
          subject,
          content,
          selectedFileUrl,
          userId,
        }),
      });

       // Show success message
    setSuccessMessage('Resource uploaded successfully.');
  
    // Reset form fields after submission if needed
    setResourceTopic('');
    setResourceType('');
    setSubject('');
    setContent('');
    setSelectedFileUrl(null);
    setUserId('');
  };

  return (
    <div className="upload-resource-page">
      <h2>Want to Contribute? You have come to the right place!</h2>
          <p>Please provide the details for the options below and click on publish to add your resource.
You can also search for your resource with your user ID below and check the details.</p> 
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="resourceTopic">Resource Topic</label>
          <i className="fas fa-user"></i>
          <input
            type="text"
            id="resourceTopic"
            value={resourceTopic}
            onChange={handleResourceTopicChange}
            required
          />
          {/* Add an icon here if you prefer */}
        </div>

        <div className="form-group">
          <label htmlFor="resourceType">Resource Type</label>
          <input
            type="text"
            id="resourceType"
            value={resourceType}
            onChange={handleResourceTypeChange}
            required
          />
          {/* Add an icon here if you prefer */}
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={handleSubjectChange}
            required
          />
          {/* Add an icon here if you prefer */}
        </div>

        <div className="form-group">
          <label htmlFor="content">Content to Write</label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            required
          />
          {/* Add an icon here if you prefer */}
        </div>

        <div className="form-group">
  <label htmlFor="file">Upload Resource File (URL)</label>
  <input
    type="url"   // Use type "url" for URL input
    id="file"
    value={selectedFileUrl}
    onChange={handleSelectedFileUrlChange}
    required
  />
</div>

        <div className="form-group">
          <label htmlFor="userId">User ID (Email)</label>
          <input
            type="email"
            id="userId"
            value={userId}
            onChange={handleUserIdChange}
            required
          />
          {/* Add an icon here if you prefer */}
        </div>
        
        <br />

        <button type="submit">Publish</button>
        {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

        <br />
        <br />
        

      </form>
      <SearchResource 
        handleSearch={handleSearch} 
        />

        <br />
        <br /> 

      {searchedResource && (
        <div className="searched-resource-details">
          <h2>Searched Resource Details</h2>
          <p>Resource Topic: {searchedResource.resourceTopic}</p>
          <p>Resource Type: {searchedResource.resourceType}</p>
          <p>Subject: {searchedResource.subject}</p>
          <p>Content: {searchedResource.content}</p>
          <p>User ID: {searchedResource.userId}</p>
          <p>Resource URL: {searchedResource.selectedFileUrl}</p>
        </div>
      )}
       {searchedResourceNotFound && (
        <div className="no-resource-message">
          No resource found for this user ID.
        </div>
      )}
    </div>
  );
};

export default Upload;
