# LinkedIn Jobs API Integration

This document explains how to integrate and use the LinkedIn Jobs API with GigM8.

## Overview

We've integrated the [linkedin-jobs-api](https://github.com/VishwaGauravIn/linkedin-jobs-api) Node.js package into our backend to scrape real LinkedIn job listings. This provides access to thousands of real job postings from LinkedIn.

## Architecture

```
Frontend (React) → Backend API (FastAPI) → LinkedIn Jobs API (Node.js) → LinkedIn
```

1. **Frontend**: React app calls our backend API
2. **Backend**: FastAPI server with LinkedIn integration
3. **LinkedIn Service**: Python service that calls Node.js script
4. **Node.js Script**: Uses linkedin-jobs-api package to scrape LinkedIn

## Setup Instructions

### 1. Install Dependencies

```bash
# Backend dependencies
cd backend
pip install -r requirements.txt

# LinkedIn Jobs API (Node.js package)
npm install linkedin-jobs-api
```

### 2. Start the Services

```bash
# Option 1: Use the startup script (recommended)
./start_with_linkedin.sh

# Option 2: Start manually
# Terminal 1 - Backend
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 - Frontend
npm run dev
```

### 3. Test the Integration

```bash
# Test LinkedIn API
python test_linkedin.py

# Or visit in browser
http://localhost:8000/jobs/linkedin/test
```

## API Endpoints

### LinkedIn Jobs Search
```
GET /jobs/linkedin
```

**Parameters:**
- `keyword` (string): Job search keyword
- `location` (string): Job location
- `date_since_posted` (string): past month, past week, 24hr
- `job_type` (string): full time, part time, contract, etc.
- `remote_filter` (string): on site, remote, hybrid
- `salary` (string): Minimum salary
- `experience_level` (string): internship, entry level, associate, etc.
- `limit` (int): Number of jobs to return (default: 25)
- `page` (int): Page number (default: 0)
- `has_verification` (bool): Has verification
- `under_10_applicants` (bool): Under 10 applicants

**Example:**
```bash
curl "http://localhost:8000/jobs/linkedin?keyword=software%20engineer&location=United%20States&limit=10"
```

### Test LinkedIn Connection
```
GET /jobs/linkedin/test
```

## Frontend Integration

The LinkedIn API is automatically integrated into the job search. Users can search for jobs and get results from:

- ✅ USAJobs (Government jobs)
- ✅ RemoteOK (Remote jobs)
- ✅ Jooble (Job aggregator)
- ✅ Indeed (RSS feeds)
- ✅ LinkedIn (RSS feeds)
- ✅ **LinkedIn API (Real scraping)** ← NEW!

## Job Data Structure

LinkedIn jobs return the following data:

```json
{
  "id": "linkedin-123456",
  "title": "Software Engineer",
  "company": "Tech Company",
  "location": "San Francisco, CA",
  "description": "",
  "source": "LinkedIn",
  "url": "https://linkedin.com/jobs/view/123456",
  "type": "Full-time",
  "posted": "2024-01-15",
  "remote": false,
  "salary": {
    "min": 80000,
    "max": 120000,
    "currency": "USD",
    "period": "year"
  },
  "company_logo": "https://...",
  "ago_time": "2 days ago"
}
```

## Features

### Advanced Filtering
- **Keywords**: Search by job title, skills, company
- **Location**: City, state, country filtering
- **Date Range**: Past month, week, or 24 hours
- **Job Type**: Full-time, part-time, contract, internship
- **Remote Work**: On-site, remote, hybrid
- **Salary**: Minimum salary requirements
- **Experience**: Entry level to executive
- **Verification**: Verified job postings
- **Applicant Count**: Jobs with fewer applicants

### Real-time Data
- Live job postings from LinkedIn
- Up-to-date salary information
- Current company logos
- Recent posting dates

## Troubleshooting

### Common Issues

1. **Node.js not found**
   ```bash
   # Install Node.js
   brew install node  # macOS
   # or download from https://nodejs.org
   ```

2. **LinkedIn API timeout**
   - LinkedIn may rate limit requests
   - Try reducing the limit parameter
   - Add delays between requests

3. **No jobs returned**
   - Check if LinkedIn has changed their structure
   - Verify the linkedin-jobs-api package is up to date
   - Check the backend logs for errors

### Debug Mode

Enable debug logging in the backend:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Performance Considerations

- **Rate Limiting**: LinkedIn may limit requests
- **Response Time**: Scraping can take 5-10 seconds
- **Caching**: Consider caching results for better performance
- **Error Handling**: Graceful fallback to other sources

## Security Notes

- LinkedIn scraping is for public job postings only
- Respect LinkedIn's terms of service
- Don't overload their servers
- Use reasonable request intervals

## Future Enhancements

- [ ] Caching layer for better performance
- [ ] Rate limiting and queue management
- [ ] Job deduplication across sources
- [ ] Real-time job alerts
- [ ] Company insights and analytics

## Support

If you encounter issues:

1. Check the backend logs
2. Test the LinkedIn API endpoint directly
3. Verify all dependencies are installed
4. Check LinkedIn's current structure

## License

This integration uses the [linkedin-jobs-api](https://github.com/VishwaGauravIn/linkedin-jobs-api) package which is licensed under Apache-2.0.
