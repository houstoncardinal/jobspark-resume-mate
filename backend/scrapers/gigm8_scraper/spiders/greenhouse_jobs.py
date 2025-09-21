"""
Greenhouse Jobs Spider for GigM8 job aggregator.
Scrapes job listings from Greenhouse-powered job boards.
"""
import scrapy
import json
import re
from datetime import datetime
from urllib.parse import urljoin, urlparse
from scrapy_playwright.page import PageMethod
from gigm8_scraper.items import JobItem

class GreenhouseJobsSpider(scrapy.Spider):
    """Spider for Greenhouse-powered job boards."""
    
    name = 'greenhouse_jobs'
    allowed_domains = ['boards-api.greenhouse.io', 'boards.greenhouse.io']
    
    # List of companies using Greenhouse (you can expand this)
    companies = [
        'stripe',
        'airbnb',
        'pinterest',
        'shopify',
        'slack',
        'dropbox',
        'github',
        'gitlab',
        'coinbase',
        'robinhood',
        'discord',
        'figma',
        'notion',
        'linear',
        'vercel',
        'netlify',
        'supabase',
        'planetscale',
        'railway',
        'render'
    ]
    
    custom_settings = {
        'DOWNLOAD_DELAY': 1,
        'RANDOMIZE_DOWNLOAD_DELAY': True,
        'CONCURRENT_REQUESTS': 4,
    }
    
    def start_requests(self):
        """Generate initial requests for each company."""
        for company in self.companies:
            # Try both API and web scraping approaches
            api_url = f'https://boards-api.greenhouse.io/v1/boards/{company}/jobs'
            web_url = f'https://boards.greenhouse.io/{company}'
            
            # First try API approach
            yield scrapy.Request(
                url=api_url,
                callback=self.parse_api,
                meta={'company': company},
                errback=self.api_fallback,
                dont_filter=True
            )
    
    def parse_api(self, response):
        """Parse Greenhouse API response."""
        company = response.meta['company']
        
        try:
            data = json.loads(response.text)
            jobs = data.get('jobs', [])
            
            self.logger.info(f"Found {len(jobs)} jobs for {company} via API")
            
            for job_data in jobs:
                try:
                    job_item = self.extract_job_from_api(job_data, company)
                    if job_item:
                        yield job_item
                except Exception as e:
                    self.logger.error(f"Error extracting job from API for {company}: {str(e)}")
                    continue
                    
        except json.JSONDecodeError:
            self.logger.warning(f"Failed to parse JSON for {company}, trying web scraping")
            # Fallback to web scraping
            web_url = f'https://boards.greenhouse.io/{company}'
            yield scrapy.Request(
                url=web_url,
                callback=self.parse_web,
                meta={'company': company},
                errback=self.web_fallback
            )
    
    def parse_web(self, response):
        """Parse Greenhouse web page."""
        company = response.meta['company']
        
        self.logger.info(f"Parsing web page for {company}: {response.url}")
        
        # Look for job listings in various formats
        job_cards = response.css('div[data-qa="job-posting"]') or response.css('div.job-posting') or response.css('div[class*="job"]')
        
        if not job_cards:
            # Try to find job links
            job_links = response.css('a[href*="/jobs/"]')
            for link in job_links:
                job_url = urljoin(response.url, link.attrib['href'])
                yield scrapy.Request(
                    url=job_url,
                    callback=self.parse_job_detail,
                    meta={'company': company},
                    errback=self.job_detail_fallback
                )
        else:
            for card in job_cards:
                try:
                    job_item = self.extract_job_from_web(card, company, response)
                    if job_item:
                        yield job_item
                except Exception as e:
                    self.logger.error(f"Error extracting job from web for {company}: {str(e)}")
                    continue
    
    def extract_job_from_api(self, job_data, company):
        """Extract job data from API response."""
        try:
            title = job_data.get('title', '')
            location = job_data.get('location', {}).get('name', '')
            apply_url = job_data.get('absolute_url', '')
            
            # Extract job type and level
            job_type = None
            experience_level = None
            
            for field in job_data.get('custom_fields', []):
                field_name = field.get('name', '').lower()
                field_value = field.get('value', '')
                
                if 'type' in field_name or 'employment' in field_name:
                    job_type = field_value
                elif 'level' in field_name or 'seniority' in field_name:
                    experience_level = field_value
            
            # Check if remote
            remote = 'remote' in location.lower() or 'work from home' in location.lower()
            
            # Extract posted date
            date_posted = job_data.get('updated_at')
            if date_posted:
                try:
                    date_posted = datetime.fromisoformat(date_posted.replace('Z', '+00:00'))
                except:
                    date_posted = None
            
            if title and location and apply_url:
                return JobItem(
                    title=title.strip(),
                    company=company.title(),
                    location=location.strip(),
                    apply_url=apply_url.strip(),
                    source=f"Greenhouse ({company.title()})",
                    job_type=job_type.strip() if job_type else None,
                    experience_level=experience_level.strip() if experience_level else None,
                    remote=remote,
                    date_posted=date_posted,
                    industry="Technology"
                )
                
        except Exception as e:
            self.logger.error(f"Error extracting job from API: {str(e)}")
            return None
    
    def extract_job_from_web(self, card, company, response):
        """Extract job data from web page."""
        try:
            title = card.css('h3 a::text').get() or card.css('h4 a::text').get() or card.css('a[href*="/jobs/"]::text').get()
            location = card.css('span[class*="location"]::text').get() or card.css('div[class*="location"]::text').get()
            apply_url = card.css('h3 a::attr(href)').get() or card.css('h4 a::attr(href)').get() or card.css('a[href*="/jobs/"]::attr(href)').get()
            
            if apply_url:
                apply_url = urljoin(response.url, apply_url)
            
            # Check if remote
            remote = 'remote' in location.lower() if location else False
            
            if title and location and apply_url:
                return JobItem(
                    title=title.strip(),
                    company=company.title(),
                    location=location.strip(),
                    apply_url=apply_url.strip(),
                    source=f"Greenhouse ({company.title()})",
                    remote=remote,
                    industry="Technology"
                )
                
        except Exception as e:
            self.logger.error(f"Error extracting job from web: {str(e)}")
            return None
    
    def parse_job_detail(self, response):
        """Parse individual job detail page."""
        company = response.meta['company']
        
        try:
            title = response.css('h1::text').get() or response.css('h2::text').get()
            location = response.css('span[class*="location"]::text').get() or response.css('div[class*="location"]::text').get()
            
            if title and location:
                return JobItem(
                    title=title.strip(),
                    company=company.title(),
                    location=location.strip(),
                    apply_url=response.url,
                    source=f"Greenhouse ({company.title()})",
                    industry="Technology"
                )
        except Exception as e:
            self.logger.error(f"Error parsing job detail for {company}: {str(e)}")
            return None
    
    def api_fallback(self, failure):
        """Fallback when API fails."""
        company = failure.request.meta['company']
        self.logger.warning(f"API failed for {company}, trying web scraping")
        
        web_url = f'https://boards.greenhouse.io/{company}'
        yield scrapy.Request(
            url=web_url,
            callback=self.parse_web,
            meta={'company': company},
            errback=self.web_fallback
        )
    
    def web_fallback(self, failure):
        """Fallback when web scraping fails."""
        company = failure.request.meta['company']
        self.logger.error(f"Web scraping failed for {company}: {failure.value}")
    
    def job_detail_fallback(self, failure):
        """Fallback when job detail parsing fails."""
        company = failure.request.meta['company']
        self.logger.error(f"Job detail parsing failed for {company}: {failure.value}")
