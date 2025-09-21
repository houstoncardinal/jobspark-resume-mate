// USAJobs API Integration
const USAJOBS_API_KEY = '4Nx2nq6xUYvNNm8VZFm8rPR3M7/8j336/vLgujfroSU=';
const USAJOBS_BASE_URL = 'https://data.usajobs.gov/api/search';

export interface USAJobsSearchParams {
  Keyword?: string;
  LocationName?: string;
  Organization?: string;
  PositionTitle?: string;
  JobCategoryCode?: string;
  PayGradeHigh?: string;
  PayGradeLow?: string;
  SalaryMin?: number;
  SalaryMax?: number;
  DatePosted?: number; // days
  Page?: number;
  ResultsPerPage?: number;
  Sort?: 'relevance' | 'date' | 'salary';
}

export interface USAJobsPosition {
  MatchedObjectId: string;
  MatchedObjectDescriptor: {
    PositionID: string;
    PositionTitle: string;
    OrganizationName: string;
    OrganizationCodes: string[];
    PositionURI: string;
    PositionLocation: Array<{
      LocationName: string;
      CityName: string;
      StateCode: string;
      CountryCode: string;
    }>;
    PositionStartDate: string;
    PositionEndDate: string;
    PositionOfferingType: string;
    PositionSchedule: string;
    PositionRemuneration: Array<{
      MinimumRange: string;
      MaximumRange: string;
      RateIntervalCode: string;
      Description: string;
    }>;
    PositionRemunerationType: string;
    PositionSensitivity: string;
    PositionRiskLevel: string;
    PositionSummary: string;
    PositionFormattedDescription: Array<{
      Label: string;
      LabelDescription: string;
    }>;
    UserArea: {
      Details: {
        JobSummary: string;
        WhoMayApply: {
          Text: string;
        };
        LowGrade: string;
        HighGrade: string;
        PromotionPotential: string;
        SubAgency: string;
        AgencyContactEmail: string;
        AgencyContactPhone: string;
        AgencyContactText: string;
        SecurityClearance: string;
        DrugTestRequired: string;
        AdjudicationType: string;
        TeleworkEligible: boolean;
        RemoteWorkEligible: boolean;
        Relocation: string;
        TravelRequired: string;
        Benefits: string;
        BenefitsDisplayDefaultText: string;
        BenefitsText: string;
        OtherInformation: string;
        KeyRequirements: string[];
        WhatToExpectNext: string;
        RequiredDocuments: string;
        HowToApply: string;
        JobFamily: string;
        JobCategory: Array<{
          Name: string;
          Code: string;
        }>;
        JobGrade: Array<{
          Code: string;
          Name: string;
        }>;
        PositionOfferingType: string;
        PositionSchedule: string;
        PositionSensitivity: string;
        PositionRiskLevel: string;
      };
    };
  };
}

export interface USAJobsSearchResult {
  SearchResult: {
    SearchResultCount: number;
    SearchResultCountAll: number;
    SearchResultItems: USAJobsPosition[];
    UserArea: {
      NumberOfPages: number;
      NumberOfJobs: number;
    };
  };
}

