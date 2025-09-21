import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PDLCompanyData {
  name?: string;
  website?: string;
  size?: string;
  industry?: string;
  location?: {
    country?: string;
    locality?: string;
    region?: string;
  };
  employees?: number;
  founded?: number;
  description?: string;
}

interface EnrichmentRequest {
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    location?: string;
    description?: string;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PDL_API_KEY = Deno.env.get('PDL_API_KEY');
    if (!PDL_API_KEY) {
      throw new Error('PDL_API_KEY is not configured');
    }

    const { jobs }: EnrichmentRequest = await req.json();
    console.log(`🔍 Enriching ${jobs.length} jobs with PDL data`);

    const enrichedJobs = await Promise.all(jobs.map(async (job) => {
      try {
        // Enrich company data using PDL Company API
        const companyResponse = await fetch('https://api.peopledatalabs.com/v5/company/enrich', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': PDL_API_KEY,
          },
          body: JSON.stringify({
            name: job.company,
          }),
        });

        if (!companyResponse.ok) {
          console.warn(`PDL API error for ${job.company}:`, companyResponse.status);
          return {
            ...job,
            enriched: false,
            error: `PDL API error: ${companyResponse.status}`
          };
        }

        const companyData: PDLCompanyData = await companyResponse.json();
        
        // Extract key insights
        const enrichment = {
          company_size: companyData.employees ? `${companyData.employees} employees` : companyData.size,
          industry: companyData.industry,
          founded_year: companyData.founded,
          company_location: companyData.location ? 
            `${companyData.location.locality || ''}, ${companyData.location.region || ''}, ${companyData.location.country || ''}`.replace(/^,\s*|,\s*$/g, '') : 
            undefined,
          website: companyData.website,
          company_description: companyData.description,
          enriched: true,
          enrichment_source: 'PDL'
        };

        console.log(`✅ Enriched ${job.company}:`, {
          employees: companyData.employees,
          industry: companyData.industry,
          founded: companyData.founded
        });

        return {
          ...job,
          ...enrichment
        };

      } catch (error) {
        console.error(`Error enriching job ${job.id}:`, error);
        return {
          ...job,
          enriched: false,
          error: error.message
        };
      }
    }));

    const successCount = enrichedJobs.filter(job => job.enriched).length;
    
    console.log(`🎉 Successfully enriched ${successCount}/${jobs.length} jobs`);

    return new Response(JSON.stringify({
      success: true,
      enriched_jobs: enrichedJobs,
      stats: {
        total: jobs.length,
        enriched: successCount,
        failed: jobs.length - successCount
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Job enrichment error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});