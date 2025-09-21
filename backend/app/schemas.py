"""
Pydantic schemas for GigM8 job aggregator API.
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class JobType(str, Enum):
    """Job type enumeration."""
    FULL_TIME = "full-time"
    PART_TIME = "part-time"
    CONTRACT = "contract"
    INTERNSHIP = "internship"
    TEMPORARY = "temporary"
    FREELANCE = "freelance"

class ExperienceLevel(str, Enum):
    """Experience level enumeration."""
    ENTRY = "entry"
    MID = "mid"
    SENIOR = "senior"
    EXECUTIVE = "executive"

class JobResponse(BaseModel):
    """Response schema for job data."""
    id: int
    title: str
    company: str
    location: str
    salary: Optional[str] = None
    description: Optional[str] = None
    apply_url: str
    source: str
    date_posted: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    job_type: Optional[JobType] = None
    experience_level: Optional[ExperienceLevel] = None
    remote: bool = False
    skills: Optional[str] = None
    benefits: Optional[str] = None
    industry: Optional[str] = None
    is_active: bool = True

    class Config:
        from_attributes = True

class JobCreate(BaseModel):
    """Schema for creating a new job."""
    title: str = Field(..., min_length=1, max_length=255)
    company: str = Field(..., min_length=1, max_length=255)
    location: str = Field(..., min_length=1, max_length=255)
    salary: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    apply_url: str = Field(..., min_length=1)
    source: str = Field(..., min_length=1, max_length=100)
    date_posted: Optional[datetime] = None
    job_type: Optional[JobType] = None
    experience_level: Optional[ExperienceLevel] = None
    remote: bool = False
    skills: Optional[List[str]] = None
    benefits: Optional[List[str]] = None
    industry: Optional[str] = Field(None, max_length=100)

    @validator('apply_url')
    def validate_url(cls, v):
        """Validate URL format."""
        if not v.startswith(('http://', 'https://')):
            raise ValueError('apply_url must be a valid URL')
        return v

    @validator('skills', 'benefits')
    def validate_lists(cls, v):
        """Validate and clean list fields."""
        if v is None:
            return None
        return [item.strip() for item in v if item.strip()]

class JobSearch(BaseModel):
    """Schema for job search parameters."""
    query: Optional[str] = None
    location: Optional[str] = None
    company: Optional[str] = None
    source: Optional[str] = None
    remote: Optional[bool] = None
    job_type: Optional[JobType] = None
    experience_level: Optional[ExperienceLevel] = None
    industry: Optional[str] = None
    salary_min: Optional[int] = Field(None, ge=0)
    salary_max: Optional[int] = Field(None, ge=0)
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None

    @validator('salary_max')
    def validate_salary_range(cls, v, values):
        """Validate salary range."""
        if v is not None and 'salary_min' in values and values['salary_min'] is not None:
            if v < values['salary_min']:
                raise ValueError('salary_max must be greater than salary_min')
        return v

class PaginatedResponse(BaseModel):
    """Schema for paginated responses."""
    items: List[Dict[str, Any]]
    total: int
    page: int
    size: int
    pages: int

class JobStats(BaseModel):
    """Schema for job statistics."""
    total_jobs: int
    active_jobs: int
    jobs_by_source: Dict[str, int]
    jobs_by_industry: Dict[str, int]
    jobs_by_location: Dict[str, int]
    jobs_by_type: Dict[str, int]
    recent_jobs_count: int
    remote_jobs_count: int

class JobSource(BaseModel):
    """Schema for job source information."""
    source: str
    count: int
    last_scraped: Optional[datetime] = None
    is_active: bool = True
