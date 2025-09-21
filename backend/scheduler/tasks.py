"""
Celery tasks for GigM8 job aggregator.
"""
import os
import subprocess
import logging
from datetime import datetime, timedelta
from celery import current_task
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from models.database import settings
from models.job import Job

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database setup
engine = create_engine(settings.database_url)
Session = sessionmaker(bind=engine)

@current_task.task(bind=True)
def scrape_microsoft_jobs(self):
    """Scrape Microsoft careers page."""
    try:
        logger.info("Starting Microsoft jobs scraping...")
        
        # Change to scrapers directory
        scrapers_dir = os.path.join(os.path.dirname(__file__), '..', 'scrapers')
        os.chdir(scrapers_dir)
        
        # Run Scrapy spider
        result = subprocess.run([
            'scrapy', 'crawl', 'microsoft_careers',
            '-L', 'INFO'
        ], capture_output=True, text=True, timeout=1800)  # 30 minutes timeout
        
        if result.returncode == 0:
            logger.info("Microsoft jobs scraping completed successfully")
            return {"status": "success", "message": "Microsoft jobs scraped successfully"}
        else:
            logger.error(f"Microsoft jobs scraping failed: {result.stderr}")
            return {"status": "error", "message": result.stderr}
            
    except subprocess.TimeoutExpired:
        logger.error("Microsoft jobs scraping timed out")
        return {"status": "error", "message": "Scraping timed out"}
    except Exception as e:
        logger.error(f"Error in Microsoft jobs scraping: {str(e)}")
        return {"status": "error", "message": str(e)}

@current_task.task(bind=True)
def scrape_greenhouse_jobs(self):
    """Scrape Greenhouse job boards."""
    try:
        logger.info("Starting Greenhouse jobs scraping...")
        
        # Change to scrapers directory
        scrapers_dir = os.path.join(os.path.dirname(__file__), '..', 'scrapers')
        os.chdir(scrapers_dir)
        
        # Run Scrapy spider
        result = subprocess.run([
            'scrapy', 'crawl', 'greenhouse_jobs',
            '-L', 'INFO'
        ], capture_output=True, text=True, timeout=1800)  # 30 minutes timeout
        
        if result.returncode == 0:
            logger.info("Greenhouse jobs scraping completed successfully")
            return {"status": "success", "message": "Greenhouse jobs scraped successfully"}
        else:
            logger.error(f"Greenhouse jobs scraping failed: {result.stderr}")
            return {"status": "error", "message": result.stderr}
            
    except subprocess.TimeoutExpired:
        logger.error("Greenhouse jobs scraping timed out")
        return {"status": "error", "message": "Scraping timed out"}
    except Exception as e:
        logger.error(f"Error in Greenhouse jobs scraping: {str(e)}")
        return {"status": "error", "message": str(e)}

@current_task.task(bind=True)
def cleanup_old_jobs(self):
    """Clean up old inactive jobs."""
    try:
        logger.info("Starting job cleanup...")
        
        session = Session()
        
        # Mark jobs as inactive if they haven't been scraped in 30 days
        cutoff_date = datetime.now() - timedelta(days=30)
        old_jobs = session.query(Job).filter(
            Job.last_scraped < cutoff_date,
            Job.is_active == True
        ).all()
        
        count = 0
        for job in old_jobs:
            job.is_active = False
            job.updated_at = datetime.now()
            count += 1
        
        session.commit()
        session.close()
        
        logger.info(f"Marked {count} old jobs as inactive")
        return {"status": "success", "message": f"Marked {count} old jobs as inactive"}
        
    except Exception as e:
        logger.error(f"Error in job cleanup: {str(e)}")
        return {"status": "error", "message": str(e)}

@current_task.task(bind=True)
def update_job_stats(self):
    """Update job statistics (placeholder for future stats aggregation)."""
    try:
        logger.info("Updating job statistics...")
        
        session = Session()
        
        # Get basic stats
        total_jobs = session.query(Job).count()
        active_jobs = session.query(Job).filter(Job.is_active == True).count()
        
        session.close()
        
        logger.info(f"Job stats updated - Total: {total_jobs}, Active: {active_jobs}")
        return {
            "status": "success", 
            "message": f"Stats updated - Total: {total_jobs}, Active: {active_jobs}"
        }
        
    except Exception as e:
        logger.error(f"Error updating job stats: {str(e)}")
        return {"status": "error", "message": str(e)}

@current_task.task(bind=True)
def scrape_all_jobs(self):
    """Scrape all job sources."""
    try:
        logger.info("Starting comprehensive job scraping...")
        
        # Run all spiders
        results = []
        
        # Microsoft jobs
        microsoft_result = scrape_microsoft_jobs.delay()
        results.append(("Microsoft", microsoft_result.get()))
        
        # Greenhouse jobs
        greenhouse_result = scrape_greenhouse_jobs.delay()
        results.append(("Greenhouse", greenhouse_result.get()))
        
        # Log results
        for source, result in results:
            logger.info(f"{source} scraping result: {result}")
        
        return {"status": "success", "message": "All job sources scraped", "results": results}
        
    except Exception as e:
        logger.error(f"Error in comprehensive job scraping: {str(e)}")
        return {"status": "error", "message": str(e)}

@current_task.task(bind=True)
def health_check(self):
    """Health check task."""
    try:
        session = Session()
        
        # Check database connection
        session.execute("SELECT 1")
        
        # Get basic job count
        job_count = session.query(Job).count()
        
        session.close()
        
        return {
            "status": "healthy",
            "database": "connected",
            "total_jobs": job_count,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {"status": "unhealthy", "error": str(e)}
