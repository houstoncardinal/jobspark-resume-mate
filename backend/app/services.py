"""
Business logic services for GigM8 job aggregator.
"""
import logging
from typing import List, Tuple, Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, asc, func, text
from models.job import Job
from app.schemas import JobCreate, JobSearch

logger = logging.getLogger(__name__)

class JobService:
    """Service class for job-related operations."""
    
    def get_jobs(
        self,
        db: Session,
        page: int = 1,
        size: int = 20,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> Tuple[List[Job], int]:
        """Get paginated list of jobs."""
        try:
            # Calculate offset
            offset = (page - 1) * size
            
            # Build query
            query = db.query(Job).filter(Job.is_active == True)
            
            # Apply sorting
            if hasattr(Job, sort_by):
                sort_column = getattr(Job, sort_by)
                if sort_order.lower() == "desc":
                    query = query.order_by(desc(sort_column))
                else:
                    query = query.order_by(asc(sort_column))
            
            # Get total count
            total = query.count()
            
            # Apply pagination
            jobs = query.offset(offset).limit(size).all()
            
            return jobs, total
            
        except Exception as e:
            logger.error(f"Error fetching jobs: {str(e)}")
            raise
    
    def search_jobs(
        self,
        db: Session,
        search_params: JobSearch,
        page: int = 1,
        size: int = 20,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> Tuple[List[Job], int]:
        """Search jobs with various filters."""
        try:
            # Calculate offset
            offset = (page - 1) * size
            
            # Build base query
            query = db.query(Job).filter(Job.is_active == True)
            
            # Apply text search
            if search_params.query:
                search_term = f"%{search_params.query}%"
                query = query.filter(
                    or_(
                        Job.title.ilike(search_term),
                        Job.description.ilike(search_term),
                        Job.company.ilike(search_term)
                    )
                )
            
            # Apply location filter
            if search_params.location:
                location_term = f"%{search_params.location}%"
                query = query.filter(Job.location.ilike(location_term))
            
            # Apply company filter
            if search_params.company:
                company_term = f"%{search_params.company}%"
                query = query.filter(Job.company.ilike(company_term))
            
            # Apply source filter
            if search_params.source:
                query = query.filter(Job.source == search_params.source)
            
            # Apply remote filter
            if search_params.remote is not None:
                query = query.filter(Job.remote == search_params.remote)
            
            # Apply job type filter
            if search_params.job_type:
                query = query.filter(Job.job_type == search_params.job_type)
            
            # Apply experience level filter
            if search_params.experience_level:
                query = query.filter(Job.experience_level == search_params.experience_level)
            
            # Apply industry filter
            if search_params.industry:
                industry_term = f"%{search_params.industry}%"
                query = query.filter(Job.industry.ilike(industry_term))
            
            # Apply salary range filter
            if search_params.salary_min is not None or search_params.salary_max is not None:
                # This is a simplified implementation
                # In production, you'd want to parse salary strings and extract numeric values
                pass
            
            # Apply date range filter
            if search_params.date_from:
                query = query.filter(Job.date_posted >= search_params.date_from)
            
            if search_params.date_to:
                query = query.filter(Job.date_posted <= search_params.date_to)
            
            # Apply sorting
            if hasattr(Job, sort_by):
                sort_column = getattr(Job, sort_by)
                if sort_order.lower() == "desc":
                    query = query.order_by(desc(sort_column))
                else:
                    query = query.order_by(asc(sort_column))
            
            # Get total count
            total = query.count()
            
            # Apply pagination
            jobs = query.offset(offset).limit(size).all()
            
            return jobs, total
            
        except Exception as e:
            logger.error(f"Error searching jobs: {str(e)}")
            raise
    
    def get_job_by_id(self, db: Session, job_id: int) -> Optional[Job]:
        """Get a specific job by ID."""
        try:
            return db.query(Job).filter(Job.id == job_id).first()
        except Exception as e:
            logger.error(f"Error fetching job {job_id}: {str(e)}")
            raise
    
    def create_job(self, db: Session, job_data: JobCreate) -> Job:
        """Create a new job."""
        try:
            # Generate job hash for deduplication
            job_hash = Job.generate_hash(
                job_data.title,
                job_data.company,
                job_data.location
            )
            
            # Check if job already exists
            existing_job = db.query(Job).filter(Job.job_hash == job_hash).first()
            if existing_job:
                # Update existing job
                existing_job.title = job_data.title
                existing_job.company = job_data.company
                existing_job.location = job_data.location
                existing_job.salary = job_data.salary
                existing_job.description = job_data.description
                existing_job.apply_url = job_data.apply_url
                existing_job.source = job_data.source
                existing_job.date_posted = job_data.date_posted
                existing_job.job_type = job_data.job_type
                existing_job.experience_level = job_data.experience_level
                existing_job.remote = job_data.remote
                existing_job.skills = ','.join(job_data.skills) if job_data.skills else None
                existing_job.benefits = ','.join(job_data.benefits) if job_data.benefits else None
                existing_job.industry = job_data.industry
                existing_job.updated_at = datetime.now()
                existing_job.is_active = True
                
                db.commit()
                db.refresh(existing_job)
                return existing_job
            
            # Create new job
            job = Job(
                title=job_data.title,
                company=job_data.company,
                location=job_data.location,
                salary=job_data.salary,
                description=job_data.description,
                apply_url=job_data.apply_url,
                source=job_data.source,
                date_posted=job_data.date_posted,
                job_hash=job_hash,
                job_type=job_data.job_type,
                experience_level=job_data.experience_level,
                remote=job_data.remote,
                skills=','.join(job_data.skills) if job_data.skills else None,
                benefits=','.join(job_data.benefits) if job_data.benefits else None,
                industry=job_data.industry
            )
            
            db.add(job)
            db.commit()
            db.refresh(job)
            
            logger.info(f"Created new job: {job.title} at {job.company}")
            return job
            
        except Exception as e:
            logger.error(f"Error creating job: {str(e)}")
            db.rollback()
            raise
    
    def update_job(self, db: Session, job_id: int, job_data: JobCreate) -> Optional[Job]:
        """Update an existing job."""
        try:
            job = db.query(Job).filter(Job.id == job_id).first()
            if not job:
                return None
            
            # Update job fields
            job.title = job_data.title
            job.company = job_data.company
            job.location = job_data.location
            job.salary = job_data.salary
            job.description = job_data.description
            job.apply_url = job_data.apply_url
            job.source = job_data.source
            job.date_posted = job_data.date_posted
            job.job_type = job_data.job_type
            job.experience_level = job_data.experience_level
            job.remote = job_data.remote
            job.skills = ','.join(job_data.skills) if job_data.skills else None
            job.benefits = ','.join(job_data.benefits) if job_data.benefits else None
            job.industry = job_data.industry
            job.updated_at = datetime.now()
            
            # Regenerate hash if key fields changed
            new_hash = Job.generate_hash(job_data.title, job_data.company, job_data.location)
            if new_hash != job.job_hash:
                job.job_hash = new_hash
            
            db.commit()
            db.refresh(job)
            
            logger.info(f"Updated job: {job.title} at {job.company}")
            return job
            
        except Exception as e:
            logger.error(f"Error updating job {job_id}: {str(e)}")
            db.rollback()
            raise
    
    def delete_job(self, db: Session, job_id: int) -> bool:
        """Delete a job (soft delete by setting is_active to False)."""
        try:
            job = db.query(Job).filter(Job.id == job_id).first()
            if not job:
                return False
            
            job.is_active = False
            job.updated_at = datetime.now()
            
            db.commit()
            
            logger.info(f"Deleted job: {job.title} at {job.company}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting job {job_id}: {str(e)}")
            db.rollback()
            raise
    
    def get_job_stats(self, db: Session) -> Dict[str, Any]:
        """Get job statistics."""
        try:
            # Total jobs
            total_jobs = db.query(Job).count()
            active_jobs = db.query(Job).filter(Job.is_active == True).count()
            
            # Jobs by source
            jobs_by_source = db.query(
                Job.source,
                func.count(Job.id).label('count')
            ).filter(Job.is_active == True).group_by(Job.source).all()
            
            # Jobs by industry
            jobs_by_industry = db.query(
                Job.industry,
                func.count(Job.id).label('count')
            ).filter(
                Job.is_active == True,
                Job.industry.isnot(None)
            ).group_by(Job.industry).all()
            
            # Jobs by location (top 10)
            jobs_by_location = db.query(
                Job.location,
                func.count(Job.id).label('count')
            ).filter(Job.is_active == True).group_by(Job.location).order_by(
                desc('count')
            ).limit(10).all()
            
            # Jobs by type
            jobs_by_type = db.query(
                Job.job_type,
                func.count(Job.id).label('count')
            ).filter(
                Job.is_active == True,
                Job.job_type.isnot(None)
            ).group_by(Job.job_type).all()
            
            # Recent jobs (last 7 days)
            recent_date = datetime.now() - timedelta(days=7)
            recent_jobs_count = db.query(Job).filter(
                Job.is_active == True,
                Job.created_at >= recent_date
            ).count()
            
            # Remote jobs
            remote_jobs_count = db.query(Job).filter(
                Job.is_active == True,
                Job.remote == True
            ).count()
            
            return {
                "total_jobs": total_jobs,
                "active_jobs": active_jobs,
                "jobs_by_source": {source: count for source, count in jobs_by_source},
                "jobs_by_industry": {industry: count for industry, count in jobs_by_industry},
                "jobs_by_location": {location: count for location, count in jobs_by_location},
                "jobs_by_type": {job_type: count for job_type, count in jobs_by_type},
                "recent_jobs_count": recent_jobs_count,
                "remote_jobs_count": remote_jobs_count
            }
            
        except Exception as e:
            logger.error(f"Error fetching job stats: {str(e)}")
            raise
    
    def get_job_sources(self, db: Session) -> List[Dict[str, Any]]:
        """Get list of job sources and their counts."""
        try:
            sources = db.query(
                Job.source,
                func.count(Job.id).label('count'),
                func.max(Job.last_scraped).label('last_scraped')
            ).filter(Job.is_active == True).group_by(Job.source).all()
            
            return [
                {
                    "source": source,
                    "count": count,
                    "last_scraped": last_scraped.isoformat() if last_scraped else None,
                    "is_active": True
                }
                for source, count, last_scraped in sources
            ]
            
        except Exception as e:
            logger.error(f"Error fetching job sources: {str(e)}")
            raise
