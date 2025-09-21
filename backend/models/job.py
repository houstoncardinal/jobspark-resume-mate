"""
Job model for GigM8 job aggregator.
"""
import hashlib
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Index, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from .database import Base

class Job(Base):
    """Job model representing a job listing."""
    
    __tablename__ = "jobs"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Job identification
    title = Column(String(255), nullable=False, index=True)
    company = Column(String(255), nullable=False, index=True)
    location = Column(String(255), nullable=False, index=True)
    
    # Job details
    salary = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    apply_url = Column(Text, nullable=False)
    source = Column(String(100), nullable=False, index=True)
    
    # Timestamps
    date_posted = Column(DateTime, nullable=True, index=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Deduplication
    job_hash = Column(String(64), unique=True, nullable=False, index=True)
    
    # Additional fields for enhanced functionality
    job_type = Column(String(50), nullable=True)  # full-time, part-time, contract, etc.
    experience_level = Column(String(50), nullable=True)  # entry, mid, senior, executive
    remote = Column(Boolean, default=False, nullable=False)
    skills = Column(Text, nullable=True)  # JSON string of skills
    benefits = Column(Text, nullable=True)  # JSON string of benefits
    industry = Column(String(100), nullable=True, index=True)
    
    # Status tracking
    is_active = Column(Boolean, default=True, nullable=False)
    last_scraped = Column(DateTime, default=func.now(), nullable=False)
    
    # Indexes for better query performance
    __table_args__ = (
        Index('idx_job_search', 'title', 'company', 'location'),
        Index('idx_source_date', 'source', 'date_posted'),
        Index('idx_remote_active', 'remote', 'is_active'),
        Index('idx_industry_active', 'industry', 'is_active'),
    )
    
    @classmethod
    def generate_hash(cls, title: str, company: str, location: str) -> str:
        """Generate a unique hash for job deduplication."""
        content = f"{title.lower().strip()}|{company.lower().strip()}|{location.lower().strip()}"
        return hashlib.sha256(content.encode()).hexdigest()
    
    def to_dict(self) -> dict:
        """Convert job instance to dictionary."""
        return {
            "id": self.id,
            "title": self.title,
            "company": self.company,
            "location": self.location,
            "salary": self.salary,
            "description": self.description,
            "apply_url": self.apply_url,
            "source": self.source,
            "date_posted": self.date_posted.isoformat() if self.date_posted else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "job_type": self.job_type,
            "experience_level": self.experience_level,
            "remote": self.remote,
            "skills": self.skills,
            "benefits": self.benefits,
            "industry": self.industry,
            "is_active": self.is_active,
        }
    
    def __repr__(self):
        return f"<Job(id={self.id}, title='{self.title}', company='{self.company}')>"
