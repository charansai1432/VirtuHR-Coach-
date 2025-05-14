export interface Scenario {
  _id: string;
  question: string;
  level: 'basic' | 'intermediate' | 'advanced';
  category: string;
  createdAt: string;
}

export interface SessionResponse {
  scenarioId: Scenario;
  userResponse: string;
  aiFeedback: string;
  timestamp: string;
}

export interface Session {
  _id: string;
  userId: string;
  level: 'basic' | 'intermediate' | 'advanced';
  startTime: string;
  endTime?: string;
  responses: SessionResponse[];
  overallFeedback?: string;
}
