import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ScenarioModel } from './models/scenarioModel.js';
import { UserSessionModel } from './models/userSessionModel.js';
import { fetchAIResponse } from './services/aiService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://charansaisita2028:u2yfS8S2vUHw8Xb3@cluster0.qbniyyn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/scenarios', async (req, res) => {
  try {
    const { level } = req.query;
    const scenarios = await ScenarioModel.find({ level });
    res.json(scenarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/scenarios/count', async (req, res) => {
  try {
    const { level } = req.query;
    const count = await ScenarioModel.countDocuments({ level });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sessions', async (req, res) => {
  try {
    const { userId, level } = req.body;
    const newSession = new UserSessionModel({
      userId,
      level,
      startTime: new Date(),
      responses: []
    });
    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/responses', async (req, res) => {
  try {
    const { sessionId, scenarioId, response: userResponse, question } = req.body;
    
    // Get AI feedback
    const feedback = await fetchAIResponse(question, userResponse);
    
    const session = await UserSessionModel.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    session.responses.push({
      scenarioId,
      userResponse,
      aiFeedback: feedback,
      timestamp: new Date()
    });
    
    await session.save();
    
    res.json({ feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sessions/:sessionId/summary', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await UserSessionModel.findById(sessionId)
      .populate('responses.scenarioId');
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;