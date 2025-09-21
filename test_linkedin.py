#!/usr/bin/env python3
"""
Test script for LinkedIn Jobs API integration
"""

import requests
import json

def test_linkedin_api():
    """Test the LinkedIn API endpoint"""
    try:
        # Test the LinkedIn API
        response = requests.get('http://localhost:8000/jobs/linkedin/test')
        
        if response.status_code == 200:
            result = response.json()
            print("✅ LinkedIn API Test Results:")
            print(f"Status: {result['status']}")
            print(f"Message: {result['message']}")
            
            if 'sample_jobs' in result and result['sample_jobs']:
                print("\n📋 Sample Jobs:")
                for i, job in enumerate(result['sample_jobs'][:2], 1):
                    print(f"{i}. {job['title']} at {job['company']}")
                    print(f"   Location: {job['location']}")
                    print(f"   URL: {job['url']}")
                    print()
        else:
            print(f"❌ LinkedIn API test failed: {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend API. Make sure it's running on localhost:8000")
    except Exception as e:
        print(f"❌ Error testing LinkedIn API: {e}")

def test_linkedin_search():
    """Test LinkedIn job search"""
    try:
        params = {
            'keyword': 'software engineer',
            'location': 'United States',
            'limit': 5
        }
        
        response = requests.get('http://localhost:8000/jobs/linkedin', params=params)
        
        if response.status_code == 200:
            jobs = response.json()
            print(f"\n🔍 LinkedIn Search Results ({len(jobs)} jobs found):")
            
            for i, job in enumerate(jobs[:3], 1):
                print(f"{i}. {job['title']} at {job['company']}")
                print(f"   Location: {job['location']}")
                print(f"   Type: {job['type']}")
                print(f"   Posted: {job['posted']}")
                print(f"   URL: {job['url']}")
                print()
        else:
            print(f"❌ LinkedIn search failed: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Error testing LinkedIn search: {e}")

if __name__ == "__main__":
    print("🚀 Testing LinkedIn Jobs API Integration")
    print("=" * 50)
    
    test_linkedin_api()
    test_linkedin_search()
    
    print("\n" + "=" * 50)
    print("Test completed!")
