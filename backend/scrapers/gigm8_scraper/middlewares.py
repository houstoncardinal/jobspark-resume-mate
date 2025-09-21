"""
Custom middlewares for GigM8 job aggregator.
"""
import random
import logging
from scrapy.downloadermiddlewares.useragent import UserAgentMiddleware
from scrapy.downloadermiddlewares.retry import RetryMiddleware
from scrapy.utils.response import response_status_message

logger = logging.getLogger(__name__)

class UserAgentMiddleware(UserAgentMiddleware):
    """Custom user agent middleware for rotation."""
    
    def __init__(self, user_agent=''):
        self.user_agent = user_agent
        self.user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
            'Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.59',
        ]
    
    def process_request(self, request, spider):
        """Set random user agent for each request."""
        ua = random.choice(self.user_agents)
        request.headers['User-Agent'] = ua
        logger.debug(f"Using User-Agent: {ua}")
        return None

class ProxyMiddleware:
    """Proxy middleware for rotating IP addresses."""
    
    def __init__(self):
        # Placeholder for proxy configuration
        # In production, you would load this from a proxy service
        self.proxies = [
            # Add your proxy servers here
            # 'http://proxy1:port',
            # 'http://proxy2:port',
        ]
        self.current_proxy = 0
    
    def process_request(self, request, spider):
        """Set proxy for request if available."""
        if self.proxies:
            proxy = self.proxies[self.current_proxy % len(self.proxies)]
            request.meta['proxy'] = proxy
            self.current_proxy += 1
            logger.debug(f"Using proxy: {proxy}")
        return None

class CustomRetryMiddleware(RetryMiddleware):
    """Custom retry middleware with enhanced logging."""
    
    def retry(self, request, reason, spider):
        """Retry request with custom logic."""
        retries = request.meta.get('retry_times', 0) + 1
        
        if retries <= self.max_retry_times:
            logger.warning(f"Retrying {request} (failed {retries} times): {reason}")
            retryreq = request.copy()
            retryreq.meta['retry_times'] = retries
            retryreq.dont_filter = True
            retryreq.priority = request.priority + self.priority_adjust
            
            return retryreq
        else:
            logger.error(f"Gave up retrying {request} (failed {retries} times): {reason}")
            return None
