export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'job_seeker' | 'recruiter' | 'employer'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role: 'job_seeker' | 'recruiter' | 'employer'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'job_seeker' | 'recruiter' | 'employer'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          phone: string | null
          location: string | null
          bio: string | null
          skills: string[] | null
          experience_level: 'entry' | 'mid' | 'senior' | 'executive' | null
          job_title: string | null
          company: string | null
          website: string | null
          linkedin_url: string | null
          github_url: string | null
          portfolio_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          phone?: string | null
          location?: string | null
          bio?: string | null
          skills?: string[] | null
          experience_level?: 'entry' | 'mid' | 'senior' | 'executive' | null
          job_title?: string | null
          company?: string | null
          website?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          portfolio_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          phone?: string | null
          location?: string | null
          bio?: string | null
          skills?: string[] | null
          experience_level?: 'entry' | 'mid' | 'senior' | 'executive' | null
          job_title?: string | null
          company?: string | null
          website?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          portfolio_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          is_primary: boolean
          ats_score: number | null
          views: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          is_primary?: boolean
          ats_score?: number | null
          views?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          is_primary?: boolean
          ats_score?: number | null
          views?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resumes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      job_applications: {
        Row: {
          id: string
          user_id: string
          job_title: string
          company: string
          location: string
          salary: string | null
          status: 'applied' | 'reviewed' | 'interview' | 'rejected' | 'offered'
          applied_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_title: string
          company: string
          location: string
          salary?: string | null
          status?: 'applied' | 'reviewed' | 'interview' | 'rejected' | 'offered'
          applied_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_title?: string
          company?: string
          location?: string
          salary?: string | null
          status?: 'applied' | 'reviewed' | 'interview' | 'rejected' | 'offered'
          applied_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      companies: {
        Row: {
          id: string
          name: string
          industry: string
          size: string
          location: string
          website: string
          description: string
          logo_url: string | null
          founded_year: number | null
          employee_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          industry: string
          size: string
          location: string
          website: string
          description: string
          logo_url?: string | null
          founded_year?: number | null
          employee_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          industry?: string
          size?: string
          location?: string
          website?: string
          description?: string
          logo_url?: string | null
          founded_year?: number | null
          employee_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_postings: {
        Row: {
          id: string
          company_id: string
          title: string
          department: string
          location: string
          type: 'full-time' | 'part-time' | 'contract' | 'internship'
          status: 'draft' | 'active' | 'paused' | 'closed'
          description: string
          requirements: string[]
          benefits: string[]
          salary_min: number | null
          salary_max: number | null
          applications_count: number
          views_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          title: string
          department: string
          location: string
          type: 'full-time' | 'part-time' | 'contract' | 'internship'
          status?: 'draft' | 'active' | 'paused' | 'closed'
          description: string
          requirements: string[]
          benefits: string[]
          salary_min?: number | null
          salary_max?: number | null
          applications_count?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          title?: string
          department?: string
          location?: string
          type?: 'full-time' | 'part-time' | 'contract' | 'internship'
          status?: 'draft' | 'active' | 'paused' | 'closed'
          description?: string
          requirements?: string[]
          benefits?: string[]
          salary_min?: number | null
          salary_max?: number | null
          applications_count?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
