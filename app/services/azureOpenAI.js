// azureOpenAI.js

import {
  AZURE_OPENAI_ENDPOINT,
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_DEPLOYMENT,
} from '@env';

export const getEventSuggestion = async transcript => {
  if (!transcript.trim()) {
    throw new Error('Empty transcript');
  }

  const today = new Date();
  const todayString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

  const url = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2023-03-15-preview`;

  const messages = [
    {
      role: 'system',
      content: `You are an assistant that extracts calendar event details from user input and outputs them in JSON format with keys: "title", "date", "time", "notes", "is_valid". The "is_valid" key is a boolean that indicates whether the event details are valid (When date or time are null). Today's date is ${todayString}. Use this information to interpret relative dates (e.g., "tomorrow", "next week") correctly.`,
    },
    {role: 'user', content: transcript},
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': AZURE_OPENAI_API_KEY,
    },
    body: JSON.stringify({
      messages: messages,
      temperature: 0.7,
      max_tokens: 150,
      response_format: {type: 'json_object'},
    }),
  });

  const data = await response.json();

  if (response.ok) {
    return data.choices[0].message.content;
  } else {
    throw new Error(data.error.message);
  }
};
