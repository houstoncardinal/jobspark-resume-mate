#!/usr/bin/env python3
"""
Test script for GigM8 backend system.
"""
import requests
import time
import json

def test_api_health():
    """Test API health endpoint."""
    try:
        response = requests.get("http://localhost:8000/health", timeout=10)
        if response.status_code == 200:
            print("✅ API health check passed")
            return True
        else:
            print(f"❌ API health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API health check failed: {e}")
        return False

def test_jobs_endpoint():
    """Test jobs endpoint."""
    try:
        response = requests.get("http://localhost:8000/jobs?page=1&size=5", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Jobs endpoint working - Found {data.get('total', 0)} jobs")
            return True
        else:
            print(f"❌ Jobs endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Jobs endpoint failed: {e}")
        return False

def test_job_search():
    """Test job search endpoint."""
    try:
        response = requests.get("http://localhost:8000/jobs/search?query=engineer&page=1&size=5", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Job search working - Found {data.get('total', 0)} matching jobs")
            return True
        else:
            print(f"❌ Job search failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Job search failed: {e}")
        return False

def test_job_stats():
    """Test job stats endpoint."""
    try:
        response = requests.get("http://localhost:8000/jobs/stats", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Job stats working - Total jobs: {data.get('total_jobs', 0)}")
            return True
        else:
            print(f"❌ Job stats failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Job stats failed: {e}")
        return False

def main():
    """Run all tests."""
    print("🧪 Testing GigM8 Backend System...")
    print("=" * 50)
    
    # Wait a bit for services to start
    print("⏳ Waiting for services to start...")
    time.sleep(5)
    
    tests = [
        ("API Health", test_api_health),
        ("Jobs Endpoint", test_jobs_endpoint),
        ("Job Search", test_job_search),
        ("Job Stats", test_job_stats),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🔍 Testing {test_name}...")
        if test_func():
            passed += 1
        else:
            print(f"❌ {test_name} test failed")
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! System is working correctly.")
    else:
        print("⚠️  Some tests failed. Please check the logs and configuration.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
