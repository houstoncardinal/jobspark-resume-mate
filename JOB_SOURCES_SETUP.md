# Job Sources Setup Guide

This guide explains how to set up and configure all available job sources for the Gigm8 job search platform.

## 🆓 Free Sources (No API Key Required)

### 1. USAJobs (Government Jobs)
- **Status**: ✅ Working
- **API Key**: Already configured
- **Description**: U.S. government job listings
- **Setup**: No additional setup required

### 2. RemoteOK
- **Status**: ✅ Working
- **API Key**: Not required
- **Description**: Remote job listings
- **Setup**: No additional setup required

### 3. GitHub
- **Status**: ✅ Working
- **API Key**: Not required
- **Description**: Open source projects and developer opportunities
- **Setup**: No additional setup required

### 4. RSS Feeds
- **Status**: ⚠️ Requires CORS proxy
- **API Key**: Not required
- **Description**: Company job feeds from Lever, Ashby, Greenhouse, etc.
- **Setup**: Requires backend service or CORS proxy

## 💰 Paid Sources (API Key Required)

### 1. Indeed
- **Status**: ❌ Requires API Key
- **API**: Indeed Publisher API
- **Setup**: 
  1. Sign up at https://ads.indeed.com/jobroll/xmlfeed
  2. Get your Publisher ID
  3. Add `VITE_INDEED_PUBLISHER_ID` to your .env file

### 2. LinkedIn
- **Status**: ❌ Requires API Key
- **API**: LinkedIn Jobs API
- **Setup**:
  1. Create LinkedIn app at https://www.linkedin.com/developers/
  2. Get Client ID and Client Secret
  3. Add `VITE_LINKEDIN_CLIENT_ID` and `VITE_LINKEDIN_CLIENT_SECRET` to .env

### 3. ZipRecruiter
- **Status**: ❌ Requires API Key
- **API**: ZipRecruiter API
- **Setup**:
  1. Sign up at https://www.ziprecruiter.com/employers/api
  2. Get API key
  3. Add `VITE_ZIPRECRUITER_API_KEY` to .env

### 4. Adzuna
- **Status**: ❌ Requires API Key
- **API**: Adzuna API
- **Setup**:
  1. Sign up at https://developer.adzuna.com/
  2. Get App ID and App Key
  3. Add `VITE_ADZUNA_APP_ID` and `VITE_ADZUNA_APP_KEY` to .env

### 5. Jooble
- **Status**: ❌ Requires API Key
- **API**: Jooble API
- **Setup**:
  1. Sign up at https://jooble.org/api/about
  2. Get API key
  3. Add `VITE_JOOBLE_API_KEY` to .env

### 6. Glassdoor
- **Status**: ❌ Requires API Key
- **API**: Glassdoor API
- **Setup**:
  1. Sign up at https://www.glassdoor.com/developer/
  2. Get Partner ID and Key
  3. Add `VITE_GLASSDOOR_PARTNER_ID` and `VITE_GLASSDOOR_KEY` to .env

### 7. Stack Overflow
- **Status**: ❌ Requires API Key
- **API**: Stack Overflow API
- **Setup**:
  1. Create app at https://stackapps.com/
  2. Get Client ID and Client Secret
  3. Add `VITE_STACKOVERFLOW_CLIENT_ID` and `VITE_STACKOVERFLOW_CLIENT_SECRET` to .env

### 8. AngelList
- **Status**: ❌ Requires API Key
- **API**: AngelList API
- **Setup**:
  1. Sign up at https://angel.co/api
  2. Get API key
  3. Add `VITE_ANGEL_API_KEY` to .env

### 9. Dice
- **Status**: ❌ Requires API Key
- **API**: Dice API
- **Setup**:
  1. Contact Dice for API access
  2. Get API key
  3. Add `VITE_DICE_API_KEY` to .env

### 10. Monster
- **Status**: ❌ Requires API Key
- **API**: Monster API
- **Setup**:
  1. Contact Monster for API access
  2. Get API key
  3. Add `VITE_MONSTER_API_KEY` to .env

