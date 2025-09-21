#!/usr/bin/env python3
"""
GigM8 Backend Management Script
"""
import os
import sys
import subprocess
import argparse
from pathlib import Path

def run_command(cmd, check=True):
    """Run a command and return the result."""
    print(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if check and result.returncode != 0:
        print(f"Error: {result.stderr}")
        sys.exit(1)
    return result

def start_services():
    """Start all services."""
    print("🚀 Starting GigM8 services...")
    run_command(["docker-compose", "up", "-d"])

def stop_services():
    """Stop all services."""
    print("🛑 Stopping GigM8 services...")
    run_command(["docker-compose", "down"])

def restart_services():
    """Restart all services."""
    print("🔄 Restarting GigM8 services...")
    run_command(["docker-compose", "restart"])

def run_migrations():
    """Run database migrations."""
    print("🗄️ Running database migrations...")
    run_command(["docker-compose", "exec", "api", "alembic", "upgrade", "head"])

def create_migration(message):
    """Create a new migration."""
    print(f"📝 Creating migration: {message}")
    run_command(["docker-compose", "exec", "api", "alembic", "revision", "--autogenerate", "-m", message])

def run_spider(spider_name):
    """Run a specific spider."""
    print(f"🕷️ Running spider: {spider_name}")
    run_command(["docker-compose", "exec", "scraper", "scrapy", "crawl", spider_name])

def run_all_spiders():
    """Run all spiders."""
    print("🕷️ Running all spiders...")
    spiders = ["microsoft_careers", "greenhouse_jobs"]
    for spider in spiders:
        run_spider(spider)

def show_logs(service=None):
    """Show logs for services."""
    if service:
        print(f"📋 Showing logs for {service}...")
        run_command(["docker-compose", "logs", "-f", service], check=False)
    else:
        print("📋 Showing logs for all services...")
        run_command(["docker-compose", "logs", "-f"], check=False)

def health_check():
    """Check service health."""
    print("🔍 Checking service health...")
    
    # Check API
    try:
        result = run_command(["curl", "-f", "http://localhost:8000/health"], check=False)
        if result.returncode == 0:
            print("✅ API is healthy")
        else:
            print("❌ API is not responding")
    except:
        print("❌ API health check failed")
    
    # Check database
    try:
        result = run_command(["docker-compose", "exec", "postgres", "pg_isready", "-U", "gigm8", "-d", "gigm8_jobs"], check=False)
        if result.returncode == 0:
            print("✅ Database is healthy")
        else:
            print("❌ Database is not responding")
    except:
        print("❌ Database health check failed")
    
    # Check Redis
    try:
        result = run_command(["docker-compose", "exec", "redis", "redis-cli", "ping"], check=False)
        if result.returncode == 0:
            print("✅ Redis is healthy")
        else:
            print("❌ Redis is not responding")
    except:
        print("❌ Redis health check failed")

def shell(service="api"):
    """Open a shell in a service container."""
    print(f"🐚 Opening shell in {service}...")
    run_command(["docker-compose", "exec", service, "bash"], check=False)

def main():
    parser = argparse.ArgumentParser(description="GigM8 Backend Management")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Service management
    subparsers.add_parser("start", help="Start all services")
    subparsers.add_parser("stop", help="Stop all services")
    subparsers.add_parser("restart", help="Restart all services")
    
    # Database management
    subparsers.add_parser("migrate", help="Run database migrations")
    create_migration_parser = subparsers.add_parser("create-migration", help="Create a new migration")
    create_migration_parser.add_argument("message", help="Migration message")
    
    # Scraping
    run_spider_parser = subparsers.add_parser("run-spider", help="Run a specific spider")
    run_spider_parser.add_argument("spider_name", help="Name of the spider to run")
    subparsers.add_parser("run-all-spiders", help="Run all spiders")
    
    # Monitoring
    logs_parser = subparsers.add_parser("logs", help="Show logs")
    logs_parser.add_argument("service", nargs="?", help="Service name (optional)")
    subparsers.add_parser("health", help="Check service health")
    
    # Development
    shell_parser = subparsers.add_parser("shell", help="Open a shell in a service container")
    shell_parser.add_argument("service", nargs="?", default="api", help="Service name (default: api)")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    # Change to backend directory
    os.chdir(Path(__file__).parent)
    
    if args.command == "start":
        start_services()
    elif args.command == "stop":
        stop_services()
    elif args.command == "restart":
        restart_services()
    elif args.command == "migrate":
        run_migrations()
    elif args.command == "create-migration":
        create_migration(args.message)
    elif args.command == "run-spider":
        run_spider(args.spider_name)
    elif args.command == "run-all-spiders":
        run_all_spiders()
    elif args.command == "logs":
        show_logs(args.service)
    elif args.command == "health":
        health_check()
    elif args.command == "shell":
        shell(args.service)

if __name__ == "__main__":
    main()
