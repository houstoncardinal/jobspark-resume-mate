# GigM8 Job Aggregator Backend

A scalable backend system for automatically scraping job listings from company career pages and job boards across the USA and globally.

## 🚀 Features

- **Automated Job Scraping**: Scrapy + Playwright spiders for JavaScript-heavy sites
- **Job Deduplication**: Hash-based deduplication system
- **RESTful API**: FastAPI with comprehensive job search and management endpoints
- **Scheduled Scraping**: Celery + Redis for automated daily job collection
- **PostgreSQL Database**: Robust data storage with SQLAlchemy ORM
- **Docker Support**: Complete containerization for easy deployment
- **Scalable Architecture**: Easy to add new job sources and spiders

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FastAPI       │    │   Celery        │    │   Scrapy        │
│   (REST API)    │◄───┤   (Scheduler)   │───►│   (Spiders)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │     Redis       │    │   Playwright    │
│   (Database)    │    │   (Message      │    │   (Browser)     │
│                 │    │    Queue)       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

- Docker and Docker Compose
- Python 3.11+ (for local development)
- PostgreSQL 15+
- Redis 7+

## 🚀 Quick Start

### Using Docker Compose (Recommended)

1. **Clone and navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Run database migrations:**
   ```bash
   docker-compose exec api alembic upgrade head
   ```

4. **Access the API:**
   - API Documentation: http://localhost:8000/docs
   - API Base URL: http://localhost:8000
   - Health Check: http://localhost:8000/health

### Manual Setup (Development)

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Install Playwright browsers:**
   ```bash
   playwright install chromium
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start PostgreSQL and Redis:**
   ```bash
   # Using Docker
   docker run -d --name postgres -e POSTGRES_DB=gigm8_jobs -e POSTGRES_USER=gigm8 -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:15-alpine
   docker run -d --name redis -p 6379:6379 redis:7-alpine
   ```

5. **Run database migrations:**
   ```bash
   alembic upgrade head
   ```

6. **Start the API server:**
   ```bash
   uvicorn app.main:app --reload
   ```

7. **Start Celery worker (in another terminal):**
   ```bash
   celery -A scheduler.celery_app worker --loglevel=info
   ```

8. **Start Celery beat scheduler (in another terminal):**
   ```bash
   celery -A scheduler.celery_app beat --loglevel=info
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql://gigm8:password@localhost:5432/gigm8_jobs

# Redis
REDIS_URL=redis://localhost:6379/0

# API
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=true

# Scraping
CONCURRENT_REQUESTS=16
SCRAPING_DELAY=1
USER_AGENT_ROTATION=true
LOG_LEVEL=INFO
```

## 📊 API Endpoints

### Job Management

- `GET /jobs` - List jobs with pagination
- `GET /jobs/search` - Search jobs with filters
- `GET /jobs/{job_id}` - Get specific job
- `POST /jobs` - Create new job (manual entry)
- `PUT /jobs/{job_id}` - Update job
- `DELETE /jobs/{job_id}` - Delete job

### Statistics

- `GET /jobs/stats` - Get job statistics
- `GET /jobs/sources` - Get job sources and counts

### Health

- `GET /health` - Health check endpoint

### Example API Calls

```bash
# Get all jobs
curl "http://localhost:8000/jobs?page=1&size=20"

# Search for remote software engineer jobs
curl "http://localhost:8000/jobs/search?query=software+engineer&remote=true"

# Get job statistics
curl "http://localhost:8000/jobs/stats"
```

## 🕷️ Scraping System

### Available Spiders

1. **Microsoft Careers** (`microsoft_careers`)
   - Scrapes Microsoft's careers page
   - Handles JavaScript-heavy content with Playwright

2. **Greenhouse Jobs** (`greenhouse_jobs`)
   - Scrapes multiple companies using Greenhouse
   - Supports both API and web scraping approaches

### Running Spiders

#### Using Docker Compose

```bash
# Run Microsoft spider
docker-compose exec scraper scrapy crawl microsoft_careers

# Run Greenhouse spider
docker-compose exec scraper scrapy crawl greenhouse_jobs

# Run all spiders
docker-compose exec scraper scrapy crawl microsoft_careers && docker-compose exec scraper scrapy crawl greenhouse_jobs
```

#### Manual Execution

```bash
cd scrapers
scrapy crawl microsoft_careers
scrapy crawl greenhouse_jobs
```

### Adding New Spiders

1. Create a new spider file in `scrapers/gigm8_scraper/spiders/`
2. Follow the existing spider patterns
3. Add the spider to the Celery scheduler in `scheduler/celery_app.py`
4. Test the spider manually before adding to production

## 📅 Scheduling

The system uses Celery Beat for automated scheduling:

- **Microsoft Jobs**: Daily at 6:00 AM UTC
- **Greenhouse Jobs**: Daily at 8:00 AM UTC
- **Job Cleanup**: Daily at 2:00 AM UTC
- **Stats Update**: Every hour

### Manual Task Execution

```bash
# Run specific tasks
docker-compose exec api celery -A scheduler.celery_app call scheduler.tasks.scrape_microsoft_jobs
docker-compose exec api celery -A scheduler.celery_app call scheduler.tasks.scrape_greenhouse_jobs

