// Add or update the api.ts file to include the /api prefix
export const createSession = async (userId: string, level: string) => {
  const response = await fetch('/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, level }),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const fetchScenarios = async (level: string) => {
  const response = await fetch(`/api/scenarios?level=${level}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const getScenarioCount = async (level: string) => {
  const response = await fetch(`/api/scenarios/count?level=${level}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data.count;
};

export const saveResponse = async (
  sessionId: string,
  scenarioId: string,
  response: string,
  question: string
) => {
  const apiResponse = await fetch('/api/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId,
      scenarioId,
      response,
      question,
    }),
  });
  
  if (!apiResponse.ok) {
    throw new Error(`HTTP error! status: ${apiResponse.status}`);
  }
  
  return apiResponse.json();
};

export const getSessionSummary = async (sessionId: string) => {
  const response = await fetch(`/api/sessions/${sessionId}/summary`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};