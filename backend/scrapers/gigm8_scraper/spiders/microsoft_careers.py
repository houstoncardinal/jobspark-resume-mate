"""
Microsoft Careers Spider for GigM8 job aggregator.
Scrapes job listings from Microsoft's careers website.
"""
import scrapy
import json
import re
from datetime import datetime
from urllib.parse import urljoin, urlparse
from scrapy_playwright.page import PageMethod
from gigm8_scraper.items import JobItem

class MicrosoftCareersSpider(scrapy.Spider):
    """Spider for Microsoft careers page."""
    
    name = 'microsoft_careers'
    allowed_domains = ['careers.microsoft.com']
    start_urls = ['https://careers.microsoft.com/us/en/search-results']
    
    custom_settings = {
        'DOWNLOAD_DELAY': 2,
        'RANDOMIZE_DOWNLOAD_DELAY': True,
        'CONCURRENT_REQUESTS': 8,
    }
    
    def start_requests(self):
        """Generate initial requests."""
        for url in self.start_urls:
            yield scrapy.Request(
                url=url,
                callback=self.parse,
                meta={
                    'playwright': True,
                    'playwright_page_methods': [
                        PageMethod('wait_for_selector', 'div[data-automation-id="job-card"]', timeout=30000),
                        PageMethod('evaluate', 'window.scrollTo(0, document.body.scrollHeight)'),
                        PageMethod('wait_for_timeout', 3000),
                    ]
                }
            )
    
    def parse(self, response):
        """Parse the main careers page."""
        self.logger.info(f"Parsing Microsoft careers page: {response.url}")
        
        # Extract job cards
        job_cards = response.css('div[data-automation-id="job-card"]')
        self.logger.info(f"Found {len(job_cards)} job cards")
        
        for card in job_cards:
            try:
                job_item = self.extract_job_data(card, response)
                if job_item:
                    yield job_item
            except Exception as e:
                self.logger.error(f"Error extracting job data: {str(e)}")
                continue
        
        # Check for pagination
        next_page = response.css('a[data-automation-id="pagination-next"]::attr(href)').get()
        if next_page:
            next_url = urljoin(response.url, next_page)
            yield scrapy.Request(
                url=next_url,
                callback=self.parse,
                meta={
                    'playwright': True,
                    'playwright_page_methods': [
                        PageMethod('wait_for_selector', 'div[data-automation-id="job-card"]', timeout=30000),
                        PageMethod('evaluate', 'window.scrollTo(0, document.body.scrollHeight)'),
                        PageMethod('wait_for_timeout', 3000),
                    ]
                }
            )
    
    def extract_job_data(self, card, response):
        """Extract job data from a job card."""
        try:
            # Extract basic information
            title = card.css('h2[data-automation-id="job-title"] a::text').get()
            if not title:
                title = card.css('h2 a::text').get()
            
            company = "Microsoft"
            
            location = card.css('span[data-automation-id="job-location"]::text').get()
            if not location:
                location = card.css('span[data-automation-id="job-location"] span::text').get()
            
            # Extract job URL
            job_url = card.css('h2[data-automation-id="job-title"] a::attr(href)').get()
            if not job_url:
                job_url = card.css('h2 a::attr(href)').get()
            
            if job_url:
                job_url = urljoin(response.url, job_url)
            
            # Extract job type and level
            job_type = card.css('span[data-automation-id="job-type"]::text').get()
            experience_level = card.css('span[data-automation-id="job-level"]::text').get()
            
            # Extract posted date
            date_posted = card.css('span[data-automation-id="job-posted-date"]::text').get()
            if date_posted:
                date_posted = self.parse_date(date_posted)
            
            # Check if remote
            remote = False
            if location and 'remote' in location.lower():
                remote = True
            
            # Create job item
            if title and company and location and job_url:
                job_item = JobItem(
                    title=title.strip(),
                    company=company.strip(),
                    location=location.strip(),
                    apply_url=job_url.strip(),
                    source="Microsoft Careers",
                    job_type=job_type.strip() if job_type else None,
                    experience_level=experience_level.strip() if experience_level else None,
                    remote=remote,
                    date_posted=date_posted,
                    industry="Technology"
                )
                
                return job_item
            
        except Exception as e:
            self.logger.error(f"Error extracting job data from card: {str(e)}")
            return None
    
    def parse_date(self, date_str):
        """Parse date string to datetime object."""
        if not date_str:
            return None
        
        date_str = date_str.strip().lower()
        
        # Common date patterns
        patterns = [
            r'(\d+)\s+days?\s+ago',
            r'(\d+)\s+hours?\s+ago',
            r'(\d+)\s+weeks?\s+ago',
            r'(\d+)\s+months?\s+ago',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, date_str)
            if match:
                value = int(match.group(1))
                if 'day' in date_str:
                    return datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
                elif 'hour' in date_str:
                    return datetime.now()
                elif 'week' in date_str:
                    return datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
                elif 'month' in date_str:
                    return datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
        return None
