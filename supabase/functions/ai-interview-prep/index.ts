import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, jobDescription, jobTitle, company, questionType = 'behavioral' } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (questionType === 'generate') {
      systemPrompt = `You are an expert interview coach. Generate realistic interview questions tailored to specific roles and candidates. Provide a mix of behavioral, technical, and situational questions.`;
      
      userPrompt = `Generate 10 interview questions for this role, including sample answers. Return as JSON:

{
  "questions": [
    {
      "question": "...",
      "type": "behavioral|technical|situational",
      "sampleAnswer": "...",
      "tips": "..."
    }
  ]
}

JOB: ${jobTitle} at ${company}
JOB DESCRIPTION: ${jobDescription}
CANDIDATE RESUME: ${resumeText}`;
    } else {
      systemPrompt = `You are an expert interview coach providing personalized feedback and coaching. Analyze responses and provide constructive, actionable advice.`;
      
      userPrompt = `As an interview coach, provide detailed feedback on interview readiness and suggest improvements based on the resume and target role.

JOB: ${jobTitle} at ${company}
RESUME: ${resumeText}
JOB DESCRIPTION: ${jobDescription}

Provide coaching advice in JSON format:
{
  "strengths": ["strength1", "strength2"],
  "improvementAreas": ["area1", "area2"],
  "keyTalking Points": ["point1", "point2"],
  "commonQuestions": ["question1", "question2"],
  "starStories": [
    {
      "situation": "...",
      "task": "...",
      "action": "...",
      "result": "..."
    }
  ],
  "salary_negotiation": {
    "market_range": "...",
    "negotiation_tips": ["tip1", "tip2"]
  }
}`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    let result;
    
    try {
      result = JSON.parse(data.choices[0]?.message?.content || '{}');
    } catch {
      result = {
        error: 'Failed to parse AI response',
        raw_response: data.choices[0]?.message?.content
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-interview-prep:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});