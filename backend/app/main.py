"""
FastAPI application for GigM8 job aggregator.
"""
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, asc
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import logging

from models.database import get_db, settings
from models.job import Job
from app.schemas import JobResponse, JobCreate, JobSearch, PaginatedResponse
from app.services import JobService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="GigM8 Job Aggregator API",
    description="A comprehensive job aggregation API for GigM8.com",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize job service
job_service = JobService()

@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Welcome to GigM8 Job Aggregator API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", response_model=Dict[str, str])
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/jobs", response_model=PaginatedResponse)
async def get_jobs(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Number of jobs per page"),
    sort_by: str = Query("created_at", description="Sort field"),
    sort_order: str = Query("desc", description="Sort order (asc/desc)"),
    db: Session = Depends(get_db)
):
    """Get paginated list of jobs."""
    try:
        jobs, total = job_service.get_jobs(
            db=db,
            page=page,
            size=size,
            sort_by=sort_by,
            sort_order=sort_order
        )
        
        return PaginatedResponse(
            items=[job.to_dict() for job in jobs],
            total=total,
            page=page,
            size=size,
            pages=(total + size - 1) // size
        )
    except Exception as e:
        logger.error(f"Error fetching jobs: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/jobs/search", response_model=PaginatedResponse)
async def search_jobs(
    query: Optional[str] = Query(None, description="Search query"),
    location: Optional[str] = Query(None, description="Location filter"),
    company: Optional[str] = Query(None, description="Company filter"),
    source: Optional[str] = Query(None, description="Source filter"),
    remote: Optional[bool] = Query(None, description="Remote jobs only"),
    job_type: Optional[str] = Query(None, description="Job type filter"),
    experience_level: Optional[str] = Query(None, description="Experience level filter"),
    industry: Optional[str] = Query(None, description="Industry filter"),
    salary_min: Optional[int] = Query(None, description="Minimum salary"),
    salary_max: Optional[int] = Query(None, description="Maximum salary"),
    date_from: Optional[datetime] = Query(None, description="Jobs posted from date"),
    date_to: Optional[datetime] = Query(None, description="Jobs posted to date"),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Number of jobs per page"),
    sort_by: str = Query("created_at", description="Sort field"),
    sort_order: str = Query("desc", description="Sort order (asc/desc)"),
    db: Session = Depends(get_db)
):
    """Search jobs with various filters."""
    try:
        search_params = JobSearch(
            query=query,
            location=location,
            company=company,
            source=source,
            remote=remote,
            job_type=job_type,
            experience_level=experience_level,
            industry=industry,
            salary_min=salary_min,
            salary_max=salary_max,
            date_from=date_from,
            date_to=date_to
        )
        
        jobs, total = job_service.search_jobs(
            db=db,
            search_params=search_params,
            page=page,
            size=size,
            sort_by=sort_by,
            sort_order=sort_order
        )
        
        return PaginatedResponse(
            items=[job.to_dict() for job in jobs],
            total=total,
            page=page,
            size=size,
            pages=(total + size - 1) // size
        )
    except Exception as e:
        logger.error(f"Error searching jobs: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job(job_id: int, db: Session = Depends(get_db)):
    """Get a specific job by ID."""
    try:
        job = job_service.get_job_by_id(db=db, job_id=job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        return JobResponse(**job.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching job {job_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/jobs", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(job_data: JobCreate, db: Session = Depends(get_db)):
    """Create a new job listing (for manual entry by employers)."""
    try:
        job = job_service.create_job(db=db, job_data=job_data)
        return JobResponse(**job.to_dict())
    except Exception as e:
        logger.error(f"Error creating job: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.put("/jobs/{job_id}", response_model=JobResponse)
async def update_job(job_id: int, job_data: JobCreate, db: Session = Depends(get_db)):
    """Update an existing job listing."""
    try:
        job = job_service.update_job(db=db, job_id=job_id, job_data=job_data)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        return JobResponse(**job.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating job {job_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.delete("/jobs/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(job_id: int, db: Session = Depends(get_db)):
    """Delete a job listing."""
    try:
        success = job_service.delete_job(db=db, job_id=job_id)
        if not success:
            raise HTTPException(status_code=404, detail="Job not found")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting job {job_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/jobs/stats", response_model=Dict[str, Any])
async def get_job_stats(db: Session = Depends(get_db)):
    """Get job statistics."""
    try:
        stats = job_service.get_job_stats(db=db)
        return stats
    except Exception as e:
        logger.error(f"Error fetching job stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/jobs/sources", response_model=List[Dict[str, Any]])
async def get_job_sources(db: Session = Depends(get_db)):
    """Get list of job sources and their counts."""
    try:
        sources = job_service.get_job_sources(db=db)
        return sources
    except Exception as e:
        logger.error(f"Error fetching job sources: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug
    )

# Import LinkedIn service
from app.linkedin_service import LinkedInJobsService

# Initialize LinkedIn service
linkedin_service = LinkedInJobsService()

@app.get("/jobs/linkedin", response_model=List[JobResponse])
async def search_linkedin_jobs(
    keyword: str = Query("", description="Job search keyword"),
    location: str = Query("", description="Job location"),
    date_since_posted: str = Query("", description="Date filter: past month, past week, 24hr"),
    job_type: str = Query("", description="Job type: full time, part time, contract, etc."),
    remote_filter: str = Query("", description="Remote filter: on site, remote, hybrid"),
    salary: str = Query("", description="Minimum salary"),
    experience_level: str = Query("", description="Experience level"),
    limit: int = Query(25, description="Number of jobs to return"),
    page: int = Query(0, description="Page number"),
    has_verification: bool = Query(False, description="Has verification"),
    under_10_applicants: bool = Query(False, description="Under 10 applicants")
):
    """Search LinkedIn jobs using the linkedin-jobs-api package."""
    try:
        jobs = linkedin_service.search_jobs(
            keyword=keyword,
            location=location,
            date_since_posted=date_since_posted,
            job_type=job_type,
            remote_filter=remote_filter,
            salary=salary,
            experience_level=experience_level,
            limit=limit,
            page=page,
            has_verification=has_verification,
            under_10_applicants=under_10_applicants
        )
        
        # Convert to JobResponse format
        job_responses = []
        for job in jobs:
            job_response = JobResponse(
                id=job["id"],
                title=job["title"],
                company=job["company"],
                location=job["location"],
                description=job["description"],
                source=job["source"],
                url=job["url"],
                type=job["type"],
                posted=job["posted"],
                remote=job["remote"],
                salary=job.get("salary"),
                company_logo=job.get("company_logo"),
                ago_time=job.get("ago_time")
            )
            job_responses.append(job_response)
        
        return job_responses
        
    except Exception as e:
        logger.error(f"Error searching LinkedIn jobs: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/jobs/linkedin/test")
async def test_linkedin_connection():
    """Test LinkedIn API connection."""
    try:
        # Test with a simple search
        jobs = linkedin_service.search_jobs(
            keyword="software engineer",
            location="United States",
            limit=5
        )
        
        return {
            "status": "success",
            "message": f"LinkedIn API is working. Found {len(jobs)} jobs.",
            "sample_jobs": jobs[:2] if jobs else []
        }
        
    except Exception as e:
        logger.error(f"LinkedIn API test failed: {str(e)}")
        return {
            "status": "error",
            "message": f"LinkedIn API test failed: {str(e)}"
        }
