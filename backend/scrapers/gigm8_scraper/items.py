"""
Scrapy items for GigM8 job aggregator.
"""
import scrapy
from datetime import datetime
from typing import Optional

class JobItem(scrapy.Item):
    """Item representing a job listing."""
    
    # Required fields
    title = scrapy.Field()
    company = scrapy.Field()
    location = scrapy.Field()
    apply_url = scrapy.Field()
    source = scrapy.Field()
    
    # Optional fields
    salary = scrapy.Field()
    description = scrapy.Field()
    date_posted = scrapy.Field()
    
    # Additional fields for enhanced functionality
    job_type = scrapy.Field()  # full-time, part-time, contract, etc.
    experience_level = scrapy.Field()  # entry, mid, senior, executive
    remote = scrapy.Field()
    skills = scrapy.Field()  # List of skills
    benefits = scrapy.Field()  # List of benefits
    industry = scrapy.Field()
    
    # Metadata
    scraped_at = scrapy.Field()
    job_hash = scrapy.Field()
    
    def __setitem__(self, key, value):
        """Override to handle data cleaning and validation."""
        if key == 'date_posted' and isinstance(value, str):
            # Try to parse date string
            try:
                # Common date formats
                for fmt in ['%Y-%m-%d', '%m/%d/%Y', '%d/%m/%Y', '%Y-%m-%dT%H:%M:%S']:
                    try:
                        value = datetime.strptime(value, fmt)
                        break
                    except ValueError:
                        continue
            except:
                value = None
        
        elif key == 'remote' and isinstance(value, str):
            # Convert string to boolean
            value = value.lower() in ['true', 'yes', '1', 'remote', 'work from home']
        
        elif key in ['skills', 'benefits'] and isinstance(value, str):
            # Convert comma-separated string to list
            value = [item.strip() for item in value.split(',') if item.strip()]
        
        super().__setitem__(key, value)
    
    def to_dict(self) -> dict:
        """Convert item to dictionary."""
        result = {}
        for key, value in self.items():
            if isinstance(value, datetime):
                result[key] = value.isoformat()
            else:
                result[key] = value
        return result
