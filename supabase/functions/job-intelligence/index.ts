import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JobIntelligenceRequest {
  job: {
    title: string;
    company: string;
    description: string;
    location?: string;
    salary?: string;
  };
  resume?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const PDL_API_KEY = Deno.env.get('PDL_API_KEY');
    
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { job, resume }: JobIntelligenceRequest = await req.json();
    console.log(`🧠 Generating intelligence for job: ${job.title} at ${job.company}`);

    // Parallel processing: AI analysis + PDL enrichment
    const [aiAnalysis, companyEnrichment] = await Promise.allSettled([
      // AI-powered job analysis
      generateJobAnalysis(job, resume, OPENAI_API_KEY),
      // PDL company enrichment (if available)
      PDL_API_KEY ? enrichCompanyData(job.company, PDL_API_KEY) : Promise.resolve(null)
    ]);

    const result = {
      success: true,
      job_analysis: aiAnalysis.status === 'fulfilled' ? aiAnalysis.value : null,
      company_data: companyEnrichment.status === 'fulfilled' ? companyEnrichment.value : null,
      generated_at: new Date().toISOString()
    };

    if (aiAnalysis.status === 'rejected') {
      console.error('AI Analysis failed:', aiAnalysis.reason);
    }
    
    if (companyEnrichment.status === 'rejected') {
      console.error('PDL Enrichment failed:', companyEnrichment.reason);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Job intelligence error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateJobAnalysis(job: any, resume: string | undefined, apiKey: string) {
  const prompt = `Analyze this job posting and provide comprehensive intelligence:

JOB DETAILS:
Title: ${job.title}
Company: ${job.company}
Location: ${job.location || 'Not specified'}
Salary: ${job.salary || 'Not specified'}
Description: ${job.description}

${resume ? `CANDIDATE RESUME:\n${resume}\n\n` : ''}

Please provide a JSON response with:
1. difficulty_level: "entry", "mid", "senior", or "executive"
2. remote_friendly: boolean - likelihood this role supports remote work
3. growth_potential: 1-10 score for career advancement opportunities
4. required_skills: array of key technical skills needed
5. nice_to_have_skills: array of preferred but not required skills
6. salary_estimate: estimated salary range if not provided
7. interview_prep: array of likely interview topics/questions
8. company_stage: "startup", "growth", "established", or "enterprise"
9. role_type: "individual_contributor", "team_lead", or "management"
${resume ? '10. match_score: 0-100 score for resume-job fit\n11. improvement_suggestions: array of ways to strengthen candidacy' : ''}

Format as clean JSON only.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career advisor and recruitment analyst. Provide accurate, helpful job market intelligence.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const analysis = data.choices[0].message.content;

  try {
    return JSON.parse(analysis);
  } catch (parseError) {
    // Fallback if JSON parsing fails
    return {
      raw_analysis: analysis,
      difficulty_level: "mid",
      remote_friendly: true,
      growth_potential: 7,
      required_skills: ["Communication", "Problem Solving"],
      interview_prep: ["Tell me about yourself", "Why this role?", "Technical questions"],
      parsing_failed: true
    };
  }
}

async function enrichCompanyData(companyName: string, apiKey: string) {
  try {
    const response = await fetch('https://api.peopledatalabs.com/v5/company/enrich', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({
        name: companyName,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    return {
      employee_count: data.employees || data.size,
      industry: data.industry,
      founded_year: data.founded,
      headquarters: data.location ? `${data.location.locality}, ${data.location.country}` : null,
      website: data.website,
      description: data.description,
      funding_stage: data.funding?.stage,
      technologies: data.technologies?.slice(0, 10) // Top 10 technologies
    };

  } catch (error) {
    console.warn('PDL enrichment failed:', error.message);
    return null;
  }
}