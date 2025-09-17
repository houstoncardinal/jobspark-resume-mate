export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          location: string | null
          industry: string | null
          experience_level: 'entry' | 'mid' | 'senior' | 'executive' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          location?: string | null
          industry?: string | null
          experience_level?: 'entry' | 'mid' | 'senior' | 'executive' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          location?: string | null
          industry?: string | null
          experience_level?: 'entry' | 'mid' | 'senior' | 'executive' | null
          created_at?: string
          updated_at?: string
        }
      }
      job_applications: {
        Row: {
          id: string
          user_id: string
          job_id: string
          job_title: string
          company: string
          job_url: string | null
          resume_name: string | null
          applied_at: string
          status: 'applied' | 'interview' | 'rejected' | 'offered' | 'withdrawn'
          notes: string | null
          salary_offered: number | null
          interview_date: string | null
        }
        Insert: {
          id?: string
          user_id: string
          job_id: string
          job_title: string
          company: string
          job_url?: string | null
          resume_name?: string | null
          applied_at?: string
          status?: 'applied' | 'interview' | 'rejected' | 'offered' | 'withdrawn'
          notes?: string | null
          salary_offered?: number | null
          interview_date?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string
          job_title?: string
          company?: string
          job_url?: string | null
          resume_name?: string | null
          applied_at?: string
          status?: 'applied' | 'interview' | 'rejected' | 'offered' | 'withdrawn'
          notes?: string | null
          salary_offered?: number | null
          interview_date?: string | null
        }
      }
      resume_library: {
        Row: {
          id: string
          user_id: string
          name: string
          content: string
          template: 'modern' | 'classic' | 'minimal'
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          content: string
          template?: 'modern' | 'classic' | 'minimal'
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          content?: string
          template?: 'modern' | 'classic' | 'minimal'
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      company_reviews: {
        Row: {
          id: string
          user_id: string
          company: string
          job_title: string | null
          rating: number
          pros: string | null
          cons: string | null
          work_life_balance: number
          salary_satisfaction: number
          management_quality: number
          career_opportunities: number
          overall_experience: string | null
          salary_range_min: number | null
          salary_range_max: number | null
          employment_type: 'full-time' | 'part-time' | 'contract' | 'internship'
          remote_work: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company: string
          job_title?: string | null
          rating: number
          pros?: string | null
          cons?: string | null
          work_life_balance: number
          salary_satisfaction: number
          management_quality: number
          career_opportunities: number
          overall_experience?: string | null
          salary_range_min?: number | null
          salary_range_max?: number | null
          employment_type?: 'full-time' | 'part-time' | 'contract' | 'internship'
          remote_work?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company?: string
          job_title?: string | null
          rating?: number
          pros?: string | null
          cons?: string | null
          work_life_balance?: number
          salary_satisfaction?: number
          management_quality?: number
          career_opportunities?: number
          overall_experience?: string | null
          salary_range_min?: number | null
          salary_range_max?: number | null
          employment_type?: 'full-time' | 'part-time' | 'contract' | 'internship'
          remote_work?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      salary_insights: {
        Row: {
          id: string
          user_id: string | null
          job_title: string
          company: string | null
          location: string | null
          salary_min: number | null
          salary_max: number | null
          currency: string
          employment_type: 'full-time' | 'part-time' | 'contract' | 'internship'
          experience_level: 'entry' | 'mid' | 'senior' | 'executive' | null
          remote_work: boolean
          source: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          job_title: string
          company?: string | null
          location?: string | null
          salary_min?: number | null
          salary_max?: number | null
          currency?: string
          employment_type?: 'full-time' | 'part-time' | 'contract' | 'internship'
          experience_level?: 'entry' | 'mid' | 'senior' | 'executive' | null
          remote_work?: boolean
          source?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          job_title?: string
          company?: string | null
          location?: string | null
          salary_min?: number | null
          salary_max?: number | null
          currency?: string
          employment_type?: 'full-time' | 'part-time' | 'contract' | 'internship'
          experience_level?: 'entry' | 'mid' | 'senior' | 'executive' | null
          remote_work?: boolean
          source?: string | null
          created_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          author_id: string | null
          featured_image_url: string | null
          tags: string[]
          published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
          view_count: number
          like_count: number
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          author_id?: string | null
          featured_image_url?: string | null
          tags?: string[]
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
          view_count?: number
          like_count?: number
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          author_id?: string | null
          featured_image_url?: string | null
          tags?: string[]
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
          view_count?: number
          like_count?: number
        }
      }
      success_stories: {
        Row: {
          id: string
          user_id: string
          title: string
          story: string
          before_resume: string | null
          after_resume: string | null
          job_title: string | null
          company: string | null
          salary_increase: number | null
          time_to_hire: number | null
          featured: boolean
          approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          story: string
          before_resume?: string | null
          after_resume?: string | null
          job_title?: string | null
          company?: string | null
          salary_increase?: number | null
          time_to_hire?: number | null
          featured?: boolean
          approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          story?: string
          before_resume?: string | null
          after_resume?: string | null
          job_title?: string | null
          company?: string | null
          salary_increase?: number | null
          time_to_hire?: number | null
          featured?: boolean
          approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_engagement: {
        Row: {
          id: string
          user_id: string
          action: string
          target_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          target_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          target_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
