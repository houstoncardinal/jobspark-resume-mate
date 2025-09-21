"""
Celery application for GigM8 job aggregator.
"""
import os
from celery import Celery
from celery.schedules import crontab
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create Celery app
celery_app = Celery(
    'gigm8_scheduler',
    broker=os.getenv('REDIS_URL', 'redis://localhost:6379/0'),
    backend=os.getenv('REDIS_URL', 'redis://localhost:6379/0'),
    include=['scheduler.tasks']
)

# Celery configuration
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Beat schedule for periodic tasks
celery_app.conf.beat_schedule = {
    'scrape-microsoft-jobs': {
        'task': 'scheduler.tasks.scrape_microsoft_jobs',
        'schedule': crontab(hour=6, minute=0),  # Run at 6 AM daily
    },
    'scrape-greenhouse-jobs': {
        'task': 'scheduler.tasks.scrape_greenhouse_jobs',
        'schedule': crontab(hour=8, minute=0),  # Run at 8 AM daily
    },
    'cleanup-old-jobs': {
        'task': 'scheduler.tasks.cleanup_old_jobs',
        'schedule': crontab(hour=2, minute=0),  # Run at 2 AM daily
    },
    'update-job-stats': {
        'task': 'scheduler.tasks.update_job_stats',
        'schedule': crontab(minute=0),  # Run every hour
    },
}

if __name__ == '__main__':
    celery_app.start()