export class USAJobsAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string = USAJOBS_API_KEY) {
    this.apiKey = apiKey;
    this.baseUrl = USAJOBS_BASE_URL;
  }

  private async makeRequest(params: USAJobsSearchParams): Promise<USAJobsSearchResult> {
    const url = new URL(this.baseUrl);
    
    // Add search parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Host': 'data.usajobs.gov',
          'User-Agent': 'Gigm8/1.0 (admin@gigm8.com)',
          'Authorization-Key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`USAJobs API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('USAJobs API Error:', error);
      throw error;
    }
  }

  async searchJobs(params: USAJobsSearchParams = {}): Promise<USAJobsSearchResult> {
    const defaultParams: USAJobsSearchParams = {
      ResultsPerPage: 25,
      Page: 1,
      Sort: 'relevance',
      ...params
    };

    return this.makeRequest(defaultParams);
  }

  async searchByKeyword(keyword: string, location?: string): Promise<USAJobsSearchResult> {
    return this.searchJobs({
      Keyword: keyword,
      LocationName: location
    });
  }

  async searchByOrganization(organization: string): Promise<USAJobsSearchResult> {
    return this.searchJobs({
      Organization: organization
    });
  }

  async searchBySalaryRange(minSalary: number, maxSalary: number): Promise<USAJobsSearchResult> {
    return this.searchJobs({
      SalaryMin: minSalary,
      SalaryMax: maxSalary
    });
  }

  async getRecentJobs(days: number = 7): Promise<USAJobsSearchResult> {
    return this.searchJobs({
      DatePosted: days
    });
  }

  async testConnection(): Promise<{ success: boolean; responseTime: number; error?: string }> {
    const startTime = Date.now();
    
    try {
      const result = await this.searchJobs({ ResultsPerPage: 1 });
      const responseTime = Date.now() - startTime;
      
      return {
        success: true,
        responseTime,
        error: undefined
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        success: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Convert USAJobs position to our internal job format
  convertToInternalJob(position: USAJobsPosition): any {
    const desc = position.MatchedObjectDescriptor;
    const location = desc.PositionLocation?.[0];
    const remuneration = desc.PositionRemuneration?.[0];
    
    return {
      id: position.MatchedObjectId,
      title: desc.PositionTitle,
      company: desc.OrganizationName,
      location: location ? `${location.CityName}, ${location.StateCode}` : 'Location TBD',
      type: 'full-time', // USAJobs are typically full-time government positions
      experienceLevel: this.determineExperienceLevel(desc.UserArea?.Details?.LowGrade, desc.UserArea?.Details?.HighGrade),
      salary: {
        min: remuneration?.MinimumRange ? parseInt(remuneration.MinimumRange.replace(/[^0-9]/g, '')) : 0,
        max: remuneration?.MaximumRange ? parseInt(remuneration.MaximumRange.replace(/[^0-9]/g, '')) : 0,
        currency: 'USD'
      },
      description: desc.PositionSummary || desc.UserArea?.Details?.JobSummary || '',
      requirements: desc.UserArea?.Details?.KeyRequirements || [],
      benefits: desc.UserArea?.Details?.Benefits ? [desc.UserArea.Details.Benefits] : [],
      postedAt: desc.PositionStartDate,
      expiresAt: desc.PositionEndDate,
      applications: 0, // Not available in USAJobs API
      views: 0, // Not available in USAJobs API
      rating: 4.0, // Default rating for government jobs
      featured: false,
      urgent: false,
      remote: desc.UserArea?.Details?.RemoteWorkEligible || false,
      visaSponsorship: false, // Government jobs typically don't sponsor visas
      equity: false, // Government jobs don't offer equity
      tags: [
        ...(desc.UserArea?.Details?.JobCategory?.map(cat => cat.Name) || []),
        desc.PositionSchedule,
        desc.PositionOfferingType
      ].filter(Boolean),
      industry: 'Government',
      source: 'USAJobs',
      url: desc.PositionURI
    };
  }

  private determineExperienceLevel(lowGrade?: string, highGrade?: string): 'entry' | 'mid' | 'senior' | 'executive' {
    if (!lowGrade) return 'entry';
    
    const grade = parseInt(lowGrade);
    if (grade <= 5) return 'entry';
    if (grade <= 9) return 'mid';
    if (grade <= 13) return 'senior';
    return 'executive';
  }
}

// Export singleton instance
export const usajobsAPI = new USAJobsAPI();

// Export utility functions
export const searchUSAJobs = (params: USAJobsSearchParams) => usajobsAPI.searchJobs(params);
export const testUSAJobsConnection = () => usajobsAPI.testConnection();
