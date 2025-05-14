import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
  scenarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scenario',
    required: true
  },
  userResponse: {
    type: String,
    required: true
  },
  aiFeedback: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const userSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['basic', 'intermediate', 'advanced'],
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  responses: [responseSchema],
  overallFeedback: {
    type: String
  }
});

export const UserSessionModel = mongoose.model('UserSession', userSessionSchema);