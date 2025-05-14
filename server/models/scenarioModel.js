import mongoose from 'mongoose';

const scenarioSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['basic', 'intermediate', 'advanced'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const ScenarioModel = mongoose.model('Scenario', scenarioSchema);