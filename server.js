
import axios from 'axios'
import express from 'express';
import fetch from 'node-fetch';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors'
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';

///fetcharticle change
import { Firestore } from '@google-cloud/firestore';
import {Storage } from '@google-cloud/storage';

const app = express();
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import morgan from 'morgan';


import connectDB from './db/connect.js';

import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'


import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import authenticateUser from './middleware/auth.js';

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

  
  

const __dirname = dirname(fileURLToPath(import.meta.url));  
app.use(express.static(path.join(__dirname, 'newimages')));
app.use(express.static(path.resolve(__dirname, './client/build')));
app.use(cors());
app.use(express.json())

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "script-src 'self' https://maps.googleapis.com");
  next();
});


// /// CODE FOR ARTICLE FETCH FROM DIRECT FIRESTORE BEGINS


// // Replace with the path to your service account JSON key file
 import serviceAccountKey from './newimages/sjsu-rf-ohana-42e2de2612fb.json' assert { type: "json" };

// // Initialize Firestore
 const firestore = new Firestore({ projectId: serviceAccountKey.project_id, credentials: serviceAccountKey });





// Define API endpoint for creating documents
app.post('/api/update', async (req, res) => {
  try {
    const { type, value } = req.body;

    const collectionRef = firestore.collection('newarticles');

    // Create a new document with appropriate fields based on the type
    if (type === 'search') {
      await collectionRef.add({ context: value, type: 'search' });
    } else if (type === 'url') {
      await collectionRef.add({ url: value, type: 'url' });
    }

    res.status(200).json({ message: 'Here are your search results:' });
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: 'An error occurred while creating document' });
  }
});

app.get('/api/recent-document', async(req, res) => {
  try {
    const docRef = firestore.collection('transaction_response').doc('Rdgs8sKw1myPCXyaM89V');
    const doc = await docRef.get();
    if (!doc.exists) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }
    const data = doc.data();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/api/upload', async (req, res) => {
  const { resourceTopic, resourceType, subject, content, selectedFileUrl, userId } = req.body;


  // Create a new document in your Firestore collection
  await firestore.collection('uploadresource').add({
    resourceTopic,
    resourceType,
    subject,
    content,
    selectedFileUrl,
    userId,

  });

  res.status(201).send('Resource uploaded successfully.');
});

// Load the Google Cloud Storage service account credentials
const storage = new Storage({
  projectId: 'sjsu-rf-ohana', // Your project ID
  keyFilename: './newimages/sjsu-rf-ohana-fccb016ed3c8.json', // Path to your service account JSON key file
});

// Endpoint to fetch data from the Google Cloud Storage JSON file
app.get('/api/data', async (req, res) => {
  try {
    const bucketName = 'context_data1'; // Replace with your bucket name
    const fileName = 'new_data1.json'; // Replace with your JSON file name

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    const data = await file.download();
    const jsonContent = data.toString();
    const jsonData = JSON.parse(jsonContent);

    res.json(jsonData);
    // console.log(jsonData);
  } catch (error) {
    console.error('Error fetching JSON data:', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.get('/api/search', async (req, res) => {
  const searchUserId = req.query.userId;

  // Query Firestore to find the resource based on searchUserId
  const querySnapshot2 = await firestore
    .collection('uploadresource')
    .where('userId', '==', searchUserId)
    .get();

  if (querySnapshot2.empty) {
    res.status(404).send('Resource not found.');
    return;
  }

  const resourceData = querySnapshot2.docs[0].data();
  res.status(200).json(resourceData);
});






app.get('/api/treatment-centers', async (req, res) => {
  const { lat, lng } = req.query;
  const radius = 5000; // Specify the radius within which to search for treatment centers (in meters)
  const apiKey = 'AIzaSyBGcMB5sQ7MZ7RpRLCWKqEdHzI3qj70EBM';

  try {
   

   
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=health&keyword=treatment&key=${apiKey}`;

    const response = await fetch(url);
    
    const data = await response.json();

    // Extract the treatment center details from the response
        const treatmentCenters = data.results.map((result) => ({
          place_id: result.place_id,
          name: result.name,
          vicinity: result.vicinity,
          geometry: result.geometry,
          openingHours: result.opening_hours ? result.opening_hours.open_now : null,
          photos: result.photos || [],
          business_status: result.business_status || null,
          types: result.types || null,
        }));
      res.json({ results: treatmentCenters });
      console.log(treatmentCenters)

  } catch (error) {
    console.error('Error retrieving treatment centers:', error);
    res.status(500).json({ error: 'Failed to retrieve treatment centers' });
  }
});

 


app.get('/', (req, res) => {
  res.json({msg: 'Welcome!'});
});

app.get('/api/v1', (req, res) => {
    res.json({msg: 'API'});
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs',authenticateUser, jobsRouter);

app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  });

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 5000;




const start =  async () =>{
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => {
        console.log(`Server is listening on port ${port}...`)
    });
    } catch (error){
        console.log(error)

    }
}


start()