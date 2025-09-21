"""
LinkedIn Jobs Service
Uses the linkedin-jobs-api Node.js package to scrape LinkedIn job listings
"""

import subprocess
import json
import logging
import os
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

class LinkedInJobsService:
    def __init__(self):
        # Use relative path from the backend directory
        self.node_script_path = os.path.join(os.path.dirname(__file__), "..", "linkedin_scraper.js")
    
    def search_jobs(self, 
                   keyword: str = "",
                   location: str = "",
                   date_since_posted: str = "",
                   job_type: str = "",
                   remote_filter: str = "",
                   salary: str = "",
                   experience_level: str = "",
                   limit: int = 25,
                   page: int = 0,
                   has_verification: bool = False,
                   under_10_applicants: bool = False) -> List[Dict[str, Any]]:
        """
        Search LinkedIn jobs using the linkedin-jobs-api package
        """
        try:
            # Prepare query options
            query_options = {
                "keyword": keyword,
                "location": location,
                "dateSincePosted": date_since_posted,
                "jobType": job_type,
                "remoteFilter": remote_filter,
                "salary": salary,
                "experienceLevel": experience_level,
                "limit": str(limit),
                "page": str(page),
                "has_verification": has_verification,
                "under_10_applicants": under_10_applicants
            }
            
            # Create the Node.js script if it doesn't exist
            self._create_node_script()
            
            # Execute the Node.js script
            result = subprocess.run([
                'node', self.node_script_path,
                json.dumps(query_options)
            ], capture_output=True, text=True, timeout=30, cwd=os.path.dirname(self.node_script_path))
            
            if result.returncode != 0:
                logger.error(f"LinkedIn scraper error: {result.stderr}")
                return []
            
            # Parse the JSON response
            jobs_data = json.loads(result.stdout)
            
            # Transform the data to match our JobListing format
            transformed_jobs = []
            for job in jobs_data:
                transformed_job = {
                    "id": f"linkedin-{hash(job.get('jobUrl', ''))}",
                    "title": job.get('position', ''),
                    "company": job.get('company', ''),
                    "location": job.get('location', ''),
                    "description": "",  # LinkedIn API doesn't provide description
                    "source": "LinkedIn",
                    "url": job.get('jobUrl', ''),
                    "type": self._map_job_type(job_type),
                    "posted": job.get('date', ''),
                    "remote": self._is_remote(job.get('location', ''), remote_filter),
                    "salary": self._parse_salary(job.get('salary', '')),
                    "company_logo": job.get('companyLogo', ''),
                    "ago_time": job.get('agoTime', '')
                }
                transformed_jobs.append(transformed_job)
            
            return transformed_jobs
            
        except subprocess.TimeoutExpired:
            logger.error("LinkedIn scraper timeout")
            return []
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse LinkedIn response: {e}")
            return []
        except Exception as e:
            logger.error(f"LinkedIn jobs search error: {e}")
            return []
    
    def _create_node_script(self):
        """Create the Node.js script for LinkedIn scraping"""
        script_content = '''
const linkedIn = require('linkedin-jobs-api');

// Get query options from command line arguments
const queryOptions = JSON.parse(process.argv[2]);

// Execute the search
linkedIn.query(queryOptions)
    .then(response => {
        console.log(JSON.stringify(response));
    })
    .catch(error => {
        console.error('Error:', error.message);
        process.exit(1);
    });
'''
        with open(self.node_script_path, 'w') as f:
            f.write(script_content)
    
    def _map_job_type(self, job_type: str) -> str:
        """Map LinkedIn job types to our format"""
        mapping = {
            "full time": "Full-time",
            "part time": "Part-time",
            "contract": "Contract",
            "temporary": "Temporary",
            "volunteer": "Volunteer",
            "internship": "Internship"
        }
        return mapping.get(job_type.lower(), "Full-time")
    
    def _is_remote(self, location: str, remote_filter: str) -> bool:
        """Determine if job is remote"""
        if remote_filter.lower() == "remote":
            return True
        return "remote" in location.lower()
    
    def _parse_salary(self, salary_str: str) -> Optional[Dict[str, Any]]:
        """Parse salary string into structured format"""
        if not salary_str or salary_str.strip() == "":
            return None
        
        # Simple salary parsing - can be enhanced
        try:
            # Look for salary ranges like "$50,000 - $80,000"
            import re
            numbers = re.findall(r'[\d,]+', salary_str.replace('$', '').replace(',', ''))
            if len(numbers) >= 2:
                return {
                    "min": int(numbers[0]),
                    "max": int(numbers[1]),
                    "currency": "USD",
                    "period": "year"
                }
            elif len(numbers) == 1:
                return {
                    "min": int(numbers[0]),
                    "max": int(numbers[0]),
                    "currency": "USD",
                    "period": "year"
                }
        except:
            pass
        
        return None
