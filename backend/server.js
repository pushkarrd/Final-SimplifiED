// Express.js Server with Firebase Admin SDK
// Backend API for SimplifiED lecture processing

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
  simplifyTextForDyslexia,
  createDetailedSteps,
  createMindMap,
  createSummary
} from './groqService.js';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], // Frontend URL
  credentials: true
}));
app.use(express.json());

// Validate environment variables
if (!process.env.GROQ_API_KEY) {
  console.error('❌ ERROR: GROQ_API_KEY is not set in .env file');
  process.exit(1);
}

console.log('✅ Environment variables loaded successfully');
console.log('🔑 Groq API Key:', process.env.GROQ_API_KEY ? 'Present (' + process.env.GROQ_API_KEY.substring(0, 10) + '...)' : 'Missing');

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccountKey.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Create lecture endpoint
app.post('/api/lectures', async (req, res) => {
  try {
    const { userId, transcription } = req.body;

    if (!userId || !transcription) {
      return res.status(400).json({ error: 'userId and transcription are required' });
    }

    const lectureData = {
      userId,
      transcription,
      simpleText: null,
      detailedSteps: null,
      mindMap: null,
      summary: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'processing'
    };

    const docRef = await db.collection('lectures').add(lectureData);

    res.status(201).json({
      id: docRef.id,
      ...lectureData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating lecture:', error);
    res.status(500).json({ error: 'Failed to create lecture' });
  }
});

// Get lecture by ID
app.get('/api/lectures/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('lectures').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Lecture not found' });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error getting lecture:', error);
    res.status(500).json({ error: 'Failed to get lecture' });
  }
});

// Get latest lecture for user
app.get('/api/lectures/user/:userId/latest', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const snapshot = await db.collection('lectures')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.json(null);
    }

    const doc = snapshot.docs[0];
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error getting latest lecture:', error);
    res.status(500).json({ error: 'Failed to get latest lecture' });
  }
});

// Process transcription through Groq AI
app.post('/api/lectures/:id/process', async (req, res) => {
  try {
    const { id } = req.params;
    const lectureRef = db.collection('lectures').doc(id);
    const doc = await lectureRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Lecture not found' });
    }

    const { transcription } = doc.data();

    if (!transcription) {
      return res.status(400).json({ error: 'No transcription found' });
    }

    // Process through Groq API sequentially
    console.log('Step 1: Simplifying text...');
    const simpleText = await simplifyTextForDyslexia(transcription);
    await lectureRef.update({ 
      simpleText, 
      updatedAt: admin.firestore.FieldValue.serverTimestamp() 
    });

    console.log('Step 2: Creating detailed steps...');
    const detailedSteps = await createDetailedSteps(simpleText);
    await lectureRef.update({ 
      detailedSteps, 
      updatedAt: admin.firestore.FieldValue.serverTimestamp() 
    });

    console.log('Step 3: Creating mind map...');
    const mindMap = await createMindMap(detailedSteps);
    await lectureRef.update({ 
      mindMap, 
      updatedAt: admin.firestore.FieldValue.serverTimestamp() 
    });

    console.log('Step 4: Creating summary...');
    const summary = await createSummary(mindMap);
    await lectureRef.update({ 
      summary, 
      status: 'completed',
      updatedAt: admin.firestore.FieldValue.serverTimestamp() 
    });

    res.json({
      simpleText,
      detailedSteps,
      mindMap,
      summary
    });
  } catch (error) {
    console.error('Error processing lecture:', error);
    res.status(500).json({ error: 'Failed to process lecture', details: error.message });
  }
});

// Update lecture field
app.patch('/api/lectures/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    await db.collection('lectures').doc(id).update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating lecture:', error);
    res.status(500).json({ error: 'Failed to update lecture' });
  }
});

// Delete lecture
app.delete('/api/lectures/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('lectures').doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting lecture:', error);
    res.status(500).json({ error: 'Failed to delete lecture' });
  }
});

// Get all lectures for user
app.get('/api/lectures/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const snapshot = await db.collection('lectures')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const lectures = [];
    snapshot.forEach(doc => {
      lectures.push({ id: doc.id, ...doc.data() });
    });

    res.json(lectures);
  } catch (error) {
    console.error('Error getting user lectures:', error);
    res.status(500).json({ error: 'Failed to get user lectures' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`📚 Firebase Admin SDK initialized`);
  console.log(`🤖 Groq API ready for text processing`);
});