# Run all scraping tasks
docker-compose exec api celery -A scheduler.celery_app call scheduler.tasks.scrape_all_jobs
```

## 🗄️ Database Schema

### Jobs Table

```sql
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    salary VARCHAR(100),
    description TEXT,
    apply_url TEXT NOT NULL,
    source VARCHAR(100) NOT NULL,
    date_posted TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    job_hash VARCHAR(64) UNIQUE NOT NULL,
    job_type VARCHAR(50),
    experience_level VARCHAR(50),
    remote BOOLEAN DEFAULT FALSE,
    skills TEXT,
    benefits TEXT,
    industry VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_scraped TIMESTAMP DEFAULT NOW()
);
```

### Indexes

- `idx_job_search` on (title, company, location)
- `idx_source_date` on (source, date_posted)
- `idx_remote_active` on (remote, is_active)
- `idx_industry_active` on (industry, is_active)

## 🔍 Monitoring and Logs

### View Logs

```bash
# API logs
docker-compose logs -f api

# Celery worker logs
docker-compose logs -f celery_worker

# Celery beat logs
docker-compose logs -f celery_beat

# All logs
docker-compose logs -f
```

### Health Monitoring

```bash
# Check API health
curl http://localhost:8000/health

# Check Celery worker status
docker-compose exec api celery -A scheduler.celery_app inspect active

# Check scheduled tasks
docker-compose exec api celery -A scheduler.celery_app inspect scheduled
```

## 🚀 Production Deployment

### Environment Setup

1. **Update environment variables for production:**
   ```env
   DATABASE_URL=postgresql://user:password@prod-db:5432/gigm8_jobs
   REDIS_URL=redis://prod-redis:6379/0
   DEBUG=false
   LOG_LEVEL=WARNING
   ```

2. **Use production-ready database:**
   - Configure PostgreSQL with proper security
   - Set up database backups
   - Configure connection pooling

3. **Configure reverse proxy (Nginx):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

4. **Set up monitoring:**
   - Configure log aggregation
   - Set up health checks
   - Monitor resource usage

### Scaling

- **Horizontal scaling**: Add more Celery workers
- **Database scaling**: Use read replicas for queries
- **Caching**: Add Redis caching for frequent queries
- **Load balancing**: Use multiple API instances

## 🛠️ Development

### Code Structure

```
backend/
├── app/                    # FastAPI application
│   ├── main.py            # API endpoints
│   ├── schemas.py         # Pydantic models
│   └── services.py        # Business logic
├── models/                # Database models
│   ├── database.py        # Database configuration
│   └── job.py            # Job model
├── scrapers/              # Scrapy spiders
│   └── gigm8_scraper/
│       ├── spiders/       # Spider implementations
│       ├── pipelines.py   # Data processing pipelines
│       ├── middlewares.py # Custom middlewares
│       └── settings.py    # Scrapy configuration
├── scheduler/             # Celery configuration
│   ├── celery_app.py      # Celery app setup
│   └── tasks.py          # Scheduled tasks
├── migrations/            # Database migrations
├── docker-compose.yml     # Docker orchestration
├── Dockerfile            # Container configuration
└── requirements.txt      # Python dependencies
```

### Adding New Job Sources

1. **Create a new spider:**
   ```python
   # scrapers/gigm8_scraper/spiders/new_source.py
   class NewSourceSpider(scrapy.Spider):
       name = 'new_source'
       # Implementation...
   ```

2. **Add to scheduler:**
   ```python
   # scheduler/celery_app.py
   'scrape-new-source': {
       'task': 'scheduler.tasks.scrape_new_source',
       'schedule': crontab(hour=10, minute=0),
   }
   ```

3. **Create task:**
   ```python
   # scheduler/tasks.py
   @current_task.task(bind=True)
   def scrape_new_source(self):
       # Implementation...
   ```

## 🐛 Troubleshooting

### Common Issues

1. **Database connection errors:**
   - Check PostgreSQL is running
   - Verify connection string
   - Check database exists

2. **Scraping failures:**
   - Check target website structure
   - Verify Playwright installation
   - Check network connectivity

3. **Celery task failures:**
   - Check Redis connection
   - Verify task imports
   - Check worker logs

### Debug Mode

Enable debug mode for detailed logging:

```env
DEBUG=true
LOG_LEVEL=DEBUG
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the logs for error details
