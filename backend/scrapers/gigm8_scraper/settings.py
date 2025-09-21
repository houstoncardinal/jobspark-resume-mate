"""
Scrapy settings for GigM8 job aggregator.
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Scrapy settings
BOT_NAME = 'gigm8_scraper'

# Spider modules
SPIDER_MODULES = ['gigm8_scraper.spiders']
NEWSPIDER_MODULE = 'gigm8_scraper.spiders'

# Obey robots.txt rules
ROBOTSTXT_OBEY = False

# Configure maximum concurrent requests
CONCURRENT_REQUESTS = int(os.getenv('CONCURRENT_REQUESTS', 16))

# Configure delay between requests
DOWNLOAD_DELAY = float(os.getenv('SCRAPING_DELAY', 1))
RANDOMIZE_DOWNLOAD_DELAY = True

# Configure user agent rotation
USER_AGENT_ROTATION = os.getenv('USER_AGENT_ROTATION', 'True').lower() == 'true'

# User agents for rotation
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.59',
]

# Configure pipelines
ITEM_PIPELINES = {
    'gigm8_scraper.pipelines.DeduplicationPipeline': 300,
    'gigm8_scraper.pipelines.DatabasePipeline': 400,
}

# Configure middlewares
DOWNLOADER_MIDDLEWARES = {
    'gigm8_scraper.middlewares.UserAgentMiddleware': 400,
    'gigm8_scraper.middlewares.ProxyMiddleware': 410,
    'scrapy_playwright.middlewares.ScrapyPlaywrightMiddleware': 500,
}

# Playwright settings
DOWNLOAD_HANDLERS = {
    "http": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
    "https": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
}

# Playwright browser settings
PLAYWRIGHT_BROWSER_TYPE = "chromium"
PLAYWRIGHT_LAUNCH_OPTIONS = {
    "headless": True,
    "args": [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
    ]
}

# Request settings
DEFAULT_REQUEST_HEADERS = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
}

# AutoThrottle settings
AUTOTHROTTLE_ENABLED = True
AUTOTHROTTLE_START_DELAY = 1
AUTOTHROTTLE_MAX_DELAY = 10
AUTOTHROTTLE_TARGET_CONCURRENCY = 2.0
AUTOTHROTTLE_DEBUG = False

# Logging
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')

# Database settings
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://gigm8:password@localhost:5432/gigm8_jobs')

# Cache settings
HTTPCACHE_ENABLED = True
HTTPCACHE_EXPIRATION_SECS = 3600  # 1 hour
HTTPCACHE_DIR = 'httpcache'

# Retry settings
RETRY_ENABLED = True
RETRY_TIMES = 3
RETRY_HTTP_CODES = [500, 502, 503, 504, 408, 429]

# Stats collection
STATS_CLASS = 'scrapy.statscollectors.MemoryStatsCollector'
