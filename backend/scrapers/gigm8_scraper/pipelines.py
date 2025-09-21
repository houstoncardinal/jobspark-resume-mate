"""
from scrapy.exceptions import DropItem
Pipelines for GigM8 job aggregator.
"""
import hashlib
import logging
from datetime import datetime
from typing import Dict, Any
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from models.job import Job
from models.database import settings

logger = logging.getLogger(__name__)

class DeduplicationPipeline:
    """Pipeline for deduplicating jobs based on hash."""
    
    def __init__(self):
        self.seen_hashes = set()
    
    def process_item(self, item, spider):
        """Check if job is duplicate based on hash."""
        # Generate hash for deduplication
        title = item.get('title', '').lower().strip()
        company = item.get('company', '').lower().strip()
        location = item.get('location', '').lower().strip()
        
        job_hash = hashlib.sha256(
            f"{title}|{company}|{location}".encode()
        ).hexdigest()
        
        if job_hash in self.seen_hashes:
            logger.debug(f"Duplicate job found: {title} at {company}")
            raise DropItem(f"Duplicate job: {title} at {company}")
        
        self.seen_hashes.add(job_hash)
        item['job_hash'] = job_hash
        item['scraped_at'] = datetime.now()
        
        return item

class DatabasePipeline:
    """Pipeline for storing jobs in database."""
    
    def __init__(self):
        self.engine = create_engine(settings.database_url)
        self.Session = sessionmaker(bind=self.engine)
        self.session = None
    
    def open_spider(self, spider):
        """Initialize database session when spider opens."""
        self.session = self.Session()
        logger.info("Database pipeline opened")
    
    def close_spider(self, spider):
        """Close database session when spider closes."""
        if self.session:
            self.session.close()
        logger.info("Database pipeline closed")
    
    def process_item(self, item, spider):
        """Store job in database."""
        try:
            # Check if job already exists
            existing_job = self.session.query(Job).filter(
                Job.job_hash == item['job_hash']
            ).first()
            
            if existing_job:
                # Update existing job
                existing_job.last_scraped = datetime.now()
                existing_job.is_active = True
                logger.debug(f"Updated existing job: {item['title']}")
            else:
                # Create new job
                job = Job(
                    title=item['title'],
                    company=item['company'],
                    location=item['location'],
                    salary=item.get('salary'),
                    description=item.get('description'),
                    apply_url=item['apply_url'],
                    source=item['source'],
                    date_posted=item.get('date_posted'),
                    job_hash=item['job_hash'],
                    job_type=item.get('job_type'),
                    experience_level=item.get('experience_level'),
                    remote=item.get('remote', False),
                    skills=','.join(item.get('skills', [])) if item.get('skills') else None,
                    benefits=','.join(item.get('benefits', [])) if item.get('benefits') else None,
                    industry=item.get('industry'),
                    last_scraped=datetime.now()
                )
                
                self.session.add(job)
                logger.info(f"Added new job: {item['title']} at {item['company']}")
            
            self.session.commit()
            
        except Exception as e:
            logger.error(f"Error storing job {item['title']}: {str(e)}")
            self.session.rollback()
            raise
        
        return item

class ValidationPipeline:
    """Pipeline for validating job data."""
    
    def process_item(self, item, spider):
        """Validate required fields."""
        required_fields = ['title', 'company', 'location', 'apply_url', 'source']
        
        for field in required_fields:
            if not item.get(field):
                logger.warning(f"Missing required field '{field}' in job: {item.get('title', 'Unknown')}")
                raise DropItem(f"Missing required field: {field}")
        
        # Clean and validate data
        item['title'] = item['title'].strip()
        item['company'] = item['company'].strip()
        item['location'] = item['location'].strip()
        item['apply_url'] = item['apply_url'].strip()
        item['source'] = item['source'].strip()
        
        return item

class LoggingPipeline:
    """Pipeline for logging scraped jobs."""
    
    def process_item(self, item, spider):
        """Log scraped job information."""
        logger.info(f"Scraped job: {item['title']} at {item['company']} from {item['source']}")
        return item