### 11. CareerBuilder
- **Status**: ❌ Requires API Key
- **API**: CareerBuilder API
- **Setup**:
  1. Contact CareerBuilder for API access
  2. Get API key
  3. Add `VITE_CAREERBUILDER_API_KEY` to .env

### 12. SimplyHired
- **Status**: ❌ Requires API Key
- **API**: SimplyHired API
- **Setup**:
  1. Contact SimplyHired for API access
  2. Get API key
  3. Add `VITE_SIMPLYHIRED_API_KEY` to .env

## 🔧 Environment Variables

Add these to your `.env` file:

```env
# Job Search API Keys
VITE_USAJOBS_API_KEY="4Nx2nq6xUYvNNm8VZFm8rPR3M7/8j336/vLgujfroSU="
VITE_USAJOBS_USER_AGENT="Gigm8 Job Search Platform (contact@gigm8.com)"
VITE_ZIPRECRUITER_API_KEY=""
VITE_JOOBLE_API_KEY=""
VITE_ADZUNA_APP_ID=""
VITE_ADZUNA_APP_KEY=""
VITE_INDEED_PUBLISHER_ID=""
VITE_GLASSDOOR_PARTNER_ID=""
VITE_GLASSDOOR_KEY=""
VITE_LINKEDIN_CLIENT_ID=""
VITE_LINKEDIN_CLIENT_SECRET=""
VITE_GITHUB_CLIENT_ID=""
VITE_GITHUB_CLIENT_SECRET=""
VITE_STACKOVERFLOW_CLIENT_ID=""
VITE_STACKOVERFLOW_CLIENT_SECRET=""
VITE_ANGEL_API_KEY=""
VITE_DICE_API_KEY=""
VITE_MONSTER_API_KEY=""
VITE_CAREERBUILDER_API_KEY=""
VITE_SIMPLYHIRED_API_KEY=""
```

## 🚀 Getting Started

1. **Test Current Setup**: The USAJobs API is already working and will show real government jobs
2. **Add Free Sources**: RemoteOK and GitHub are working without API keys
3. **Add Paid Sources**: Choose which paid sources you want and add their API keys
4. **Test Connections**: Use the "Test APIs" button in the job search interface

## 📊 Current Status

- ✅ **USAJobs**: Working (Government jobs)
- ✅ **RemoteOK**: Working (Remote jobs)
- ✅ **GitHub**: Working (Open source projects)
- ⚠️ **RSS Feeds**: Requires CORS proxy
- ❌ **All Paid Sources**: Require API keys

## 🔍 Job Search Features

- **Real-time Search**: Search across multiple job sources simultaneously
- **Advanced Filtering**: Filter by location, salary, job type, experience level
- **Source Selection**: Choose which job sources to search
- **API Status Monitoring**: See which sources are working
- **Duplicate Removal**: Automatically removes duplicate job listings
- **Relevance Sorting**: Sorts results by relevance and date

## 🌍 Global Job Coverage

The platform can search jobs from:
- 🇺🇸 United States (USAJobs, Indeed, LinkedIn, etc.)
- 🌍 International (Adzuna, Jooble, RemoteOK)
- 💻 Remote Jobs (RemoteOK, GitHub, various sources)
- 🏛️ Government Jobs (USAJobs)
- 🚀 Startup Jobs (AngelList, Y Combinator)
- 💼 Professional Jobs (LinkedIn, Indeed)
- 🔧 Tech Jobs (Stack Overflow, GitHub, Dice)

## 📈 Scaling Recommendations

1. **Start with Free Sources**: USAJobs, RemoteOK, GitHub
2. **Add High-Value Paid Sources**: Indeed, LinkedIn, ZipRecruiter
3. **Implement CORS Proxy**: For RSS feeds and additional sources
4. **Add Backend Service**: For rate limiting and caching
5. **Consider Job Scraping**: For sources without APIs

## 🛠️ Technical Implementation

The job search system is built with:
- **Frontend**: React + TypeScript
- **Job Aggregation**: Custom job-aggregator.ts
- **API Integration**: Direct API calls to job sources
- **Data Normalization**: Consistent job data format
- **Error Handling**: Graceful fallbacks for failed sources
- **Performance**: Parallel API calls and result aggregation
