// Groq API service for text processing
// Using Llama 3.1 model for fast, accurate text processing

import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Validate API key
if (!GROQ_API_KEY) {
  console.error('❌ ERROR: GROQ_API_KEY not found in groqService.js');
  throw new Error('GROQ_API_KEY is required');
}

/**
 * Process raw transcription into simple, dyslexic-friendly text
 */
export async function simplifyTextForDyslexia(rawText) {
  const prompt = `You are an expert in creating dyslexic-friendly content. Take the following lecture transcription and simplify it to make it easily readable for dyslexic users. Use:
- Short, clear sentences
- Simple vocabulary
- Clear structure
- No complex jargon (or explain it simply if needed)

Transcription: ${rawText}

Simplified text:`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error:', errorData);
      throw new Error(`API returned ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected API response:', data);
      throw new Error('Invalid response format from Groq API');
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error simplifying text:', error);
    throw error;
  }
}

/**
 * Convert simplified text into detailed step-by-step format
 */
export async function createDetailedSteps(simpleText) {
  const prompt = `You are an expert educator for dyslexic students. Take the following simplified text and break it down into clear, numbered step-by-step instructions or explanations. Make each step:
- Clear and actionable
- Easy to follow
- Well-numbered and organized
- Suitable for dyslexic readers

Text: ${simpleText}

Detailed steps:`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error:', errorData);
      throw new Error(`API returned ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected API response:', data);
      throw new Error('Invalid response format from Groq API');
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error creating detailed steps:', error);
    throw error;
  }
}

/**
 * Generate a mind map structure from detailed steps
 */
export async function createMindMap(detailedSteps) {
  const prompt = `You are an expert in creating visual learning aids. Take the following detailed steps and convert them into a text-based mind map structure using bullets and indentation. Format it as:

Main Topic
  ├─ Subtopic 1
  │  ├─ Detail 1
  │  └─ Detail 2
  ├─ Subtopic 2
  │  ├─ Detail 1
  │  └─ Detail 2

Make it clear, hierarchical, and easy to understand for dyslexic readers.

Steps: ${detailedSteps}

Mind map:`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error:', errorData);
      throw new Error(`API returned ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected API response:', data);
      throw new Error('Invalid response format from Groq API');
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error creating mind map:', error);
    throw error;
  }
}

/**
 * Create a final summary of all content
 */
export async function createSummary(mindMapText) {
  const prompt = `You are an expert educator. Create a final, comprehensive summary that is:
- Fully enhanced and simplified
- Easily readable for dyslexic users
- Captures all key points
- Uses clear, simple language
- Well-structured with bullet points

Based on: ${mindMapText}

Summary:`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error:', errorData);
      throw new Error(`API returned ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected API response:', data);
      throw new Error('Invalid response format from Groq API');
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error creating summary:', error);
    throw error;
  }
}
