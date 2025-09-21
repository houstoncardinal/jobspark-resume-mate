"""
Scheduler package for GigM8 job aggregator.
"""
from .celery_app import celery_app
from .tasks import *

__all__ = ['celery_app']
